/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { APIRequestContext } from '@playwright/test'

import { test as baseTest } from '@playwright/test'
import { createPhotosAccounts, withRequestContext } from '../utils/accounts.ts'
import { addPhotoToAlbum, CollaboratorType, createAlbum, createAlbumPublicLink } from '../utils/dav.ts'
import { collectionPhotoName, MEDIA_FIXTURES, PHOTOS_FOLDER } from '../utils/media.ts'

/** An album shared both with an account and through a public link. */
export interface SharedAlbumApi {
	/** Owner of the album. */
	owner: User
	/** Account the album is shared with. */
	collaborator: User
	/** An account the album is *not* shared with. */
	outsider: User
	/** Name of the album. */
	albumName: string
	/** Name the album is stored under for the collaborator. */
	sharedAlbumName: string
	/** Token of the public link of the album. */
	publicToken: string
	/** Name the one photo of the album carries inside it. */
	photoName: string
}

interface AlbumApiFixtures {
	/**
	 * A request context that carries no session yet, so a request is authenticated
	 * by the credentials it carries — or by nothing at all, which is how a visitor
	 * of a public link reaches an album.
	 */
	api: APIRequestContext
}

interface AlbumApiWorkerFixtures {
	sharedAlbum: SharedAlbumApi
}

/**
 * An album with one photo, one collaborator and a public link — set up entirely
 * over WebDAV.
 *
 * These tests are about what the DAV endpoints refuse, so they neither need a
 * browser nor the UI that would normally build this. Doing it over the API also
 * makes the setup cheap enough to be shared by the whole worker: every one of
 * these calls is expected to be rejected, so none of them can change it.
 */
export const test = baseTest.extend<AlbumApiFixtures, AlbumApiWorkerFixtures>({
	// A context of its own per test: Nextcloud answers a Basic authenticated
	// request with a session cookie, and a context that sends that cookie back
	// would run the next request as the account it belongs to — which is exactly
	// what a test acting as somebody else, or as nobody, must not do.
	api: async ({ playwright, baseURL }, use) => {
		const api = await playwright.request.newContext({ baseURL })
		await use(api)
		await api.dispose()
	},

	sharedAlbum: [async ({ playwright }, use) => {
		const baseURL = baseTest.info().project.use.baseURL

		const [ownerAccount, collaboratorAccount, outsiderAccount] = await createPhotosAccounts(playwright.request, baseURL, 3)
		const { user: owner, media } = ownerAccount
		const collaborator = collaboratorAccount.user

		const albumName = `api_album_${owner.userId}`
		const photo = MEDIA_FIXTURES[0]

		// One context for the whole setup, which acts as the owner throughout.
		const publicToken = await withRequestContext(playwright.request, baseURL, async (request) => {
			await createAlbum(request, owner, albumName)
			await addPhotoToAlbum(request, owner, albumName, `${PHOTOS_FOLDER}/${photo}`)
			return createAlbumPublicLink(request, owner, albumName, [
				{ id: collaborator.userId, type: CollaboratorType.User },
			])
		})

		await use({
			owner,
			collaborator,
			outsider: outsiderAccount.user,
			albumName,
			sharedAlbumName: `${albumName} (${owner.userId})`,
			publicToken,
			photoName: collectionPhotoName(media[photo], photo),
		})
	}, { scope: 'worker' }],
})

export { expect } from '@playwright/test'
