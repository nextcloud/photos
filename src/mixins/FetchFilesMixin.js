/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { davGetClient, davRootPath } from '@nextcloud/files'
import { joinPaths } from '@nextcloud/paths'
import logger from '../services/logger.js'
import getPhotos from '../services/PhotoSearch.js'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'
import AbortControllerMixin from './AbortControllerMixin.js'
import store from '../store/index.js'

export default {
	name: 'FetchFilesMixin',

	mixins: [
		AbortControllerMixin,
	],

	data() {
		return {
			errorFetchingFiles: null,
			loadingFiles: false,
			doneFetchingFiles: false,
			fetchSemaphore: new SemaphoreWithPriority(1),
			fetchedFileIds: [],
		}
	},

	watch: {
		'$route.path'() {
			this.resetFetchFilesState()
		},
	},

	methods: {
		/**
		 * @param {object} options - Options to pass to getPhotos.
		 * @param {string[]} [blacklist=[]] - Array of ids to filter out.
		 * @param {boolean} [force=false] - Force fetching even if doneFetchingFiles is true
		 * @return {Promise<string[]>} - The next batch of data depending on global offset.
		 */
		async fetchFiles(options = {}, blacklist = [], force = false) {
			if ((this.doneFetchingFiles && !force) || this.loadingFiles) {
				return []
			}

			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true

				const numberOfImagesPerBatch = 200

				// Load next batch of images
				const fetchedFiles = await getPhotos({
					firstResult: this.fetchedFileIds.length,
					nbResults: numberOfImagesPerBatch,
					...options,
					signal: this.abortController.signal,
				})

				// If we get less files than requested that means we got to the end
				if (fetchedFiles.length !== numberOfImagesPerBatch) {
					this.doneFetchingFiles = true
				}

				const fileIds = fetchedFiles
					.map(file => file.fileid)
					.filter(fileId => !this.fetchedFileIds.includes(fileId.toString())) // Filter to prevent duplicate fileIds.

				this.fetchedFileIds.push(
					...fileIds
						.map((fileId) => fileId.toString())
						.filter((fileId) => !blacklist.includes(fileId))
				)

				this.$store.dispatch('appendFiles', fetchedFiles)

				logger.debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, fileIds)

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
							await davGetClient().createDirectory(joinPaths(davRootPath, source))
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
				logger.error('Error fetching files', { error })
			} finally {
				this.loadingFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},

		resetFetchFilesState() {
			this.doneFetchingFiles = false
			this.errorFetchingFiles = null
			this.loadingFiles = false
			this.fetchedFileIds = []
		},
	},
}
