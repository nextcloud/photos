/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Ref } from 'vue'
import type { WebDAVClient, WebDAVClientError } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { ref } from 'vue'
import { fetchCollections as fetchCollectionsRequest } from '../services/collectionFetcher.ts'
import { davClient } from '../services/DavClient.ts'
import { logger } from '../services/logger.ts'
import { useCollectionsStore } from '../store/collections.ts'
import { useAbortController } from './useAbortController.ts'

/**
 * Fetch the collections of a root, like albums or places, into the store.
 */
export function useFetchCollections(): {
	fetchCollections: (collectionHome: string, extraProps?: string[], client?: WebDAVClient) => Promise<Collection[]>
	errorFetchingCollections: Ref<null | number | Error>
	loadingCollections: Ref<boolean>
} {
	const collectionsStore = useCollectionsStore()
	const { abortSignal } = useAbortController()

	const errorFetchingCollections = ref<null | number | Error>(null)
	const loadingCollections = ref(false)

	/**
	 * @param collectionHome - Root the collections live under
	 * @param extraProps - Dav properties to fetch on top of the default ones
	 * @param client - Dav client to use, the public one for shares
	 */
	async function fetchCollections(collectionHome: string, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection[]> {
		if (loadingCollections.value) {
			return []
		}

		try {
			loadingCollections.value = true
			errorFetchingCollections.value = null

			const collections = await fetchCollectionsRequest(collectionHome, { signal: abortSignal.value }, extraProps, client)

			collectionsStore.addCollections(collections)

			return collections
		} catch (error) {
			if ((error as WebDAVClientError).response?.status === 404) {
				errorFetchingCollections.value = 404
			} else {
				errorFetchingCollections.value = error as Error
			}
			logger.error('Error fetching collections:', { error })
		} finally {
			loadingCollections.value = false
		}

		return []
	}

	return {
		fetchCollections,
		errorFetchingCollections,
		loadingCollections,
	}
}
