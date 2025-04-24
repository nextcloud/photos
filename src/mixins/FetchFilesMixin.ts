/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent } from 'vue'
import { isAxiosError } from 'axios'

import { showError } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { joinPaths } from '@nextcloud/paths'
import { translate as t } from '@nextcloud/l10n'

import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import getPhotos, { type PhotoSearchOptions } from '../services/PhotoSearch.js'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'
import AbortControllerMixin from './AbortControllerMixin.js'
import store from '../store/index.js'

export default defineComponent({
	name: 'FetchFilesMixin',

	mixins: [
		AbortControllerMixin,
	],

	data() {
		return {
			errorFetchingFiles: null as null|number|Error|unknown,
			loadingFiles: false,
			doneFetchingFiles: false,
			fetchSemaphore: new SemaphoreWithPriority(1),
			fetchedFileIds: [] as number[],
		}
	},

	watch: {
		'$route.path'() {
			this.resetFetchFilesState()
		},
	},

	methods: {
		/**
		 * @param options - Options to pass to getPhotos.
		 * @param blacklist - Array of ids to filter out.
		 * @param force - Force fetching even if doneFetchingFiles is true
		 * @return The next batch of data depending on global offset.
		 */
		async fetchFiles(options: Partial<PhotoSearchOptions> = {}, blacklist: number[] = [], force: boolean = false): Promise<number[]> {
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
					.map(file => file.fileid as number)
					.filter(fileId => !this.fetchedFileIds.includes(fileId)) // Filter to prevent duplicate fileIds.

				this.fetchedFileIds.push(
					...fileIds.filter((fileId) => !blacklist.includes(fileId)),
				)

				this.$store.dispatch('appendFiles', fetchedFiles)

				logger.debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, { fileIds })

				return fileIds
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 404) {
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
			this.doneFetchingFiles = false
			this.errorFetchingFiles = null
			this.loadingFiles = false
			this.fetchedFileIds = []
		},
	},
})
