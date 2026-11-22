/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'
import { useFilesStore } from '../store/files.ts'
import { useTimelineJump } from './useTimelineJump.ts'

const { getPhotos, showError } = vi.hoisted(() => ({
	getPhotos: vi.fn(),
	showError: vi.fn(),
}))

vi.mock('../services/PhotoSearch.ts', () => ({ getPhotos }))
vi.mock('@nextcloud/dialogs', () => ({ showError }))

/**
 * Build a batch of search results with consecutive file ids.
 *
 * @param firstFileId - Id of the first file
 * @param count - Number of files
 */
function buildFiles(firstFileId: number, count: number): File[] {
	return Array.from({ length: count }, (_, index) => ({
		fileid: firstFileId + index,
		path: `/photo-${firstFileId + index}.jpg`,
		mtime: new Date(2020, 0, 1),
		attributes: {},
	} as unknown as File))
}

/**
 * A promise resolved from the outside.
 */
function deferred<T>() {
	let resolve!: (value: T) => void
	const promise = new Promise<T>((done) => {
		resolve = done
	})
	return { promise, resolve }
}

describe('useTimelineJump', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		getPhotos.mockReset()
		showError.mockReset()
	})

	test('loads the photos taken before the end of the month', async () => {
		getPhotos.mockResolvedValueOnce(buildFiles(1, 200))
		const fetchedFileIds = ref<number[]>([])
		const { jumpActive, jumpToMonth } = useTimelineJump(fetchedFileIds, () => ({
			mimesType: ['image/jpeg'],
			extraFilters: '<filter/>',
		}))

		expect(await jumpToMonth('201912')).toBe(true)

		const options = getPhotos.mock.calls[0][0]
		expect(options.mimesType).toEqual(['image/jpeg'])
		expect(options.firstResult).toBe(0)
		expect(options.nbResults).toBe(200)
		expect(options.extraFilters).toContain('<filter/>')
		expect(options.extraFilters).toContain('<d:lt>')
		expect(options.extraFilters).toContain(`<d:literal>${new Date(2020, 0, 1).getTime() / 1000}</d:literal>`)
		expect(fetchedFileIds.value).toHaveLength(200)
		expect(Object.keys(useFilesStore().files)).toHaveLength(200)
		expect(jumpActive.value).toBe(true)
	})

	test('pages down from the month and skips the photos already shown', async () => {
		getPhotos
			.mockResolvedValueOnce(buildFiles(1, 200))
			.mockResolvedValueOnce(buildFiles(150, 100))
		const fetchedFileIds = ref<number[]>([])
		const { jumpToMonth, loadMoreAfterJump } = useTimelineJump(fetchedFileIds, () => ({}))

		await jumpToMonth('201912')
		await loadMoreAfterJump()

		expect(getPhotos.mock.calls[1][0].firstResult).toBe(200)
		expect(fetchedFileIds.value).toHaveLength(249)
		expect(new Set(fetchedFileIds.value).size).toBe(249)

		// The last batch was not full, there is nothing left below.
		await loadMoreAfterJump()
		expect(getPhotos).toHaveBeenCalledTimes(2)
	})

	test('does not page before a jump', async () => {
		const { jumpActive, loadMoreAfterJump } = useTimelineJump(ref([]), () => ({}))

		await loadMoreAfterJump()

		expect(jumpActive.value).toBe(false)
		expect(getPhotos).not.toHaveBeenCalled()
	})

	test('drops a jump superseded by a later one', async () => {
		const first = deferred<File[]>()
		getPhotos
			.mockImplementationOnce(() => first.promise)
			.mockResolvedValueOnce(buildFiles(500, 10))
		const fetchedFileIds = ref<number[]>([])
		const { jumpToMonth } = useTimelineJump(fetchedFileIds, () => ({}))

		const firstJump = jumpToMonth('202001')
		const secondJump = jumpToMonth('201801')
		first.resolve(buildFiles(1, 200))

		expect(await firstJump).toBe(false)
		expect(await secondJump).toBe(true)
		expect(getPhotos.mock.calls[0][0].signal.aborted).toBe(true)
		expect(fetchedFileIds.value).toEqual(buildFiles(500, 10).map((file) => file.fileid))
	})

	test('drops a cancelled jump', async () => {
		const pending = deferred<File[]>()
		getPhotos.mockImplementationOnce(() => pending.promise)
		const fetchedFileIds = ref<number[]>([])
		const { jumpActive, jumpToMonth, cancelJump } = useTimelineJump(fetchedFileIds, () => ({}))

		const jump = jumpToMonth('202001')
		cancelJump()
		pending.resolve(buildFiles(1, 10))

		expect(await jump).toBe(false)
		expect(jumpActive.value).toBe(false)
		expect(fetchedFileIds.value).toEqual([])
	})

	test('reports a failed jump and keeps paging as before', async () => {
		getPhotos.mockRejectedValueOnce(new Error('network'))
		const { jumpActive, jumpToMonth } = useTimelineJump(ref([]), () => ({}))

		expect(await jumpToMonth('202001')).toBe(false)
		expect(jumpActive.value).toBe(false)
		expect(showError).toHaveBeenCalledOnce()
	})

	test('moves the next batch up for the removed photos', async () => {
		getPhotos
			.mockResolvedValueOnce(buildFiles(1, 200))
			.mockResolvedValueOnce([])
		const { jumpToMonth, loadMoreAfterJump, forgetJumpFiles } = useTimelineJump(ref([]), () => ({}))

		await jumpToMonth('201912')
		forgetJumpFiles([3, 4, 9999])
		await loadMoreAfterJump()

		expect(getPhotos.mock.calls[1][0].firstResult).toBe(198)
	})

	test('goes back to paging from the newest photos after a reset', async () => {
		getPhotos.mockResolvedValueOnce(buildFiles(1, 200))
		const { jumpActive, jumpToMonth, resetJump } = useTimelineJump(ref([]), () => ({}))

		await jumpToMonth('201912')
		resetJump()

		expect(jumpActive.value).toBe(false)
	})
})
