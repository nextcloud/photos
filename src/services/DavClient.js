/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { createClient, getPatcher } from 'webdav'
import { generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser, getRequestToken } from '@nextcloud/auth'
import { request } from 'webdav/dist/node/request.js'

export const rootPath = 'dav'
export const prefixPath = `/files/${getCurrentUser()?.uid}`

// init webdav client on default dav endpoint
const defaultRootUrl = generateRemoteUrl(rootPath)

export const getClient = (rootUrl = defaultRootUrl) => {
	const client = createClient(rootUrl, {
		headers: {
			requesttoken: getRequestToken() || '',
		},
	})

	/**
	 * Allow to override the METHOD to support dav REPORT
	 *
	 * @see https://github.com/perry-mitchell/webdav-client/blob/8d9694613c978ce7404e26a401c39a41f125f87f/source/request.ts
	 */
	const patcher = getPatcher()

	// https://github.com/perry-mitchell/hot-patcher/issues/6
	patcher.patch('request', (options) => {
		if (options.headers?.method) {
			options.method = options.headers.method
			delete options.headers.method
		}
		return request(options)
	})
	return client
}
