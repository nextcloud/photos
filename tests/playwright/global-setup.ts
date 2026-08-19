/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FullConfig } from '@playwright/test'

import { request } from '@playwright/test'
import { createPhotosAccounts, withRequestContext } from './support/utils/accounts.ts'
import { readPhotoPlace } from './support/utils/dav.ts'
import { PHOTO_IN_LAURIS, PHOTOS_FOLDER } from './support/utils/media.ts'
import { deleteUser } from './support/utils/occ.ts'

/**
 * Resolve the places of one throwaway account before the tests start.
 *
 * Resolving the place of a photo needs a city database, which the server
 * downloads and indexes the first time it is asked for one. Several workers ask
 * for it at the same time, and the first of them would be the one paying for the
 * download while the others read a file that is still being written — so it is
 * done once, here, where nothing else is running.
 *
 * A place that stays empty is only reported, not raised: it means the instance
 * cannot reach the city database, which is a problem for the three specs about
 * places and for nothing else. Those fail on their own, and with their own
 * message.
 *
 * @param config - The resolved Playwright configuration
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
	const baseURL = config.projects[0]?.use?.baseURL

	const [account] = await createPhotosAccounts(request, baseURL, 1, { withPlaces: true })
	const place = await withRequestContext(request, baseURL, (api) => readPhotoPlace(
		api,
		account.user,
		`${PHOTOS_FOLDER}/${PHOTO_IN_LAURIS}`,
	))

	if (place === '') {
		console.warn('The places of the photos could not be resolved — the tests about places will fail.')
	} else {
		console.info(`Places are available, resolved "${PHOTO_IN_LAURIS}" to "${place}".`)
	}

	await withRequestContext(request, baseURL, (api) => deleteUser(api, account.user))
}
