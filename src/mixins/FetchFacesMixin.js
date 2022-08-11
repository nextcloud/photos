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

import { mapGetters } from 'vuex'

import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'

import client from '../services/DavClient.js'
import logger from '../services/logger.js'
import cancelableRequest from '../utils/CancelableRequest.js'

export default {
	name: 'FetchFacesMixin',

	data() {
		return {
			errorFetchingFaces: null,
			loadingFaces: false,
			cancelFacesRequest: () => { },
		}
	},

	async beforeMount() {
		this.fetchFaces()
	},

	beforeDestroy() {
		this.cancelFacesRequest('Changed view')
	},

	computed: {
		...mapGetters([
			'faces',
		]),
	},

	methods: {
		async fetchFaces() {
			if (this.loadingFaces) {
				return
			}

			try {
				this.loadingFaces = true
				this.errorFetchingFaces = null

				const { request, cancel } = cancelableRequest(client.getDirectoryContents)
				this.cancelAlbumsRequest = cancel

				const faces = await request(`/recognize/${getCurrentUser()?.uid}/faces/`)
				this.$store.dispatch('addFaces', { faces })
				logger.debug(`[FetchFacesMixin] Fetched ${faces.length} new faces: `, faces)
			} catch (error) {
				if (error.response && error.response.status) {
					if (error.response.status === 404) {
						this.errorFetchingFaces = 404
					} else {
						this.errorFetchingFaces = error
					}
				}
				logger.error(t('photos', 'Failed to fetch faces list.'), error)
				showError(t('photos', 'Failed to fetch faces list.'))
			} finally {
				this.cancelFacesRequest = () => { }
				this.loadingFaces = false
			}
		},
	},
}
