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

/**
 * Whether the faces tests can run at all.
 *
 * They drive recognize's WebDAV API, and recognize has to be built (TensorFlow
 * binaries and models) and mounted into the container for that — which the
 * server script only does when it was pointed at such a checkout.
 */
export const isRecognizeAvailable = Boolean(process.env.RECOGNIZE_APP_PATH)

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
	// recognize's install migration cannot download its Node runtime, as the app is
	// mounted read only — point it at the binary the workflow pre-staged instead.
	// Without this the classifier never starts and no face is ever detected.
	await runOcc(['config:app:set', '--lazy', '--value=/var/www/html/apps/recognize/bin/node', 'recognize', 'node_binary'])

	await runOcc(['files:scan', user.userId, '--generate-metadata'], { verbose: true })
	await runOcc(['recognize:classify'], { verbose: true })

	for (let pass = 0; pass < 6; pass++) {
		await runOcc(['recognize:cluster-faces', '-b', '10000'], { verbose: true })
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
	const { stdout, stderr } = await runExec(
		['bash', '-c', "sqlite3 data/*.db 'SELECT COUNT(*) FROM oc_recognize_face_detections'"],
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
