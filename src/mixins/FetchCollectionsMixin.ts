/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mapActions } from 'vuex'

import AbortControllerMixin from './AbortControllerMixin.js'
import { fetchCollections, type Collection } from '../services/collectionFetcher.js'
import logger from '../services/logger.js'
import type { WebDAVClient } from 'webdav'

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

		async fetchCollections(collectionHome: string, extraProps: string[], client: WebDAVClient): Promise<Collection[]> {
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
