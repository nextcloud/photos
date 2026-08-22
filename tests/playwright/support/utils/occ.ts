/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { User } from '@nextcloud/e2e-test-server'
import type { APIRequestContext } from '@playwright/test'

import { runOcc } from '@nextcloud/e2e-test-server/docker'
import { withRetry } from './retry.ts'

/** The provisioning API, which the accounts of the tests are created through. */
const USERS_ENDPOINT = '/ocs/v2.php/cloud/users'

/**
 * Headers of a provisioning API call, made as the administrator.
 *
 * Basic auth rather than a session: these calls run before any browser session
 * exists, and every one of them carries its own credentials.
 */
const ADMIN_HEADERS = {
	Accept: 'application/json',
	'OCS-APIRequest': 'true',
	Authorization: `Basic ${Buffer.from('admin:admin').toString('base64')}`,
}

/** What the provisioning API answers when the account is already there. */
const OCS_ALREADY_EXISTS = 102

/** Outcome of a provisioning API call, as the payload reports it. */
interface OcsMeta {
	statuscode?: number
	message?: string
}

/**
 * Read the outcome of a provisioning API call.
 *
 * The API answers `HTTP 200` even when it refused what was asked, the real status
 * is in the payload.
 *
 * @param meta - The `ocs.meta` of the answer
 * @param description - What was attempted, for the error message
 */
function expectOcsSuccess(meta: OcsMeta | undefined, description: string): void {
	if (meta?.statuscode !== 100 && meta?.statuscode !== 200) {
		throw new Error(`Failed to ${description}: ${meta?.statuscode} ${meta?.message}`)
	}
}

/**
 * Create an account through the provisioning API.
 *
 * Not through `occ`: every worker of the run creates accounts, and a handful of
 * `occ` processes writing to the same SQLite database at once end in "database is
 * locked". The web request goes through the connection pool of the server, which
 * is built for exactly that.
 *
 * @param request - Request context that carries no session, so the call is made
 * as the administrator it authenticates as
 * @param user - Account to create
 */
export async function createUser(request: APIRequestContext, user: User): Promise<void> {
	await withRetry(async () => {
		const response = await request.post(`${USERS_ENDPOINT}?format=json`, {
			headers: ADMIN_HEADERS,
			form: { userid: user.userId, password: user.password },
		})

		const meta = (await response.json()).ocs?.meta
		// A creation that lost the race for the database reports a failure after the
		// account itself was already written, so a retry of it finds the account it
		// just made. The ids are freshly generated random ones, so "already exists"
		// can only be that.
		if (meta?.statuscode === OCS_ALREADY_EXISTS) {
			return
		}

		expectOcsSuccess(meta, `create the account "${user.userId}"`)
	}, `create the account "${user.userId}"`)
}

/**
 * Delete an account and everything it owns.
 *
 * @param request - Request context that carries no session
 * @param user - Account to delete
 */
export async function deleteUser(request: APIRequestContext, user: User): Promise<void> {
	await withRetry(async () => {
		const response = await request.delete(`${USERS_ENDPOINT}/${encodeURIComponent(user.userId)}?format=json`, {
			headers: ADMIN_HEADERS,
		})

		expectOcsSuccess((await response.json()).ocs?.meta, `delete the account "${user.userId}"`)
	}, `delete the account "${user.userId}"`)
}

/**
 * Generate the metadata of every photo of the given accounts.
 *
 * Only needed for the *place* of a photo: uploading a file already extracts its
 * EXIF data, its dimensions and the date it was taken, but resolving the
 * coordinates to a place name is deferred to a background pass — which this scan
 * runs inline. There is no HTTP endpoint for it, hence the `occ` round trip.
 *
 * The accounts are passed as arguments and the flag comes last on purpose: it
 * takes an optional value, so a following account id would be swallowed as that
 * value instead of being treated as an argument.
 *
 * @param users - Accounts whose photos to process
 */
export async function generatePhotoPlaces(users: User[]): Promise<void> {
	const userIds = users.map(({ userId }) => userId)
	await withRetry(
		() => runOcc(['files:scan', ...userIds, '--generate-metadata']),
		`generate the photo metadata of ${userIds.join(', ')}`,
	)
}

/**
 * Set an app config value.
 *
 * @param appId - App the config belongs to
 * @param key - Name of the config value
 * @param value - Value to set
 */
export async function setAppConfig(appId: string, key: string, value: string): Promise<void> {
	await withRetry(
		() => runOcc(['config:app:set', appId, key, `--value=${value}`]),
		`set the ${appId} config ${key}`,
	)
}

/**
 * Set a setting of one account, the way the settings of an app store it.
 *
 * @param user - Account the setting belongs to
 * @param appId - App the setting belongs to
 * @param key - Name of the setting
 * @param value - Value to set
 */
export async function setUserSetting(user: User, appId: string, key: string, value: string): Promise<void> {
	await withRetry(
		() => runOcc(['user:setting', user.userId, appId, key, value]),
		`set the ${appId} setting ${key} of "${user.userId}"`,
	)
}
