/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { Ref } from 'vue'
import type { FileStat, ResponseDataDetailed, WebDAVClientError } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import he from 'he'
import { onBeforeMount, ref } from 'vue'
import { davClient } from '../services/DavClient.ts'
import { getPropFind } from '../services/DavRequest.ts'
import { logger } from '../services/logger.ts'
import { useFacesStore } from '../store/faces.ts'
import { useFilesStore } from '../store/files.ts'
import { useAbortController } from './useAbortController.ts'

const recognizeDAVProps = [
	'<nc:face-detections/>',
	'<nc:face-preview-image/>',
	'<nc:realpath/>',
	'<nc:nbItems/>',
]

type FaceNode = File & {
	attributes: {
		'face-detections': string
		'face-preview-image': string
		realpath: string
	}
}

/**
 * Turn the dav listing of a face into nodes of the photos it shows.
 *
 * @param fetchedRawFiles - Entries of the listing
 */
function toFaceNodes(fetchedRawFiles: FileStat[]): FaceNode[] {
	return fetchedRawFiles
		.map((file) => ({
			...file,
			filename: he.decode(file.props?.realpath).replace(`/${getCurrentUser()?.uid}/files`, `/files/${getCurrentUser()?.uid}`),
		}))
		.map((file) => {
			const node = resultToNode(file) as FaceNode
			// Set the parsed detections after resultToNode: it builds attributes
			// as `{ ...node, ...props }`, so assigning before would be overwritten
			// by the raw JSON string still held in props.
			node.attributes['face-detections'] = JSON.parse(he.decode(file.props?.['face-detections']))
			return node
		})
}

/**
 * Fetch the faces recognize found and the photos they appear on into the stores.
 * The list of faces is fetched as soon as the component mounts.
 */
export function useFetchFaces(): {
	fetchFaces: () => Promise<void>
	fetchFaceContent: (faceName: string, force?: boolean) => Promise<void>
	fetchUnassignedFaces: (force?: boolean) => Promise<void>
	fetchUnassignedFacesCount: () => Promise<void>
	loadingFaces: Ref<boolean>
	loadingFiles: Ref<boolean>
	errorFetchingFaces: Ref<null | number | Error>
	errorFetchingFiles: Ref<null | number | Error>
} {
	const facesStore = useFacesStore()
	const filesStore = useFilesStore()
	const { abortSignal } = useAbortController()

	const loadingFaces = ref(false)
	const loadingFiles = ref(false)
	const errorFetchingFaces = ref<null | number | Error>(null)
	const errorFetchingFiles = ref<null | number | Error>(null)

	const facesRoot = `/recognize/${getCurrentUser()?.uid}/faces/`
	const unassignedFacesRoot = `/recognize/${getCurrentUser()?.uid}/unassigned-faces`

	async function fetchFaces(): Promise<void> {
		if (loadingFaces.value) {
			return
		}

		if (Object.keys(facesStore.faces).length) {
			return
		}

		try {
			loadingFaces.value = true
			errorFetchingFaces.value = null

			const { data: fetchedRawFaces } = await davClient.getDirectoryContents(facesRoot, {
				data: getPropFind(recognizeDAVProps),
				details: true,
				signal: abortSignal.value,
			}) as ResponseDataDetailed<FileStat[]>

			const fetchedFaces = fetchedRawFaces.map((file) => resultToNode(file, facesRoot) as unknown as Collection)
			facesStore.addFaces(fetchedFaces)
			logger.debug(`[useFetchFaces] Fetched ${fetchedFaces.length} new faces: `, { fetchedFaces })
		} catch (error) {
			if ((error as WebDAVClientError).response?.status === 404) {
				errorFetchingFaces.value = 404
			} else {
				errorFetchingFaces.value = error as Error
			}
			logger.error(t('photos', 'Failed to fetch faces list.'), { error })
			showError(t('photos', 'Failed to fetch faces list.'))
		} finally {
			loadingFaces.value = false
		}
	}

	/**
	 * @param faceName - Face to fetch the photos of
	 * @param force - Fetch again even when they are already in the store
	 */
	async function fetchFaceContent(faceName: string, force: boolean = false): Promise<void> {
		if (loadingFiles.value) {
			return
		}

		const facesFiles = facesStore.facesFiles
		if (!force && facesFiles[faceName] && facesFiles[faceName].length) {
			return
		}

		try {
			errorFetchingFiles.value = null
			loadingFiles.value = true

			const { data: fetchedRawFiles } = await davClient.getDirectoryContents(`${facesRoot}${faceName}`, {
				data: getPropFind(recognizeDAVProps),
				details: true,
				signal: abortSignal.value,
			}) as ResponseDataDetailed<FileStat[]>

			const fetchedFiles = toFaceNodes(fetchedRawFiles)
			const fileIds = fetchedFiles.map((file) => file.fileid?.toString() as string)

			filesStore.appendFiles(fetchedFiles)

			if (fetchedFiles.length > 0) {
				facesStore.addFileIdsToFace(faceName, fileIds)
			}

			logger.debug(`[useFetchFaces] Fetched ${fileIds.length} new files: `, { fileIds })
		} catch (error) {
			if ((error as WebDAVClientError).response?.status === 404) {
				errorFetchingFaces.value = 404
			} else {
				errorFetchingFaces.value = error as Error
			}

			logger.error('Error fetching face files', { error })
		} finally {
			loadingFiles.value = false
		}
	}

	/**
	 * @param force - Fetch again even when they are already in the store
	 */
	async function fetchUnassignedFaces(force: boolean = false): Promise<void> {
		if (loadingFiles.value) {
			return
		}

		if (!force && facesStore.unassignedFiles.length) {
			return
		}

		try {
			errorFetchingFiles.value = null
			loadingFiles.value = true

			const { data: fetchedRawFiles } = await davClient.getDirectoryContents(unassignedFacesRoot, {
				data: getPropFind(recognizeDAVProps),
				details: true,
				signal: abortSignal.value,
			}) as ResponseDataDetailed<FileStat[]>

			const fetchedFiles = toFaceNodes(fetchedRawFiles)
			const fileIds = [...new Set(fetchedFiles.map((file) => '' + file.fileid))]
			filesStore.appendFiles(fetchedFiles)

			if (fetchedFiles.length > 0) {
				facesStore.addUnassignedFiles(fileIds)
			}

			logger.debug(`[useFetchFaces] Fetched ${fileIds.length} new unassigned files: `, { fileIds })
		} catch (error) {
			if ((error as WebDAVClientError).response?.status === 404) {
				errorFetchingFaces.value = 404
			} else {
				errorFetchingFaces.value = error as Error
			}

			logger.error('Error fetching unassigned files', { error })
		} finally {
			loadingFiles.value = false
		}
	}

	async function fetchUnassignedFacesCount(): Promise<void> {
		try {
			const { data: unassignedFacesFolder } = await davClient.stat(unassignedFacesRoot, {
				data: getPropFind(recognizeDAVProps),
				details: true,
				signal: abortSignal.value,
			}) as ResponseDataDetailed<FileStat>

			const count = Number(unassignedFacesFolder.props?.nbItems)

			facesStore.setUnassignedFilesCount(count)

			logger.debug('[useFetchFaces] Fetched unassigned files count: ', { count })
		} catch (error) {
			logger.error('Error fetching unassigned files count', { error })
		}
	}

	onBeforeMount(fetchFaces)

	return {
		fetchFaces,
		fetchFaceContent,
		fetchUnassignedFaces,
		fetchUnassignedFacesCount,
		loadingFaces,
		loadingFiles,
		errorFetchingFaces,
		errorFetchingFiles,
	}
}
