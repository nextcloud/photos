/**
 * @copyright Copyright (c) 2019 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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

import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'

import client from './DavClient.js'
import logger from './logger.js'

/**
 * Remove a file from the album.
 *
 * @param {string} albumId - The id of the album.
 * @param {string} filePath - The path of the file.
 * @param {string} fileName - The name of the file.
 */
export async function addFileToAlbum(albumId, filePath, fileName) {
	try {
		await client.copyFile(
			`/files/${getCurrentUser()?.uid}/${filePath}`,
			`/files/${getCurrentUser()?.uid}/${albumId}/${fileName}`
		)
	} catch (error) {
		logger.error(t('photos', 'Failed to add {fileName} to album {albumId}.', { fileName, albumId }), error)
		showError(t('photos', 'Failed to add {fileName} to album {albumId}.', { fileName, albumId }))
	}
}

/**
 * Remove a file from the album.
 *
 * @param {string} albumId - The id of the album.
 * @param {string} fileName - The name of the file.
 */
export async function removeFileFromAlbum(albumId, fileName) {
	try {
		await client.deleteFile(`/files/${getCurrentUser()?.uid}/${albumId}/${fileName}`)
	} catch (error) {
		logger.error(t('photos', 'Failed to delete {fileName}.', { fileName }), error)
		showError(t('photos', 'Failed to delete {fileName}.', { fileName }))
	}
}

/**
 * Create a new album.
 *
 * @param {import('./Albums.js').Album} albumInfo - The info of the album.
 */
export async function createAlbum({ name }) {
	try {
		await client.createDirectory(`/files/${getCurrentUser()?.uid}/${name}`)
	} catch (error) {
		logger.error(t('photos', 'Failed to create {name}.', { name }), error)
		showError(t('photos', 'Failed to create {name}.', { name }))
	}
}

/**
 * Delete an album.
 *
 * @param {string} albumId - The name of the album.
 */
export async function deleteAlbum(albumId) {
	try {
		await client.deleteFile(`/files/${getCurrentUser()?.uid}/${albumId}`)
	} catch (error) {
		logger.error(t('photos', 'Failed to delete {albumId}.', { albumId }), error)
		showError(t('photos', 'Failed to delete {albumId}.', { albumId }))
	}
}
