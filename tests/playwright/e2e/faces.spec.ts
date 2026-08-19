/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Response } from '@playwright/test'

import { expect, test } from '../support/fixtures/faces.ts'
import { isRecognizeAvailable } from '../support/utils/faces.ts'

/**
 * The people view is driven by recognize, which has to be built and mounted into
 * the test container for any of this to exist — see `start-nextcloud-server.js`.
 */
test.skip(!isRecognizeAvailable, 'RECOGNIZE_APP_PATH is not set, so recognize is not installed')

/**
 * Detecting and clustering the faces costs minutes of TensorFlow work, so all of
 * these tests share one classified account. They therefore run in order, and the
 * one that shrinks the set of people comes last: merging two of them leaves fewer
 * behind than the tests before it need.
 */
test.describe.configure({ mode: 'serial' })

/**
 * Assert that a request to recognize succeeded, and in particular that it did not
 * 404.
 *
 * Addressing a photo by its bare file name instead of the `{detectionId}-{name}`
 * recognize expects used to make these requests 404 while the UI happily reported
 * success, which is the regression these tests guard.
 *
 * @param response - The recognize request to check
 */
async function expectRecognizeSuccess(response: Response): Promise<void> {
	const request = `${response.request().method()} ${response.url()}`
	expect(response.status(), `${request} must not 404`).not.toBe(404)
	expect([200, 201, 204, 207], `unexpected status for ${request}`).toContain(response.status())
}

test.describe('The people recognize found', () => {
	test('lists them, together with the faces it could not assign', async ({ photosApp }) => {
		const { faces } = photosApp

		await faces.open()

		await expect(faces.getAllFaces().first()).toBeVisible()
		await expect(faces.unassignedFaces()).toBeVisible()
	})

	test('shows the photos of a person', async ({ photosApp }) => {
		const { face, faces } = photosApp

		await faces.open()
		await face.open(await faces.getFaceName(0))

		await expect(face.grid.getAllMedia().first()).toBeVisible()
	})

	test('renames a person', async ({ photosApp }) => {
		const { face, faces } = photosApp
		const newName = 'Playwright Person'

		await faces.open()
		await face.open(await faces.getFaceName(0))

		await expectRecognizeSuccess(await face.rename(newName))

		await expect(face.name()).toHaveText(newName)
	})

	test('moves a photo to a different person', async ({ photosApp }) => {
		const { face, faces } = photosApp

		await faces.open()
		// Moving a photo needs a second person to move it to.
		expect(await faces.getAllFaces().count(), 'recognize found more than one person').toBeGreaterThanOrEqual(2)

		await face.open(await faces.getFaceName(0))
		await face.grid.selectFirst()

		await expectRecognizeSuccess(await face.moveSelectionToFirstOtherPerson())
	})

	test('removes a photo from a person', async ({ photosApp }) => {
		const { face, faces } = photosApp

		await faces.open()
		await face.open(await faces.getFaceName(0))
		await face.grid.selectFirst()

		await expectRecognizeSuccess(await face.removeSelectionFromPerson())
	})

	// Last: merging moves every photo of one person onto another and deletes the
	// first, which leaves the tests above without the second person they need.
	test('merges two people', async ({ photosApp }) => {
		const { face, faces } = photosApp

		await faces.open()
		expect(await faces.getAllFaces().count(), 'recognize found more than one person').toBeGreaterThanOrEqual(2)

		await face.open(await faces.getFaceName(0))

		await expectRecognizeSuccess(await face.mergeIntoFirstOtherPerson())
	})
})
