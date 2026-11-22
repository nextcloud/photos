/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { closestLoadedMonth, endOfMonth, mergeMonthCounts, monthCountsFromDays, sortMonthsNewestFirst } from './timelineMonths.ts'

describe('monthCountsFromDays', () => {
	test('returns no month without days', () => {
		expect(monthCountsFromDays([])).toEqual({})
	})

	test('sums the days of each month', () => {
		expect(monthCountsFromDays([
			{ day: '2026-03-02', count: 4 },
			{ day: '2026-03-01', count: 1 },
			{ day: '2026-01-31', count: 2 },
			{ day: '2019-12-24', count: 7 },
		])).toEqual({
			202603: 5,
			202601: 2,
			201912: 7,
		})
	})
})

describe('mergeMonthCounts', () => {
	test('keeps the months of every source with their highest count', () => {
		const summary = { 202603: 5, 202601: 2, 201912: 7 }
		const loaded = { 202603: 8, 202602: 3, 202601: 1 }

		expect(mergeMonthCounts(summary, loaded)).toEqual({
			202603: 8,
			202602: 3,
			202601: 2,
			201912: 7,
		})
	})

	test('returns the loaded counts when the summary is empty', () => {
		expect(mergeMonthCounts({}, { 202603: 8 })).toEqual({ 202603: 8 })
	})
})

describe('sortMonthsNewestFirst', () => {
	test('sorts across years', () => {
		expect(sortMonthsNewestFirst(['201912', '202603', '202601', '202012'])).toEqual(['202603', '202601', '202012', '201912'])
	})
})

describe('endOfMonth', () => {
	test('returns the start of the next month in local time', () => {
		expect(endOfMonth('202603')).toBe(new Date(2026, 3, 1).getTime() / 1000)
	})

	test('rolls over to the next year after December', () => {
		expect(endOfMonth('201912')).toBe(new Date(2020, 0, 1).getTime() / 1000)
	})
})

describe('closestLoadedMonth', () => {
	const loaded = ['202603', '202601', '201912']

	test('returns the month when it is loaded', () => {
		expect(closestLoadedMonth('202601', loaded)).toBe('202601')
	})

	test('falls back to the closest older month', () => {
		expect(closestLoadedMonth('202602', loaded)).toBe('202601')
		expect(closestLoadedMonth('202005', loaded)).toBe('201912')
	})

	test('falls back to the oldest month when none is older', () => {
		expect(closestLoadedMonth('201801', loaded)).toBe('201912')
	})

	test('returns nothing without loaded months', () => {
		expect(closestLoadedMonth('202601', [])).toBe('')
	})
})
