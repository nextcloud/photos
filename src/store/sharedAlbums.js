/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
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

import client from '../services/DavClient.js'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

/**
 * @typedef {object} Album
 * @property {string} basename - The name of the album.
 * @property {number} lastmod - The creation date of the album.
 * @property {string} size - The number of items in the album.
 */

const state = {
	sharedAlbums: {},
	sharedAlbumsFiles: {},
}

const mutations = {
	/**
	 * Add albums to the album collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.albums list of albums
	 */
	addSharedAlbums(state, { albums }) {
		state.sharedAlbums = {
			...state.sharedAlbums,
			...albums.reduce((albums, album) => ({ ...albums, [album.basename]: album }), {}),
		}
	},

	/**
	 * Remove albums from the album collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.albumNames list of albums ids
	 */
	removeSharedAlbums(state, { albumNames }) {
		albumNames.forEach(albumName => delete state.sharedAlbums[albumName])
		albumNames.forEach(albumName => delete state.sharedAlbumsFiles[albumName])
	},

	/**
	 * Add files to an album.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album id
	 * @param {string[]} data.fileIdsToAdd list of files
	 */
	addFilesToSharedAlbum(state, { albumName, fileIdsToAdd }) {
		const albumFiles = state.sharedAlbumsFiles[albumName] || []
		state.sharedAlbumsFiles = {
			...state.sharedAlbumsFiles,
			[albumName]: [
				...albumFiles,
				...fileIdsToAdd.filter(fileId => !albumFiles.includes(fileId)), // Filter to prevent duplicate fileId.
			],
		}
		state.sharedAlbums[albumName].nbItems += fileIdsToAdd.length
	},

	/**
	 * Remove files to an album.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album id
	 * @param {string[]} data.fileIdsToRemove list of files
	 */
	removeFilesFromSharedAlbum(state, { albumName, fileIdsToRemove }) {
		state.sharedAlbumsFiles = {
			...state.sharedAlbumsFiles,
			[albumName]: state.sharedAlbumsFiles[albumName].filter(fileId => !fileIdsToRemove.includes(fileId)),
		}
		state.sharedAlbums[albumName].nbItems -= fileIdsToRemove.length
	},
}

const getters = {
	sharedAlbums: state => state.sharedAlbums,
	sharedAlbumsFiles: state => state.sharedAlbumsFiles,
}

const actions = {
	/**
	 * Update files and albums
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {Album[]} data.albums list of albums
	 */
	addSharedAlbums(context, { albums }) {
		context.commit('addSharedAlbums', { albums })
	},

	/**
	 * Add files to an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album name
	 * @param {string[]} data.fileIdsToAdd list of files ids to add
	 */
	async addFilesToSharedAlbum(context, { albumName, fileIdsToAdd }) {
		const semaphore = new Semaphore(5)

		context.commit('addFilesToSharedAlbum', { albumName, fileIdsToAdd })

		const promises = fileIdsToAdd
			.map(async (fileId) => {
				const file = context.getters.files[fileId]
				const album = context.getters.sharedAlbums[albumName]
				const symbol = await semaphore.acquire()

				try {
					await client.copyFile(
						file.filename,
						`${album.filename}/${file.basename}`,
					)
				} catch (error) {
					if (error.response.status !== 409) { // Already in the album.
						context.commit('removeFilesFromSharedAlbum', { albumName, fileIdsToRemove: [fileId] })

						logger.error(t('photos', 'Failed to add {fileBaseName} to shared album {albumName}.', { fileBaseName: file.basename, albumName }), { error })
						showError(t('photos', 'Failed to add {fileBaseName} to shared album {albumName}.', { fileBaseName: file.basename, albumName }))
					}
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Remove files to an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album name
	 * @param {string[]} data.fileIdsToRemove list of files ids to remove
	 */
	async removeFilesFromSharedAlbum(context, { albumName, fileIdsToRemove }) {
		const semaphore = new Semaphore(5)

		context.commit('removeFilesFromSharedAlbum', { albumName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const file = context.getters.files[fileId]
				const symbol = await semaphore.acquire()

				try {
					await client.deleteFile(file.filename)
				} catch (error) {
					context.commit('addFilesToSharedAlbum', { albumName, fileIdsToAdd: [fileId] })

					logger.error(t('photos', 'Failed to delete {fileBaseName}.', { fileBaseName: file.basename }), { error })
					showError(t('photos', 'Failed to delete {fileBaseName}.', { fileBaseName: file.basename }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Delete an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the id of the album
	 */
	async deleteSharedAlbum(context, { albumName }) {
		try {
			const album = context.getters.sharedAlbums[albumName]
			await client.deleteFile(album.filename)
			context.commit('removeSharedAlbums', { albumNames: [albumName] })
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {albumName}.', { albumName }), { error })
			showError(t('photos', 'Failed to delete {albumName}.', { albumName }))
		}
	},
}

export default { state, mutations, getters, actions }
