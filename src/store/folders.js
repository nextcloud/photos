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
import { sortCompare } from '../utils/fileUtils'

const state = {
	paths: {},
	folders: {},
}

const mutations = {
	/**
	 * Index folders paths and ids
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {number} data.fileid current folder id
	 * @param {Array} data.files list of files
	 */
	updateFolders(state, { fileid, files }) {
		if (files.length > 0) {
			// sort by last modified
			const list = files
				.sort((a, b) => sortCompare(a, b, 'lastmod'))
				.filter(file => file.fileid >= 0)

			// Set folder list
			Vue.set(state.folders, fileid, list.map(file => file.fileid))
		} else {
			Vue.set(state.folders, fileid, [])
		}
	},

	/**
	 * Index folders paths and ids
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.path path of this folder
	 * @param {number} data.fileid id of this folder
	 */
	addPath(state, { path, fileid }) {
		if (fileid >= 0) {
			Vue.set(state.paths, path, fileid)
		}
	},
}

const getters = {
	folders: state => state.folders,
	folder: state => fileid => state.folders[fileid],
	folderId: state => path => state.paths[path],
}

const actions = {
	/**
	 * Update files and folders
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {number} data.fileid current folder id
	 * @param {Array} data.files list of files
	 * @param {Array} data.folders list of folders
	 */
	updateFolders(context, { fileid, files, folders }) {
		context.commit('updateFolders', { fileid, files })

		// then add each folders path indexes
		folders.forEach(folder => context.commit('addPath', { path: folder.filename, fileid: folder.fileid }))
	},

	/**
	 * Index folders paths and ids
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.path path of this folder
	 * @param {number} data.fileid id of this folder
	 */
	addPath(context, { path, fileid }) {
		context.commit('addPath', { path, fileid })
	},
}

export default { state, mutations, getters, actions }
