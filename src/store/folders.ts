/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import { sortCompare, type PhotoNode } from '../utils/fileUtils.js'

const state = {
	paths: {},
	folders: {},
}

type FoldersState = typeof state

const mutations = {
	/**
	 * Index folders paths and ids
	 */
	updateFolders(state: FoldersState, { fileid, files }: { fileid: number, files: PhotoNode[] }) {
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
	 */
	addPath(state: FoldersState, { path, fileid }: { path: string, fileid: number }) {
		if (fileid >= 0) {
			Vue.set(state.paths, path, fileid)
		}
	},

	/**
	 * Append files to a folder
	 */
	addFilesToFolder(state: FoldersState, { fileid, files }: { fileid: number, files: PhotoNode[] }) {
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
	folders: (state: FoldersState) => state.folders,
	folder: (state: FoldersState) => fileid => state.folders[fileid],
	folderId: (state: FoldersState) => path => state.paths[path],
}

const actions = {
	/**
	 * Update files and folders
	 */
	updateFolders(context, { fileid, files, folders }: { fileid: string, files: PhotoNode[], folders: PhotoNode[] }) {
		context.commit('updateFolders', { fileid, files })

		// then add each folders path indexes
		folders.forEach(folder => context.commit('addPath', { path: folder.filename, fileid: folder.fileid }))
	},

	/**
	 * Index folders paths and ids
	 */
	addPath(context, { path, fileid }: { path: string, fileid: string }) {
		context.commit('addPath', { path, fileid })
	},

	/**
	 * Append files to a folder
	 */
	addFilesToFolder(context, { fileid, files }: { fileid: string, files: PhotoNode[] }) {
		context.commit('addFilesToFolder', { fileid, files })
	},
}

export default { state, mutations, getters, actions }
