/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { WebDAVClient } from 'webdav'
import type { Collection } from '../services/collectionFetcher.js'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { defineComponent, markRaw } from 'vue'
import {
	fetchCollection,
	fetchCollectionFiles,
} from '../services/collectionFetcher.js'
import logger from '../services/logger.js'
import { collectionFilesExtraProps } from '../store/collections.js'
import { useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'
import AbortControllerMixin from './AbortControllerMixin.js'

export default defineComponent({
	name: 'FetchCollectionContentMixin',

	data() {
		return {
			fetchSemaphore: markRaw(new SemaphoreWithPriority(1)),
			loadingCollection: false,
			loadingCollectionFiles: false,
			errorFetchingCollection: null as null | number | Error | unknown,
			errorFetchingCollectionFiles: null as null | number | Error | unknown,
		}
	},

	mixins: [AbortControllerMixin],

	methods: {
		async fetchCollection(collectionFileName: string, extraProps: string[], client?: WebDAVClient): Promise<Collection | null> {
			if (this.loadingCollection) {
				return null
			}

			try {
				this.loadingCollection = true
				this.errorFetchingCollection = null

				const collection = await fetchCollection(collectionFileName, { signal: this.abortController.signal }, extraProps, client)
				if (collection === null) {
					return null
				}

				useCollectionsStore().addCollections([collection])
				return collection
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollection = 404
					return null
				}

				this.errorFetchingCollection = error
				logger.error('[PublicCollectionContent] Error fetching collection', { error })
				showError(t('photos', 'Failed to fetch collection.'))
			} finally {
				this.loadingCollection = false
			}

			return null
		},

		async fetchCollectionFiles(collectionFileName: string, extraProps: string[] = [], client?: WebDAVClient): Promise<File[]> {
			if (this.loadingCollectionFiles) {
				return []
			}

			extraProps = [...extraProps, ...collectionFilesExtraProps]

			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingCollectionFiles = null
				this.loadingCollectionFiles = true

				const fetchedFiles = await fetchCollectionFiles(collectionFileName, { signal: this.abortController.signal }, extraProps, client)
				const fileIds = fetchedFiles.map((file) => String(file.fileid))

				useFilesStore().appendFiles(fetchedFiles)

				useCollectionsStore().setCollectionFiles(collectionFileName, fileIds)

				return fetchedFiles
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollectionFiles = 404
					return []
				}

				this.errorFetchingCollectionFiles = error

				showError(t('photos', 'Failed to fetch collections list.'))
				logger.error('[PublicCollectionContent] Error fetching collection files', { error })
			} finally {
				this.loadingCollectionFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},
	},
})
