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
import Vue from 'vue'
import moment from '@nextcloud/moment'

import { deleteFile, favoriteFile, downloadFiles } from '../services/FileActions.js'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

const state = {
	files: {},
	nomediaPaths: [],
}

const mutations = {
	/**
	 * Append or update given files
	 *
	 * @param {object} state the store mutations
	 * @param {Array} newFiles the store mutations
	 */
	updateFiles(state, newFiles) {
		newFiles.forEach(file => {
			if (state.nomediaPaths.some(nomediaPath => file.filename.startsWith(nomediaPath))) {
				return
			}
			if (file.fileid >= 0) {
				if (file.fileMetadataSize) {
					file.fileMetadataSizeParsed = JSON.parse(file.fileMetadataSize.replace(/&quot;/g, '"'))
				}
				file.fileMetadataSizeParsed.width = file.fileMetadataSizeParsed?.width ?? 256
				file.fileMetadataSizeParsed.height = file.fileMetadataSizeParsed?.height ?? 256
			}

			// Precalculate dates as it is expensive.
			file.timestamp = moment(file.lastmod).unix() // For sorting
			file.month = moment(file.lastmod).format('YYYYMM') // For grouping by month
			file.day = moment(file.lastmod).format('MMDD') // For On this day
		})

		state.files = {
			...state.files,
			...newFiles.reduce((files, file) => ({ ...files, [file.fileid]: file }), {}),
		}
	},

	/**
	 * Set a folder subfolders
	 *
	 * @param {object} state the store mutations
	 * @param {object} data destructuring object
	 * @param {number} data.fileid current folder id
	 * @param {Array} data.folders list of folders
	 */
	setSubFolders(state, { fileid, folders }) {
		if (state.files[fileid]) {
			const subfolders = folders
				.map(folder => folder.fileid)
				// some invalid folders have an id of -1 (ext storage)
				.filter(id => id >= 0)
			Vue.set(state.files[fileid], 'folders', subfolders)
		}
	},

	/**
	 * Set list of all .nomedia/.noimage files
	 *
	 * @param {object} state the store mutations
	 * @param {Array} paths list of files
	 */
	setNomediaPaths(state, paths) {
		state.nomediaPaths = paths
	},

	/**
	 * Delete a file
	 *
	 * @param {object} state the store mutations
	 * @param {number} fileId - The id of the file
	 */
	deleteFile(state, fileId) {
		Vue.delete(state.files, fileId)
	},

	/**
	 * Favorite a list of files
	 *
	 * @param {object} state the store mutations
	 * @param {object} params -
	 * @param {number} params.fileId - The id of the file
	 * @param {boolean} params.favoriteState - The ew state of the favorite property
	 */
	favoriteFile(state, { fileId, favoriteState }) {
		Vue.set(state.files[fileId], 'favorite', favoriteState ? 1 : 0)
	},
}

const getters = {
	files: state => state.files,
	nomediaPaths: state => state.nomediaPaths,
}

const actions = {
	/**
	 * Update files, folders and their respective subfolders
	 *
	 * @param {object} context the store mutations
	 * @param {object} data destructuring object
	 * @param {object} data.folder current folder fileinfo
	 * @param {Array} data.files list of files
	 * @param {Array} data.folders list of folders within current folder
	 */
	updateFiles(context, { folder, files = [], folders = [] } = {}) {
		// we want all the FileInfo! Folders included!
		context.commit('updateFiles', [folder, ...files, ...folders])
		context.commit('setSubFolders', { fileid: folder.fileid, folders })
	},

	/**
	 * Append or update given files
	 *
	 * @param {object} context the store mutations
	 * @param {Array} files list of files
	 */
	appendFiles(context, files = []) {
		context.commit('updateFiles', files)
	},

	/**
	 * Set list of all .nomedia/.noimage files
	 *
	 * @param {object} context the store mutations
	 * @param {Array} paths list of files
	 */
	setNomediaPaths(context, paths) {
		logger.debug('Ignored paths', { paths })
		context.commit('setNomediaPaths', paths)
	},

	/**
	 * Delete a list of files
	 *
	 * @param {object} context the store mutations
	 * @param {number[]} fileIds - The ids of the files
	 */
	deleteFiles(context, fileIds) {
		const semaphore = new Semaphore(5)

		const files = fileIds.map(fileId => state.files[fileId]).reduce((files, file) => ({ ...files, [file.fileid]: file }), {})
		fileIds.forEach(fileId => context.commit('deleteFile', fileId))

		const promises = fileIds
			.map(async (fileId) => {
				const symbol = await semaphore.acquire()
				try {
					await deleteFile(files[fileId].filename)
				} catch (error) {
					console.error(error)
					context.dispatch('appendFiles', [files[fileId]])
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Favorite a list of files
	 *
	 * @param {object} context the store mutations
	 * @param {object} params -
	 * @param {number[]} params.fileIds - The ids of the files
	 * @param {boolean} params.favoriteState - The favorite state to set
	 */
	toggleFavoriteForFiles(context, { fileIds, favoriteState }) {
		const semaphore = new Semaphore(5)

		const promises = fileIds
			.map(async (fileId) => {
				await semaphore.acquire()
				await favoriteFile(state.files[fileId].filename, favoriteState)
				context.commit('favoriteFile', { fileId, favoriteState })
				return semaphore.release()
			})

		return Promise.all(promises)
	},

	/**
	 * Download a list of files
	 *
	 * @param {object} context the store mutations
	 * @param {number[]} fileIds - The ids of the files
	 */
	downloadFiles(context, fileIds) {
		downloadFiles(fileIds.map(fileId => context.state.files[fileId].filename))
	},
}

export default { state, mutations, getters, actions }
