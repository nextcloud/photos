/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { defineStore } from 'pinia'

import Vue from 'vue'
import { sortCompare } from '../utils/fileUtils.js'

interface State {
	folders: { [fileid: number]: number[] }
	paths: { [path: string]: number }
}

export const useFoldersStore = defineStore('folders', {
	state: (): State => ({
		folders: {},
		paths: {},
	}),

	getters: {
		getFolderContentById: state => (fileid: number) => state.folders[fileid],
		getFolderId: state => (path: string) => state.paths[path],
	},

	actions: {
		/**
		 * Index folders paths and ids
		 */
		updateFolders({ fileid, files, folders }: { fileid: number, files: any[], folders: any[] }) {
			// add each folders path indexes
			folders.forEach(folder => this.addPath({ path: folder.filename, fileid: folder.fileid }))

			// sort by last modified
			const list = files
				.sort((a, b) => sortCompare(a, b, 'lastmod'))
				.filter(file => file.fileid >= 0)

			// set folder list
			Vue.set(this.folders, Number(fileid), list.map(file => file.fileid))
		},

		/**
		 * Index folders paths and ids
		 */
		addPath({ path, fileid }: { path: string, fileid: number }) {
			if (fileid >= 0) {
				Vue.set(this.paths, path, Number(fileid))
			}
		},

		/**
		 * Append files to a folder
		 */
		addFilesToFolder({ fileid, files }: { fileid: number, files: any[] }) {
			if (fileid >= 0 && files.length > 0) {
				// and sort by last modified
				const list = files
					.sort((a, b) => sortCompare(a, b, 'lastmod'))
					.filter(file => file.fileid >= 0)
					.map(file => file.fileid)
				Vue.set(this.folders, Number(fileid), [...list, ...this.folders[fileid]])
			}
		},
	},
})
