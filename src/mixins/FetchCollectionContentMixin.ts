/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mapActions } from 'vuex'
import type { WebDAVClient } from 'webdav'

import { showError } from '@nextcloud/dialogs'

import AbortControllerMixin from './AbortControllerMixin.js'
import { fetchCollection, fetchCollectionFiles, type Collection } from '../services/collectionFetcher.js'
import logger from '../services/logger.js'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'
import type { PhotoNode } from '../utils/fileUtils.js'

export default {
	name: 'FetchCollectionContentMixin',

	data() {
		return {
			fetchSemaphore: new SemaphoreWithPriority(1),
			loadingCollection: false,
			loadingCollectionFiles: false,
			errorFetchingCollection: null,
			errorFetchingCollectionFiles: null,
		}
	},

	mixins: [
		AbortControllerMixin,
	],

	methods: {
		...mapActions([
			'appendFiles',
			'addCollections',
			'setCollectionFiles',
		]),
		async fetchCollection(collectionFileName: string, extraProps: string[], client: WebDAVClient): Promise<Collection|null> {
			if (this.loadingCollection) {
				return null
			}

			try {
				this.loadingCollection = true
				this.errorFetchingCollection = null

				const collection = await fetchCollection(collectionFileName, { signal: this.abortController.signal }, extraProps, client)
				this.addCollections({ collections: [collection] })
				return collection
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollection = 404
					return null
				}

				this.errorFetchingCollection = error
				logger.error('[PublicCollectionContent] Error fetching collection', { error })
				showError(this.t('photos', 'Failed to fetch collection.'))
			} finally {
				this.loadingCollection = false
			}

			return null
		},

		async fetchCollectionFiles(collectionFileName: string, extraProps: string[], client: WebDAVClient, mappers: ((nodes: PhotoNode) => PhotoNode)[] = []): Promise<PhotoNode[]> {
			if (this.loadingCollectionFiles) {
				return []
			}

			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingCollectionFiles = null
				this.loadingCollectionFiles = true

				let fetchedFiles = await fetchCollectionFiles(collectionFileName, { signal: this.abortController.signal }, extraProps, client)
				const fileIds = fetchedFiles.map(file => file.fileid.toString())

				mappers.forEach(mapper => (fetchedFiles = fetchedFiles.map(mapper)))

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('setCollectionFiles', { collectionFileName, fileIds })
				}

				return fetchedFiles
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollectionFiles = 404
					return []
				}

				this.errorFetchingCollectionFiles = error

				showError(this.t('photos', 'Failed to fetch collections list.'))
				logger.error('[PublicCollectionContent] Error fetching collection files', { error })
			} finally {
				this.loadingCollectionFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},
	},
}
