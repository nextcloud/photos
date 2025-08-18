/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WebDAVClient } from 'webdav'

import { ref } from 'vue'
import {
	type Collection,

	fetchCollections,
} from '../services/collectionFetcher.js'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import store from '../store/index.ts'
import useAbortController from './useAbortController.ts'

export default function() {
	const errorFetchingCollections = ref(null as null | number | Error | unknown)
	const loadingCollections = ref(false)
	const { abortSignal } = useAbortController()

	/**
	 *
	 * @param collectionHome
	 * @param extraProps
	 * @param client
	 */
	async function _fetchCollections(collectionHome: string, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection[]> {
		if (loadingCollections.value) {
			return []
		}

		try {
			loadingCollections.value = true
			errorFetchingCollections.value = null

			const collections = await fetchCollections(collectionHome, { signal: abortSignal.value }, extraProps, client)

			store.dispatch('addCollections', { collections })

			return collections
		} catch (error) {
			if (error.response?.status === 404) {
				errorFetchingCollections.value = 404
			} else {
				errorFetchingCollections.value = error
			}
			logger.error('Error fetching collections:', { error })
		} finally {
			loadingCollections.value = false
		}

		return []
	}

	return { fetchCollections: _fetchCollections, errorFetchingCollections, loadingCollections }
}
