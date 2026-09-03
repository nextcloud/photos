/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import logger from './logger.js'

/**
 * Read the body of a failed dav request.
 * The dav client rejects with the raw fetch Response, whose body is not consumed yet.
 *
 * @param error - The error thrown by the dav client.
 */
export async function getErrorBody(error): Promise<string> {
	try {
		return await error.response?.text?.() ?? ''
	} catch (error) {
		logger.debug('Could not read the body of the failed request', { error })
		return ''
	}
}
