/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'
import store from '../store/index.ts'
import { useFilesByMonth } from './useFilesByMonth.ts'

vi.mock('../store/index.ts', async () => {
	const { reactive } = await import('vue')

	return {
		default: {
			state: reactive({ files: {} as Record<string, PhotoFile> }),
		},
	}
})

/**
 * Put photos in the store, in the shape the grouping reads them.
 *
 * @param photos - The photos to hold, as [fileid, month, timestamp] triples
 */
function givenPhotos(photos: [number, string, number][]): void {
	store.state.files.files = Object.fromEntries(photos.map(([fileid, month, timestamp]) => [
		fileid,
		{ fileid, attributes: { month, timestamp } } as PhotoFile,
	]))
}

describe('useFilesByMonth', () => {
	beforeEach(() => {
		store.state.files.files = {}
	})

	test('has no month without photos', () => {
		const { fileIdsByMonth, monthsList } = useFilesByMonth(ref([]))

		expect(fileIdsByMonth.value).toEqual({})
		expect(monthsList.value).toEqual([])
	})

	test('groups the photos by the month they were taken in', () => {
		givenPhotos([[1, '202601', 100], [2, '202602', 200], [3, '202601', 300]])

		const { fileIdsByMonth } = useFilesByMonth(ref([1, 2, 3]))

		expect(fileIdsByMonth.value).toEqual({ 202601: [3, 1], 202602: [2] })
	})

	test('sorts the photos of a month from the most recent one', () => {
		givenPhotos([[1, '202601', 100], [2, '202601', 300], [3, '202601', 200]])

		const { fileIdsByMonth } = useFilesByMonth(ref([1, 2, 3]))

		expect(fileIdsByMonth.value['202601']).toEqual([2, 3, 1])
	})

	test('skips the photos that are not in the store', () => {
		givenPhotos([[1, '202601', 100]])

		const { fileIdsByMonth } = useFilesByMonth(ref([1, 404]))

		expect(fileIdsByMonth.value).toEqual({ 202601: [1] })
	})

	test('lists the months from the most recent one', () => {
		givenPhotos([[1, '202511', 100], [2, '202602', 200], [3, '202601', 300]])

		const { monthsList } = useFilesByMonth(ref([1, 2, 3]))

		expect(monthsList.value).toEqual(['202602', '202601', '202511'])
	})

	test('follows the photos it is handed', () => {
		givenPhotos([[1, '202601', 100], [2, '202602', 200]])
		const fileIds = ref([1])

		const { monthsList } = useFilesByMonth(fileIds)
		expect(monthsList.value).toEqual(['202601'])

		fileIds.value = [1, 2]
		expect(monthsList.value).toEqual(['202602', '202601'])
	})

	describe('bursts', () => {
		// Three photos a second apart, then one taken a day later.
		const burst: [number, string, number][] = [
			[1, '202601', 1000],
			[2, '202601', 1001],
			[3, '202601', 1002],
			[4, '202601', 90000],
		]

		test('keeps every photo of a run on its own tile by default', () => {
			givenPhotos(burst)

			const { fileIdsByMonth, burstStacks } = useFilesByMonth(ref([1, 2, 3, 4]))

			expect(burstStacks.value).toEqual({})
			expect(fileIdsByMonth.value['202601']).toEqual([4, 3, 2, 1])
		})

		test('folds a run into the tile of its leader when asked to', () => {
			givenPhotos(burst)

			const { fileIdsByMonth, burstStacks } = useFilesByMonth(ref([1, 2, 3, 4]), { foldBursts: true })

			expect(Object.keys(burstStacks.value)).toEqual(['3'])
			expect(burstStacks.value['3'].memberIds).toEqual([3, 2, 1])
			expect(fileIdsByMonth.value['202601']).toEqual([4, 3])
		})

		test('counts every photo of a run in the ungrouped months', () => {
			givenPhotos(burst)

			const { fileIdsByMonthUngrouped } = useFilesByMonth(ref([1, 2, 3, 4]), { foldBursts: true })

			expect(fileIdsByMonthUngrouped.value['202601']).toEqual([4, 3, 2, 1])
		})

		test('never spreads a run over two months', () => {
			// The three photos were taken seconds apart, but the month turned
			// between the first and the second one.
			givenPhotos([[1, '202601', 1000], [2, '202602', 1001], [3, '202602', 1002]])

			const { burstStacks, fileIdsByMonth } = useFilesByMonth(ref([1, 2, 3]), { foldBursts: true })

			expect(burstStacks.value['3'].memberIds).toEqual([3, 2])
			expect(fileIdsByMonth.value).toEqual({ 202601: [1], 202602: [3] })
		})

		test('follows a folding that is turned on and off', () => {
			givenPhotos(burst)
			const foldBursts = ref(false)

			const { fileIdsByMonth } = useFilesByMonth(ref([1, 2, 3, 4]), { foldBursts })
			expect(fileIdsByMonth.value['202601']).toEqual([4, 3, 2, 1])

			foldBursts.value = true
			expect(fileIdsByMonth.value['202601']).toEqual([4, 3])
		})
	})
})
