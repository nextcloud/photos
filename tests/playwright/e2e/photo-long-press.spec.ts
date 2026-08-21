/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_FIXTURES } from '../support/utils/media.ts'

/** Two photos of the library, any two of them will do. */
const [PHOTO, OTHER_PHOTO] = MEDIA_FIXTURES

test.describe('Selecting photos by holding them', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('selects a photo without opening it', async ({ photosApp }) => {
		const { timeline, viewer } = photosApp

		await timeline.grid.longPress(PHOTO)

		await expect(timeline.grid.getSelectionCheckbox(PHOTO)).toBeChecked()
		// A selection is what the press is for, so the click it ends with must not
		// open the photo on top of it.
		await expect(viewer.dialog()).toHaveCount(0)
		await expect(timeline.unselectAllButton()).toBeVisible()
	})

	test('adds a second photo to the selection', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.longPress(PHOTO)
		await timeline.grid.longPress(OTHER_PHOTO)

		await expect(timeline.grid.getSelectionCheckbox(PHOTO)).toBeChecked()
		await expect(timeline.grid.getSelectionCheckbox(OTHER_PHOTO)).toBeChecked()
	})

	test('takes a photo out of the selection again', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.longPress(PHOTO)
		await expect(timeline.grid.getSelectionCheckbox(PHOTO)).toBeChecked()

		await timeline.grid.longPress(PHOTO)
		await expect(timeline.grid.getSelectionCheckbox(PHOTO)).not.toBeChecked()
		await expect(timeline.unselectAllButton()).toHaveCount(0)
	})

	test('opens a photo that is pressed and let go of', async ({ photosApp }) => {
		const { timeline, viewer } = photosApp

		await timeline.grid.open(PHOTO)

		// A short press is still what opens a photo, i.e. the two are told apart by
		// how long the press is held rather than by where it lands.
		await viewer.waitForPhoto(PHOTO)
		await expect(timeline.grid.getSelectionCheckbox(PHOTO)).not.toBeChecked()
	})
})
