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
 * @typedef {object} Face
 * @property {string} basename - The name of the album.
 * @property {number} lastmod - The creation date of the album.
 * @property {string} size - The number of items in the album.
 */

const state = {
	faces: {},
	facesFiles: [],
}

const mutations = {
	/**
	 * Add albums to the album collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.faces list of albums
	 */
	addFaces(state, { faces }) {
		state.faces = {
			...state.faces,
			...faces.reduce((faces, face) => ({ ...faces, [face.basename]: face }), {}),
		}
	},

	/**
	 * Remove faces from the face collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.faceNames list of albums ids
	 */
	removeFaces(state, { faceNames }) {
		faceNames.forEach(faceName => delete state.faces[faceName])
	},

	/**
	 * Add files to a face.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.faceName the face name
	 * @param {string[]} data.fileIdsToAdd list of files
	 */
	addFilesToFace(state, { faceName, fileIdsToAdd }) {
		const faceFiles = state.facesFiles[faceName] || []
		state.facesFiles = {
			...state.facesFiles,
			[faceName]: [
				...faceFiles,
				...fileIdsToAdd.filter(fileId => !faceFiles.includes(fileId)), // Filter to prevent duplicate fileId.
			],
		}
	},

	/**
	 * Remove files from a face.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.faceName the album id
	 * @param {string[]} data.fileIdsToRemove list of files
	 */
	removeFilesFromFace(state, { faceName, fileIdsToRemove }) {
		state.facesFiles = {
			...state.facesFiles,
			[faceName]: state.facesFiles[faceName].filter(fileId => !fileIdsToRemove.includes(fileId)),
		}
	},
}

const getters = {
	faces: state => state.faces,
	facesFiles: state => state.facesFiles,
}

const actions = {
	/**
	 * Update files and albums
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {Album[]} data.faces list of faces
	 */
	addFaces(context, { faces }) {
		context.commit('addFaces', { faces })
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
					context.commit('removeFilesFromAlbum', { albumName, fileIdsToRemove: [fileId] })

					logger.error(t('photos', 'Failed to add {fileBaseName} to album {albumName}.', { fileBaseName, albumName }), error)
					showError(t('photos', 'Failed to add {fileBaseName} to album {albumName}.', { fileBaseName, albumName }))
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
	 * Rename an album.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.currentAlbumName - The current name of the album.
	 * @param {string} data.newAlbumName - The wanted name for the album.
	 */
	async renameAlbum(context, { currentAlbumName, newAlbumName }) {
		let album = state.albums[currentAlbumName]

		try {
			context.commit('removeAlbums', { albumNames: [currentAlbumName] })

			album = await client.moveFile(
				`/photos/${getCurrentUser()?.uid}/albums/${currentAlbumName}`,
				`/photos/${getCurrentUser()?.uid}/albums/${newAlbumName}`,
			)
		} catch (error) {
			logger.error(t('photos', 'Failed to rename {currentAlbumName} to {newAlbumName}.', { currentAlbumName, newAlbumName }), error)
			showError(t('photos', 'Failed to rename {currentAlbumName} to {newAlbumName}.', { currentAlbumName, newAlbumName }))
		} finally {
			context.commit('addAlbums', { albums: [album] })
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
