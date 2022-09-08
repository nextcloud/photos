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

import moment from '@nextcloud/moment'
import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'

import client from '../services/DavClient.js'
import logger from '../services/logger.js'
import { genFileInfo } from '../utils/fileUtils.js'
import AbortControllerMixin from './AbortControllerMixin.js'

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
		async fetchAlbums() {
			if (this.loadingAlbums) {
				return
			}

			try {
				this.loadingAlbums = true
				this.errorFetchingAlbums = null

				const response = await client.getDirectoryContents(`/photos/${getCurrentUser()?.uid}/albums`, {
					data: `<?xml version="1.0"?>
							<d:propfind xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
								<d:prop>
									<nc:last-photo />
									<nc:nbItems />
									<nc:location />
									<nc:dateRange />
								</d:prop>
							</d:propfind>`,
					details: true,
					signal: this.abortController.signal,
				})

				const albums = response.data
					.filter(album => album.filename !== '/photos/admin/albums')
					.map(album => genFileInfo(album))
					.map(album => {
						const dateRange = JSON.parse(album.dateRange?.replace(/&quot;/g, '"') ?? '{}')

						if (dateRange.start === null) {
							dateRange.start = moment().unix()
							dateRange.end = moment().unix()
						}

						const dateRangeFormated = {
							startDate: moment.unix(dateRange.start).format('MMMM YYYY'),
							endDate: moment.unix(dateRange.end).format('MMMM YYYY'),
						}

						if (dateRangeFormated.startDate === dateRangeFormated.endDate) {
							return { ...album, date: dateRangeFormated.startDate }
						} else {
							return { ...album, date: this.t('photos', '{startDate} to {endDate}', dateRangeFormated) }
						}
					})

				this.$store.dispatch('addAlbums', { albums })
				logger.debug(`[FetchAlbumsMixin] Fetched ${albums.length} new files: `, albums)
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingAlbums = 404
				} else if (error.code === 'ERR_CANCELED') {
					return
				} else {
					this.errorFetchingAlbums = error
				}
				logger.error(t('photos', 'Failed to fetch albums list.'), error)
				showError(t('photos', 'Failed to fetch albums list.'))
			} finally {
				this.loadingAlbums = false
			}
		},
	},
}
