/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mapActions } from 'vuex'

import AbortControllerMixin from './AbortControllerMixin.js'
import { fetchCollections } from '../services/collectionFetcher.js'
import logger from '../services/logger.js'

export default {
	name: 'FetchCollectionsMixin',

	data() {
		return {
			errorFetchingCollections: null,
			loadingCollections: false,
		}
	},

	mixins: [
		AbortControllerMixin,
	],

	methods: {
		...mapActions([
			'addCollections',
		]),

		/**
		 * @param {string} collectionHome
		 * @param {string[]} [extraProps] - Extra properties to add to the DAV request.
		 * @param {import('webdav').WebDAVClient} [client] - The DAV client to use.
		 * @return {Promise<import('../services/collectionFetcher.js').Collection[]>}
		 */
		async fetchCollections(collectionHome, extraProps, client) {
			if (this.loadingCollections) {
				return []
			}

			try {
				this.loadingCollections = true
				this.errorFetchingCollections = null

				const collections = await fetchCollections(collectionHome, { signal: this.abortController.signal }, extraProps, client)

				this.addCollections({ collections })

				return collections
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollections = 404
				} else {
					this.errorFetchingCollections = error
				}
				logger.error('Error fetching collections:', { error })
			} finally {
				this.loadingCollections = false
			}

			return []
		},
	},
}
