/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import Vue from 'vue'

import moment from '@nextcloud/moment'
import { showError } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'

import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'
import { davClient } from '../services/DavClient.ts'
import type { PhotoNode } from '../utils/fileUtils.ts'

const state = {
	files: {},
	nomediaPaths: [] as string[],
}

type FilesState = typeof state

const mutations = {
	/**
	 * Append or update given files
	 */
	updateFiles(state: FilesState, newFiles: PhotoNode[]) {
		const files = {}
		newFiles
			.filter(file => !file.hidden)
			.forEach(file => {
				// Ignore the file if the path is excluded
				if (state.nomediaPaths.some(nomediaPath => file.filename.startsWith(nomediaPath)
					|| file.filename.startsWith(`${defaultRootPath}${nomediaPath}`))) {
					return
				}

				if (file.fileid >= 0) {
					file.metadataPhotosSize ??= { width: 256, height: 256 }
				}

				// Make the fileId a string once and for all.
				file.fileid = file.fileid.toString()

				// Precalculate dates as it is expensive.
				const date = moment((file.metadataPhotosOriginalDateTime * 1000) || file.lastmod)
				file.timestamp = date.unix() // For sorting
				file.month = date.format('YYYYMM') // For grouping by month
				file.day = date.format('MMDD') // For On this day

				// Schedule the file to add
				files[file.fileid] = file
			})

		state.files = {
			...state.files,
			...files,
		}
	},

	/**
	 * Set a folder subfolders
	 */
	setSubFolders(state: FilesState, { fileid, folders }: { fileid: number, folders: PhotoNode[] }) {
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
	 */
	setNomediaPaths(state: FilesState, paths: string[]) {
		state.nomediaPaths = paths
	},

	/**
	 * Delete a file
	 */
	deleteFile(state: FilesState, fileId: number) {
		Vue.delete(state.files, fileId)
	},

	/**
	 * Favorite a list of files
	 */
	favoriteFile(state: FilesState, { fileId, favoriteState }: { fileId: number, favoriteState: 0|1 }) {
		Vue.set(state.files[fileId], 'favorite', favoriteState)
	},
}

const getters = {
	files: (state: FilesState) => state.files,
	nomediaPaths: (state: FilesState) => state.nomediaPaths,
}

const actions = {
	/**
	 * Update files, folders and their respective subfolders
	 */
	updateFiles(context, { folder, files = [], folders = [] }: { folder: PhotoNode, files: PhotoNode[], folders: PhotoNode[]}) {
		// we want all the FileInfo! Folders included!
		context.commit('updateFiles', [folder, ...files, ...folders])
		context.commit('setSubFolders', { fileid: folder.fileid, folders })
	},

	/**
	 * Append or update given files
	 */
	appendFiles(context, files: PhotoNode[] = []) {
		context.commit('updateFiles', files)
	},

	/**
	 * Set list of all .nomedia/.noimage files
	 */
	setNomediaPaths(context, paths: string[]) {
		logger.debug('Ignored paths', { paths })
		context.commit('setNomediaPaths', paths)
	},

	/**
	 * Delete a list of files
	 */
	deleteFiles(context, fileIds: number[]) {
		const semaphore = new Semaphore(5)

		const files = fileIds
			.map(fileId => state.files[fileId])
			.reduce((files, file) => ({ ...files, [file.fileid]: file }), {})

		fileIds.forEach(fileId => context.commit('deleteFile', fileId))

		const promises = fileIds
			.map(async (fileId) => {
				const file = files[fileId]
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(file.filename)
				} catch (error) {
					logger.error(t('photos', 'Failed to delete {fileId}', { fileId }), { error })
					showError(t('photos', 'Failed to delete {fileName}', { fileName: file.basename }))
					context.dispatch('appendFiles', [file])
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Favorite a list of files
	 */
	toggleFavoriteForFiles(context, { fileIds, favoriteState }: { fileIds: string[], favoriteState: 0|1 }) {
		const semaphore = new Semaphore(5)

		const promises = fileIds
			.map(async (fileId) => {
				const file = context.state.files[fileId]
				const symbole = await semaphore.acquire()

				try {
					context.commit('favoriteFile', { fileId, favoriteState })
					await davClient.customRequest(
						file.filename,
						{
							method: 'PROPPATCH',
							data: `<?xml version="1.0"?>
							<d:propertyupdate xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
							<d:set>
								<d:prop>
									<oc:favorite>${favoriteState}</oc:favorite>
								</d:prop>
							</d:set>
							</d:propertyupdate>`,
						},
					)
				} catch (error) {
					context.commit('favoriteFile', { fileId, favoriteState: favoriteState === 0 ? 1 : 0 })
					logger.error(t('photos', 'Failed to set favorite state for {fileId}', { fileId: file.fileid }), { error })
					showError(t('photos', 'Failed to set favorite state for {fileName}', { fileName: file.basename }))
				}

				return semaphore.release(symbole)
			})

		return Promise.all(promises)
	},
}

export default { state, mutations, getters, actions }
