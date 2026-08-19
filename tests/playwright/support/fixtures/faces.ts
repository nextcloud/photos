/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { User } from '@nextcloud/e2e-test-server'
import { login } from '@nextcloud/e2e-test-server/playwright'
import { test as baseTest } from '@playwright/test'
import { PhotosApp } from '../sections/PhotosApp.ts'
import { withRequestContext } from '../utils/accounts.ts'
import { classifyFaces, expectFaceClusters, seedFaceMedia } from '../utils/faces.ts'
import { createUser } from '../utils/occ.ts'
import { withRetry } from '../utils/retry.ts'

interface FacesWorkerFixtures {
	/** An account whose photos recognize has detected and clustered faces on. */
	faceAccount: { user: User }
}

interface FacesFixtures {
	user: User
	photosApp: PhotosApp
}

/**
 * An account recognize has already classified, shared by every test of the worker.
 *
 * Detecting and clustering faces is minutes of TensorFlow work over a few hundred
 * uploads, so it is done once instead of once per test. The tests of the spec
 * therefore run in declaration order and are ordered so that the ones shrinking
 * the set of people come last — see the spec for the details.
 *
 * Only the account is shared: every test signs in on a session of its own, as a
 * session restored in a second browser context is invalidated by the remember-me
 * token rotation and starts answering 401 mid-test.
 */
export const test = baseTest.extend<FacesFixtures, FacesWorkerFixtures>({
	faceAccount: [async ({ playwright }, use) => {
		const baseURL = baseTest.info().project.use.baseURL
		const user = User.createRandom()

		// The account is created as the administrator and everything after it as the
		// account itself, which is two sessions — and a context that carries the one
		// would run the other under it, see `withRequestContext`.
		await withRequestContext(playwright.request, baseURL, (admin) => createUser(admin, user))

		await withRequestContext(playwright.request, baseURL, async (request) => {
			await seedFaceMedia(request, user)
			await classifyFaces(user)
			// Fail here, with the reason, rather than as an unexplained timeout in a test.
			await expectFaceClusters(request, user)
		})

		await use({ user })
	}, { scope: 'worker' }],

	user: ({ faceAccount }, use) => use(faceAccount.user),

	page: async ({ browser, baseURL, faceAccount }, use) => {
		const page = await browser.newPage({ storageState: undefined, baseURL })
		await withRetry(() => login(page.request, faceAccount.user), `authenticate as "${faceAccount.user.userId}"`)

		await use(page)
		await page.close()
	},

	photosApp: async ({ page }, use) => {
		await use(new PhotosApp(page))
	},
})

export { expect } from '@playwright/test'
