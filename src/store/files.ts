/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { PhotoMetadataUpdate } from '../services/photoActions.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { defineStore } from 'pinia'
import Vue, { ref } from 'vue'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import { deletePhoto as deletePhotoRequest, savePhotoMetadata, setPhotoFavorite as setPhotoFavoriteRequest } from '../services/photoActions.ts'
import Semaphore from '../utils/semaphoreWithPriority.js'
import useFoldersStore from './folders.ts'

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

export default defineStore('files', () => {
	const files = ref<Record<string, PhotoFile>>({})
	const nomediaPaths = ref<string[]>([])

	/**
	 * Append or update given files
	 *
	 * @param newFiles - Files to index
	 */
	function appendFiles(newFiles: File[] = []): void {
		const indexed = {}
		newFiles
			.filter((file) => !file.attributes.hidden)
			.forEach((file) => {
				// Ignore the file if the path is excluded
				// TODO: Check that it works
				if (nomediaPaths.value.some((nomediaPath) => file.path.startsWith(nomediaPath)
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

				indexed[file.fileid as number] = file
			})

		files.value = {
			...files.value,
			...indexed,
		}
	}

	/**
	 * Set list of all .nomedia/.noimage files
	 *
	 * @param paths - Paths to exclude from the listings
	 */
	function setNomediaPaths(paths: string[]): void {
		logger.debug('Ignored paths', { paths })
		nomediaPaths.value = paths
	}

	/**
	 * Favorite a file, or take that mark off again
	 *
	 * Photos of the folders view are not part of this store, so the state is
	 * only updated when the file is known.
	 *
	 * @param fileId - Id of the file
	 * @param favoriteState - 1 to favorite, 0 to unfavorite
	 */
	function favoriteFile(fileId: number | string, favoriteState: 0 | 1): void {
		const attributes = files.value[fileId]?.attributes
		if (attributes === undefined) {
			return
		}

		// Vue 2 does not track properties added to an object, and a photo that
		// was never a favorite has no favorite attribute yet.
		Vue.set(attributes, 'favorite', favoriteState)
	}

	/**
	 * Correct the taken date and the position of a photo
	 *
	 * @param photo - Photo to update
	 * @param update - New taken date and position
	 * @param update.takenAt - Corrected capture time, as a unix timestamp
	 * @param update.location - Corrected position, or null to drop it
	 * @throws {Error} When the server rejects the update
	 */
	async function updatePhotoMetadata(photo: PhotoTarget, { takenAt, location }: PhotoMetadataUpdate): Promise<void> {
		await savePhotoMetadata(photo, { takenAt, location })

		const attributes = files.value[photo.fileid]?.attributes
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
	}

	/**
	 * Mark a single photo as a favorite, or take that mark off again
	 *
	 * @param photo - Photo to update
	 * @param favorite - Whether the photo becomes a favorite
	 * @throws {Error} When the server rejects the update
	 */
	async function setPhotoFavorite(photo: PhotoTarget, favorite: boolean): Promise<void> {
		await setPhotoFavoriteRequest(photo, favorite)

		// The photo can be one of a timeline as well as one of a folder, and the
		// two views hold their own listings.
		const favoriteState = favorite ? 1 : 0
		favoriteFile(photo.fileid, favoriteState)
		useFoldersStore().favoriteFolderFile(photo.fileid, favoriteState)
	}

	/**
	 * Move a photo to the trash
	 *
	 * Photos of the folders view are not part of this store, so the file is
	 * only dropped from it when it is known.
	 *
	 * @param photo - Photo to delete
	 * @throws {Error} When the server refuses to delete the photo
	 */
	async function deletePhoto(photo: PhotoTarget): Promise<void> {
		await deletePhotoRequest(photo)
		Vue.delete(files.value, photo.fileid)
	}

	/**
	 * Delete a list of files
	 *
	 * @param fileIds - Ids of the files to delete
	 */
	function deleteFiles(fileIds: Array<number | string>): Promise<unknown[]> {
		const semaphore = new Semaphore(5)

		const deleted = fileIds
			.map((fileId) => files.value[fileId])
			.reduce((deleted, file) => ({ ...deleted, [file.fileid]: file }), {} as Record<string, PhotoFile>)

		fileIds.forEach((fileId) => Vue.delete(files.value, fileId))

		const promises = fileIds
			.map(async (fileId) => {
				const file = deleted[fileId]
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(file.root + file.path)
				} catch (error) {
					logger.error(t('photos', 'Failed to delete {fileId}', { fileId }), { error })
					showError(t('photos', 'Failed to delete {fileName}', { fileName: file.basename }))
					appendFiles([file])
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	}

	/**
	 * Favorite a list of files
	 *
	 * @param fileIds - Ids of the files to update
	 * @param favoriteState - 1 to favorite, 0 to unfavorite
	 */
	function toggleFavoriteForFiles(fileIds: string[], favoriteState: 0 | 1): Promise<unknown[]> {
		const semaphore = new Semaphore(5)

		const promises = fileIds
			.map(async (fileId) => {
				const file = files.value[fileId]
				const symbole = await semaphore.acquire()

				try {
					favoriteFile(fileId, favoriteState)
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
					favoriteFile(fileId, favoriteState === 0 ? 1 : 0)
					logger.error(t('photos', 'Failed to set favorite state for {fileId}', { fileId: file.fileid }), { error })
					showError(t('photos', 'Failed to set favorite state for {fileName}', { fileName: file.basename }))
				}

				return semaphore.release(symbole)
			})

		return Promise.all(promises)
	}

	return {
		files,
		nomediaPaths,
		appendFiles,
		setNomediaPaths,
		favoriteFile,
		updatePhotoMetadata,
		setPhotoFavorite,
		deletePhoto,
		deleteFiles,
		toggleFavoriteForFiles,
	}
})
