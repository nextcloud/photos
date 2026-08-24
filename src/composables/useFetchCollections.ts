/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Ref } from 'vue'
import type { WebDAVClient } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { ref } from 'vue'
import { fetchCollections as fetchCollectionsFromDav } from '../services/collectionFetcher.ts'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.ts'
import store from '../store/index.ts'
import { getErrorResponse } from '../utils/errors.ts'
import { useAbortController } from './useAbortController.ts'

/**
 * Fetch the collections of a home - albums, shared albums or places - and put
 * them in the store.
 */
export function useFetchCollections(): {
	fetchCollections: (collectionHome: string, extraProps?: string[], client?: WebDAVClient) => Promise<Collection[]>
	errorFetchingCollections: Ref<number | Error | undefined>
	loadingCollections: Ref<boolean>
} {
	const errorFetchingCollections = ref<number | Error | undefined>()
	const loadingCollections = ref(false)
	const { abortSignal } = useAbortController()

	/**
	 * @param collectionHome - Path of the collection home to list
	 * @param extraProps - DAV properties to request on top of the default ones
	 * @param client - WebDAV client to fetch with, the user one by default
	 */
	async function fetchCollections(collectionHome: string, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection[]> {
		if (loadingCollections.value) {
			return []
		}

		try {
			loadingCollections.value = true
			errorFetchingCollections.value = undefined

			const collections = await fetchCollectionsFromDav(collectionHome, { signal: abortSignal.value }, extraProps, client)

			store.dispatch('addCollections', { collections })

			return collections
		} catch (error) {
			errorFetchingCollections.value = getErrorResponse(error)?.status === 404 ? 404 : error as Error
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
