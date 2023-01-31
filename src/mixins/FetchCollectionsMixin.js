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

import AbortControllerMixin from './AbortControllerMixin.js'
import { fetchCollections } from '../services/collectionFetcher.js'

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
		 * @param {string[]} extraProps - Extra properties to add to the DAV request.
		 * @return {Promise<import('../services/collectionFetcher.js').Collection[]>}
		 */
		async fetchCollections(collectionHome, extraProps = []) {
			if (this.loadingCollections) {
				return []
			}

			try {
				this.loadingCollections = true
				this.errorFetchingCollections = null

				const collections = await fetchCollections(collectionHome, { signal: this.abortController.signal }, extraProps)

				this.addCollections({ collections })

				return collections
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingCollections = 404
				} else {
					this.errorFetchingCollections = error
				}
			} finally {
				this.loadingCollections = false
			}

			return []
		},
	},
}
