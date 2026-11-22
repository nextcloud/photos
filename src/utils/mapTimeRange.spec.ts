/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { filterByMonthRange, fromMonthIndex, getMonthRange, toMonthIndex } from './mapTimeRange.ts'

type Item = { month: string }

const items: Item[] = ['202403', '201912', '202001', '202212', '202001'].map((month) => ({ month }))

/**
 * @param from - The first month to keep, as a month key
 * @param to - The last month to keep, as a month key
 * @return The months of the kept items
 */
function filter(from?: string, to?: string): string[] {
	return filterByMonthRange(
		items,
		(item) => item.month,
		from === undefined ? undefined : toMonthIndex(from),
		to === undefined ? undefined : toMonthIndex(to),
	).map(({ month }) => month)
}

describe('toMonthIndex and fromMonthIndex', () => {
	test('number consecutive months consecutively across a year boundary', () => {
		expect(toMonthIndex('202001') - toMonthIndex('201912')).toBe(1)
		expect(toMonthIndex('202012') - toMonthIndex('202001')).toBe(11)
	})

	test('round-trip every month', () => {
		for (const month of ['199901', '202006', '202012', '203011']) {
			expect(fromMonthIndex(toMonthIndex(month))).toBe(month)
		}
	})
})

describe('getMonthRange', () => {
	test('has no range when there are no items', () => {
		expect(getMonthRange([], (item: Item) => item.month)).toBeUndefined()
	})

	test('spans from the oldest to the newest item whatever their order', () => {
		expect(getMonthRange(items, (item) => item.month)).toEqual([toMonthIndex('201912'), toMonthIndex('202403')])
	})

	test('covers a single month when all items share it', () => {
		const index = toMonthIndex('202005')
		expect(getMonthRange([{ month: '202005' }], (item) => item.month)).toEqual([index, index])
	})
})

describe('filterByMonthRange', () => {
	test('keeps every item, in order, without bounds', () => {
		expect(filterByMonthRange(items, (item) => item.month)).toBe(items)
	})

	test('keeps both ends of the range', () => {
		expect(filter('201912', '202001')).toEqual(['201912', '202001', '202001'])
	})

	test('applies a single bound', () => {
		expect(filter('202201')).toEqual(['202403', '202212'])
		expect(filter(undefined, '201912')).toEqual(['201912'])
	})

	test('keeps a single month', () => {
		expect(filter('202212', '202212')).toEqual(['202212'])
	})

	test('keeps nothing when no item falls in the range', () => {
		expect(filter('202101', '202111')).toEqual([])
	})
})
