/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { PublicAlbumPage } from '../support/sections/PublicAlbumPage.ts'
import { Timeline } from '../support/sections/TimelinePage.ts'
import { collectionPhotoName, MEDIA_FIXTURES, PHOTOS_FOLDER } from '../support/utils/media.ts'

const [PHOTO, OTHER_PHOTO] = MEDIA_FIXTURES

test.describe('Marking a single photo as a favorite', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('marks it through its own actions and takes it back', async ({ photosApp, readFavorite }) => {
		const { timeline } = photosApp

		const menu = await timeline.grid.openActionsMenu(PHOTO)
		await expect(menu.addToFavoritesEntry()).toBeVisible()
		await menu.favorite()

		expect(await readFavorite(PHOTO)).toBe(true)

		// The entry names what it does to the photo as it is now, so it is the
		// other way around from here on.
		const marked = await timeline.grid.openActionsMenu(PHOTO)
		await expect(marked.removeFromFavoritesEntry()).toBeVisible()
		await marked.unfavorite()

		expect(await readFavorite(PHOTO)).toBe(false)
	})

	test('comes up as marked after a reload', async ({ photosApp }) => {
		const { timeline } = photosApp

		await (await timeline.grid.openActionsMenu(PHOTO)).favorite()

		// A listing fetched from scratch is what says the state was really stored.
		await timeline.open()
		await expect((await timeline.grid.openActionsMenu(PHOTO)).removeFromFavoritesEntry()).toBeVisible()
	})

	test('stars the tile of the photo', async ({ photosApp }) => {
		const { timeline } = photosApp

		await expect(timeline.grid.getFavoriteMarker(PHOTO)).toHaveCount(0)

		await (await timeline.grid.openActionsMenu(PHOTO)).favorite()

		await timeline.grid.leaveTiles()
		await expect(timeline.grid.getFavoriteMarker(PHOTO)).toBeVisible()
	})

	test('lists it in the favorites and leaves the other photos alone', async ({ photosApp }) => {
		const { timeline } = photosApp

		await (await timeline.grid.openActionsMenu(PHOTO)).favorite()

		await timeline.open(Timeline.favorites)
		await expect(timeline.grid.getMedia(PHOTO)).toBeVisible()
		await expect(timeline.grid.getAllMedia()).toHaveCount(1)
	})

	test('leaves the other photos of the timeline untouched', async ({ photosApp, readFavorite }) => {
		await (await photosApp.timeline.grid.openActionsMenu(PHOTO)).favorite()

		expect(await readFavorite(OTHER_PHOTO)).toBe(false)
	})
})

test.describe('Marking a photo outside of the timeline', () => {
	test('marks a photo of the folders view', async ({ photosApp, readFavorite }) => {
		const { folders } = photosApp

		await folders.open(PHOTOS_FOLDER)
		// The folder listing carries no favorite state, so the entry offers to mark
		// the photo whether it is one already or not.
		await (await folders.grid.openActionsMenu(PHOTO)).favorite()

		expect(await readFavorite(PHOTO)).toBe(true)
	})

	test('marks a photo of an album', async ({ photosApp, readFavorite }) => {
		const { album, albums } = photosApp
		const albumName = 'Favorites'

		await albums.open()
		await albums.createAlbum(albumName)
		await album.addPhotos(albumName, [PHOTO])

		// The photo is listed under a name made up of its file id, but its actions
		// are named after the original file, which is what they are about.
		await (await album.grid.openActionsMenu(PHOTO)).favorite()

		expect(await readFavorite(PHOTO)).toBe(true)
	})
})

test.describe('The actions of a photo nobody is signed in for', () => {
	test('offers neither the favorites nor the tags', async ({ browser, baseURL, media, photosApp }) => {
		const { album, albums } = photosApp
		const albumName = 'public_actions'

		await albums.open()
		await albums.createAlbum(albumName)
		await album.addPhotos(albumName, [PHOTO])

		const link = await (await album.openCollaborators()).createPublicLink()

		const visitorPage = await browser.newPage({ storageState: undefined, baseURL })
		const publicAlbum = new PublicAlbumPage(visitorPage)
		await publicAlbum.open(link)

		const menu = await publicAlbum.grid.openActionsMenu(collectionPhotoName(media[PHOTO], PHOTO))
		await expect(menu.getEntry('View metadata')).toBeVisible()
		await expect(menu.addToFavoritesEntry()).toHaveCount(0)
		await expect(menu.manageTagsEntry()).toHaveCount(0)

		await visitorPage.close()
	})
})
