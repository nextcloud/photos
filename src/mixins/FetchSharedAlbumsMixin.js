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

import { mapGetters, mapActions } from 'vuex'

import { getCurrentUser } from '@nextcloud/auth'

import AbortControllerMixin from './AbortControllerMixin.js'
import { fetchAlbums } from '../services/Albums.js'

export default {
	name: 'FetchSharedAlbumsMixin',

	data() {
		return {
			errorFetchingSharedAlbums: null,
			loadingSharedAlbums: false,
		}
	},

	mixins: [
		AbortControllerMixin,
	],

	async beforeMount() {
		this.fetchSharedAlbums()
	},

	computed: {
		...mapGetters([
			'sharedAlbums',
		]),
	},

	methods: {
		...mapActions([
			'addSharedAlbums',
		]),

		async fetchSharedAlbums() {
			if (this.loadingSharedAlbums) {
				return
			}

			try {
				this.loadingSharedAlbums = true
				this.errorFetchingSharedAlbums = null

				const albums = await fetchAlbums(`/photos/${getCurrentUser()?.uid}/sharedalbums`, this.abortController.signal)

				this.addSharedAlbums({ albums })
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingSharedAlbums = 404
				} else {
					this.errorFetchingSharedAlbums = error
				}
			} finally {
				this.loadingSharedAlbums = false
			}
		},
	},
}
