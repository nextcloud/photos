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

import { encodePath } from '@nextcloud/paths'
import { generateUrl } from '@nextcloud/router'
import { showError } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'
import { getCurrentUser } from '@nextcloud/auth'

import client from './DavClient.js'
import logger from './logger.js'

/**
 * Delete a file
 *
 * @param {number} fileName - The file's id
 */
export async function deleteFile(fileName) {
	try {
		await client.deleteFile(`/files/${getCurrentUser()?.uid}/${fileName}`)
	} catch (error) {
		logger.error(t('photos', 'Failed to delete {fileName}.', { fileName }), error)
		showError(t('photos', 'Failed to delete {fileName}.', { fileName }))
	}
}

/**
 * Favorite a file
 *
 * @param {string} fileName - The file's name
 * @param {boolean} favoriteState - The new favorite state
 */
export async function favoriteFile(fileName, favoriteState) {
	let encodedPath = encodePath(fileName)
	while (encodedPath[0] === '/') {
		encodedPath = encodedPath.substring(1)
	}

	try {
		return axios.post(
			`${generateUrl('/apps/files/api/v1/files/')}${encodedPath}`,
			{
				tags: favoriteState ? ['_$!<Favorite>!$_'] : [],
			},
		)
	} catch (error) {
		logger.error(t('photos', 'Failed to favorite {fileName}.', { fileName }), error)
		showError(t('photos', 'Failed to favorite {fileName}.', { fileName }))
	}
}

/**
 * Download a file
 *
 * @param {string[]} fileNames - The file's names
 */
export async function downloadFiles(fileNames) {
	const randomToken = Math.random().toString(36).substring(2)

	const params = new URLSearchParams()
	params.append('files', JSON.stringify(fileNames))
	params.append('downloadStartSecret', randomToken)

	const downloadURL = generateUrl(`/apps/files/ajax/download.php?${params}`)

	window.location = `${downloadURL}downloadStartSecret=${randomToken}`

	return new Promise((resolve) => {
		const waitForCookieInterval = setInterval(
			() => {
				const cookieIsSet = document.cookie
					.split(';')
					.map(cookie => cookie.split('='))
					.findIndex(([cookieName, cookieValue]) => cookieName === 'ocDownloadStarted' && cookieValue === randomToken)

				if (cookieIsSet) {
					clearInterval(waitForCookieInterval)
					resolve(true)
				}
			},
			50
		)
	})
}
