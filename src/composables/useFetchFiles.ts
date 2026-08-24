/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { Ref } from 'vue'
import type { PhotoSearchOptions } from '../services/PhotoSearch.ts'

import { showError } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { join } from '@nextcloud/paths'
import { onUnmounted, ref } from 'vue'
import router from '../router/index.ts'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.ts'
import getPhotos from '../services/PhotoSearch.ts'
import store from '../store/index.ts'
import { getErrorResponse } from '../utils/errors.ts'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.ts'
import { useAbortController } from './useAbortController.ts'

/**
 * Number of photos requested per batch. A batch that comes back short means
 * there is nothing left to fetch.
 */
const NUMBER_OF_IMAGES_PER_BATCH = 200

/**
 * Fetch the photos of the timeline batch by batch and put them in the store.
 * The batches already fetched are dropped when the user navigates to another
 * path, so the next one starts over from the first photo.
 */
export function useFetchFiles(): {
	fetchFiles: (options?: Partial<PhotoSearchOptions>, filter?: (file: File) => boolean, force?: boolean) => Promise<number[]>
	resetFetchFilesState: () => void
	fetchedFileIds: Ref<number[]>
	loadingFiles: Ref<boolean>
	errorFetchingFiles: Ref<number | Error | undefined>
	doneFetchingFiles: Ref<boolean>
} {
	const fetchedFileIds = ref<number[]>([])
	const loadingFiles = ref(false)
	const errorFetchingFiles = ref<number | Error | undefined>()
	const doneFetchingFiles = ref(false)

	const fetchSemaphore = new SemaphoreWithPriority(1)
	const { abortSignal, abortPendingRequest } = useAbortController()

	/**
	 * @param options - Options to pass to getPhotos.
	 * @param filter - Function to filter out some files.
	 * @param force - Force fetching even if doneFetchingFiles is true
	 * @return The next batch of data depending on global offset.
	 */
	async function fetchFiles(options: Partial<PhotoSearchOptions> = {}, filter?: (file: File) => boolean, force: boolean = false): Promise<number[]> {
		if ((doneFetchingFiles.value && !force) || loadingFiles.value) {
			return []
		}

		const signal = abortSignal.value
		const fetchSemaphoreSymbol = await fetchSemaphore.acquire()

		try {
			loadingFiles.value = true
			errorFetchingFiles.value = undefined

			// Load next batch of images
			let fetchedFiles = await getPhotos({
				firstResult: fetchedFileIds.value.length,
				nbResults: NUMBER_OF_IMAGES_PER_BATCH,
				...options,
				signal,
			})

			// If we get less files than requested that means we got to the end
			if (fetchedFiles.length !== NUMBER_OF_IMAGES_PER_BATCH) {
				doneFetchingFiles.value = true
			}

			if (filter !== undefined) {
				fetchedFiles = fetchedFiles.filter(filter)
			}

			const fileIds = fetchedFiles
				.map((file) => file.fileid as number)
				.filter((fileId) => !fetchedFileIds.value.includes(fileId)) // Filter to prevent duplicate fileIds.

			fetchedFileIds.value.push(...fileIds)

			store.dispatch('appendFiles', fetchedFiles)

			logger.debug(`Fetched ${fileIds.length} new files: `, { fileIds })

			return fileIds
		} catch (error) {
			const response = getErrorResponse(error)
			if (response?.status === 404) {
				const sources = store.state.userConfig.photosSourceFolders
				for (const source of sources) {
					if (response.data?.match(`File with name /${source} could not be located`) === null) {
						continue
					}
					logger.debug(`The ${source} folder does not exist, creating it.`)
					try {
						await davClient.createDirectory(join(defaultRootPath, source))
						resetFetchFilesState()
						return []
					} catch (error) {
						errorFetchingFiles.value = 404
						logger.error('Fail to create source directory', { error })
					}
				}
			} else if (error instanceof DOMException && error.code === error.ABORT_ERR) {
				return []
			} else {
				errorFetchingFiles.value = error as Error
			}

			// cancelled request, moving on...
			showError(t('photos', 'Error fetching files'))
			logger.error(t('photos', 'Error fetching files'), { error })
		} finally {
			loadingFiles.value = false
			fetchSemaphore.release(fetchSemaphoreSymbol)
		}

		return []
	}

	/**
	 * Drop the photos fetched so far, so the next fetch starts over.
	 */
	function resetFetchFilesState(): void {
		abortPendingRequest()
		doneFetchingFiles.value = false
		errorFetchingFiles.value = undefined
		loadingFiles.value = false
		fetchedFileIds.value = []
	}

	const removeNavigationHook = router.afterEach((to, from) => {
		if (to.path !== from.path) {
			resetFetchFilesState()
		}
	})

	onUnmounted(removeNavigationHook)

	return {
		fetchFiles,
		resetFetchFilesState,
		fetchedFileIds,
		loadingFiles,
		errorFetchingFiles,
		doneFetchingFiles,
	}
}
