/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { FileStat, ResponseDataDetailed } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { showError } from '@nextcloud/dialogs'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import he from 'he'
import { defineComponent } from 'vue'
import { davClient } from '../services/DavClient.ts'
import { getPropFind } from '../services/DavRequest.ts'
import { logger } from '../services/logger.ts'
import { useFacesStore } from '../store/faces.ts'
import { useFilesStore } from '../store/files.ts'
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
			return useFacesStore().faces
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

				const fetchedFaces = fetchedRawFaces.map((file) => resultToNode(file, `/recognize/${getCurrentUser()?.uid}/faces/`) as unknown as Collection)
				useFacesStore().addFaces(fetchedFaces)
				logger.debug(`[FetchFacesMixin] Fetched ${fetchedFaces.length} new faces: `, { fetchedFaces })
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

			const facesFiles = useFacesStore().facesFiles
			if (!force && facesFiles[faceName] && facesFiles[faceName].length) {
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
					}))
					.map((file) => {
						const node = resultToNode(file) as FaceNode
						// Set the parsed detections after resultToNode: it builds attributes
						// as `{ ...node, ...props }`, so assigning before would be overwritten
						// by the raw JSON string still held in props.
						node.attributes['face-detections'] = JSON.parse(he.decode(file.props?.['face-detections']))
						return node
					})

				const fileIds = fetchedFiles.map((file) => file.fileid?.toString() as string)

				useFilesStore().appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					useFacesStore().addFileIdsToFace(faceName, fileIds)
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

		async fetchUnassignedFaces(force = false) {
			if (this.loadingFiles) {
				return
			}

			if (!force && useFacesStore().unassignedFiles.length) {
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
					}))
					.map((file) => {
						const node = resultToNode(file) as FaceNode
						// Set the parsed detections after resultToNode: it builds attributes
						// as `{ ...node, ...props }`, so assigning before would be overwritten
						// by the raw JSON string still held in props.
						node.attributes['face-detections'] = JSON.parse(he.decode(file.props?.['face-detections']))
						return node
					})

				const fileIds = [...new Set(fetchedFiles.map((file) => '' + file.fileid))]
				useFilesStore().appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await useFacesStore().addUnassignedFiles(fileIds)
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

				await useFacesStore().setUnassignedFilesCount(count)

				logger.debug('[FetchFacesMixin] Fetched unassigned files count: ', { count })
			} catch (error) {
				// cancelled request, moving on...
				logger.error('Error fetching unassigned files count', { error })
			}
		},
	},
})
