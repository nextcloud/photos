/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'
import type { PhotoFile } from './files.ts'
import type { PhotosContext } from './index.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import Vue from 'vue'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

type FaceDetection = {
	id: number
	clusterId: number | null
	title: string | null
}

/**
 * Find the face detection of a file that belongs to the given face.
 *
 * The recognize WebDAV API names every detected face `{detectionId}-{fileName}`
 * (see FacePhoto::getName) and resolves children by parsing the detection id out
 * of that name (see FaceRoot::getChild). Addressing a face photo by its bare file
 * name therefore yields a 404, so we need the detection to build the correct path.
 *
 * @param file The photo node carrying the parsed `face-detections` attribute.
 * @param face The name of the face the detection belongs to, or `undefined` for
 *             the unassigned-faces collection.
 */
function findFaceDetection(file: PhotoFile, face?: string): FaceDetection {
	const detections = ((file.attributes as Record<string, unknown>)['face-detections'] ?? []) as FaceDetection[]
	// recognize lists unassigned faces as detections with a cluster id of -1, and
	// names a face after its cluster title, falling back to the cluster id.
	const detection = face === undefined
		? detections.find((d) => d.clusterId === -1)
		: detections.find((d) => (d.title || `${d.clusterId}`) === face)
	if (detection === undefined) {
		throw new Error(`No face detection found for file "${file.basename}" in face "${face ?? 'unassigned'}"`)
	}
	return detection
}

/**
 * Build the WebDAV file name used by the recognize faces API for a detection.
 *
 * @param detection The face detection being addressed.
 * @param fileBaseName The bare file name of the photo.
 */
function getRecognizeFileName(detection: FaceDetection, fileBaseName: string): string {
	return `${detection.id}-${fileBaseName}`
}

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
				const detection = findFaceDetection(file, oldFace)
				const recognizeFileName = getRecognizeFileName(detection, fileBaseName)
				const symbol = await semaphore.acquire()

				try {
					await davClient.moveFile(
						oldFace ? `/recognize/${getCurrentUser()?.uid}/faces/${oldFace}/${recognizeFileName}` : `/recognize/${getCurrentUser()?.uid}/unassigned-faces/${recognizeFileName}`,
						`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${recognizeFileName}`,
					)
					detection.title = faceName
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
				const file = context.rootState.files.files[fileId]
				const fileBaseName = file.basename
				const recognizeFileName = getRecognizeFileName(findFaceDetection(file, faceName), fileBaseName)
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${recognizeFileName}`)
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
