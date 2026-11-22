/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { ComputedRef, Ref } from 'vue'
import type { PhotoFile } from '../store/files.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { computed, onUnmounted, ref } from 'vue'
import { allMimes } from '../services/AllowedMimes.ts'
import { logger } from '../services/logger.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { useFilesStore } from '../store/files.ts'

/**
 * Number of photos fetched at once. Views built on top of the loaded photos
 * need a decent amount of them to show something meaningful, but they are not
 * paginated, so most of them stay with a single batch.
 */
const BATCH_SIZE = 500

/**
 * Access the photos that are currently loaded in the store, and load a batch of
 * them, or the whole library, for the views which are not driven by the timeline.
 */
export function useLoadedPhotos(): {
	photos: ComputedRef<PhotoFile[]>
	loading: Ref<boolean>
	loadPhotos: () => Promise<void>
	loadAllPhotos: () => Promise<void>
} {
	const filesStore = useFilesStore()
	const abortController = new AbortController()
	const loading = ref(false)

	// The store also holds the folders and their content, so only the files
	// with a media mime type are kept here.
	const photos = computed<PhotoFile[]>(() => Object.values(filesStore.files)
		.filter((file) => allMimes.includes(file.mime ?? ''))
		.sort((photo1, photo2) => photo2.attributes.timestamp - photo1.attributes.timestamp))

	/**
	 * @param all - Keep fetching batches until the whole library is loaded
	 */
	async function fetchPhotos(all: boolean): Promise<void> {
		if (loading.value) {
			return
		}

		try {
			loading.value = true
			let firstResult = 0
			let files: File[]
			do {
				files = await getPhotos({
					mimesType: allMimes,
					firstResult,
					nbResults: BATCH_SIZE,
					signal: abortController.signal,
				})
				filesStore.appendFiles(files)
				firstResult += files.length
			} while (all && files.length === BATCH_SIZE)
		} catch (error) {
			if (error instanceof DOMException && error.code === error.ABORT_ERR) {
				return
			}

			logger.error('Error fetching files', { error })
			showError(t('photos', 'Error fetching files'))
		} finally {
			loading.value = false
		}
	}

	const loadPhotos = () => fetchPhotos(false)
	const loadAllPhotos = () => fetchPhotos(true)

	onUnmounted(() => abortController.abort())

	return { photos, loading, loadPhotos, loadAllPhotos }
}
