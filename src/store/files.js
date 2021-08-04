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
 */
import Vue from 'vue'

const state = {
	files: {},
}

const mutations = {
	/**
	 * Append or update given files
	 *
	 * @param {object} state the store mutations
	 * @param {Array} files the store mutations
	 */
	updateFiles(state, files) {
		files.forEach(file => {
			if (file.fileid >= 0) {
				Vue.set(state.files, file.fileid, file)
			}
		})
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
}

const getters = {
	files: state => state.files,
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
}

export default { state, mutations, getters, actions }
