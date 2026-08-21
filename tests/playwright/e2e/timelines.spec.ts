/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from '../support/fixtures/photos-app.ts'
import { sharedAlbumName } from '../support/sections/SharedAlbumsPage.ts'
import { collectionPhotoName, MEDIA_COUNT, MEDIA_FIXTURES } from '../support/utils/media.ts'

const [firstPhoto, secondPhoto, thirdPhoto] = MEDIA_FIXTURES

test.describe('The timeline of the whole library', () => {
	test.beforeEach(async ({ photosApp }) => {
		await photosApp.timeline.open()
	})

	test('shows every photo of the library', async ({ photosApp }) => {
		await expect(photosApp.timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT)
	})

	test('marks a photo as favorite and takes it back', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.select(firstPhoto)
		await timeline.favoriteSelection([firstPhoto])
		await timeline.grid.expectFavorite(firstPhoto, true)

		await timeline.grid.select(firstPhoto)
		await timeline.unfavoriteSelection([firstPhoto])
		await timeline.grid.expectFavorite(firstPhoto, false)
	})

	test('marks several photos as favorite and takes it back', async ({ photosApp }) => {
		const { timeline } = photosApp
		const selection = [secondPhoto, thirdPhoto]

		await timeline.grid.select(...selection)
		await timeline.favoriteSelection(selection)
		for (const photo of selection) {
			await timeline.grid.expectFavorite(photo, true)
		}

		await timeline.grid.select(...selection)
		await timeline.unfavoriteSelection(selection)
		for (const photo of selection) {
			await timeline.grid.expectFavorite(photo, false)
		}
	})

	test('keeps the favorite state after a reload', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.select(firstPhoto)
		await timeline.favoriteSelection([firstPhoto])

		// The tiles are marked as favorite before the server confirms it, so only a
		// listing fetched from scratch says the state was really stored.
		await timeline.open()
		await timeline.grid.expectFavorite(firstPhoto, true)
	})

	test('downloads a single photo', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.select(firstPhoto)
		// A single photo is handed over as itself rather than zipped up.
		expect(await timeline.downloadSelection()).toBe(firstPhoto)
	})

	test('downloads several photos as an archive', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.select(secondPhoto, thirdPhoto)
		expect(await timeline.downloadSelection()).toMatch(/\.zip$/)
	})

	test('moves a photo to the trash', async ({ photosApp }) => {
		const { timeline } = photosApp

		await timeline.grid.select(firstPhoto)
		await timeline.deleteSelection([firstPhoto])

		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT - 1)

		// Still gone once the timeline is fetched from scratch, i.e. it is gone on
		// the server and not just dropped from the list the browser was holding.
		await timeline.open()
		await expect(timeline.grid.getMedia(firstPhoto)).toHaveCount(0)
	})

	test('moves several photos to the trash', async ({ photosApp }) => {
		const { timeline } = photosApp
		const selection = [secondPhoto, thirdPhoto]

		await timeline.grid.select(...selection)
		await timeline.deleteSelection(selection)

		await expect(timeline.grid.getAllMedia()).toHaveCount(MEDIA_COUNT - selection.length)

		await timeline.open()
		for (const photo of selection) {
			await expect(timeline.grid.getMedia(photo)).toHaveCount(0)
		}
	})
})

test.describe('Adding photos of the timeline to an album', () => {
	const albumName = 'timeline_album'

	test('adds a single photo', async ({ media, photosApp }) => {
		const { albums, album, timeline } = photosApp

		await albums.open()
		await albums.createAlbum(albumName)

		await timeline.open()
		await timeline.grid.select(firstPhoto)
		const picker = await timeline.openAlbumPicker()
		await picker.pickAlbum(albumName, 1)

		await album.open(albumName)
		// A photo of a collection is stored under its file id, so that two
		// collaborators can add files of the same name.
		await expect(album.grid.getMedia(collectionPhotoName(media[firstPhoto], firstPhoto))).toBeVisible()
		await expect(album.grid.getAllMedia()).toHaveCount(1)
	})

	test('adds several photos', async ({ photosApp }) => {
		const { albums, album, timeline } = photosApp
		const selection = [secondPhoto, thirdPhoto]

		await albums.open()
		await albums.createAlbum(albumName)

		await timeline.open()
		await timeline.grid.select(...selection)
		const picker = await timeline.openAlbumPicker()
		await picker.pickAlbum(albumName, selection.length)

		await album.open(albumName)
		await expect(album.grid.getAllMedia()).toHaveCount(selection.length)
	})

	test('deletes the album again', async ({ photosApp }) => {
		const { albums, album } = photosApp

		await albums.open()
		await albums.createAlbum(albumName)

		await album.deleteAlbum(albumName)

		// Re-read the overview rather than trusting the one the app navigated back
		// to: a listing that has not arrived yet is also one without the album.
		await albums.open()
		await expect(albums.getAlbum(albumName)).toHaveCount(0)
		await expect(albums.emptyMessage()).toBeVisible()
	})
})

test.describe('Adding photos of the timeline to a shared album', () => {
	const albumName = 'timeline_shared_album'

	test('adds photos of a collaborator to the album of its owner', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount] = await createAccounts(1)

		// The owner creates the album and invites the collaborator.
		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		const collaborators = await photosApp.album.openCollaborators()
		await collaborators.addCollaborators(bobAccount.user.userId)

		// The collaborator adds a photo of their own library through the timeline.
		const bob = await openSession(bobAccount)
		await bob.app.timeline.open()
		await bob.app.timeline.grid.select(firstPhoto)
		const picker = await bob.app.timeline.openAlbumPicker()
		await picker.pickAlbum(albumName, 1)

		await bob.app.sharedAlbum.open(albumName, user.userId)
		await expect(bob.app.sharedAlbum.grid.getMedia(collectionPhotoName(bobAccount.media[firstPhoto], firstPhoto))).toBeVisible()

		// And the owner sees it in their own album.
		await photosApp.album.open(albumName)
		await expect(photosApp.album.grid.getAllMedia()).toHaveCount(1)
	})

	test('adds several photos of a collaborator to the album of its owner', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount] = await createAccounts(1)
		const selection = [secondPhoto, thirdPhoto]

		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		const collaborators = await photosApp.album.openCollaborators()
		await collaborators.addCollaborators(bobAccount.user.userId)

		const bob = await openSession(bobAccount)
		await bob.app.timeline.open()
		await bob.app.timeline.grid.select(...selection)
		const picker = await bob.app.timeline.openAlbumPicker()
		await picker.pickAlbum(albumName, selection.length)

		await bob.app.sharedAlbums.open()
		await expect(bob.app.sharedAlbums.getAlbum(sharedAlbumName(albumName, user.userId))).toBeVisible()

		await bob.app.sharedAlbum.open(albumName, user.userId)
		await expect(bob.app.sharedAlbum.grid.getAllMedia()).toHaveCount(selection.length)
	})
})
