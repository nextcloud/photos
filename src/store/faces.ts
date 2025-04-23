/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'
import { t } from '@nextcloud/l10n'
import Vue from 'vue'

import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

type Face = {
	basename: string // The name of the face.
	lastmod: number // The creation date of the face.
	size: string // The number of items in the face.
}

const state = {
	faces: {} as Record<string, Face>,
	facesFiles: {} as Record<string, string[]>,
	unassignedFiles: [] as string[],
	unassignedFilesCount: 0,
}

type FaceState = typeof state

const mutations = {
	/**
	 * Add faces to the face collection.
	 */
	addFaces(state: FaceState, { faces }: { faces: Face[] }) {
		for (const face of faces) {
			Vue.set(state.faces, face.basename, face)
		}
	},

	/**
	 * Remove faces from the face collection.
	 */
	removeFaces(state: FaceState, { faceNames }: { faceNames: string[] }) {
		faceNames.forEach(faceName => Vue.delete(state.faces, faceName))
		faceNames.forEach(faceName => Vue.delete(state.facesFiles, faceName))
	},

	/**
	 * Add files to a face.
	 */
	addFilesToFace(state: FaceState, { faceName, fileIdsToAdd }: { faceName: string, fileIdsToAdd: string[] }) {
		if (!state.facesFiles[faceName]) {
			Vue.set(state.facesFiles, faceName, [])
		}
		const faceFiles = state.facesFiles[faceName]
		faceFiles.push(...fileIdsToAdd.filter(fileId => !faceFiles.includes(fileId))) // Filter to prevent duplicate fileId.
	},

	/**
	 * Add files to a face.
	 */
	addUnassignedFiles(state: FaceState, { fileIdsToAdd }: { fileIdsToAdd: string[] }) {
		if (!state.unassignedFiles) {
			state.unassignedFiles = []
		}
		const files = state.unassignedFiles
		files.push(...fileIdsToAdd.filter(fileId => !files.includes(fileId))) // Filter to prevent duplicate fileId.
	},

	/**
	 * Remove files from the unassigned Files collection
	 */
	removeUnassignedFile(state: FaceState, { fileIdsToRemove }: { fileIdsToRemove: string[] }) {
		state.unassignedFiles = state.unassignedFiles.filter(fileId => !fileIdsToRemove.includes(fileId))
	},

	/**
	 * Remove files from a face.
	 */
	removeFilesFromFace(state: FaceState, { faceName, fileIdsToRemove }: { faceName: string, fileIdsToRemove: string[] }) {
		Vue.set(state.facesFiles, faceName, state.facesFiles[faceName].filter(fileId => !fileIdsToRemove.includes(fileId)))
	},

	setUnassignedFilesCount(state: FaceState, count: number) {
		state.unassignedFilesCount = count
	},
}

const getters = {
	faces: (state: FaceState) => state.faces,
	facesFiles: (state: FaceState) => state.facesFiles,
	unassignedFiles: (state: FaceState) => state.unassignedFiles,
	unassignedFilesCount: (state: FaceState) => state.unassignedFilesCount,
}

const actions = {
	/**
	 * Update files and faces
	 */
	addFaces(context, { faces }: { faces: Face[] }) {
		context.commit('addFaces', { faces })
	},

	/**
	 * Add files to a face.
	 */
	async moveFilesToFace(context, { oldFace, faceName, fileIdsToMove }: { oldFace?: string, faceName: string, fileIdsToMove: string[] }) {
		const semaphore = new Semaphore(5)

		const promises = fileIdsToMove
			.map(async (fileId) => {
				const file = context.getters.files[fileId]
				const fileBaseName = file.basename
				const symbol = await semaphore.acquire()

				try {
					await davClient.moveFile(
						oldFace ? `/recognize/${getCurrentUser()?.uid}/faces/${oldFace}/${fileBaseName}` : `/recognize/${getCurrentUser()?.uid}/unassigned-faces/${fileBaseName}`,
						`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${fileBaseName}`,
					)
					file.faceDetections.find(detection => detection.title === oldFace).title = faceName
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
	 */
	async removeFilesFromFace(context, { faceName, fileIdsToRemove }: { faceName: string, fileIdsToRemove: string[] }) {
		const semaphore = new Semaphore(5)

		await context.commit('removeFilesFromFace', { faceName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const fileBaseName = context.getters.files[fileId].basename
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
	 */
	async renameFace(context, { oldName, faceName }: { oldName: string, faceName: string }) {
		let face = state.faces[oldName]

		try {
			if (state.faces[faceName]) {
				throw new Error('Name already exists')
			}
			await davClient.moveFile(
				`/recognize/${getCurrentUser()?.uid}/faces/${oldName}`,
				`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
			)
			context.commit('removeFaces', { faceNames: [oldName] })
			face = { ...face, basename: faceName }
			context.commit('addFaces', { faces: [face] })
		} catch (error) {
			logger.error(t('photos', 'Failed to rename {oldName} to {faceName}', { oldName, faceName }), { error })
			showError(t('photos', 'Failed to rename {oldName} to {faceName}', { oldName, faceName }))
			throw error
		}
	},

	/**
	 * Delete an face.
	 */
	async deleteFace(context, { faceName }: { faceName: string}) {
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
