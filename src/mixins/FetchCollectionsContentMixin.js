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

import { mapActions } from 'vuex'

import { showError } from '@nextcloud/dialogs'

import AbortControllerMixin from './AbortControllerMixin.js'
import { fetchCollection, fetchCollectionFiles } from '../services/collectionFetcher.js'
import logger from '../services/logger.js'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'

export default {
	name: 'FetchCollectionsContentMixin',

	data() {
		return {
			semaphore: new SemaphoreWithPriority(30),
			fetchSemaphore: new SemaphoreWithPriority(1),
			semaphoreSymbol: null,
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

		async fetchCollection(collectionFileName) {
			if (this.loadingCollection) {
				return
			}

			try {
				this.loadingCollection = true
				this.errorFetchingCollection = null

				const collection = await fetchCollection(collectionFileName, { signal: this.abortController.signal })
				this.addCollections({ collections: [collection] })
				return collection
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollection = 404
					return
				}

				this.errorFetchingCollection = error
				logger.error('[PublicLocationContent] Error fetching location', { error })
				showError(this.t('photos', 'Failed to fetch location.'))
			} finally {
				this.loadingCollection = false
			}
		},

		async fetchCollectionFiles(collectionFileName) {
			if (this.loadingCollectionFiles) {
				return []
			}

			const semaphoreSymbol = await this.semaphore.acquire(() => 0, 'fetchFiles')
			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingCollectionFiles = null
				this.loadingCollectionFiles = true
				this.semaphoreSymbol = semaphoreSymbol

				const fetchedFiles = await fetchCollectionFiles(collectionFileName, { signal: this.abortController.signal })
				const fileIds = fetchedFiles.map(file => file.fileid.toString())

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

				showError(this.t('photos', 'Failed to fetch locations list.'))
				logger.error('[PublicLocationContent] Error fetching location files', { error })
			} finally {
				this.loadingCollectionFiles = false
				this.semaphore.release(semaphoreSymbol)
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},
	},
}
