/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { MEDIA_COUNT, MEDIA_FIXTURES, PHOTOS_FOLDER } from '../support/utils/media.ts'

const [PHOTO, OTHER_PHOTO] = MEDIA_FIXTURES

/**
 * The folders view reads its listing from an endpoint of its own rather than from
 * DAV, and shows what comes back on the photo tile of the timeline. These tests
 * are about what that tile does with a photo of a folder — the actions it carries
 * are covered by the specs of the actions themselves.
 */
test.describe('The photos of a folder', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.folders.open(PHOTOS_FOLDER)
	})

	test('shows every photo of the folder', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await expect(grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
		await expect(grid.getMedia(PHOTO)).toBeVisible()
	})

	test('stacks the preview of a photo the way the timeline does', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		// More than one layer, i.e. the tile fades a sharp preview in over a small
		// one instead of waiting for the sharp one on an empty tile.
		expect(await grid.getPreviewLayers(PHOTO).count()).toBeGreaterThan(1)
	})

	test('carries the actions of every photo', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await expect(grid.getAllActionsMenuTriggers()).toHaveCount(MEDIA_COUNT)
		await expect((await grid.openActionsMenu(PHOTO)).getEntry('View metadata')).toBeVisible()
	})

	test('offers no selection, there being nothing to do with one here', async ({ photosApp }) => {
		const { grid } = photosApp.folders

		await grid.hoverTile(PHOTO)

		await expect(grid.getSelectionCheckbox(PHOTO)).toHaveCount(0)
	})

	test('opens a photo in the viewer, with the folder as its gallery', async ({ photosApp }) => {
		const { folders, viewer } = photosApp

		await folders.grid.open(PHOTO)

		await viewer.waitForPhoto(PHOTO)
		// The arrows are what says the viewer was handed the folder rather than the
		// single photo that was clicked.
		await expect(viewer.nextButton()).toBeVisible()
		await expect(viewer.previousButton()).toBeVisible()
	})

	test('moves a photo to the trash and leaves the folder without it', async ({ photosApp }) => {
		const { folders } = photosApp

		await (await folders.grid.openActionsMenu(PHOTO)).delete()

		await expect(folders.grid.getMedia(PHOTO)).toHaveCount(0)
		await expect(folders.grid.getMedia(OTHER_PHOTO)).toBeVisible()

		// A listing fetched from scratch is what says the photo is really gone.
		await folders.open(PHOTOS_FOLDER)
		await expect(folders.grid.getAllMedia()).toHaveCount(MEDIA_COUNT - 1)
		await expect(folders.grid.getMedia(PHOTO)).toHaveCount(0)
	})
})

test.describe('The layout of a folder', () => {
	/**
	 * The tiles of a folder are squares, the listing not saying what shape the
	 * photos are — so a photo is either fit whole into its tile, leaving it partly
	 * empty, or cropped to fill it.
	 */
	test('shows a photo whole, and crops it once the cropped layout is on', async ({ photosApp, setPhotosSetting }) => {
		const { folders } = photosApp

		await folders.open(PHOTOS_FOLDER)
		await folders.grid.expectPreviewCropped(PHOTO, false)

		await setPhotosSetting('croppedLayout', 'true')

		// The setting is handed to the app when the page is loaded, so the view is
		// opened again rather than waited on.
		await folders.open(PHOTOS_FOLDER)
		await folders.grid.expectPreviewCropped(PHOTO, true)
	})
})
