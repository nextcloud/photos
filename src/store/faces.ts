/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'
import type { PhotoFile } from './files.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'
import { useFilesStore } from './files.ts'

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

export const useFacesStore = defineStore('faces', () => {
	const faces = ref<Record<string, Collection>>({})
	const facesFiles = ref<Record<string, string[]>>({})
	const unassignedFiles = ref<string[]>([])
	const unassignedFilesCount = ref(0)

	/**
	 * @param newFaces - Faces to index
	 */
	function addFaces(newFaces: Collection[]): void {
		for (const face of newFaces) {
			faces.value[face.basename] = face
		}
	}

	/**
	 * @param faceNames - Faces to forget
	 */
	function removeFaces(faceNames: string[]): void {
		faceNames.forEach((faceName) => {
			delete faces.value[faceName]
			delete facesFiles.value[faceName]
		})
	}

	/**
	 * @param faceName - Face to add to
	 * @param fileIdsToAdd - Files to add
	 */
	function addFileIdsToFace(faceName: string, fileIdsToAdd: string[]): void {
		if (!facesFiles.value[faceName]) {
			facesFiles.value[faceName] = []
		}
		const faceFiles = facesFiles.value[faceName]
		faceFiles.push(...fileIdsToAdd.filter((fileId) => !faceFiles.includes(fileId))) // Filter to prevent duplicate fileId.
	}

	/**
	 * @param fileIdsToAdd - Files to add
	 */
	function addUnassignedFiles(fileIdsToAdd: string[]): void {
		const files = unassignedFiles.value
		files.push(...fileIdsToAdd.filter((fileId) => !files.includes(fileId))) // Filter to prevent duplicate fileId.
	}

	/**
	 * @param fileIdsToRemove - Files to remove
	 */
	function removeUnassignedFiles(fileIdsToRemove: string[]): void {
		unassignedFiles.value = unassignedFiles.value.filter((fileId) => !fileIdsToRemove.includes(fileId))
	}

	/**
	 * @param faceName - Face to remove from
	 * @param fileIdsToRemove - Files to remove
	 */
	function removeFileIdsFromFace(faceName: string, fileIdsToRemove: string[]): void {
		facesFiles.value[faceName] = facesFiles.value[faceName].filter((fileId) => !fileIdsToRemove.includes(fileId))
	}

	/**
	 * @param count - Number of photos holding a face nobody named yet
	 */
	function setUnassignedFilesCount(count: number): void {
		unassignedFilesCount.value = count
	}

	/**
	 * Move photos from one face to another, or out of the unassigned ones
	 *
	 * @param faceName - Face the photos land on
	 * @param fileIdsToMove - Photos to move
	 * @param oldFace - Face the photos come from, or undefined for the unassigned ones
	 */
	async function moveFilesToFace(faceName: string, fileIdsToMove: string[], oldFace?: string): Promise<unknown[]> {
		const semaphore = new Semaphore(5)

		const promises = fileIdsToMove
			.map(async (fileId) => {
				const file = useFilesStore().files[fileId]
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
					addFileIdsToFace(faceName, [fileId])
					if (oldFace) {
						removeFileIdsFromFace(oldFace, [fileId])
					} else {
						removeUnassignedFiles([fileId])
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
	}

	/**
	 * Take photos off a face, and put them back if the server refuses
	 *
	 * @param faceName - Face to remove from
	 * @param fileIdsToRemove - Photos to remove
	 */
	async function removeFilesFromFace(faceName: string, fileIdsToRemove: string[]): Promise<unknown[]> {
		const semaphore = new Semaphore(5)

		removeFileIdsFromFace(faceName, fileIdsToRemove)

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const file = useFilesStore().files[fileId]
				const fileBaseName = file.basename
				const recognizeFileName = getRecognizeFileName(findFaceDetection(file, faceName), fileBaseName)
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}/${recognizeFileName}`)
				} catch (error) {
					addFileIdsToFace(faceName, [fileId])

					logger.error(t('photos', 'Failed to remove {fileBaseName}', { fileBaseName }), { error })
					showError(t('photos', 'Failed to remove {fileBaseName}', { fileBaseName }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	}

	/**
	 * @param oldName - Name the face carries
	 * @param faceName - Name to give it
	 * @throws {Error} When the name is taken, or the server refuses the rename
	 */
	async function renameFace(oldName: string, faceName: string): Promise<void> {
		const face = faces.value[oldName]

		try {
			if (faces.value[faceName]) {
				throw new Error('Name already exists')
			}
			await davClient.moveFile(
				`/recognize/${getCurrentUser()?.uid}/faces/${oldName}`,
				`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
			)
			removeFaces([oldName])
			face.rename(faceName)
			addFaces([face])
		} catch (error) {
			logger.error(t('photos', 'Failed to rename {oldName} to {faceName}', { oldName, faceName }), { error })
			showError(t('photos', 'Failed to rename {oldName} to {faceName}', { oldName, faceName }))
			throw error
		}
	}

	/**
	 * @param faceName - Face to delete
	 */
	async function deleteFace(faceName: string): Promise<void> {
		try {
			await davClient.deleteFile(`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`)
			removeFaces([faceName])
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {faceName}', { faceName }), { error })
			showError(t('photos', 'Failed to delete {faceName}', { faceName }))
		}
	}

	return {
		faces,
		facesFiles,
		unassignedFiles,
		unassignedFilesCount,
		addFaces,
		removeFaces,
		addFileIdsToFace,
		removeFileIdsFromFace,
		addUnassignedFiles,
		removeUnassignedFiles,
		setUnassignedFilesCount,
		moveFilesToFace,
		removeFilesFromFace,
		renameFace,
		deleteFace,
	}
})
