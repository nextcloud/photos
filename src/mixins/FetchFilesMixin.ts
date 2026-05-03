/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'

import { showError } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { joinPaths } from '@nextcloud/paths'
import { defineComponent, markRaw } from 'vue'
import { davClient } from '../services/DavClient.ts'
import { getIndexedPhotos, getIndexedSearchPhotos, resetIndexedCursor } from '../services/IndexedTimelineSearch.ts'
import logger from '../services/logger.js'
import getPhotos, { type PhotoSearchOptions } from '../services/PhotoSearch.js'
import store from '../store/index.js'
import indexStatusStore from '../store/indexStatus.ts'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'
import AbortControllerMixin from './AbortControllerMixin.js'

export default defineComponent({
	name: 'FetchFilesMixin',

	mixins: [AbortControllerMixin],

	data() {
		return {
			errorFetchingFiles: null as null | number | Error | unknown,
			loadingFiles: false,
			doneFetchingFiles: false,
			// markRaw: SemaphoreWithPriority uses private class fields that
			// throw "Cannot access invalid private field" under Vue 3's
			// reactive Proxy.
			fetchSemaphore: markRaw(new SemaphoreWithPriority(1)),
			fetchedFileIds: [] as number[],
		}
	},

	watch: {
		'$route.path': function() {
			this.resetFetchFilesState()
		},
	},

	methods: {
		/**
		 * @param options - Options to pass to getPhotos.
		 * @param filter - Function to filter out some files.
		 * @param force - Force fetching even if doneFetchingFiles is true
		 * @return The next batch of data depending on global offset.
		 */
		async fetchFiles(options: Partial<PhotoSearchOptions> = {}, filter?: (file: File) => boolean, force: boolean = false): Promise<number[]> {
			if ((this.doneFetchingFiles && !force) || this.loadingFiles) {
				return []
			}

			const signal = this.abortController.signal
			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true

				const numberOfImagesPerBatch = 200

				// Three-way routing for the data path:
				//   1. Search active + index ready → /api/v1/index/search
				//      (bypasses DAV SEARCH entirely; works on instances
				//      where DAV SEARCH is broken — e.g. NC34 dev builds
				//      with strict lazy-AppConfig validation throwing in
				//      `getKnownMetadata()`).
				//   2. No search + index ready + no exotic filters →
				//      /api/v1/index/timeline.
				//   3. Anything else → legacy DAV REPORT.
				// Indexed paths are best-effort: any HTTP failure falls
				// back to DAV silently.
				const indexStatus = indexStatusStore()
				const searchQuery = (options.searchQuery ?? '').trim()
				const indexReady = indexStatus.ready === true
				const noExoticFilters = options.onThisDay !== true
					&& options.onlyFavorites !== true
					&& (options.extraFilters ?? '') === ''

				let fetchedFiles: File[] | null = null

				if (searchQuery !== '' && indexReady) {
					try {
						fetchedFiles = await getIndexedSearchPhotos(searchQuery, {
							firstResult: this.fetchedFileIds.length,
							nbResults: numberOfImagesPerBatch,
							...options,
							signal,
						})
					} catch (e) {
						logger.warn('[FetchFilesMixin] Indexed search failed; falling back to DAV', { error: e })
						fetchedFiles = null
					}
				} else if (searchQuery === '' && indexReady && noExoticFilters) {
					try {
						fetchedFiles = await getIndexedPhotos({
							firstResult: this.fetchedFileIds.length,
							nbResults: numberOfImagesPerBatch,
							...options,
							signal,
						})
					} catch (e) {
						logger.warn('[FetchFilesMixin] Indexed timeline failed; falling back to DAV', { error: e })
						fetchedFiles = null
					}
				}

				if (fetchedFiles === null) {
					fetchedFiles = await getPhotos({
						firstResult: this.fetchedFileIds.length,
						nbResults: numberOfImagesPerBatch,
						...options,
						signal,
					})
				}

				// If we get less files than requested that means we got to the end
				if (fetchedFiles.length !== numberOfImagesPerBatch) {
					this.doneFetchingFiles = true
				}

				if (filter !== undefined) {
					fetchedFiles = fetchedFiles.filter(filter)
				}

				const fileIds = fetchedFiles
					.map((file) => file.fileid as number)
					.filter((fileId) => !this.fetchedFileIds.includes(fileId)) // Filter to prevent duplicate fileIds.

				this.fetchedFileIds.push(...fileIds)

				this.$store.dispatch('appendFiles', fetchedFiles)

				logger.debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, { fileIds })

				return fileIds
			} catch (error) {
				if (error.response?.status === 404) {
					const sources = store.state.userConfig.photosSourceFolders
					for (const source of sources) {
						if (error.response?.data?.match(`File with name /${source} could not be located`) === null) {
							continue
						}
						logger.debug(`The ${source} folder does not exist, creating it.`)
						try {
							await davClient.createDirectory(joinPaths(defaultRootPath, source))
							this.resetFetchFilesState()
							return []
						} catch (error) {
							this.errorFetchingFiles = 404
							logger.error('Fail to create source directory', { error })
						}
					}
				} else if (error instanceof DOMException && error.code === error.ABORT_ERR) {
					return []
				} else {
					this.errorFetchingFiles = error
				}

				// cancelled request, moving on...
				showError(t('photos', 'Error fetching files'))
				logger.error(t('photos', 'Error fetching files'), { error })
			} finally {
				this.loadingFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},

		resetFetchFilesState() {
			this.abortPendingRequest()
			this.doneFetchingFiles = false
			this.errorFetchingFiles = null
			this.loadingFiles = false
			this.fetchedFileIds = []
			// Drop the indexed cursor so the next fetch starts at the
			// most recent photo again (mirrors how the DAV path resets
			// its `firstResult` offset to 0).
			resetIndexedCursor()
		},
	},
})
