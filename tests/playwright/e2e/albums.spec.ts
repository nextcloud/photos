/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { SeededMedia } from '../support/utils/media.ts'

import { expect, test } from '../support/fixtures/photos-app.ts'
import { collectionPhotoName, MEDIA_FIXTURES } from '../support/utils/media.ts'

const ALBUM_NAME = 'albums_test'

/** The photos the album is populated with, oldest first. */
const ALBUM_PHOTOS = MEDIA_FIXTURES.slice(0, 3)

/** A photo of the library that is deliberately left out of the album. */
const PHOTO_OUTSIDE_ALBUM = MEDIA_FIXTURES[3]

/**
 * Name a photo carries inside the album.
 *
 * @param media - File ids of the seeded photos
 * @param name - Name of the original file
 */
function inAlbum(media: SeededMedia, name: string): string {
	return collectionPhotoName(media[name as keyof SeededMedia], name)
}

test.describe('Managing an album', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.albums.open()
		await photosApp.albums.createAlbum(ALBUM_NAME)
		await photosApp.album.addPhotos(ALBUM_NAME, [...ALBUM_PHOTOS])
	})

	test('holds the photos that were added to it', async ({ media, photosApp }) => {
		const { album } = photosApp

		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length)
		for (const photo of ALBUM_PHOTOS) {
			await expect(album.grid.getMedia(inAlbum(media, photo))).toBeVisible()
		}

		// Still there once the album is read from scratch.
		await album.open(ALBUM_NAME)
		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length)
	})

	test('removes a photo from the album', async ({ media, photosApp }) => {
		const { album } = photosApp
		const removed = inAlbum(media, ALBUM_PHOTOS[0])

		await album.grid.select(removed)
		await album.removeSelectionFromAlbum([removed])

		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length - 1)

		// The photo only left the album, the library still has it.
		await photosApp.timeline.open()
		await expect(photosApp.timeline.grid.getMedia(ALBUM_PHOTOS[0])).toBeVisible()
	})

	test('removes several photos from the album', async ({ media, photosApp }) => {
		const { album } = photosApp
		const removed = [inAlbum(media, ALBUM_PHOTOS[0]), inAlbum(media, ALBUM_PHOTOS[1])]

		await album.grid.select(...removed)
		await album.removeSelectionFromAlbum(removed)

		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length - removed.length)

		await album.open(ALBUM_NAME)
		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length - removed.length)
	})

	test('marks a photo of the album as favorite and takes it back', async ({ media, photosApp }) => {
		const { album } = photosApp
		const photo = inAlbum(media, ALBUM_PHOTOS[0])

		await album.grid.select(photo)
		await album.favoriteSelection([photo])
		await album.grid.expectFavorite(photo, true)

		await album.grid.select(photo)
		await album.unfavoriteSelection([photo])
		await album.grid.expectFavorite(photo, false)
	})

	test('marks several photos of the album as favorite and takes it back', async ({ media, photosApp }) => {
		const { album } = photosApp
		const selection = [inAlbum(media, ALBUM_PHOTOS[1]), inAlbum(media, ALBUM_PHOTOS[2])]

		await album.grid.select(...selection)
		await album.favoriteSelection(selection)
		for (const photo of selection) {
			await album.grid.expectFavorite(photo, true)
		}

		await album.grid.select(...selection)
		await album.unfavoriteSelection(selection)
		for (const photo of selection) {
			await album.grid.expectFavorite(photo, false)
		}
	})

	test('renames the album', async ({ photosApp }) => {
		const { album, albums } = photosApp

		await album.rename('New name')

		// The name survives a reload, i.e. it was stored rather than only shown.
		await album.open('New name')
		await expect(album.heading('New name')).toBeVisible()

		await albums.open()
		await expect(albums.getAlbum('New name')).toBeVisible()
		await expect(albums.getAlbum(ALBUM_NAME)).toHaveCount(0)
	})

	test('sets and clears the location of the album', async ({ photosApp }) => {
		const { album } = photosApp

		await album.setLocation('New location')
		await expect(album.location()).toContainText('New location')

		await album.open(ALBUM_NAME)
		await expect(album.location()).toContainText('New location')

		await album.setLocation('')
		await album.open(ALBUM_NAME)
		await expect(album.location()).toHaveCount(0)
	})

	test('drops a photo of the album when the file itself is deleted', async ({ media, photosApp }) => {
		const { album, timeline } = photosApp

		await album.addPhotos(ALBUM_NAME, [PHOTO_OUTSIDE_ALBUM])
		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length + 1)

		// Deleting the file, not the album entry: the album has to follow.
		await timeline.open()
		await timeline.grid.select(PHOTO_OUTSIDE_ALBUM)
		await timeline.deleteSelection([PHOTO_OUTSIDE_ALBUM])

		await album.open(ALBUM_NAME)
		await expect(album.grid.getMedia(inAlbum(media, PHOTO_OUTSIDE_ALBUM))).toHaveCount(0)
		await expect(album.grid.getAllMedia()).toHaveCount(ALBUM_PHOTOS.length)
	})
})
