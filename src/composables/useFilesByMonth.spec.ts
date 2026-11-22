/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { ref } from 'vue'
import { useFilesByMonth } from './useFilesByMonth.ts'

/**
 * A photo of the folder "/Photos".
 *
 * @param fileid - File id
 * @param basename - File name
 * @param timestamp - Second it was taken at
 * @param month - Month key it is shown under
 */
function photo(fileid: number, basename: string, timestamp: number, month = '202601'): PhotoFile {
	const mime = basename.toLowerCase().endsWith('.jpg') ? 'image/jpeg' : 'image/heic'
	return { fileid, basename, dirname: '/Photos', mime, attributes: { timestamp, month } } as PhotoFile
}

/**
 * The grid of the given photos, folding stacks.
 *
 * @param photos - The photos of the library
 */
function timeline(photos: PhotoFile[]) {
	const files = ref(Object.fromEntries(photos.map((file) => [String(file.fileid), file])))
	return useFilesByMonth(ref(photos.map((file) => file.fileid)), files, true)
}

describe('useFilesByMonth', () => {
	test('stacks the variants of a shot under its JPEG, whenever they were taken', () => {
		const { burstStacks, fileIdsByMonth } = timeline([
			photo(1, 'IMG_1.heic', 1000),
			photo(2, 'IMG_1.jpg', 5000),
			photo(3, 'IMG_2.jpg', 3000),
		])

		expect(fileIdsByMonth.value).toEqual({ 202601: ['2', '3'] })
		expect(burstStacks.value).toEqual({ 2: { leaderId: '2', memberIds: ['2', '1'] } })
	})

	test('folds a variant into its leader of another month', () => {
		const { burstStacks, fileIdsByMonth, monthsList } = timeline([
			photo(1, 'IMG_1.heic', 1000, '202601'),
			photo(2, 'IMG_1 (edited).heic', 9000000, '202604'),
		])

		expect(fileIdsByMonth.value).toEqual({ 202604: ['2'] })
		expect(monthsList.value).toEqual(['202604'])
		expect(burstStacks.value[2]?.memberIds).toEqual(['2', '1'])
	})

	test('leads the variants of a shot by its JPEG rather than as a burst led by the newest file', () => {
		const { burstStacks } = timeline([
			photo(1, 'IMG_1.heic', 1001),
			photo(2, 'IMG_1.jpg', 1000),
			photo(3, 'IMG_2.jpg', 2000),
		])

		expect(burstStacks.value).toEqual({ 2: { leaderId: '2', memberIds: ['2', '1'] } })
	})

	test('merges a burst with the variants of its shots', () => {
		const { burstStacks, fileIdsByMonth } = timeline([
			photo(1, 'IMG_1.heic', 1005),
			photo(2, 'IMG_1.jpg', 1004),
			photo(3, 'IMG_2.heic', 1003),
			photo(4, 'IMG_2.jpg', 1002),
			photo(5, 'IMG_3.jpg', 1000),
		])

		expect(fileIdsByMonth.value).toEqual({ 202601: ['2'] })
		expect(burstStacks.value).toEqual({ 2: { leaderId: '2', memberIds: ['2', '1', '4', '3', '5'] } })
	})

	test('folds nothing when the view does not ask for it', () => {
		const photos = [photo(1, 'IMG_1.heic', 1000), photo(2, 'IMG_1.jpg', 1000)]
		const files = ref(Object.fromEntries(photos.map((file) => [String(file.fileid), file])))
		const { burstStacks, fileIdsByMonth } = useFilesByMonth(ref([1, 2]), files)

		expect(burstStacks.value).toEqual({})
		expect(fileIdsByMonth.value[202601]).toHaveLength(2)
	})
})
