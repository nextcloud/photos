/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { APIRequestContext } from '@playwright/test'

import { runExec, runOcc } from '@nextcloud/e2e-test-server/docker'
import { expect } from '@playwright/test'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { basicAuth, mkdir, RECOGNIZE_DAV_ROOT, uploadFile } from './dav.ts'
import { PHOTOS_FOLDER } from './media.ts'
import { setAppConfig } from './occ.ts'

/** Folder holding the face fixtures, relative to the app root. */
const FACES_FIXTURE_DIR = 'tests/playwright/fixtures/faces'

/**
 * How often each fixture image is uploaded, under a name of its own.
 *
 * recognize only starts forming clusters once it gathered at least 120 face
 * detections, which our committed fixture set is far short of. The copies share
 * the face vector of their original and therefore cluster tightly, which is what
 * keeps the outcome predictable enough to assert on.
 */
const FACE_UPLOAD_MULTIPLIER = 7

let _isRecognizeAvailable: boolean
export async function isRecognizeAvailable(): Promise<boolean> {
	if (_isRecognizeAvailable === undefined) {
		const { stdout: recognizeAppPath, exitCode } = await runOcc(['app:getpath', 'recognize'], { failOnError: false })
		_isRecognizeAvailable = exitCode === 0 && recognizeAppPath.trim() !== ''
	}
	return _isRecognizeAvailable
}

/**
 * Upload the face fixtures into the photos folder of an account.
 *
 * @param request - Request context to upload with
 * @param user - Account to upload for
 */
export async function seedFaceMedia(request: APIRequestContext, user: User): Promise<void> {
	await mkdir(request, user, PHOTOS_FOLDER)

	const fixtureRoot = resolve(process.cwd(), FACES_FIXTURE_DIR)
	const people = (await readdir(fixtureRoot, { withFileTypes: true }))
		.filter((entry) => entry.isDirectory())

	expect(people.length, `face fixtures are present in ${FACES_FIXTURE_DIR}`).toBeGreaterThan(0)

	for (const person of people) {
		const images = (await readdir(resolve(fixtureRoot, person.name)))
			.filter((name) => /\.jpe?g$/i.test(name))

		for (const image of images) {
			const content = await readFile(resolve(fixtureRoot, person.name, image))

			for (let copy = 0; copy < FACE_UPLOAD_MULTIPLIER; copy++) {
				const target = copy === 0 ? image : `${copy}-${image}`
				await uploadFile(request, user, `${PHOTOS_FOLDER}/${target}`, content, 'image/jpeg')
			}
		}
	}
}

/**
 * Detect and cluster the faces of the uploaded fixtures.
 *
 * This mirrors recognize's own CI: extract the metadata, classify the photos to
 * get face detections, then cluster them. Several clustering passes, as a single
 * one does not necessarily assign every detection to its final cluster.
 *
 * @param user - Account whose photos to process
 */
export async function classifyFaces(user: User): Promise<void> {
	await setAppConfig('recognize', 'faces.enabled', 'true')
	// The photos app talks to recognize's WebDAV API without a signed key.
	await setAppConfig('recognize', 'require_api_key', 'false')
	// CI runners only have a couple of cores available.
	await setAppConfig('recognize', 'tensorflow.cores', '1')
	await expectNodeRuntime()

	await runOcc(['files:scan', user.userId, '--generate-metadata'], { verbose: true })
	await runOcc(['recognize:classify'], { verbose: true })

	for (let pass = 0; pass < 6; pass++) {
		await runOcc(['recognize:cluster-faces', '-b', '10000'], { verbose: true })
	}
}

/**
 * Assert that recognize has the Node runtime it spawns its classifiers with.
 */
async function expectNodeRuntime(): Promise<void> {
	const { stdout: configured } = await runOcc(['config:app:get', 'recognize', 'node_binary'], { failOnError: false })
	const { stdout: appPath } = await runOcc(['app:getpath', 'recognize'])

	const nodeBinary = configured.trim() || `${appPath.trim()}/bin/node`
	const { exitCode } = await runExec(['test', '-x', nodeBinary], { failOnError: false })
	expect(exitCode, `recognize installed an executable Node runtime at ${nodeBinary}`).toBe(0)

	if (configured.trim() === '') {
		await runOcc(['config:app:set', '--lazy', `--value=${nodeBinary}`, 'recognize', 'node_binary'])
	}
}

/**
 * Assert that the pipeline really produced clusters, and say why it did not.
 *
 * Without this a pipeline that yields nothing only surfaces much later as an
 * opaque "no person found" timeout. Querying the very endpoint the app uses turns
 * that into an actionable failure, and the detection count tells "classification
 * produced nothing" apart from "fewer than the 120 detections recognize needs".
 *
 * @param request - Request context to query with
 * @param user - Account whose faces were classified
 */
export async function expectFaceClusters(request: APIRequestContext, user: User): Promise<void> {
	const response = await request.fetch(`${RECOGNIZE_DAV_ROOT}/${encodeURIComponent(user.userId)}/faces/`, {
		method: 'PROPFIND',
		headers: { ...basicAuth(user), Depth: '1' },
	})

	const body = await response.text()
	// A Depth:1 listing answers with the collection itself plus one entry per cluster.
	const clusterCount = Math.max((body.match(/<\w+:response[\s>]/g) ?? []).length - 1, 0)

	if (clusterCount > 0) {
		return
	}

	expect(clusterCount, [
		'recognize formed no face cluster.',
		`Face detections in the database: ${await countFaceDetections()} (clustering needs at least 120).`,
		`recognize log tail:\n${await readRecognizeLog()}`,
	].join('\n')).toBeGreaterThan(0)
}

/**
 * How many face detections recognize stored, read straight out of the database.
 *
 * Both diagnostics below tolerate a failing command — a missing table or a log
 * without a single matching line are answers in themselves, and neither may turn
 * a diagnostic into the reported failure.
 */
async function countFaceDetections(): Promise<string> {
	// Through PHP's SQLite binding rather than the `sqlite3` client, which the
	// container does not ship.
	const { stdout, stderr } = await runExec(
		['php', '-r', 'echo (new SQLite3("data/owncloud.db"))->querySingle("SELECT COUNT(*) FROM oc_recognize_face_detections");'],
		{ failOnError: false },
	)
	return stdout.trim() || `unknown (${stderr.trim()})`
}

/** The tail of the server log, filtered down to what recognize wrote. */
async function readRecognizeLog(): Promise<string> {
	const { stdout, stderr } = await runExec(
		['bash', '-c', "grep -iE 'recognize|face|cluster|tensor|classif' data/nextcloud.log | tail -n 60"],
		{ failOnError: false },
	)
	return stdout.trim() || stderr.trim() || '(empty)'
}
