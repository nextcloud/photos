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
import { getCurrentUser } from '@nextcloud/auth'

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
	albums: {},
	albumsFiles: {},
}

const mutations = {
	/**
	 * Add albums to the album collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.albums list of albums
	 */
	addAlbums(state, { albums }) {
		state.albums = {
			...state.albums,
			...albums.reduce((albums, album) => ({ ...albums, [album.basename]: album }), {}),
		}
	},

	/**
	 * Add albums to the album collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Album} data.album the album to update
	 */
	updateAlbum(state, { album }) {
		state.albums[album.basename] = album
	},

	/**
	 * Remove albums from the album collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.albumNames list of albums ids
	 */
	removeAlbums(state, { albumNames }) {
		albumNames.forEach(albumName => delete state.albums[albumName])
		albumNames.forEach(albumName => delete state.albumsFiles[albumName])
	},

	/**
	 * Add files to an album.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album id
	 * @param {string[]} data.fileIdsToAdd list of files
	 */
	addFilesToAlbum(state, { albumName, fileIdsToAdd }) {
		const albumFiles = state.albumsFiles[albumName] || []
		state.albumsFiles = {
			...state.albumsFiles,
			[albumName]: [
				...albumFiles,
				...fileIdsToAdd.filter(fileId => !albumFiles.includes(fileId)), // Filter to prevent duplicate fileId.
			],
		}
		state.albums[albumName].nbItems += fileIdsToAdd.length
	},

	/**
	 * Remove files to an album.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album id
	 * @param {string[]} data.fileIdsToRemove list of files
	 */
	removeFilesFromAlbum(state, { albumName, fileIdsToRemove }) {
		state.albumsFiles = {
			...state.albumsFiles,
			[albumName]: state.albumsFiles[albumName].filter(fileId => !fileIdsToRemove.includes(fileId)),
		}
		state.albums[albumName].nbItems -= fileIdsToRemove.length
	},
}

const getters = {
	albums: state => state.albums,
	albumsFiles: state => state.albumsFiles,
}

const actions = {
	/**
	 * Update files and albums
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {Album[]} data.albums list of albums
	 */
	addAlbums(context, { albums }) {
		context.commit('addAlbums', { albums })
	},

	/**
	 * Add files to an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the album name
	 * @param {string[]} data.fileIdsToAdd list of files ids to add
	 */
	async addFilesToAlbum(context, { albumName, fileIdsToAdd }) {
		const semaphore = new Semaphore(5)

		context.commit('addFilesToAlbum', { albumName, fileIdsToAdd })

		const promises = fileIdsToAdd
			.map(async (fileId) => {
				const fileName = context.getters.files[fileId].filename
				const fileBaseName = context.getters.files[fileId].basename
				const symbol = await semaphore.acquire()

				try {
					await client.copyFile(
						`/files/${getCurrentUser()?.uid}/${fileName}`,
						`/photos/${getCurrentUser()?.uid}/albums/${albumName}/${fileBaseName}`
					)
				} catch (error) {
					if (error.response.status !== 409) { // Already in the album.
						context.commit('removeFilesFromAlbum', { albumName, fileIdsToRemove: [fileId] })

						logger.error(t('photos', 'Failed to add {fileBaseName} to album {albumName}.', { fileBaseName, albumName }), error)
						showError(t('photos', 'Failed to add {fileBaseName} to album {albumName}.', { fileBaseName, albumName }))
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
	async removeFilesFromAlbum(context, { albumName, fileIdsToRemove }) {
		const semaphore = new Semaphore(5)

		context.commit('removeFilesFromAlbum', { albumName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const fileBaseName = context.getters.files[fileId].basename
				const symbol = await semaphore.acquire()

				try {
					await client.deleteFile(`/photos/${getCurrentUser()?.uid}/albums/${albumName}/${fileBaseName}`)
				} catch (error) {
					context.commit('addFilesToAlbum', { albumName, fileIdsToAdd: [fileId] })

					logger.error(t('photos', 'Failed to delete {fileBaseName}.', { fileBaseName }), error)
					showError(t('photos', 'Failed to delete {fileBaseName}.', { fileBaseName }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Create an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {Album} data.album the album
	 */
	async createAlbum(context, { album }) {
		try {
			await client.createDirectory(`/photos/${getCurrentUser()?.uid}/albums/${album.basename}`)
			context.commit('addAlbums', { albums: [album] })
			return album
		} catch (error) {
			logger.error(t('photos', 'Failed to create {albumName}.', { albumName: album.basename }), error)
			showError(t('photos', 'Failed to create {albumName}.', { albumName: album.basename }))
		}
	},

	/**
	 * Rename an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.currentAlbumName - The current name of the album.
	 * @param {string} data.newAlbumName - The wanted name for the album.
	 */
	async renameAlbum(context, { currentAlbumName, newAlbumName }) {
		const album = state.albums[currentAlbumName]
		const newAlbum = { ...album, basename: newAlbumName }
		try {
			context.commit('addAlbums', { albums: [newAlbum] })

			await client.moveFile(
				`/photos/${getCurrentUser()?.uid}/albums/${currentAlbumName}`,
				`/photos/${getCurrentUser()?.uid}/albums/${newAlbumName}`,
			)

			context.commit('removeAlbums', { albumNames: [currentAlbumName] })
			return newAlbum
		} catch (error) {
			context.commit('removeAlbums', { albumNames: [newAlbumName] })

			logger.error(t('photos', 'Failed to rename {currentAlbumName} to {newAlbumName}.', { currentAlbumName, newAlbumName }), error)
			showError(t('photos', 'Failed to rename {currentAlbumName} to {newAlbumName}.', { currentAlbumName, newAlbumName }))
			return album
		}
	},

	/**
	 * Update an album's location.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.albumName - The name of the album.
	 * @param {string} data.newLocation - The new location of the album.
	 */
	async updateAlbumLocation(context, { albumName, newLocation }) {
		const album = state.albums[albumName]
		const updatedAlbum = { ...album, location: newLocation }

		try {
			context.commit('updateAlbum', { album: updatedAlbum })

			await client.customRequest(
				`/photos/${getCurrentUser()?.uid}/albums/${albumName}`,
				{
					method: 'PROPPATCH',
					data: `<?xml version="1.0"?>
							<d:propertyupdate xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
							<d:set>
									<d:prop>
									<nc:location>${newLocation}</nc:location>
									</d:prop>
							</d:set>
							</d:propertyupdate>`,
				}
			)

			return updatedAlbum
		} catch (error) {
			context.commit('updateAlbum', { album })

			logger.error(t('photos', 'Failed to update location of {albumName} to {newLocation}.', { albumName, newLocation }), error)
			showError(t('photos', 'Failed to update location of {albumName} to {newLocation}.', { albumName, newLocation }))
			return album
		}
	},

	/**
	 * Delete an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.albumName the id of the album
	 */
	async deleteAlbum(context, { albumName }) {
		try {
			await client.deleteFile(`/photos/${getCurrentUser()?.uid}/albums/${albumName}`)
			context.commit('removeAlbums', { albumNames: [albumName] })
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {albumName}.', { albumName }), error)
			showError(t('photos', 'Failed to delete {albumName}.', { albumName }))
		}
	},
}

export default { state, mutations, getters, actions }
