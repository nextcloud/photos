/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, Ref } from 'vue'
import type { PhotoFile } from '../store/files.ts'

import { showError } from '@nextcloud/dialogs'
import { subscribe } from '@nextcloud/event-bus'
import { t } from '@nextcloud/l10n'
import { computed, onScopeDispose, ref } from 'vue'
import { allMimes } from '../services/AllowedMimes.ts'
import { logger } from '../services/logger.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { useFilesStore } from '../store/files.ts'
import { configChangedEvent } from '../store/userConfig.ts'

/**
 * Number of photos fetched per request.
 */
const BATCH_SIZE = 500

/**
 * Upper bound of photos fetched for the views built on the whole library, to
 * keep the browser responsive on very large libraries.
 */
export const MAX_PHOTOS = 20000

/**
 * Whether the whole library, up to `MAX_PHOTOS`, has already been fetched
 * during this page load.
 */
let libraryLoaded = false

subscribe(configChangedEvent, ({ key }: { key: string }) => {
	if (key === 'photosSourceFolders') {
		libraryLoaded = false
	}
})

/**
 * Access the photos that are currently loaded in the store, and load the whole
 * library for the views which are not driven by the timeline.
 */
export function useLoadedPhotos(): {
	photos: ComputedRef<PhotoFile[]>
	loading: Ref<boolean>
	loadPhotos: (force?: boolean) => Promise<void>
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
	 * Fetch the library batch by batch into the store, until a batch comes back
	 * short or `MAX_PHOTOS` is reached. The store, and so `photos`, is updated
	 * after every batch while `loading` stays true.
	 *
	 * @param force - Fetch again even if the library was already loaded
	 */
	async function loadPhotos(force: boolean = false): Promise<void> {
		if (loading.value || (libraryLoaded && !force)) {
			return
		}

		try {
			loading.value = true
			for (let firstResult = 0; firstResult < MAX_PHOTOS; firstResult += BATCH_SIZE) {
				const files = await getPhotos({
					mimesType: allMimes,
					firstResult,
					nbResults: BATCH_SIZE,
					signal: abortController.signal,
				})
				if (abortController.signal.aborted) {
					return
				}

				filesStore.appendFiles(files)

				if (files.length < BATCH_SIZE) {
					break
				}
				if (firstResult + BATCH_SIZE >= MAX_PHOTOS) {
					logger.info(`Stopped loading the library after ${MAX_PHOTOS} photos`)
				}
			}
			libraryLoaded = true
		} catch (error) {
			if (abortController.signal.aborted) {
				return
			}

			logger.error('Error fetching files', { error })
			showError(t('photos', 'Error fetching files'))
		} finally {
			loading.value = false
		}
	}

	onScopeDispose(() => abortController.abort())

	return { photos, loading, loadPhotos }
}
