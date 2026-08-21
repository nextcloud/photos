/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosApp } from '../support/sections/PhotosApp.ts'
import type { PhotosSession } from '../support/utils/accounts.ts'
import type { SeededMedia } from '../support/utils/media.ts'

import { expect, test } from '../support/fixtures/photos-app.ts'
import { PublicAlbumPage } from '../support/sections/PublicAlbumPage.ts'
import { sharedAlbumName } from '../support/sections/SharedAlbumsPage.ts'
import { collectionPhotoName, MEDIA_FIXTURES } from '../support/utils/media.ts'

const [firstPhoto, secondPhoto, thirdPhoto] = MEDIA_FIXTURES

test.describe('An album shared with a collaborator', () => {
	const albumName = 'shared_album'

	test('lets the collaborator add and remove photos of their own', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount] = await createAccounts(1)

		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		await (await photosApp.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

		const bob = await openSession(bobAccount)
		await bob.app.sharedAlbum.open(albumName, user.userId)
		await expect(bob.app.sharedAlbum.emptyMessage()).toBeVisible()

		await bob.app.sharedAlbum.addPhotos(albumName, user.userId, [firstPhoto])
		const inAlbum = collectionPhotoName(bobAccount.media[firstPhoto], firstPhoto)
		await expect(bob.app.sharedAlbum.grid.getMedia(inAlbum)).toBeVisible()

		await bob.app.sharedAlbum.grid.select(inAlbum)
		await bob.app.sharedAlbum.removeSelectionFromAlbum([inAlbum])
		await expect(bob.app.sharedAlbum.grid.getAllMedia()).toHaveCount(0)
	})

	test('lets the collaborator add and remove several photos at once', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount] = await createAccounts(1)
		const added = [secondPhoto, thirdPhoto]

		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		await (await photosApp.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

		const bob = await openSession(bobAccount)
		await bob.app.sharedAlbum.open(albumName, user.userId)
		await bob.app.sharedAlbum.addPhotos(albumName, user.userId, added)

		const inAlbum = added.map((photo) => collectionPhotoName(bobAccount.media[photo], photo))
		await expect(bob.app.sharedAlbum.grid.getAllMedia()).toHaveCount(added.length)

		await bob.app.sharedAlbum.grid.select(...inAlbum)
		await bob.app.sharedAlbum.removeSelectionFromAlbum(inAlbum)
		await expect(bob.app.sharedAlbum.grid.getAllMedia()).toHaveCount(0)
	})

	test('lets the collaborator leave it', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount] = await createAccounts(1)

		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		await (await photosApp.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

		const bob = await openSession(bobAccount)
		await bob.app.sharedAlbum.open(albumName, user.userId)
		await bob.app.sharedAlbum.leaveAlbum(albumName, user.userId)

		// Gone for the collaborator, still there for the owner.
		await bob.app.sharedAlbums.open()
		await expect(bob.app.sharedAlbums.getAlbum(sharedAlbumName(albumName, user.userId))).toHaveCount(0)

		await photosApp.albums.open()
		await expect(photosApp.albums.getAlbum(albumName)).toBeVisible()
	})

	test('disappears for the collaborator once they are removed', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount] = await createAccounts(1)

		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		await (await photosApp.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

		const bob = await openSession(bobAccount)
		await bob.app.sharedAlbums.open()
		await expect(bob.app.sharedAlbums.getAlbum(sharedAlbumName(albumName, user.userId))).toBeVisible()

		await (await photosApp.album.openCollaborators()).removeCollaborators(bobAccount.user.userId)

		await bob.app.sharedAlbums.open()
		await expect(bob.app.sharedAlbums.getAllAlbums()).toHaveCount(0)
	})

	/**
	 * Downloading from a shared album is not implemented: the actions are commented
	 * out in `SharedAlbumContent.vue`. The Cypress suite carried the same tests
	 * disabled, so they are kept pending here rather than dropped.
	 */
	test.fixme('lets the collaborator download photos of the album', () => {})
})

test.describe('Two albums of the same name shared with the same account', () => {
	const albumName = 'shared_album_same_name'

	test('are told apart by their owner', async ({ photosApp, user, createAccounts, openSession }) => {
		const [bobAccount, charlieAccount] = await createAccounts(2)

		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		await (await photosApp.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

		const charlie = await openSession(charlieAccount)
		await charlie.app.albums.open()
		await charlie.app.albums.createAlbum(albumName)
		await (await charlie.app.album.openCollaborators()).addCollaborators(bobAccount.user.userId)

		const bob = await openSession(bobAccount)
		await bob.app.sharedAlbums.open()

		await expect(bob.app.sharedAlbums.getAlbum(sharedAlbumName(albumName, user.userId))).toBeVisible()
		await expect(bob.app.sharedAlbums.getAlbum(sharedAlbumName(albumName, charlieAccount.user.userId))).toBeVisible()
		await expect(bob.app.sharedAlbums.getAllAlbums()).toHaveCount(2)
	})
})

test.describe('An album shared with several collaborators', () => {
	const albumName = 'shared_album_collaborators'

	/**
	 * Share a fresh album with two collaborators and have each of the three
	 * accounts contribute one photo of its own library.
	 *
	 * @param photosApp - The app of the owner
	 * @param owner - Account id of the owner
	 * @param collaborators - The sessions of the collaborators
	 * @param media - File ids of the owner's photos
	 */
	async function shareWithContributions(
		photosApp: PhotosApp,
		owner: string,
		collaborators: PhotosSession[],
		media: SeededMedia,
	): Promise<string[]> {
		await photosApp.albums.open()
		await photosApp.albums.createAlbum(albumName)
		await (await photosApp.album.openCollaborators())
			.addCollaborators(...collaborators.map(({ user }) => user.userId))

		await photosApp.album.addPhotos(albumName, [firstPhoto])
		const names = [collectionPhotoName(media[firstPhoto], firstPhoto)]

		for (const [index, collaborator] of collaborators.entries()) {
			const photo = MEDIA_FIXTURES[index + 1]
			await collaborator.app.sharedAlbum.open(albumName, owner)
			await collaborator.app.sharedAlbum.addPhotos(albumName, owner, [photo])
			names.push(collectionPhotoName(collaborator.media[photo], photo))
		}

		return names
	}

	test('shows every collaborator the photos of all of them', async ({ photosApp, user, media, createAccounts, openSession }) => {
		const accounts = await createAccounts(2)
		const collaborators = await Promise.all(accounts.map((account) => openSession(account)))

		const names = await shareWithContributions(photosApp, user.userId, collaborators, media)

		await photosApp.album.open(albumName)
		await expect(photosApp.album.grid.getAllMedia()).toHaveCount(names.length)

		for (const collaborator of collaborators) {
			await collaborator.app.sharedAlbum.open(albumName, user.userId)
			await expect(collaborator.app.sharedAlbum.grid.getAllMedia()).toHaveCount(names.length)
			for (const name of names) {
				await expect(collaborator.app.sharedAlbum.grid.getMedia(name)).toBeVisible()
			}
		}
	})

	test('drops the photos of a collaborator that is removed', async ({ photosApp, user, media, createAccounts, openSession }) => {
		const accounts = await createAccounts(2)
		const collaborators = await Promise.all(accounts.map((account) => openSession(account)))
		const [bob] = collaborators

		const names = await shareWithContributions(photosApp, user.userId, collaborators, media)
		const bobsPhoto = names[1]

		await photosApp.album.open(albumName)
		await (await photosApp.album.openCollaborators()).removeCollaborators(bob.user.userId)

		await photosApp.album.open(albumName)
		await expect(photosApp.album.grid.getMedia(bobsPhoto)).toHaveCount(0)
		await expect(photosApp.album.grid.getAllMedia()).toHaveCount(names.length - 1)
	})

	test('lets a collaborator remove every photo of the album', async ({ photosApp, user, media, createAccounts, openSession }) => {
		const accounts = await createAccounts(2)
		const collaborators = await Promise.all(accounts.map((account) => openSession(account)))
		const [bob] = collaborators

		const names = await shareWithContributions(photosApp, user.userId, collaborators, media)

		await bob.app.sharedAlbum.open(albumName, user.userId)
		await bob.app.sharedAlbum.grid.select(...names)
		await bob.app.sharedAlbum.removeSelectionFromAlbum(names)
		await expect(bob.app.sharedAlbum.grid.getAllMedia()).toHaveCount(0)

		// Also gone for the owner, i.e. the photos really left the album.
		await photosApp.album.open(albumName)
		await expect(photosApp.album.grid.getAllMedia()).toHaveCount(0)
		await expect(photosApp.album.emptyMessage()).toBeVisible()
	})

	test('drops a photo whose file was deleted by its owner', async ({ photosApp, user, media, createAccounts, openSession }) => {
		const accounts = await createAccounts(2)
		const collaborators = await Promise.all(accounts.map((account) => openSession(account)))
		const [bob] = collaborators

		const names = await shareWithContributions(photosApp, user.userId, collaborators, media)
		const bobsPhoto = names[1]

		// Bob deletes the file itself, not the album entry.
		await bob.app.timeline.open()
		await bob.app.timeline.grid.select(secondPhoto)
		await bob.app.timeline.deleteSelection([secondPhoto])

		await bob.app.sharedAlbum.open(albumName, user.userId)
		await expect(bob.app.sharedAlbum.grid.getMedia(bobsPhoto)).toHaveCount(0)
		await expect(bob.app.sharedAlbum.grid.getAllMedia()).toHaveCount(names.length - 1)

		await photosApp.album.open(albumName)
		await expect(photosApp.album.grid.getAllMedia()).toHaveCount(names.length - 1)
	})

	test('drops a collaborator whose account is deleted, and its photos', async ({ photosApp, user, media, createAccounts, openSession, deleteAccount }) => {
		const accounts = await createAccounts(2)
		const collaborators = await Promise.all(accounts.map((account) => openSession(account)))
		const [, charlie] = collaborators

		const names = await shareWithContributions(photosApp, user.userId, collaborators, media)

		await deleteAccount(charlie.user)

		await photosApp.album.open(albumName)
		await expect(photosApp.album.grid.getMedia(names[2])).toHaveCount(0)
		await expect(photosApp.album.grid.getAllMedia()).toHaveCount(names.length - 1)

		const collaboratorsDialog = await photosApp.album.openCollaborators()
		await expect(collaboratorsDialog.getSelectedCollaborators()).toHaveCount(1)
	})

	test('disappears for its collaborators when the owner is deleted', async ({ photosApp, user, media, createAccounts, openSession, deleteAccount }) => {
		const accounts = await createAccounts(2)
		const collaborators = await Promise.all(accounts.map((account) => openSession(account)))
		const [bob] = collaborators

		await shareWithContributions(photosApp, user.userId, collaborators, media)

		await deleteAccount(user)

		await bob.app.sharedAlbums.open()
		await expect(bob.app.sharedAlbums.getAllAlbums()).toHaveCount(0)
	})
})

test.describe('An album shared through a public link', () => {
	const albumName = 'public_album'

	test('is readable by anyone holding the link, and only until it is revoked', async ({ browser, baseURL, photosApp }) => {
		const { album, albums } = photosApp

		await albums.open()
		await albums.createAlbum(albumName)
		await album.addPhotos(albumName, [...MEDIA_FIXTURES.slice(0, 3)])

		const link = await (await album.openCollaborators()).createPublicLink()

		// A visitor of the link has no account, hence a context without a session.
		const visitorPage = await browser.newPage({ storageState: undefined, baseURL })
		const publicAlbum = new PublicAlbumPage(visitorPage)

		await publicAlbum.open(link)
		await expect(publicAlbum.heading(albumName)).toBeVisible()
		await expect(publicAlbum.grid.getAllMedia()).toHaveCount(3)

		await album.open(albumName)
		await (await album.openCollaborators()).deletePublicLink()

		await publicAlbum.open(link)
		await expect(publicAlbum.notFoundMessage()).toBeVisible()

		await visitorPage.close()
	})

	test('lets a visitor download one of its photos', async ({ browser, baseURL, photosApp, media }) => {
		const { album, albums } = photosApp
		const photo = MEDIA_FIXTURES[2]

		await albums.open()
		await albums.createAlbum(albumName)
		await album.addPhotos(albumName, [photo])

		const link = await (await album.openCollaborators()).createPublicLink()

		const visitorPage = await browser.newPage({ storageState: undefined, baseURL })
		const publicAlbum = new PublicAlbumPage(visitorPage)

		await publicAlbum.open(link)
		const inAlbum = collectionPhotoName(media[photo], photo)
		await expect(publicAlbum.grid.getMedia(inAlbum)).toBeVisible()

		const download = await publicAlbum.downloadPhoto(inAlbum)
		expect(download.suggestedFilename()).toBe(inAlbum)

		await visitorPage.close()
	})
})
