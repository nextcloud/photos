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
	name: 'FetchAlbumsMixin',

	data() {
		return {
			errorFetchingAlbums: null,
			loadingAlbums: false,
		}
	},

	mixins: [
		AbortControllerMixin,
	],

	async beforeMount() {
		this.fetchAlbums()
	},

	computed: {
		...mapGetters([
			'albums',
		]),
	},

	methods: {
		...mapActions([
			'addAlbums',
		]),

		async fetchAlbums() {
			if (this.loadingAlbums) {
				return
			}

			try {
				this.loadingAlbums = true
				this.errorFetchingAlbums = null

				const albums = await fetchAlbums(`/photos/${getCurrentUser()?.uid}/albums`, this.abortController.signal)

				this.addAlbums({ albums })
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingAlbums = 404
				} else {
					this.errorFetchingAlbums = error
				}
			} finally {
				this.loadingAlbums = false
			}
		},
	},
}
