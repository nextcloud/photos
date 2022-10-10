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

import { mapActions, mapGetters } from 'vuex'

import { showError } from '@nextcloud/dialogs'
import { getCurrentUser } from '@nextcloud/auth'

import client from '../services/DavClient.js'
import logger from '../services/logger.js'
import DavRequest from '../services/DavRequest'
import { genFileInfo } from '../utils/fileUtils'
import AbortControllerMixin from './AbortControllerMixin'

export default {
	name: 'FetchFacesMixin',

	data() {
		return {
			errorFetchingFaces: null,
			loadingFaces: false,
			errorFetchingFiles: null,
			loadingFiles: false,
		}
	},

	mixins: [
		AbortControllerMixin,
	],

	async beforeMount() {
		this.fetchFaces()
	},

	computed: {
		...mapGetters([
			'faces',
		]),
	},

	methods: {
		...mapActions([
			'appendFiles',
		]),

		async fetchFaces() {
			if (this.loadingFaces) {
				return
			}

			if (Object.keys(this.faces).length) {
				return
			}

			try {
				this.loadingFaces = true
				this.errorFetchingFaces = null

				const faces = await client.getDirectoryContents(`/recognize/${getCurrentUser()?.uid}/faces/`, {
					signal: this.abortController.signal,
				})
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
				logger.error(t('photos', 'Failed to fetch faces list.'), { error })
				showError(t('photos', 'Failed to fetch faces list.'))
			} finally {
				this.loadingFaces = false
			}
		},

		async fetchFaceContent(faceName, force) {
			if (this.loadingFiles) {
				return
			}

			if (!force && this.facesFiles[faceName] && this.facesFiles[faceName].length) {
				return
			}

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true

				let { data: fetchedFiles } = await client.getDirectoryContents(
					`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
					{
						data: DavRequest,
						details: true,
						signal: this.abortController.signal,
					}
				)

				fetchedFiles = fetchedFiles
					.map(file => genFileInfo(file))
					.map(file => ({ ...file, filename: file.realpath.replace(`/${getCurrentUser().uid}/files`, '') }))

				const fileIds = fetchedFiles.map(file => '' + file.fileid)

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addFilesToFace', { faceName, fileIdsToAdd: fileIds })
				}

				logger.debug(`[FetchFacesMixin] Fetched ${fileIds.length} new files: `, fileIds)
			} catch (error) {
				if (error.response && error.response.status) {
					if (error.response.status === 404) {
						this.errorFetchingFiles = 404
					} else {
						this.errorFetchingFiles = error
					}
				}

				// cancelled request, moving on...
				logger.error('Error fetching face files', { error })
			} finally {
				this.loadingFiles = false
			}
		},
	},
}
