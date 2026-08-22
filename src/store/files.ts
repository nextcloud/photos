/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File, Folder } from '@nextcloud/files'
import type { PhotoMetadataUpdate } from '../services/photoActions.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'
import type { PhotosContext } from './index.ts'

import { showError } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import Vue from 'vue'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import { deletePhoto, savePhotoMetadata, setPhotoFavorite } from '../services/photoActions.ts'
import Semaphore from '../utils/semaphoreWithPriority.js'

export type PhotoFile = File & {
	fileid: number
	attributes: {
		'metadata-blurhash'?: string
		'metadata-photos-original_date_time': number
		'metadata-photos-size': { width: number, height: number }
		'metadata-photos-gps'?: { latitude: string, longitude: string, altitude?: string }
		/** Whether a preview can be generated for this file - not whether one exists already. */
		hasPreview?: boolean
		timestamp: number
		month: string
		day: string
	}
}

const state = {
	files: {} as Record<string, PhotoFile>,
	nomediaPaths: [] as string[],
}

export type FilesState = typeof state

const mutations = {
	/**
	 * Append or update given files
	 *
	 * @param state
	 * @param newFiles
	 */
	updateFiles(state: FilesState, newFiles: File[]) {
		const files = {}
		newFiles
			.filter((file) => !file.attributes.hidden)
			.forEach((file) => {
				// Ignore the file if the path is excluded
				// TODO: Check that it works
				if (state.nomediaPaths.some((nomediaPath) => file.path.startsWith(nomediaPath)
					|| file.path.startsWith(`${defaultRootPath}${nomediaPath}`))) {
					return
				}

				if ((file.fileid as number) >= 0) {
					file.attributes['metadata-photos-size'] ??= { width: 256, height: 256 }
				}

				// Precalculate dates as it is expensive.
				const date = moment((file.attributes['metadata-photos-original_date_time'] * 1000) || file.mtime)
				file.attributes.timestamp = date.unix() // For sorting
				file.attributes.month = date.format('YYYYMM') // For grouping by month
				file.attributes.day = date.format('MMDD') // For On this day

				files[file.fileid as number] = file
			})

		state.files = {
			...state.files,
			...files,
		}
	},

	/**
	 * Set list of all .nomedia/.noimage files
	 *
	 * @param state
	 * @param paths
	 */
	setNomediaPaths(state: FilesState, paths: string[]) {
		state.nomediaPaths = paths
	},

	/**
	 * Delete a file
	 *
	 * @param state
	 * @param fileId
	 */
	deleteFile(state: FilesState, fileId: number) {
		Vue.delete(state.files, fileId)
	},

	/**
	 * Favorite a list of files
	 *
	 * Photos of the folders view are not part of this store, so the state is
	 * only updated when the file is known.
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileId
	 * @param root0.favoriteState
	 */
	favoriteFile(state: FilesState, { fileId, favoriteState }: { fileId: number, favoriteState: 0 | 1 }) {
		const attributes = state.files[fileId]?.attributes
		if (attributes === undefined) {
			return
		}

		Vue.set(attributes, 'favorite', favoriteState)
	},

	/**
	 * Store the corrected taken date and position of a photo
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileId
	 * @param root0.takenAt
	 * @param root0.location
	 */
	setPhotoMetadata(state: FilesState, { fileId, takenAt, location }: { fileId: number } & PhotoMetadataUpdate) {
		const attributes = state.files[fileId]?.attributes
		if (attributes === undefined) {
			return
		}

		// The dates driving the sorting and the grouping are precalculated, so
		// they have to be recomputed for the photo to move to its new month.
		const date = moment(takenAt * 1000)
		Vue.set(attributes, 'metadata-photos-original_date_time', takenAt)
		Vue.set(attributes, 'timestamp', date.unix())
		Vue.set(attributes, 'month', date.format('YYYYMM'))
		Vue.set(attributes, 'day', date.format('MMDD'))

		if (location === null) {
			Vue.delete(attributes, 'metadata-photos-gps')
		} else {
			// Coordinates are strings once they come back from a DAV listing.
			Vue.set(attributes, 'metadata-photos-gps', {
				latitude: String(location.latitude),
				longitude: String(location.longitude),
			})
		}
	},
}

const getters = {
	files: (state: FilesState) => state.files,
	nomediaPaths: (state: FilesState) => state.nomediaPaths,
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
	updateFiles(context: PhotosContext<FilesState>, { folder, files = [], folders = [] }: { folder: Folder, files: File[], folders: Folder[] }) {
		// we want all the FileInfo! Folders included!
		context.commit('updateFiles', [folder, ...files, ...folders])
		context.commit('setSubFolders', { fileid: folder.fileid, folders })
	},

	/**
	 * Append or update given files
	 *
	 * @param context
	 * @param files
	 */
	appendFiles(context: PhotosContext<FilesState>, files: File[] = []) {
		context.commit('updateFiles', files)
	},

	/**
	 * Set list of all .nomedia/.noimage files
	 *
	 * @param context
	 * @param paths
	 */
	setNomediaPaths(context: PhotosContext<FilesState>, paths: string[]) {
		logger.debug('Ignored paths', { paths })
		context.commit('setNomediaPaths', paths)
	},

	/**
	 * Correct the taken date and the position of a photo
	 *
	 * @param context
	 * @param root0
	 * @param root0.photo
	 * @param root0.takenAt
	 * @param root0.location
	 * @throws {Error} When the server rejects the update
	 */
	async updatePhotoMetadata(context: PhotosContext<FilesState>, { photo, takenAt, location }: { photo: PhotoTarget } & PhotoMetadataUpdate) {
		await savePhotoMetadata(photo, { takenAt, location })
		context.commit('setPhotoMetadata', { fileId: photo.fileid, takenAt, location })
	},

	/**
	 * Mark a single photo as a favorite, or take that mark off again
	 *
	 * @param context
	 * @param root0
	 * @param root0.photo
	 * @param root0.favorite
	 * @throws {Error} When the server rejects the update
	 */
	async setPhotoFavorite(context: PhotosContext<FilesState>, { photo, favorite }: { photo: PhotoTarget, favorite: boolean }) {
		await setPhotoFavorite(photo, favorite)

		// The photo can be one of a timeline as well as one of a folder, and the
		// two views hold their own listings.
		const favoriteState = favorite ? 1 : 0
		context.commit('favoriteFile', { fileId: photo.fileid, favoriteState })
		context.commit('favoriteFolderFile', { fileId: photo.fileid, favoriteState })
	},

	/**
	 * Move a photo to the trash
	 *
	 * Photos of the folders view are not part of this store, so the file is
	 * only dropped from it when it is known.
	 *
	 * @param context
	 * @param photo
	 * @throws {Error} When the server refuses to delete the photo
	 */
	async deletePhoto(context: PhotosContext<FilesState>, photo: PhotoTarget) {
		await deletePhoto(photo)
		context.commit('deleteFile', photo.fileid)
	},

	/**
	 * Delete a list of files
	 *
	 * @param context
	 * @param fileIds
	 */
	deleteFiles(context: PhotosContext<FilesState>, fileIds: number[]) {
		const semaphore = new Semaphore(5)

		const files = fileIds
			.map((fileId) => state.files[fileId])
			.reduce((files, file) => ({ ...files, [file.fileid]: file }), {} as Record<string, PhotoFile>)

		fileIds.forEach((fileId) => context.commit('deleteFile', fileId))

		const promises = fileIds
			.map(async (fileId) => {
				const file = files[fileId]
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(file.root + file.path)
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
	 *
	 * @param context
	 * @param root0
	 * @param root0.fileIds
	 * @param root0.favoriteState
	 */
	toggleFavoriteForFiles(context: PhotosContext<FilesState>, { fileIds, favoriteState }: { fileIds: string[], favoriteState: 0 | 1 }) {
		const semaphore = new Semaphore(5)

		const promises = fileIds
			.map(async (fileId) => {
				const file = context.state.files[fileId]
				const symbole = await semaphore.acquire()

				try {
					context.commit('favoriteFile', { fileId, favoriteState })
					await davClient.customRequest(
						file.root + file.path,
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
