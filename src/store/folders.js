/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import { sortCompare } from '../utils/fileUtils.js'

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
		if (!state.folders[fileid]) {
			Vue.set(state.folders, fileid, [])
		}

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

	/**
	 * Append files to a folder
	 *
	 * @param {object} state vuex state
	 * @param {object} data destructuring object
	 * @param {number} data.fileid id of this folder
	 * @param {Array} data.files list of files to add
	 */
	addFilesToFolder(state, { fileid, files }) {
		if (fileid >= 0 && files.length > 0) {
			// and sort by last modified
			const list = files
				.sort((a, b) => sortCompare(a, b, 'lastmod'))
				.filter(file => file.fileid >= 0)
				.map(file => file.fileid)
			Vue.set(state.folders, fileid, [...list, ...state.folders[fileid]])
		}
	},
}

const getters = {
	folders: state => state.folders,
	paths: state => state.paths,
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

	/**
	 * Append files to a folder
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {number} data.fileid id of this folder
	 * @param {Array} data.files list of files to add
	 */
	addFilesToFolder(context, { fileid, files }) {
		context.commit('addFilesToFolder', { fileid, files })
	},
}

export default { state, mutations, getters, actions }
