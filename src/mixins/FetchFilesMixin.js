/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { showError } from '@nextcloud/dialogs'
import { davRootPath } from '@nextcloud/files'
import { joinPaths } from '@nextcloud/paths'

import { davClient } from '../services/DavClient.ts'
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
						.filter((fileId) => !blacklist.includes(fileId)),
				)

				this.$store.dispatch('appendFiles', fetchedFiles)

				logger.debug(`[FetchFilesMixin] Fetched ${fileIds.length} new files: `, fileIds)

				return fileIds
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFiles = 404
					const source = joinPaths(davRootPath, store.state.userConfig.photosSourceFolder ?? '/Photos') + '/'
					logger.debug('Photo source does not exist, creating it.')
					try {
						await davClient.createDirectory(source)
					} catch (error) {
						logger.error('Fail to create source directory', { error })
					}
				} else if (error.code === 'ERR_CANCELED') {
					return []
				} else {
					this.errorFetchingFiles = error
				}

				// cancelled request, moving on...
				showError(t('photos', 'Error fetching files'))
				logger.error(error)
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
