/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { getCurrentUser } from '@nextcloud/auth'
import { mapActions, mapGetters } from 'vuex'
import he from 'he'
import type { FileStat, ResponseDataDetailed } from 'webdav'

import { genFileInfo, type PhotoNode } from '../utils/fileUtils.js'
import logger from '../services/logger.js'
import AbortControllerMixin from './AbortControllerMixin.js'
import { davClient } from '../services/DavClient.ts'
import { getPropFind } from '../services/DavRequest.ts'

const recognizeDAVProps = [
	'nc:face-detections',
	'nc:face-preview-image',
	'nc:realpath',
]

type FaceNode = PhotoNode & {
	faceDetections: string
	facePreviewImage: string
	realpath: string
}

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

				const { data: faces } = await davClient.getDirectoryContents(`/recognize/${getCurrentUser()?.uid}/faces/`, {
					data: getPropFind(recognizeDAVProps),
					details: true,
					signal: this.abortController.signal,
				}) as ResponseDataDetailed<FileStat[]>
				this.$store.dispatch('addFaces', { faces })
				logger.debug(`[FetchFacesMixin] Fetched ${faces.length} new faces: `, {faces})
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

				const { data: fetchedRawFiles } = await davClient.getDirectoryContents(
					`/recognize/${getCurrentUser()?.uid}/faces/${faceName}`,
					{
						data: getPropFind(recognizeDAVProps),
						details: true,
						signal: this.abortController.signal,
					},
				) as ResponseDataDetailed<FileStat[]>

				const fetchedFiles = fetchedRawFiles
					.map(file => genFileInfo(file) as FaceNode)
					.map(file => ({ ...file, filename: he.decode(file.realpath).replace(`/${getCurrentUser()?.uid}/files`, `/files/${getCurrentUser()?.uid}`) }))
					.map(file => ({ ...file, faceDetections: JSON.parse(he.decode(file.faceDetections)) }))

				const fileIds = fetchedFiles.map(file => '' + file.fileid)

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addFilesToFace', { faceName, fileIdsToAdd: fileIds })
				}

				logger.debug(`[FetchFacesMixin] Fetched ${fileIds.length} new files: `, { fileIds })
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
					.map(file => genFileInfo(file) as FaceNode)
					.map(file => ({ ...file, filename: he.decode(file.realpath).replace(`/${getCurrentUser()?.uid}/files`, `/files/${getCurrentUser()?.uid}`) }))
					.map(file => ({ ...file, faceDetections: JSON.parse(he.decode(file.faceDetections)) }))

				const fileIds = fetchedFiles.map(file => '' + file.fileid)

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addUnassignedFiles', { fileIdsToAdd: fileIds })
				}

				logger.debug(`[FetchFacesMixin] Fetched ${fileIds.length} new unassigned files: `, { fileIds })
			} catch (error) {
				if (error.response && error.response.status) {
					if (error.response.status === 404) {
						this.errorFetchingFiles = 404
					} else {
						this.errorFetchingFiles = error
					}
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
}
