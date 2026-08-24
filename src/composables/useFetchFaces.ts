/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { ComputedRef, Ref } from 'vue'
import type { FileStat, ResponseDataDetailed } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import he from 'he'
import { computed, onBeforeMount, ref } from 'vue'
import { davClient } from '../services/DavClient.ts'
import { getPropFind } from '../services/DavRequest.ts'
import logger from '../services/logger.ts'
import store from '../store/index.ts'
import { getErrorResponse } from '../utils/errors.ts'
import { useAbortController } from './useAbortController.ts'

/**
 * DAV properties the recognize app exposes on the faces and their photos.
 */
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
 * Root of the recognize DAV endpoints of the current user.
 */
function recognizeRoot(): string {
	return `/recognize/${getCurrentUser()?.uid}`
}

/**
 * Turn the raw DAV answer of a face listing into nodes usable by the photo
 * tiles: the photos are addressed by their real path rather than by their path
 * inside the face, and their detections are parsed.
 *
 * @param results - Raw DAV listing
 */
function toPhotoNodes(results: FileStat[]): FaceNode[] {
	return results
		.map((file) => ({
			...file,
			filename: he.decode(file.props?.realpath as string).replace(`/${getCurrentUser()?.uid}/files`, `/files/${getCurrentUser()?.uid}`),
		}))
		.map((file) => {
			const node = resultToNode(file) as FaceNode
			// Set the parsed detections after resultToNode: it builds attributes
			// as `{ ...node, ...props }`, so assigning before would be overwritten
			// by the raw JSON string still held in props.
			node.attributes['face-detections'] = JSON.parse(he.decode(file.props?.['face-detections'] as string))
			return node
		})
}

/**
 * Fetch the faces recognized in the library and their photos, and put them in
 * the store. The face list is fetched on mount, unless the store already holds
 * it.
 */
export function useFetchFaces(): {
	faces: ComputedRef<Record<string, Collection>>
	fetchFaces: () => Promise<void>
	fetchFaceContent: (faceName: string, force?: boolean) => Promise<void>
	fetchUnassignedFaces: (force?: boolean) => Promise<void>
	fetchUnassignedFacesCount: () => Promise<void>
	loadingFaces: Ref<boolean>
	errorFetchingFaces: Ref<number | Error | undefined>
	loadingFiles: Ref<boolean>
	errorFetchingFiles: Ref<number | Error | undefined>
} {
	const loadingFaces = ref(false)
	const errorFetchingFaces = ref<number | Error | undefined>()
	const loadingFiles = ref(false)
	const errorFetchingFiles = ref<number | Error | undefined>()

	const { abortSignal } = useAbortController()

	const faces = computed(() => store.state.faces.faces)

	async function fetchFaces(): Promise<void> {
		if (loadingFaces.value || Object.keys(faces.value).length > 0) {
			return
		}

		try {
			loadingFaces.value = true
			errorFetchingFaces.value = undefined

			const { data: fetchedRawFaces } = await davClient.getDirectoryContents(`${recognizeRoot()}/faces/`, {
				data: getPropFind(recognizeDAVProps),
				details: true,
				signal: abortSignal.value,
			}) as ResponseDataDetailed<FileStat[]>

			const fetchedFace = fetchedRawFaces.map((file) => resultToNode(file, `${recognizeRoot()}/faces/`) as FaceNode)
			store.dispatch('addFaces', { faces: fetchedFace })
			logger.debug(`Fetched ${fetchedFace.length} new faces: `, { fetchedFace })
		} catch (error) {
			errorFetchingFaces.value = getErrorResponse(error)?.status === 404 ? 404 : error as Error
			logger.error('Failed to fetch faces list.', { error })
			showError(t('photos', 'Failed to fetch faces list.'))
		} finally {
			loadingFaces.value = false
		}
	}

	/**
	 * @param faceName - Name of the face to list the photos of
	 * @param force - Fetch again even if the face already has photos in the store
	 */
	async function fetchFaceContent(faceName: string, force: boolean = false): Promise<void> {
		if (loadingFiles.value) {
			return
		}

		if (!force && store.state.faces.facesFiles[faceName]?.length) {
			return
		}

		try {
			loadingFiles.value = true
			errorFetchingFiles.value = undefined

			const { data: fetchedRawFiles } = await davClient.getDirectoryContents(
				`${recognizeRoot()}/faces/${faceName}`,
				{
					data: getPropFind(recognizeDAVProps),
					details: true,
					signal: abortSignal.value,
				},
			) as ResponseDataDetailed<FileStat[]>

			const fetchedFiles = toPhotoNodes(fetchedRawFiles)
			const fileIds = fetchedFiles.map((file) => file.fileid?.toString() as string)

			store.dispatch('appendFiles', fetchedFiles)

			if (fetchedFiles.length > 0) {
				store.commit('addFilesToFace', { faceName, fileIdsToAdd: fileIds })
			}

			logger.debug(`Fetched ${fileIds.length} new files: `, { fileIds })
		} catch (error) {
			errorFetchingFaces.value = getErrorResponse(error)?.status === 404 ? 404 : error as Error

			// cancelled request, moving on...
			logger.error('Error fetching face files', { error })
		} finally {
			loadingFiles.value = false
		}
	}

	/**
	 * @param force - Fetch again even if the store already holds unassigned photos
	 */
	async function fetchUnassignedFaces(force: boolean = false): Promise<void> {
		if (loadingFiles.value) {
			return
		}

		if (!force && store.state.faces.unassignedFiles?.length) {
			return
		}

		try {
			loadingFiles.value = true
			errorFetchingFiles.value = undefined

			const { data: fetchedRawFiles } = await davClient.getDirectoryContents(
				`${recognizeRoot()}/unassigned-faces`,
				{
					data: getPropFind(recognizeDAVProps),
					details: true,
					signal: abortSignal.value,
				},
			) as ResponseDataDetailed<FileStat[]>

			const fetchedFiles = toPhotoNodes(fetchedRawFiles)
			const fileIds = [...new Set(fetchedFiles.map((file) => `${file.fileid}`))]

			store.dispatch('appendFiles', fetchedFiles)

			if (fetchedFiles.length > 0) {
				store.commit('addUnassignedFiles', { fileIdsToAdd: fileIds })
			}

			logger.debug(`Fetched ${fileIds.length} new unassigned files: `, { fileIds })
		} catch (error) {
			errorFetchingFaces.value = getErrorResponse(error)?.status === 404 ? 404 : error as Error

			// cancelled request, moving on...
			logger.error('Error fetching unassigned files', { error })
		} finally {
			loadingFiles.value = false
		}
	}

	async function fetchUnassignedFacesCount(): Promise<void> {
		try {
			const { data: unassignedFacesRoot } = await davClient.stat(
				`${recognizeRoot()}/unassigned-faces`,
				{
					data: getPropFind(recognizeDAVProps),
					details: true,
					signal: abortSignal.value,
				},
			) as ResponseDataDetailed<FileStat>

			const count = Number(unassignedFacesRoot.props?.nbItems)

			store.commit('setUnassignedFilesCount', count)

			logger.debug('Fetched unassigned files count: ', { count })
		} catch (error) {
			// cancelled request, moving on...
			logger.error('Error fetching unassigned files count', { error })
		}
	}

	onBeforeMount(fetchFaces)

	return {
		faces,
		fetchFaces,
		fetchFaceContent,
		fetchUnassignedFaces,
		fetchUnassignedFacesCount,
		loadingFaces,
		errorFetchingFaces,
		loadingFiles,
		errorFetchingFiles,
	}
}
