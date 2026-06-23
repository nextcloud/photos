/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@nextcloud/e2e-test-server'

import { mkdir } from './photosUtils.ts'

/**
 * recognize's FaceClusterAnalyzer only starts forming clusters once it has
 * gathered at least MIN_DATASET_SIZE (120) face detections. Our committed face
 * fixture set is much smaller than that, so we upload every fixture image
 * several times (under distinct names) to comfortably clear the threshold.
 * The duplicated detections share the same face vector and therefore cluster
 * tightly, which keeps the resulting clusters deterministic enough to test.
 */
export const FACE_UPLOAD_MULTIPLIER = 5

/**
 * Folder, relative to `cypress/fixtures`, that holds the face fixture images.
 * It is populated from the recognize repository's `test-files/FaceID-550`
 * dataset (see the Cypress workflow / `npm run cypress:setup-faces`).
 */
export const FACES_FIXTURE_DIR = 'faces'

export type FacesSetupInfo = {
	snapshot?: string
	user: User
}

/**
 * Upload the face fixture images for a user.
 *
 * Each image is uploaded `FACE_UPLOAD_MULTIPLIER` times under a distinct name
 * so recognize ends up with enough detections to cluster.
 *
 * @param user The user to upload the fixtures for.
 * @param destination The target folder, relative to the user root.
 */
export function uploadFaceMedia(user: User, destination = '/Photos') {
	return cy.exec(`find cypress/fixtures/${FACES_FIXTURE_DIR} -type f \\( -iname '*.jpg' -o -iname '*.jpeg' \\)`)
		.then((result) => {
			const files = result.stdout.split('\n').map((line) => line.trim()).filter(Boolean)
			expect(files.length, 'face fixture images are present').to.be.greaterThan(0)

			files.forEach((absolutePath) => {
				// Path relative to the fixtures folder, e.g. "faces/Sao_Mai/Sao_Mai_1.jpg".
				const fixturePath = absolutePath.replace(/^cypress\/fixtures\//, '')
				const fileName = fixturePath.split('/').pop() as string

				for (let copy = 0; copy < FACE_UPLOAD_MULTIPLIER; copy++) {
					const targetName = copy === 0 ? fileName : `${copy}-${fileName}`
					cy.uploadFile(user, fixturePath, 'image/jpeg', `/${destination}/${targetName}`)
				}
			})
		})
}

/**
 * Run the recognize face detection + clustering pipeline.
 *
 * This mirrors recognize's own CI: scan the files, classify them to produce
 * face detections, then run several clustering passes to stabilise the
 * resulting clusters.
 */
export function classifyFaces() {
	// Enable faces and disable the API key requirement so the Photos WebDAV
	// requests are accepted without a signed recognize key.
	cy.runOccCommand('config:app:set --value true recognize faces.enabled')
	cy.runOccCommand('config:app:set --value false recognize require_api_key')
	// GitHub runners only have a couple of cores available.
	cy.runOccCommand('config:app:set --value 1 recognize tensorflow.cores')
	// recognize's InstallDeps migration cannot download its Node runtime because
	// the app is mounted read-only, so point it at the binary pre-staged by the
	// workflow (see .github/workflows/cypress.yml). Without this the classifier
	// process never starts and no faces are detected.
	cy.runOccCommand('config:app:set --lazy --value /var/www/html/apps/recognize/bin/node recognize node_binary')
	// Debug logging, written to data/nextcloud.log, so recognize's classifier
	// errors and "ClusterDebug: …" lines (e.g. "Not enough face detections
	// found") are available for diagnosis from inside the test container.
	cy.runOccCommand('config:system:set loglevel --value 0')
	cy.runOccCommand('config:system:set log_type --value file')

	cy.runOccCommand('files:scan --all --generate-metadata', { timeout: 5 * 60 * 1000 })
	cy.runOccCommand('recognize:classify', { timeout: 30 * 60 * 1000 })

	// Several passes, as a single pass does not necessarily assign every
	// detection to its final cluster.
	for (let pass = 0; pass < 6; pass++) {
		cy.runOccCommand('recognize:cluster-faces -b 10000', { timeout: 10 * 60 * 1000 })
	}
}

/**
 * Verify that the recognize pipeline actually produced face clusters.
 *
 * Without this, a pipeline that yields no clusters only surfaces much later as
 * an opaque "[data-test="face"] not found" timeout in the faces view. Querying
 * the same WebDAV endpoint the app uses turns that into a clear, actionable
 * failure, and the detection count helps tell apart "classification produced
 * nothing" from "fewer than the 120 detections recognize needs to cluster".
 *
 * @param user The user whose faces were classified.
 */
export function verifyFacesClassification(user: User) {
	const diagnostics: { detections?: string, logTail?: string } = {}

	// Gather diagnostics from the live test container. The post-run workflow
	// steps can't do this: the container is already gone by then. The occ
	// commands above prove it is up here, so read straight from it. We derive
	// the container name exactly like @nextcloud/cypress's getContainerName
	// (nextcloud-cypress-tests_<basename of cwd>) instead of `docker ps`, which
	// returned nothing in CI.
	cy.exec('pwd')
		.then(({ stdout }) => {
			const container = `nextcloud-cypress-tests_${stdout.trim().split('/').pop()}`
			const dockerExec = (command: string) => cy.exec(`docker exec --user www-data --workdir /var/www/html ${container} ${command}`, { failOnNonZeroExit: false })

			// Count face detections directly in the DB (php is always present in
			// the container, sqlite3 may not be).
			dockerExec('php -r \'try { $f = glob("data/*.db"); echo $f ? (new PDO("sqlite:".$f[0]))->query("SELECT COUNT(*) FROM oc_recognize_face_detections")->fetchColumn() : "no-db"; } catch (Throwable $e) { echo "err: ".$e->getMessage(); }\'')
				.then(({ stdout: detections }) => {
					diagnostics.detections = (detections || '').trim()
				})
			dockerExec("sh -c 'grep -iE \"recognize|face|cluster|tensor|classif|node\" data/nextcloud.log 2>/dev/null | tail -n 60'")
				.then(({ stdout: logTail }) => {
					diagnostics.logTail = (logTail || '').trim()
				})
		})

	// Hard check: the faces collection must expose at least one cluster.
	cy.request({
		method: 'PROPFIND',
		url: `${Cypress.env('baseUrl')}/remote.php/dav/recognize/${encodeURIComponent(user.userId)}/faces/`,
		auth: { user: user.userId, pass: user.password },
		headers: { Depth: '1' },
	}).then((response) => {
		// Depth:1 returns the faces collection itself plus one entry per cluster.
		const responseCount = (response.body.match(/<\w+:response[\s>]/g) || []).length
		const clusterCount = Math.max(responseCount - 1, 0)
		cy.log(`recognize face clusters: ${clusterCount}, detections: ${diagnostics.detections}`)
		expect(
			clusterCount,
			'recognize formed at least one face cluster.\n'
			+ `Face detections in DB: ${diagnostics.detections ?? 'unknown'} (clustering needs ≥120).\n`
			+ `recognize log tail:\n${diagnostics.logTail ?? '(empty)'}`,
		).to.be.greaterThan(0)
	})
}

/**
 * Set up the data needed for the faces tests.
 *
 * The face classification pipeline is expensive, so it is run only once and
 * the resulting Nextcloud data directory is snapshotted; subsequent tests
 * restore that snapshot instead of re-classifying.
 */
export function setupFacesTests(): Cypress.Chainable<FacesSetupInfo> {
	return cy.task('getVariable', { key: 'faces-data' })
		.then((_setupInfo) => {
			const setupInfo = (_setupInfo as FacesSetupInfo) || ({} as FacesSetupInfo)

			if (setupInfo.snapshot) {
				cy.restoreState(setupInfo.snapshot)
			} else {
				cy.createRandomUser().then((user) => {
					setupInfo.user = user
				})

				cy.then(() => {
					mkdir(setupInfo.user, '/Photos')
					uploadFaceMedia(setupInfo.user)
				})

				classifyFaces()

				// Fail early and clearly if classification produced no clusters,
				// rather than snapshotting an empty state and timing out later.
				cy.then(() => {
					verifyFacesClassification(setupInfo.user)
				})

				cy.then(() => {
					cy.saveState().then((value) => {
						setupInfo.snapshot = value
					})
					cy.task('setVariable', { key: 'faces-data', value: setupInfo })
				})
			}

			return cy.then(() => {
				cy.login(setupInfo.user)
				cy.visit('/apps/photos')
				return cy.wrap(setupInfo)
			})
		})
}

/**
 * Navigate to the faces view and wait for the faces list to be fetched.
 */
export function navigateToFaces() {
	cy.url().then((url) => {
		if (!url.includes('/apps/photos/faces')) {
			cy.intercept({ times: 1, method: 'PROPFIND', url: '/remote.php/dav/recognize/*/faces/' }).as('propFindFaces')
			cy.get('[data-id-app-nav-item="faces"]').click()
			cy.wait('@propFindFaces')
		}
	})
	// Wait for at least one recognized person to be rendered.
	cy.get('[data-test="face"]', { timeout: 10000 }).should('have.length.at.least', 1)
}

/**
 * Open the n-th recognized person and wait for their photos to load.
 *
 * @param index The index of the person in the faces list.
 */
export function openFace(index = 0) {
	cy.intercept({ method: 'PROPFIND', url: '/remote.php/dav/recognize/*/faces/*' }).as('propFindFaceContent')
	cy.get('[data-test="face"]').eq(index).click()
	cy.wait('@propFindFaceContent')
	cy.get('[data-test="media"]', { timeout: 10000 }).should('have.length.at.least', 1)
}

/**
 * Select the n-th photo in the currently open person view.
 *
 * @param index The index of the photo.
 */
export function selectFacePhoto(index = 0) {
	cy.get('[data-test="media"]').eq(index)
		.find('a').focus()
		.parent().find('input').check({ force: true })
}

/**
 * Open the selection actions menu in the person view.
 */
export function openFaceActionsMenu() {
	cy.get('.face__header__actions [aria-label="Open actions menu"]').click()
}
