/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { Ref } from 'vue'
import type { WebDAVClient, WebDAVClientError } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { ref } from 'vue'
import {
	fetchCollectionFiles as fetchCollectionFilesRequest,
	fetchCollection as fetchCollectionRequest,
} from '../services/collectionFetcher.ts'
import { logger } from '../services/logger.ts'
import { collectionFilesExtraProps, useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import { SemaphoreWithPriority } from '../utils/semaphoreWithPriority.ts'
import { useAbortController } from './useAbortController.ts'

/**
 * Fetch one collection and the files it holds into the stores.
 */
export function useFetchCollectionContent(): {
	fetchCollection: (collectionFileName: string, extraProps: string[], client?: WebDAVClient) => Promise<Collection | null>
	fetchCollectionFiles: (collectionFileName: string, extraProps?: string[], client?: WebDAVClient) => Promise<File[]>
	loadingCollection: Ref<boolean>
	loadingCollectionFiles: Ref<boolean>
	errorFetchingCollection: Ref<null | number | Error>
	errorFetchingCollectionFiles: Ref<null | number | Error>
} {
	const collectionsStore = useCollectionsStore()
	const filesStore = useFilesStore()
	const { abortSignal } = useAbortController()

	const fetchSemaphore = new SemaphoreWithPriority(1)
	const loadingCollection = ref(false)
	const loadingCollectionFiles = ref(false)
	const errorFetchingCollection = ref<null | number | Error>(null)
	const errorFetchingCollectionFiles = ref<null | number | Error>(null)

	/**
	 * @param collectionFileName - Path of the collection under its root
	 * @param extraProps - Dav properties to fetch on top of the default ones
	 * @param client - Dav client to use, the public one for shares
	 */
	async function fetchCollection(collectionFileName: string, extraProps: string[], client?: WebDAVClient): Promise<Collection | null> {
		if (loadingCollection.value) {
			return null
		}

		try {
			loadingCollection.value = true
			errorFetchingCollection.value = null

			const collection = await fetchCollectionRequest(collectionFileName, { signal: abortSignal.value }, extraProps, client)
			if (collection === null) {
				return null
			}

			collectionsStore.addCollections([collection])
			return collection
		} catch (error) {
			if ((error as WebDAVClientError).response?.status === 404) {
				errorFetchingCollection.value = 404
				return null
			}

			errorFetchingCollection.value = error as Error
			logger.error('[useFetchCollectionContent] Error fetching collection', { error })
			showError(t('photos', 'Failed to fetch collection.'))
		} finally {
			loadingCollection.value = false
		}

		return null
	}

	/**
	 * @param collectionFileName - Path of the collection under its root
	 * @param extraProps - Dav properties to fetch on top of the default ones
	 * @param client - Dav client to use, the public one for shares
	 */
	async function fetchCollectionFiles(collectionFileName: string, extraProps: string[] = [], client?: WebDAVClient): Promise<File[]> {
		if (loadingCollectionFiles.value) {
			return []
		}

		extraProps = [...extraProps, ...collectionFilesExtraProps]

		const fetchSemaphoreSymbol = await fetchSemaphore.acquire()

		try {
			errorFetchingCollectionFiles.value = null
			loadingCollectionFiles.value = true

			const fetchedFiles = await fetchCollectionFilesRequest(collectionFileName, { signal: abortSignal.value }, extraProps, client)
			const fileIds = fetchedFiles.map((file) => String(file.fileid))

			filesStore.appendFiles(fetchedFiles)
			collectionsStore.setCollectionFiles(collectionFileName, fileIds)

			return fetchedFiles
		} catch (error) {
			if ((error as WebDAVClientError).response?.status === 404) {
				errorFetchingCollectionFiles.value = 404
				return []
			}

			errorFetchingCollectionFiles.value = error as Error

			showError(t('photos', 'Failed to fetch collections list.'))
			logger.error('[useFetchCollectionContent] Error fetching collection files', { error })
		} finally {
			loadingCollectionFiles.value = false
			fetchSemaphore.release(fetchSemaphoreSymbol)
		}

		return []
	}

	return {
		fetchCollection,
		fetchCollectionFiles,
		loadingCollection,
		loadingCollectionFiles,
		errorFetchingCollection,
		errorFetchingCollectionFiles,
	}
}
