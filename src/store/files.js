/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

const state = {
	files: {},
}

const mutations = {
	/**
	 * Increment the number of contacts accepted
	 *
	 * @param {Object} state the store mutations
	 * @param {Array} files the store mutations
	 */
	updateFiles(state, files) {
		files.forEach(file => {
			Vue.set(state.files, file.id, file)
		})
	},

	/**
	 * Set a folder subfolders
	 *
	 * @param {Object} state the store mutations
	 * @param {Object} data destructuring object
	 * @param {number} data.id current folder id
	 * @param {Array} data.folders list of folders
	 */
	setSubFolders(state, { id, folders }) {
		if (state.files[id]) {
			Vue.set(state.files[id], 'folders', [...folders.map(folder => folder.id)])
		}
	},
}

const getters = {
	files: state => state.files,
}

const actions = {
	/**
	 * Increment the number of contacts accepted
	 *
	 * @param {Object} context the store mutations
	 * @param {Object} data destructuring object
	 * @param {Object} data.folder current folder fileinfo
	 * @param {Array} data.files list of files
	 * @param {Array} data.folders list of folders within current folder
	 */
	updateFiles(context, { folder, files, folders }) {
		const t0 = performance.now()
		// we want all the FileInfo! Folders included!
		context.commit('updateFiles', [folder, ...files, ...folders])
		context.commit('setSubFolders', { id: folder.id, folders })
		const t1 = performance.now()
		console.debug('perf: updateFiles', `${t1 - t0}ms`)
	},
}

export default { state, mutations, getters, actions }
