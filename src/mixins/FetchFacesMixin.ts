/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { FileStat, ResponseDataDetailed } from 'webdav'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import he from 'he'
import { defineComponent } from 'vue'
import { davClient } from '../services/DavClient.ts'
import { getPropFind } from '../services/DavRequest.ts'
import logger from '../services/logger.js'
import AbortControllerMixin from './AbortControllerMixin.js'

const recognizeDAVProps = [
	'<nc:face-detections/>',
	'<nc:face-preview-image/>',
	'<nc:realpath/>',
	'<nc:nbItems/>',
]

type FaceNode = File & {
	attributes: {
		'face-detections': string
		'face-preview-image': string
		realpath: string
	}
}

export default defineComponent({
	name: 'FetchFacesMixin',

	data() {
		return {
			errorFetchingFaces: null as null | number | Error | unknown,
			loadingFaces: false,
			errorFetchingFiles: null as null | number | Error | unknown,
			loadingFiles: false,
		}
	},

	mixins: [AbortControllerMixin],

	async beforeMount() {
		this.fetchFaces()
	},

	computed: {
		faces() {
			return this.$store.state.faces.faces
		},
	},

	methods: {
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

				const { data: fetchedRawFaces } = await davClient.getDirectoryContents(`/recognize/${getCurrentUser()?.uid}/faces/`, {
					data: getPropFind(recognizeDAVProps),
					details: true,
					signal: this.abortController.signal,
				}) as ResponseDataDetailed<FileStat[]>

				const fetchedFace = fetchedRawFaces.map((file) => resultToNode(file, `/recognize/${getCurrentUser()?.uid}/faces/`) as FaceNode)
				this.$store.dispatch('addFaces', { faces: fetchedFace })
				logger.debug(`[FetchFacesMixin] Fetched ${fetchedFace.length} new faces: `, { fetchedFace })
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFaces = 404
				} else {
					this.errorFetchingFaces = error
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

				const { data: fetchedRawFiles } = await davClient.getDirectoryContents(
					`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
					{
						data: getPropFind(recognizeDAVProps),
						details: true,
						signal: this.abortController.signal,
					},
				) as ResponseDataDetailed<FileStat[]>

				const fetchedFiles = fetchedRawFiles
					.map((file) => ({
						...file,
						filename: he.decode(file.props?.realpath).replace(`/${getCurrentUser()?.uid}/files`, `/files/${getCurrentUser()?.uid}`),
						'face-detections': JSON.parse(he.decode(file.props?.['face-detections'])),
					}))
					.map((file) => resultToNode(file) as FaceNode)

				const fileIds = fetchedFiles.map((file) => file.fileid?.toString() as string)

				this.$store.dispatch('appendFiles', fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addFilesToFace', { faceName, fileIdsToAdd: fileIds })
				}

				logger.debug(`[FetchFacesMixin] Fetched ${fileIds.length} new files: `, { fileIds })
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFaces = 404
				} else {
					this.errorFetchingFaces = error
				}

				// cancelled request, moving on...
				logger.error('Error fetching face files', { error })
			} finally {
				this.loadingFiles = false
			}
		},

		async fetchUnassignedFaces(force) {
			if (this.loadingFiles) {
				return
			}

			if (!force && this.unassignedFiles && this.unassignedFiles.length) {
				return
			}

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true

				const { data: fetchedRawFiles } = await davClient.getDirectoryContents(
					`/recognize/${getCurrentUser()?.uid}/unassigned-faces`,
					{
						data: getPropFind(recognizeDAVProps),
						details: true,
						signal: this.abortController.signal,
					},
				) as ResponseDataDetailed<FileStat[]>

				const fetchedFiles = fetchedRawFiles
					.map((file) => ({
						...file,
						filename: he.decode(file.props?.realpath).replace(`/${getCurrentUser()?.uid}/files`, `/files/${getCurrentUser()?.uid}`),
						'face-detections': JSON.parse(he.decode(file.props?.['face-detections'])),
					}))
					.map((file) => resultToNode(file) as FaceNode)

				const fileIds = [...new Set(fetchedFiles.map((file) => '' + file.fileid))]
				this.$store.dispatch('appendFiles', fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addUnassignedFiles', { fileIdsToAdd: fileIds })
				}

				logger.debug(`[FetchFacesMixin] Fetched ${fileIds.length} new unassigned files: `, { fileIds })
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFaces = 404
				} else {
					this.errorFetchingFaces = error
				}

				// cancelled request, moving on...
				logger.error('Error fetching unassigned files', { error })
			} finally {
				this.loadingFiles = false
			}
		},

		async fetchUnassignedFacesCount() {
			try {
				const { data: unassignedFacesRoot } = await davClient.stat(
					`/recognize/${getCurrentUser()?.uid}/unassigned-faces`,
					{
						data: getPropFind(recognizeDAVProps),
						details: true,
						signal: this.abortController.signal,
					},
				) as ResponseDataDetailed<FileStat>

				const count = Number(unassignedFacesRoot.props?.nbItems)

				await this.$store.commit('setUnassignedFilesCount', count)

				logger.debug('[FetchFacesMixin] Fetched unassigned files count: ', { count })
			} catch (error) {
				// cancelled request, moving on...
				logger.error('Error fetching unassigned files count', { error })
			}
		},
	},
})
