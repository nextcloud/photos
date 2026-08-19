/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { APIRequest, APIRequestContext, Browser, Page } from '@playwright/test'
import type { SeededMedia } from './media.ts'

import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { PhotosApp } from '../sections/PhotosApp.ts'
import { seedMedia } from './media.ts'
import { createUser, generatePhotoPlaces } from './occ.ts'
import { withRetry } from './retry.ts'

/** An account of a test, with the media fixtures in its photos folder. */
export interface PhotosAccount {
	user: User
	/** File ids of the seeded photos, which is how the app addresses them. */
	media: SeededMedia
}

/** An account together with the browser session it is signed in on. */
export interface PhotosSession extends PhotosAccount {
	page: Page
	app: PhotosApp
}

export interface CreateAccountsOptions {
	/**
	 * Whether the places of the photos have to be resolved before the test runs.
	 *
	 * Uploading a photo already extracts its EXIF data, its dimensions and the
	 * date it was taken, but the place its coordinates point at is only resolved
	 * in a deferred pass — which costs an `occ` round trip, so only the tests
	 * about places ask for it.
	 */
	withPlaces?: boolean
}

/**
 * Run DAV calls as one account, on a request context that carries no other
 * session.
 *
 * Nextcloud answers a Basic authenticated request with a session cookie, and a
 * context that sends that cookie back on the next request is authenticated as the
 * account the cookie belongs to — whatever credentials that request carries. One
 * context per account is what keeps "act as this account" honest.
 *
 * @param apiRequest - Factory for request contexts, i.e. Playwright's `playwright.request`
 * @param baseURL - Base URL of the instance under test
 * @param action - What to do with the context
 */
export async function withRequestContext<T>(
	apiRequest: APIRequest,
	baseURL: string | undefined,
	action: (request: APIRequestContext) => Promise<T>,
): Promise<T> {
	const request = await apiRequest.newContext({ baseURL })
	try {
		return await action(request)
	} finally {
		await request.dispose()
	}
}

/**
 * Create accounts seeded with the media fixtures.
 *
 * The places of the photos are resolved for all of them in one go: that step
 * shells out to `occ`, which every worker of the run contends over, so doing it
 * per account would multiply the slowest part of the setup.
 *
 * @param apiRequest - Factory for request contexts, i.e. Playwright's `playwright.request`
 * @param baseURL - Base URL of the instance under test
 * @param count - How many accounts to create
 * @param options - Whether the places of the photos are needed
 */
export async function createPhotosAccounts(
	apiRequest: APIRequest,
	baseURL: string | undefined,
	count: number,
	{ withPlaces = false }: CreateAccountsOptions = {},
): Promise<PhotosAccount[]> {
	const users = Array.from({ length: count }, () => User.createRandom())

	// All of them on one context, which acts as the administrator throughout.
	await withRequestContext(apiRequest, baseURL, async (admin) => {
		for (const user of users) {
			await createUser(admin, user)
		}
	})

	// One account at a time: seeding one writes five photos, each of which extracts
	// its metadata and propagates the size of its folder — and the workers of the
	// run already contend over the same database. More parallelism here only turns
	// that contention into failed requests.
	const accounts: PhotosAccount[] = []
	for (const user of users) {
		const media = await withRequestContext(apiRequest, baseURL, (request) => seedMedia(request, user))
		accounts.push({ user, media })
	}

	if (withPlaces) {
		await generatePhotoPlaces(users)
	}

	return accounts
}

/**
 * Open a browser session signed in as an account.
 *
 * Every session gets a context of its own: a session captured in one context and
 * restored in another is invalidated by the remember-me token rotation as soon as
 * the second one uses it, which surfaces as seemingly random 401s mid-test.
 *
 * @param browser - Browser to open the session in
 * @param baseURL - Base URL of the instance under test
 * @param account - Account to sign in as
 */
export async function openPhotosSession(
	browser: Browser,
	baseURL: string | undefined,
	account: PhotosAccount,
): Promise<PhotosSession> {
	const page = await browser.newPage({ storageState: undefined, baseURL })
	await withRetry(() => login(page.request, account.user), `authenticate as "${account.user.userId}"`)

	return { ...account, page, app: new PhotosApp(page) }
}
