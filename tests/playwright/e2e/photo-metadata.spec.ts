/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { collectionPhotoName, PHOTO_IN_LAURIS, PHOTOS_FOLDER } from '../support/utils/media.ts'

/** The photo every test here is about: taken in Lauris on the 24th of October 2019. */
const PHOTO = PHOTO_IN_LAURIS

test.describe('Showing the metadata of a photo', () => {
	/** The place of a photo is resolved out of its coordinates in a pass of its own. */
	test.use({ withPlaces: true })

	test('shows the place, the coordinates and the camera', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.open()
		const metadata = await (await timeline.grid.openActionsMenu(PHOTO)).viewMetadata()

		await expect(metadata.getEntry('Place')).toHaveText('Lauris')
		await expect(metadata.getEntry('Location')).toHaveText('43.73926, 5.31345')
		// The manufacturer is left out, the model already carries it.
		await expect(metadata.getEntry('Camera')).toHaveText('ONEPLUS A5000')
	})

	test('shows the photo on a map', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.open()
		const metadata = await (await timeline.grid.openActionsMenu(PHOTO)).viewMetadata()

		// A map carries no accessible name of its own, its marker names the place
		// it points at.
		await expect(metadata.map()).toBeVisible()
		await expect(metadata.mapMarkerLabel()).toContainText('Lauris')
	})
})

test.describe('Editing the metadata of a photo', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('comes up with the values the photo carries', async ({ photosApp }) => {
		const editor = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		// The precision of the coordinates depends on the server, and the taken date
		// is shown in the timezone of the browser.
		expect(Number(await editor.latitudeInput().inputValue())).toBeCloseTo(43.739, 2)
		expect(Number(await editor.longitudeInput().inputValue())).toBeCloseTo(5.313, 2)
		await expect(editor.takenAtInput()).toHaveValue(/^2019-10-2\d/)
	})

	test('saves a corrected position and taken date', async ({ photosApp }) => {
		const editor = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		await editor.fillCoordinates('48.8583', '2.2945')
		await editor.fillTakenAt('2020-07-14T21:30')
		await editor.save()

		// Reopening reads the values back from the server rather than from the form.
		await photosApp.timeline.open()
		const reopened = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		await expect(reopened.latitudeInput()).toHaveValue('48.8583')
		await expect(reopened.longitudeInput()).toHaveValue('2.2945')
		await expect(reopened.takenAtInput()).toHaveValue('2020-07-14T21:30')
	})

	test('refuses coordinates which are off world', async ({ photosApp }) => {
		const editor = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		await editor.latitudeInput().fill('95')

		await expect(editor.latitudeInput()).toHaveAccessibleDescription('Enter decimal degrees between -90 and 90')
		await expect(editor.saveButton()).toBeDisabled()
	})

	test('refuses a position with only one coordinate', async ({ photosApp }) => {
		const editor = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		await editor.longitudeInput().fill('')

		await expect(editor.longitudeInput()).toHaveAccessibleDescription('Both coordinates are required')
		await expect(editor.saveButton()).toBeDisabled()
	})

	test('removes the position of the photo', async ({ photosApp }) => {
		const editor = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		await editor.removeLocationButton().click()
		await editor.save()

		await photosApp.timeline.open()
		const reopened = await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).editMetadata()

		await expect(reopened.latitudeInput()).toHaveValue('')
		await expect(reopened.longitudeInput()).toHaveValue('')
	})
})

test.describe('Reaching the actions of a photo outside of the timeline', () => {
	test('manages a photo of the folders view', async ({ photosApp }) => {
		const { folders } = photosApp

		await folders.open(PHOTOS_FOLDER)
		const metadata = await (await folders.grid.openActionsMenu(PHOTO)).viewMetadata()

		await expect(metadata.getEntry('Filename')).toHaveText(PHOTO)
	})

	test('manages a photo of an album', async ({ media, photosApp }) => {
		const { album, albums, timeline } = photosApp
		const albumName = 'Actions'

		await albums.open()
		await albums.createAlbum(albumName)

		// Added through the actions of the photo itself rather than through the
		// album, which is the path this test is about.
		await timeline.open()
		const picker = await (await timeline.grid.openActionsMenu(PHOTO)).addToAlbum()
		await picker.pickAlbum(albumName, 1)

		await album.open(albumName)
		// Photos of an album are shown under a name made up of their file id, but
		// their actions are about the original file — which is what this is about.
		await expect(album.grid.getMedia(collectionPhotoName(media[PHOTO], PHOTO))).toBeVisible()
		const metadata = await (await album.grid.openActionsMenu(PHOTO)).viewMetadata()

		await expect(metadata.getEntry('Filename')).toHaveText(PHOTO)
	})

	test('leaves the picking of photos alone', async ({ photosApp }) => {
		const { album, albums } = photosApp
		const albumName = 'Picking'

		await albums.open()
		await albums.createAlbum(albumName)

		const picker = await album.openPhotosPicker(albumName)

		// Picking photos is not managing them.
		await expect(picker.grid.getAllActionsMenuTriggers()).toHaveCount(0)
	})
})
