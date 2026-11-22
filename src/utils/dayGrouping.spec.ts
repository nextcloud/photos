/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { groupFileIdsByDay, toDateKey } from './dayGrouping.ts'

/**
 * A photo taken on the given day.
 *
 * @param date - The `YYYYMMDD` day it was taken on.
 */
function photo(date: string): PhotoFile {
	return { attributes: { month: date.slice(0, 6), day: date.slice(4) } } as PhotoFile
}

describe('toDateKey', () => {
	test('joins the month and the day of the month', () => {
		expect(toDateKey(photo('20260614'))).toBe('20260614')
	})
})

describe('groupFileIdsByDay', () => {
	test('returns no day for no photo', () => {
		expect(groupFileIdsByDay([], {})).toEqual([])
	})

	test('splits photos into their days, keeping the given order', () => {
		const files = {
			1: photo('20260614'),
			2: photo('20260614'),
			3: photo('20260612'),
			4: photo('20260601'),
			5: photo('20260601'),
		}

		expect(groupFileIdsByDay(['1', '2', '3', '4', '5'], files)).toEqual([
			{ id: '20260614', fileIds: ['1', '2'] },
			{ id: '20260612', fileIds: ['3'] },
			{ id: '20260601', fileIds: ['4', '5'] },
		])
	})

	test('keeps the order of days rather than sorting their keys', () => {
		const files = { 1: photo('20260601'), 2: photo('20260630') }

		expect(groupFileIdsByDay(['1', '2'], files).map(({ id }) => id)).toEqual(['20260601', '20260630'])
	})

	test('puts photos of the same day into one group even when not adjacent', () => {
		const files = { 1: photo('20260614'), 2: photo('20260613'), 3: photo('20260614') }

		expect(groupFileIdsByDay(['1', '2', '3'], files)).toEqual([
			{ id: '20260614', fileIds: ['1', '3'] },
			{ id: '20260613', fileIds: ['2'] },
		])
	})

	test('tells the same day of different months and years apart', () => {
		const files = { 1: photo('20260614'), 2: photo('20260514'), 3: photo('20250614') }

		expect(groupFileIdsByDay(['1', '2', '3'], files).map(({ id }) => id)).toEqual(['20260614', '20260514', '20250614'])
	})

	test('leaves out ids of photos it does not know', () => {
		const files = { 1: photo('20260614') }

		expect(groupFileIdsByDay(['1', '2'], files)).toEqual([{ id: '20260614', fileIds: ['1'] }])
	})
})
