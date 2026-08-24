/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { Ref } from 'vue'
import type { WebDAVClient } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { ref } from 'vue'
import {
	fetchCollectionFiles as fetchCollectionFilesFromDav,
	fetchCollection as fetchCollectionFromDav,
} from '../services/collectionFetcher.ts'
import logger from '../services/logger.ts'
import { collectionFilesExtraProps } from '../store/collections.ts'
import store from '../store/index.ts'
import { getErrorResponse } from '../utils/errors.ts'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.ts'
import { useAbortController } from './useAbortController.ts'

/**
 * Fetch a single collection - an album, a shared album or a place - and its
 * files, and put them in the store.
 */
export function useFetchCollectionContent(): {
	fetchCollection: (collectionFileName: string, extraProps?: string[], client?: WebDAVClient) => Promise<Collection | null>
	fetchCollectionFiles: (collectionFileName: string, extraProps?: string[], client?: WebDAVClient) => Promise<File[]>
	loadingCollection: Ref<boolean>
	loadingCollectionFiles: Ref<boolean>
	errorFetchingCollection: Ref<number | Error | undefined>
	errorFetchingCollectionFiles: Ref<number | Error | undefined>
} {
	const loadingCollection = ref(false)
	const loadingCollectionFiles = ref(false)
	const errorFetchingCollection = ref<number | Error | undefined>()
	const errorFetchingCollectionFiles = ref<number | Error | undefined>()

	const fetchSemaphore = new SemaphoreWithPriority(1)
	const { abortSignal } = useAbortController()

	/**
	 * @param collectionFileName - Path of the collection to fetch
	 * @param extraProps - DAV properties to request on top of the default ones
	 * @param client - WebDAV client to fetch with, the user one by default
	 */
	async function fetchCollection(collectionFileName: string, extraProps: string[] = [], client?: WebDAVClient): Promise<Collection | null> {
		if (loadingCollection.value) {
			return null
		}

		try {
			loadingCollection.value = true
			errorFetchingCollection.value = undefined

			const collection = await fetchCollectionFromDav(collectionFileName, { signal: abortSignal.value }, extraProps, client)
			store.dispatch('addCollections', { collections: [collection] })
			return collection
		} catch (error) {
			if (getErrorResponse(error)?.status === 404) {
				errorFetchingCollection.value = 404
				return null
			}

			errorFetchingCollection.value = error as Error
			logger.error('Error fetching collection', { error })
			showError(t('photos', 'Failed to fetch collection.'))
		} finally {
			loadingCollection.value = false
		}

		return null
	}

	/**
	 * @param collectionFileName - Path of the collection to list
	 * @param extraProps - DAV properties to request on top of the default ones
	 * @param client - WebDAV client to fetch with, the user one by default
	 */
	async function fetchCollectionFiles(collectionFileName: string, extraProps: string[] = [], client?: WebDAVClient): Promise<File[]> {
		if (loadingCollectionFiles.value) {
			return []
		}

		const fetchSemaphoreSymbol = await fetchSemaphore.acquire()

		try {
			loadingCollectionFiles.value = true
			errorFetchingCollectionFiles.value = undefined

			const fetchedFiles = await fetchCollectionFilesFromDav(
				collectionFileName,
				{ signal: abortSignal.value },
				[...extraProps, ...collectionFilesExtraProps],
				client,
			)
			const fileIds = fetchedFiles.map((file) => file.fileid?.toString())

			store.dispatch('appendFiles', fetchedFiles)
			store.commit('setCollectionFiles', { collectionFileName, fileIds })

			return fetchedFiles
		} catch (error) {
			if (getErrorResponse(error)?.status === 404) {
				errorFetchingCollectionFiles.value = 404
				return []
			}

			errorFetchingCollectionFiles.value = error as Error
			logger.error('Error fetching collection files', { error })
			showError(t('photos', 'Failed to fetch collections list.'))
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
