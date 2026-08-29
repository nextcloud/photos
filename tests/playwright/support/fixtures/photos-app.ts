/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { Page } from '@playwright/test'
import type { PhotosAccount, PhotosSession } from '../utils/accounts.ts'
import type { FolderListingEntry } from '../utils/dav.ts'
import type { MediaFixture, SeededMedia } from '../utils/media.ts'

import { login } from '@nextcloud/e2e-test-server/playwright'
import { test as baseTest } from '@playwright/test'
import { PhotosApp } from '../sections/PhotosApp.ts'
import { createPhotosAccounts, openPhotosSession, withRequestContext } from '../utils/accounts.ts'
import { assignSystemTag, createSystemTag, readFileTags, readFolderListing, readPhotoFavorite, setPhotoFavorite } from '../utils/dav.ts'
import { PHOTOS_FOLDER, removeMediaLocations, seedPhotosTakenAt, seedVideos } from '../utils/media.ts'
import { deleteUser, setUserSetting } from '../utils/occ.ts'
import { withRetry } from '../utils/retry.ts'

interface PhotosOptions {
	/**
	 * Whether the places of the seeded photos have to be resolved before the test
	 * runs. Declare it per spec file or per describe block with
	 * `test.use({ withPlaces: true })`.
	 *
	 * Resolving them costs an `occ` round trip, so only the tests about places,
	 * and the filters built on them, ask for it — see `createPhotosAccounts`.
	 */
	withPlaces: boolean
}

interface PhotosFixtures {
	/** The account of the test, with the media fixtures in its photos folder. */
	account: PhotosAccount
	/** The account of the test. */
	user: User
	/** File ids of the seeded photos, by file name. */
	media: SeededMedia
	/** The photos app, on the page of {@link PhotosFixtures.account}. */
	photosApp: PhotosApp
	/**
	 * Create further accounts, seeded like the one of the test.
	 *
	 * Ask for all of them in a single call: the `occ` work is shared between them,
	 * and it is the slowest part of the setup.
	 */
	createAccounts: (count: number) => Promise<PhotosAccount[]>
	/**
	 * Sign an account in on a browser session of its own, so a test can act as
	 * two people at once. Closed again when the test ends.
	 */
	openSession: (account: PhotosAccount) => Promise<PhotosSession>
	/**
	 * Delete an account, for the tests about what becomes of the albums it was part
	 * of.
	 */
	deleteAccount: (user: User) => Promise<void>
	/**
	 * Add photos to the library of the test account, taken at the given moments,
	 * and return their names.
	 */
	seedPhotos: (namePrefix: string, takenAt: Date[]) => Promise<string[]>
	/**
	 * Add the video fixtures to the library of the test account, for the tests
	 * about what a tile does with a video. Call it before the app is opened, as
	 * the views only read the library once.
	 */
	seedVideos: () => Promise<void>
	/**
	 * Drop the coordinates of every photo of the test account, for the tests about
	 * a library that has nothing to show on a map.
	 */
	removePhotoLocations: () => Promise<void>
	/**
	 * Create a tag of the instance and put it on the given photos of the test
	 * account.
	 *
	 * Tags are shared by the whole instance, so a test that asserts on one has to
	 * name it after its own account — the tests run in parallel, and every one of
	 * them sees the tags of all the others.
	 */
	seedTag: (displayName: string, photoNames?: MediaFixture[]) => Promise<void>
	/** The names of the tags the server holds for a photo of the test account. */
	readTags: (photoName: MediaFixture) => Promise<string[]>
	/** Whether the server has a photo of the test account marked as a favorite. */
	readFavorite: (photoName: MediaFixture) => Promise<boolean>
	/**
	 * Mark a photo of the test account as a favorite, for the tests about a view
	 * showing one. Call it before the view is opened, as a listing carries the
	 * state of the moment it was read.
	 */
	favoritePhoto: (photoName: MediaFixture) => Promise<void>
	/**
	 * The listing the folders view of the test account is built from, straight
	 * from the endpoint that answers it.
	 */
	readFolderListing: (path: string) => Promise<FolderListingEntry[]>
	/**
	 * Store one of the settings of the app for the test account, the way its
	 * settings section does.
	 *
	 * The views are handed the settings when the page is loaded, so a test has to
	 * set one before it opens the view it is about.
	 */
	setPhotosSetting: (key: string, value: string) => Promise<void>
}

/**
 * A fresh account with the media fixtures uploaded, signed in and ready to drive
 * the photos app.
 *
 * Every test gets its own account. The tests favorite, delete, rename and share
 * things, so sharing an account between them would make them depend on the order
 * they happen to run in — and Playwright runs them in parallel across workers.
 */
export const test = baseTest.extend<PhotosOptions & PhotosFixtures>({
	withPlaces: [false, { option: true }],

	account: async ({ playwright, baseURL, withPlaces }, use) => {
		const [account] = await createPhotosAccounts(playwright.request, baseURL, 1, { withPlaces })
		await use(account)
	},

	user: ({ account }, use) => use(account.user),

	media: ({ account }, use) => use(account.media),

	// The page is built here rather than taken from Playwright, so the service
	// worker option has to be carried over by hand - `test.use` sets it on the
	// context Playwright would have built. Options that are no fixture of their
	// own, `reducedMotion` among them, cannot be reached from here at all and have
	// to be emulated on the page instead.
	page: async ({ browser, baseURL, account, serviceWorkers }, use) => {
		// Important: authenticate in a clean environment by unsetting storage state.
		const page = await browser.newPage({ storageState: undefined, baseURL, serviceWorkers })
		await withRetry(() => login(page.request, account.user), `authenticate as "${account.user.userId}"`)

		await use(page)
		await page.close()
	},

	photosApp: async ({ page }, use) => {
		await use(new PhotosApp(page))
	},

	createAccounts: async ({ playwright, baseURL, withPlaces }, use) => {
		await use((count: number) => createPhotosAccounts(playwright.request, baseURL, count, { withPlaces }))
	},

	deleteAccount: async ({ playwright, baseURL }, use) => {
		await use((user: User) => withRequestContext(
			playwright.request,
			baseURL,
			(request) => deleteUser(request, user),
		))
	},

	seedPhotos: async ({ playwright, baseURL, account }, use) => {
		await use((namePrefix: string, takenAt: Date[]) => withRequestContext(
			playwright.request,
			baseURL,
			(request) => seedPhotosTakenAt(request, account.user, namePrefix, takenAt),
		))
	},

	seedVideos: async ({ playwright, baseURL, account }, use) => {
		await use(async () => {
			await withRequestContext(
				playwright.request,
				baseURL,
				(request) => seedVideos(request, account.user),
			)
		})
	},

	removePhotoLocations: async ({ playwright, baseURL, account }, use) => {
		await use(() => withRequestContext(
			playwright.request,
			baseURL,
			(request) => removeMediaLocations(request, account.user),
		))
	},

	seedTag: async ({ playwright, baseURL, account }, use) => {
		await use((displayName: string, photoNames: MediaFixture[] = []) => withRequestContext(
			playwright.request,
			baseURL,
			async (request) => {
				const tagId = await createSystemTag(request, account.user, displayName)

				for (const name of photoNames) {
					await assignSystemTag(request, account.user, account.media[name], tagId)
				}
			},
		))
	},

	readTags: async ({ playwright, baseURL, account }, use) => {
		await use((photoName: MediaFixture) => withRequestContext(
			playwright.request,
			baseURL,
			(request) => readFileTags(request, account.user, account.media[photoName]),
		))
	},

	readFavorite: async ({ playwright, baseURL, account }, use) => {
		await use((photoName: MediaFixture) => withRequestContext(
			playwright.request,
			baseURL,
			(request) => readPhotoFavorite(request, account.user, `${PHOTOS_FOLDER}/${photoName}`),
		))
	},

	setPhotosSetting: async ({ account }, use) => {
		await use((key: string, value: string) => setUserSetting(account.user, 'photos', key, value))
	},

	favoritePhoto: async ({ playwright, baseURL, account }, use) => {
		await use((photoName: MediaFixture) => withRequestContext(
			playwright.request,
			baseURL,
			(request) => setPhotoFavorite(request, account.user, `${PHOTOS_FOLDER}/${photoName}`, true),
		))
	},

	readFolderListing: async ({ playwright, baseURL, account }, use) => {
		await use((path: string) => withRequestContext(
			playwright.request,
			baseURL,
			(request) => readFolderListing(request, account.user, path),
		))
	},

	openSession: async ({ browser, baseURL }, use) => {
		const pages: Page[] = []

		await use(async (account: PhotosAccount) => {
			const session = await openPhotosSession(browser, baseURL, account)
			pages.push(session.page)
			return session
		})

		await Promise.all(pages.map((page) => page.close()))
	},
})

export { expect } from '@playwright/test'
