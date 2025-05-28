/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WebDAVClient } from 'webdav'

import { defineComponent } from 'vue'
import {
	type Collection,

	fetchCollections,
} from '../services/collectionFetcher.js'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import AbortControllerMixin from './AbortControllerMixin.js'

export default defineComponent({
	name: 'FetchCollectionsMixin',

	data() {
		return {
			errorFetchingCollections: null as null | number | Error | unknown,
			loadingCollections: false,
		}
	},

	mixins: [AbortControllerMixin],

	methods: {
		async fetchCollections(collectionHome: string, extraProps: string[] = [], client: WebDAVClient = davClient): Promise<Collection[]> {
			if (this.loadingCollections) {
				return []
			}

			try {
				this.loadingCollections = true
				this.errorFetchingCollections = null

				const collections = await fetchCollections(collectionHome, { signal: this.abortController.signal }, extraProps, client)

				this.$store.dispatch('addCollections', { collections })

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
})
