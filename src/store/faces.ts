/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'
import type { PhotosContext } from './index.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import Vue from 'vue'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

const state = {
	faces: {} as Record<string, Collection>,
	facesFiles: {} as Record<string, string[]>,
	unassignedFiles: [] as string[],
	unassignedFilesCount: 0,
}

export type FacesState = typeof state

const mutations = {
	/**
	 * Add faces to the face collection.
	 *
	 * @param state
	 * @param root0
	 * @param root0.faces
	 */
	addFaces(state: FacesState, { faces }: { faces: Collection[] }) {
		for (const face of faces) {
			Vue.set(state.faces, face.basename, face)
		}
	},

	/**
	 * Remove faces from the face collection.
	 *
	 * @param state
	 * @param root0
	 * @param root0.faceNames
	 */
	removeFaces(state: FacesState, { faceNames }: { faceNames: string[] }) {
		faceNames.forEach((faceName) => Vue.delete(state.faces, faceName))
		faceNames.forEach((faceName) => Vue.delete(state.facesFiles, faceName))
	},

	/**
	 * Add files to a face.
	 *
	 * @param state
	 * @param root0
	 * @param root0.faceName
	 * @param root0.fileIdsToAdd
	 */
	addFilesToFace(state: FacesState, { faceName, fileIdsToAdd }: { faceName: string, fileIdsToAdd: string[] }) {
		if (!state.facesFiles[faceName]) {
			Vue.set(state.facesFiles, faceName, [])
		}
		const faceFiles = state.facesFiles[faceName]
		faceFiles.push(...fileIdsToAdd.filter((fileId) => !faceFiles.includes(fileId))) // Filter to prevent duplicate fileId.
	},

	/**
	 * Add files to a face.
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileIdsToAdd
	 */
	addUnassignedFiles(state: FacesState, { fileIdsToAdd }: { fileIdsToAdd: string[] }) {
		if (!state.unassignedFiles) {
			state.unassignedFiles = []
		}
		const files = state.unassignedFiles
		files.push(...fileIdsToAdd.filter((fileId) => !files.includes(fileId))) // Filter to prevent duplicate fileId.
	},

	/**
	 * Remove files from the unassigned Files collection
	 *
	 * @param state
	 * @param root0
	 * @param root0.fileIdsToRemove
	 */
	removeUnassignedFile(state: FacesState, { fileIdsToRemove }: { fileIdsToRemove: string[] }) {
		state.unassignedFiles = state.unassignedFiles.filter((fileId) => !fileIdsToRemove.includes(fileId))
	},

	/**
	 * Remove files from a face.
	 *
	 * @param state
	 * @param root0
	 * @param root0.faceName
	 * @param root0.fileIdsToRemove
	 */
	removeFilesFromFace(state: FacesState, { faceName, fileIdsToRemove }: { faceName: string, fileIdsToRemove: string[] }) {
		Vue.set(state.facesFiles, faceName, state.facesFiles[faceName].filter((fileId) => !fileIdsToRemove.includes(fileId)))
	},

	setUnassignedFilesCount(state: FacesState, count: number) {
		state.unassignedFilesCount = count
	},
}

const getters = {
	faces: (state: FacesState) => state.faces,
	facesFiles: (state: FacesState) => state.facesFiles,
	unassignedFiles: (state: FacesState) => state.unassignedFiles,
	unassignedFilesCount: (state: FacesState) => state.unassignedFilesCount,
}

const actions = {
	/**
	 * Update files and faces
	 *
	 * @param context
	 * @param root0
	 * @param root0.faces
	 */
	addFaces(context: PhotosContext<FacesState>, { faces }: { faces: Collection[] }) {
		context.commit('addFaces', { faces })
	},

	/**
	 * Add files to a face.
	 *
	 * @param context
	 * @param root0
	 * @param root0.oldFace
	 * @param root0.faceName
	 * @param root0.fileIdsToMove
	 */
	async moveFilesToFace(context: PhotosContext<FacesState>, { oldFace, faceName, fileIdsToMove }: { oldFace?: string, faceName: string, fileIdsToMove: string[] }) {
		const semaphore = new Semaphore(5)

		const promises = fileIdsToMove
			.map(async (fileId) => {
				const file = context.rootState.files.files[fileId]
				const fileBaseName = file.basename
				const symbol = await semaphore.acquire()

				try {
					await davClient.moveFile(
						oldFace ? `/recognize/${getCurrentUser()?.uid}/faces/${oldFace}/${fileBaseName}` : `/recognize/${getCurrentUser()?.uid}/unassigned-faces/${fileBaseName}`,
						`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${fileBaseName}`,
					)
					file.faceDetections.find((detection) => detection.title === oldFace).title = faceName
					await context.commit('addFilesToFace', { faceName, fileIdsToAdd: [fileId] })
					if (oldFace) {
						await context.commit('removeFilesFromFace', { faceName: oldFace, fileIdsToRemove: [fileId] })
					} else {
						await context.commit('removeUnassignedFile', { fileIdsToRemove: [fileId] })
					}
					semaphore.release(symbol)
				} catch (error) {
					logger.error(t('photos', 'Failed to move {fileBaseName} to person {faceName}', { fileBaseName, faceName }), { error })
					showError(t('photos', 'Failed to move {fileBaseName} to person {faceName}', { fileBaseName, faceName }))
					semaphore.release(symbol)
					throw error
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Remove files to an face.
	 *
	 * @param context
	 * @param root0
	 * @param root0.faceName
	 * @param root0.fileIdsToRemove
	 */
	async removeFilesFromFace(context: PhotosContext<FacesState>, { faceName, fileIdsToRemove }: { faceName: string, fileIdsToRemove: string[] }) {
		const semaphore = new Semaphore(5)

		await context.commit('removeFilesFromFace', { faceName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const fileBaseName = context.rootState.files[fileId].basename
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${fileBaseName}`)
				} catch (error) {
					context.commit('addFilesToFace', { faceName, fileIdsToAdd: [fileId] })

					logger.error(t('photos', 'Failed to remove {fileBaseName}', { fileBaseName }), { error })
					showError(t('photos', 'Failed to remove {fileBaseName}', { fileBaseName }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Rename an face.
	 *
	 * @param context
	 * @param root0
	 * @param root0.oldName
	 * @param root0.faceName
	 */
	async renameFace(context: PhotosContext<FacesState>, { oldName, faceName }: { oldName: string, faceName: string }) {
		const face = state.faces[oldName]

		try {
			if (state.faces[faceName]) {
				throw new Error('Name already exists')
			}
			await davClient.moveFile(
				`/recognize/${getCurrentUser()?.uid}/faces/${oldName}`,
				`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
			)
			context.commit('removeFaces', { faceNames: [oldName] })
			face.rename(faceName)
			context.commit('addFaces', { faces: [face] })
		} catch (error) {
			logger.error(t('photos', 'Failed to rename {oldName} to {faceName}', { oldName, faceName }), { error })
			showError(t('photos', 'Failed to rename {oldName} to {faceName}', { oldName, faceName }))
			throw error
		}
	},

	/**
	 * Delete an face.
	 *
	 * @param context
	 * @param root0
	 * @param root0.faceName
	 */
	async deleteFace(context: PhotosContext<FacesState>, { faceName }: { faceName: string }) {
		try {
			await davClient.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`)
			context.commit('removeFaces', { faceNames: [faceName] })
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {faceName}', { faceName }), { error })
			showError(t('photos', 'Failed to delete {faceName}', { faceName }))
		}
	},
}

export default { state, mutations, getters, actions }
