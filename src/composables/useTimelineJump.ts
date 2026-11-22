/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { ComputedRef, Ref } from 'vue'
import type { PhotoSearchOptions } from '../services/PhotoSearch.ts'

import { showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { computed, ref, shallowRef } from 'vue'
import { logger } from '../services/logger.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { useFilesStore } from '../store/files.ts'
import { endOfMonth } from '../utils/timelineMonths.ts'

const numberOfImagesPerBatch = 200

/**
 * Position in the photos taken before a given time, sorted newest first.
 */
interface JumpCursor {
	before: number
	offset: number
	done: boolean
	// Every file the cursor returned, they are the results before `offset`.
	fileIds: Set<number>
}

/**
 * Load the photos of a month far down the timeline without paging through
 * the newer ones first, and keep paging down from there.
 *
 * @param fetchedFileIds - Ids of the photos the timeline shows, extended in place
 * @param searchOptions - Search options of the timeline, like mime types and filters
 */
export function useTimelineJump(
	fetchedFileIds: Ref<number[]>,
	searchOptions: () => Partial<PhotoSearchOptions>,
): {
	jumpActive: ComputedRef<boolean>
	loadingJump: ComputedRef<boolean>
	jumpToMonth: (month: string) => Promise<boolean>
	loadMoreAfterJump: () => Promise<void>
	cancelJump: () => void
	forgetJumpFiles: (fileIds: number[]) => void
	resetJump: () => void
} {
	const filesStore = useFilesStore()

	const cursor = shallowRef<JumpCursor | null>(null)
	const jumping = ref(false)
	const loadingMore = ref(false)
	let jumpController: AbortController | null = null
	let loadMoreController = new AbortController()

	const jumpActive = computed(() => cursor.value !== null)
	const loadingJump = computed(() => jumping.value || loadingMore.value)

	/**
	 * @param current - Cursor to fetch the next batch of
	 * @param signal - Signal aborting the request
	 */
	function fetchBatch(current: JumpCursor, signal: AbortSignal): Promise<File[]> {
		const options = searchOptions()
		return getPhotos({
			...options,
			extraFilters: `${options.extraFilters ?? ''}
				<d:lt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${current.before}</d:literal>
				</d:lt>`,
			firstResult: current.offset,
			nbResults: numberOfImagesPerBatch,
			signal,
		})
	}

	/**
	 * @param current - Cursor the batch was fetched for
	 * @param files - Fetched batch
	 */
	function applyBatch(current: JumpCursor, files: File[]): void {
		current.offset += files.length
		current.done = files.length < numberOfImagesPerBatch

		const fileIds = files.map((file) => file.fileid as number)
		fileIds.forEach((fileId) => current.fileIds.add(fileId))

		filesStore.appendFiles(files)
		fetchedFileIds.value.push(...fileIds.filter((fileId) => !fetchedFileIds.value.includes(fileId)))
	}

	/**
	 * @param error - Error of the request
	 */
	function reportError(error: unknown): void {
		showError(t('photos', 'Error fetching files'))
		logger.error(t('photos', 'Error fetching files'), { error })
	}

	/**
	 * Load the first photos of a month, and page down from it from then on.
	 * A later jump supersedes a pending one.
	 *
	 * @param month - `YYYYMM` month key
	 * @return Whether the photos are loaded, false when the jump failed or was superseded
	 */
	async function jumpToMonth(month: string): Promise<boolean> {
		jumpController?.abort()
		const controller = new AbortController()
		jumpController = controller
		jumping.value = true

		const next: JumpCursor = { before: endOfMonth(month), offset: 0, done: false, fileIds: new Set() }
		try {
			const files = await fetchBatch(next, controller.signal)
			if (controller.signal.aborted) {
				return false
			}
			applyBatch(next, files)
			cursor.value = next
			return true
		} catch (error) {
			if (!controller.signal.aborted) {
				reportError(error)
			}
			return false
		} finally {
			if (jumpController === controller) {
				jumpController = null
				jumping.value = false
			}
		}
	}

	/**
	 * Load the next photos below the month of the last jump.
	 */
	async function loadMoreAfterJump(): Promise<void> {
		const current = cursor.value
		if (current === null || current.done || loadingMore.value) {
			return
		}

		const signal = loadMoreController.signal
		loadingMore.value = true
		try {
			const files = await fetchBatch(current, signal)
			if (!signal.aborted) {
				applyBatch(current, files)
			}
		} catch (error) {
			if (!signal.aborted) {
				reportError(error)
			}
		} finally {
			loadingMore.value = false
		}
	}

	function cancelJump(): void {
		jumpController?.abort()
		jumpController = null
		jumping.value = false
	}

	/**
	 * Account for photos removed from the library, so the next batch does not
	 * skip the ones moving up into their place.
	 *
	 * @param fileIds - Ids of the removed photos
	 */
	function forgetJumpFiles(fileIds: number[]): void {
		const current = cursor.value
		if (current === null) {
			return
		}
		for (const fileId of fileIds) {
			if (current.fileIds.delete(fileId)) {
				current.offset--
			}
		}
	}

	function resetJump(): void {
		cancelJump()
		loadMoreController.abort()
		loadMoreController = new AbortController()
		loadingMore.value = false
		cursor.value = null
	}

	return {
		jumpActive,
		loadingJump,
		jumpToMonth,
		loadMoreAfterJump,
		cancelJump,
		forgetJumpFiles,
		resetJump,
	}
}
