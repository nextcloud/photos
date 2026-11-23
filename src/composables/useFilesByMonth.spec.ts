/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { ref } from 'vue'
import { toDayKey, toMonthKey } from '../utils/dateUtils.ts'
import { useFilesByMonth } from './useFilesByMonth.ts'

/**
 * A photo taken at the given local time.
 *
 * @param fileid - Id of the photo.
 * @param date - When it was taken.
 */
function photo(fileid: number, date: Date): PhotoFile {
	return {
		fileid,
		attributes: {
			timestamp: Math.floor(date.getTime() / 1000),
			month: toMonthKey(date),
			day: toDayKey(date),
		},
	} as PhotoFile
}

describe('useFilesByMonth', () => {
	const files = ref<Record<string, PhotoFile>>(Object.fromEntries([
		photo(1, new Date(2026, 5, 14, 18, 0, 0)),
		// A burst of three photos.
		photo(2, new Date(2026, 5, 14, 9, 0, 2)),
		photo(3, new Date(2026, 5, 14, 9, 0, 1)),
		photo(4, new Date(2026, 5, 14, 9, 0, 0)),
		photo(5, new Date(2026, 5, 2, 12, 0, 0)),
		photo(6, new Date(2026, 4, 31, 23, 59, 0)),
	].map((file) => [file.fileid, file])))
	const fetchedFileIds = ref([5, 3, 1, 6, 2, 4])

	test('splits the photos of every month into their days, newest first', () => {
		const { daysByMonth } = useFilesByMonth(fetchedFileIds, files)

		expect(daysByMonth.value).toEqual({
			202606: [
				{ id: '20260614', fileIds: ['1', '2', '3', '4'] },
				{ id: '20260602', fileIds: ['5'] },
			],
			202605: [
				{ id: '20260531', fileIds: ['6'] },
			],
		})
	})

	test('holds the tile of a run only when runs are folded', () => {
		const { daysByMonth } = useFilesByMonth(fetchedFileIds, files, true)

		expect(daysByMonth.value[202606]).toEqual([
			{ id: '20260614', fileIds: ['1', '2'] },
			{ id: '20260602', fileIds: ['5'] },
		])
	})
})
