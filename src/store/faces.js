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
import Vue from 'vue'

/**
 * @typedef {object} Face
 * @property {string} basename - The name of the face.
 * @property {number} lastmod - The creation date of the face.
 * @property {string} size - The number of items in the face.
 */

const state = {
	faces: {},
	facesFiles: {},
	unassignedFiles: [],
	unassignedFilesCount: 0,
}

const mutations = {
	/**
	 * Add faces to the face collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.faces list of faces
	 */
	addFaces(state, { faces }) {
		for (const face of faces) {
			Vue.set(state.faces, face.basename, face)
		}
	},

	/**
	 * Remove faces from the face collection.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {Array} data.faceNames list of faces ids
	 */
	removeFaces(state, { faceNames }) {
		faceNames.forEach(faceName => Vue.delete(state.faces, faceName))
		faceNames.forEach(faceName => Vue.delete(state.facesFiles, faceName))
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
		if (!state.facesFiles[faceName]) {
			Vue.set(state.facesFiles, faceName, [])
		}
		const faceFiles = state.facesFiles[faceName]
		faceFiles.push(...fileIdsToAdd.filter(fileId => !faceFiles.includes(fileId))) // Filter to prevent duplicate fileId.
	},

	/**
	 * Add files to a face.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string[]} data.fileIdsToAdd list of files
	 */
	addUnassignedFiles(state, { fileIdsToAdd }) {
		if (!state.unassignedFiles) {
			state.unassignedFiles = []
		}
		const files = state.unassignedFiles
		files.push(...fileIdsToAdd.filter(fileId => !files.includes(fileId))) // Filter to prevent duplicate fileId.
	},

	/**
	 * Remove files from the unassigned Files collection
	 *
	 * @param state
	 * @param fileIdsToRemove.fileIdsToRemove
	 * @param fileIdsToRemove
	 */
	removeUnassignedFile(state, { fileIdsToRemove }) {
		state.unassignedFiles = state.unassignedFiles.filter(fileId => !fileIdsToRemove.includes(fileId))
	},

	/**
	 * Remove files from a face.
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.faceName the face id
	 * @param {string[]} data.fileIdsToRemove list of files
	 */
	removeFilesFromFace(state, { faceName, fileIdsToRemove }) {
		Vue.set(state.facesFiles, faceName, state.facesFiles[faceName].filter(fileId => !fileIdsToRemove.includes(fileId)))
	},

	/**
	 *
	 * @param state
	 * @param count
	 */
	setUnassignedFilesCount(state, count) {
		state.unassignedFilesCount = count
	},
}

const getters = {
	faces: state => state.faces,
	facesFiles: state => state.facesFiles,
	unassignedFiles: state => state.unassignedFiles,
	unassignedFilesCount: state => state.unassignedFilesCount,
}

const actions = {
	/**
	 * Update files and faces
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {Face[]} data.faces list of faces
	 */
	addFaces(context, { faces }) {
		context.commit('addFaces', { faces })
	},

	/**
	 * Add files to a face.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.faceName the new face name
	 * @param {?string} data.oldFace the old face name
	 * @param {string[]} data.fileIdsToMove list of files ids to move
	 */
	async moveFilesToFace(context, { oldFace, faceName, fileIdsToMove }) {
		const semaphore = new Semaphore(5)

		const promises = fileIdsToMove
			.map(async (fileId) => {
				const file = context.getters.files[fileId]
				const fileBaseName = file.basename
				const symbol = await semaphore.acquire()

				try {
					await client.moveFile(
						oldFace ? `/recognize/${getCurrentUser()?.uid}/faces/${oldFace}/${fileBaseName}` : `/recognize/${getCurrentUser()?.uid}/unassigned-faces/${fileBaseName}`,
						`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${fileBaseName}`
					)
					file.faceDetections.find(detection => detection.title === oldFace).title = faceName
					await context.commit('addFilesToFace', { faceName, fileIdsToAdd: [fileId] })
					if (oldFace) {
						await context.commit('removeFilesFromFace', { faceName: oldFace, fileIdsToRemove: [fileId] })
					} else {
						await context.commit('removeUnassignedFile', { fileIdsToRemove: [fileId] })
					}
					semaphore.release(symbol)
				} catch (error) {
					logger.error(t('photos', 'Failed to move {fileBaseName} to person {faceName}.', { fileBaseName, faceName }), { error })
					showError(t('photos', 'Failed to move {fileBaseName} to person {faceName}.', { fileBaseName, faceName }))
					semaphore.release(symbol)
					throw error
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Remove files to an face.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.faceName the face name
	 * @param {string[]} data.fileIdsToRemove list of files ids to remove
	 */
	async removeFilesFromFace(context, { faceName, fileIdsToRemove }) {
		const semaphore = new Semaphore(5)

		await context.commit('removeFilesFromFace', { faceName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const fileBaseName = context.getters.files[fileId].basename
				const symbol = await semaphore.acquire()

				try {
					await client.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${fileBaseName}`)
				} catch (error) {
					context.commit('addFilesToFace', { faceName, fileIdsToAdd: [fileId] })

					logger.error(t('photos', 'Failed to remove {fileBaseName}.', { fileBaseName }), { error })
					showError(t('photos', 'Failed to remove {fileBaseName}.', { fileBaseName }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Rename an face.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.oldName - The current name of the face.
	 * @param {string} data.faceName - The wanted name for the face.
	 */
	async renameFace(context, { oldName, faceName }) {
		let face = state.faces[oldName]

		try {
			if (state.faces[faceName]) {
				throw new Error('Name already exists')
			}
			await client.moveFile(
				`/recognize/${getCurrentUser()?.uid}/faces/${oldName}`,
				`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
			)
			context.commit('removeFaces', { faceNames: [oldName] })
			face = { ...face, basename: faceName }
			context.commit('addFaces', { faces: [face] })
		} catch (error) {
			logger.error(t('photos', 'Failed to rename {oldName} to {faceName}.', { oldName, faceName }), { error })
			showError(t('photos', 'Failed to rename {oldName} to {faceName}.', { oldName, faceName }))
			throw error
		}
	},

	/**
	 * Delete an face.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.faceName the id of the face
	 */
	async deleteFace(context, { faceName }) {
		try {
			await client.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`)
			context.commit('removeFaces', { faceNames: [faceName] })
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {faceName}.', { faceName }), { error })
			showError(t('photos', 'Failed to delete {faceName}.', { faceName }))
		}
	},
}

export default { state, mutations, getters, actions }
