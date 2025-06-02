import type { FoldersNode } from '../services/FolderContent.ts'
import type { PhotosContext } from './index.js'

import { defaultRootPath } from '@nextcloud/files/dav'
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'
import { sortCompareFileInfo } from '../utils/fileUtils.js'

const state = {
	paths: {} as Record<string, number>,
	folders: {} as Record<string, number[]>,
	files: {} as Record<string, FoldersNode>,
	subFolders: {} as Record<string, number[]>,
}

export type FoldersState = typeof state

const mutations = {
	/**
	 * Index folders paths and ids
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileid
	 * @param root0.files
	 */
	updateFolders(state: FoldersState, { fileid, files }: { fileid: number, files: FoldersNode[] }) {
		if (files.length > 0) {
			// sort by last modified
			const list = files
				.sort((a, b) => sortCompareFileInfo(a, b, 'lastmod'))
				.filter((file) => file.fileid >= 0)

			// Set folder list
			Vue.set(state.folders, fileid, list.map((file) => file.fileid))
		} else {
			Vue.set(state.folders, fileid, [])
		}
	},

	/**
	 * Append or update given files
	 *
	 * @param state
	 * @param root0
	 * @param root0.newFiles
	 * @param root0.nomediaPaths
	 */
	updateFoldersFiles(state: FoldersState, { newFiles, nomediaPaths }: { newFiles: FoldersNode[], nomediaPaths: string[] }) {
		const files = {}
		newFiles
			// TODO: Is this needed? .filter(file => !file.hidden)
			.forEach((file) => {
				// Ignore the file if the path is excluded
				// TODO: Check that it works
				if (nomediaPaths.some((nomediaPath) => file.filename.startsWith(nomediaPath)
					|| file.filename.startsWith(`${defaultRootPath}${nomediaPath}`))) {
					return
				}

				files[file.fileid as number] = file
			})

		state.files = {
			...state.files,
			...files,
		}
	},

	/**
	 * Set a folder subfolders
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileid
	 * @param root0.folders
	 */
	setSubFolders(state: FoldersState, { fileid, folders }: { fileid: number, folders: FoldersNode[] }) {
		if (state.folders[fileid]) {
			const subfolders = folders
				.map((folder) => folder.fileid as number)
				// some invalid folders have an id of -1 (ext storage)
				.filter((id) => id >= 0)
			Vue.set(state.subFolders, fileid, subfolders)
		}
	},

	/**
	 * Index folders paths and ids
	 *
	 * @param state
	 * @param root0
	 * @param root0.path
	 * @param root0.fileid
	 */
	addPath(state: FoldersState, { path, fileid }: { path: string, fileid: number }) {
		if (fileid >= 0) {
			Vue.set(state.paths, path, fileid)
		}
	},

	/**
	 * Append files to a folder
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileid
	 * @param root0.files
	 */
	addFilesToFolder(state: FoldersState, { fileid, files }: { fileid: number, files: FoldersNode[] }) {
		if (fileid >= 0 && files.length > 0) {
			// and sort by last modified
			const list = files
				.sort((a, b) => sortCompareFileInfo(a, b, 'lastmod'))
				.filter((file) => file.fileid >= 0)
				.map((file) => file.fileid)
			Vue.set(state.folders, fileid, [...list, ...state.folders[fileid]])
		}
	},
}

const getters = {
	folders: (state: FoldersState) => state.folders,
	folder: (state: FoldersState) => (fileid: number) => state.folders[fileid],
	folderId: (state: FoldersState) => (path: string) => state.paths[path],
}

const actions = {
	/**
	 * Update files, folders and their respective subfolders
	 *
	 * @param context
	 * @param root0
	 * @param root0.folder
	 * @param root0.files
	 * @param root0.folders
	 */
	updateFoldersFiles(context: PhotosContext<FoldersState>, { folder, files = [], folders = [] }: { folder: FoldersNode, files: FoldersNode[], folders: FoldersNode[] }) {
		// we want all the FileInfo! Folders included!
		context.commit('updateFoldersFiles', { newFiles: [folder, ...files, ...folders], nomediaPaths: context.rootState.files.nomediaPaths })
		context.commit('setSubFolders', { fileid: folder.fileid, folders })
	},

	/**
	 * Append or update given files
	 *
	 * @param context
	 * @param files
	 */
	appendFoldersFiles(context: PhotosContext<FoldersState>, files: FoldersNode[] = []) {
		context.commit('updateFoldersFiles', { newFiles: files, nomediaPaths: context.rootState.files.nomediaPaths })
	},

	/**
	 * Update files and folders
	 *
	 * @param context
	 * @param root0
	 * @param root0.fileid
	 * @param root0.files
	 * @param root0.folders
	 */
	updateFolders(context: PhotosContext<FoldersState>, { fileid, files, folders }: { fileid: number, files: FoldersNode[], folders: FoldersNode[] }) {
		context.commit('updateFolders', { fileid, files })

		// then add each folders path indexes
		folders.forEach((folder) => context.commit('addPath', { path: folder.filename, fileid: folder.fileid }))
	},

	/**
	 * Index folders paths and ids
	 *
	 * @param context
	 * @param root0
	 * @param root0.path
	 * @param root0.fileid
	 */
	addPath(context: PhotosContext<FoldersState>, { path, fileid }: { path: string, fileid: number }) {
		context.commit('addPath', { path, fileid })
	},

	/**
	 * Append files to a folder
	 *
	 * @param context
	 * @param root0
	 * @param root0.fileid
	 * @param root0.files
	 */
	addFilesToFolder(context: PhotosContext<FoldersState>, { fileid, files }: { fileid: number, files: FoldersNode[] }) {
		context.commit('addFilesToFolder', { fileid, files })
	},
}

export default { state, mutations, getters, actions }
