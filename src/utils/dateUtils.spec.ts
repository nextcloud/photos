/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
	formatDate,
	formatDateRange,
	formatMonth,
	formatMonthAndYear,
	formatTime,
	formatYear,
	fromMonthKey,
	toDayKey,
	toMonthKey,
} from './dateUtils.ts'

// The formatted output depends on the user locale, so it is pinned here instead
// of following whatever locale the machine running the tests happens to have.
const { getCanonicalLocale } = vi.hoisted(() => ({ getCanonicalLocale: vi.fn(() => 'en-GB') }))

vi.mock('@nextcloud/l10n', () => ({ getCanonicalLocale }))

beforeEach(() => {
	getCanonicalLocale.mockReturnValue('en-GB')
})

// The suite runs with `TZ=CET`, so local time is what these dates spell out.
describe('toMonthKey', () => {
	test('pads the month to two digits', () => {
		expect(toMonthKey(new Date(2026, 0, 15))).toBe('202601')
	})

	test('keeps two digit months as they are', () => {
		expect(toMonthKey(new Date(2026, 11, 31))).toBe('202612')
	})

	test('uses local time rather than UTC', () => {
		// One minute into January in CET is still December in UTC.
		expect(toMonthKey(new Date(2026, 0, 1, 0, 1))).toBe('202601')
	})
})

describe('toDayKey', () => {
	test('pads both the month and the day to two digits', () => {
		expect(toDayKey(new Date(2026, 0, 5))).toBe('0105')
	})

	test('keeps two digit months and days as they are', () => {
		expect(toDayKey(new Date(2026, 10, 25))).toBe('1125')
	})

	test('uses local time rather than UTC', () => {
		expect(toDayKey(new Date(2026, 7, 29, 0, 1))).toBe('0829')
	})
})

describe('fromMonthKey', () => {
	test('parses a month key into the first day of that month', () => {
		expect(fromMonthKey('202608')).toEqual(new Date(2026, 7, 1))
	})

	test('round trips with toMonthKey', () => {
		expect(toMonthKey(fromMonthKey('199912'))).toBe('199912')
	})
})

describe('formatMonth', () => {
	test('formats a month key as the month name alone', () => {
		expect(formatMonth('202608')).toBe('August')
	})

	test('follows the user locale', () => {
		getCanonicalLocale.mockReturnValue('de-DE')
		expect(formatMonth('202608')).toBe('August')
		expect(formatMonth('202605')).toBe('Mai')
	})
})

describe('formatYear', () => {
	test('formats a month key as the year alone', () => {
		expect(formatYear('202608')).toBe('2026')
	})
})

describe('formatMonthAndYear', () => {
	test('formats a month key', () => {
		expect(formatMonthAndYear('202608')).toBe('August 2026')
	})

	test('formats a date', () => {
		expect(formatMonthAndYear(new Date(2026, 7, 29))).toBe('August 2026')
	})

	test('abbreviates the month name when asked to', () => {
		expect(formatMonthAndYear('202608', true)).toBe('Aug 2026')
	})

	test('follows the user locale', () => {
		getCanonicalLocale.mockReturnValue('de-DE')
		expect(formatMonthAndYear('202608')).toBe('August 2026')
	})
})

describe('formatDate', () => {
	test('formats a date without its time', () => {
		expect(formatDate(new Date(2026, 7, 29, 14, 53))).toBe('29 Aug 2026')
	})

	test('follows the user locale', () => {
		getCanonicalLocale.mockReturnValue('en-US')
		expect(formatDate(new Date(2026, 7, 29))).toBe('Aug 29, 2026')
	})
})

describe('formatTime', () => {
	test('formats the time of a date', () => {
		expect(formatTime(new Date(2026, 7, 29, 14, 53, 42))).toBe('14:53')
	})

	test('follows the user locale', () => {
		getCanonicalLocale.mockReturnValue('en-US')
		expect(formatTime(new Date(2026, 7, 29, 14, 53))).toBe('2:53 PM')
	})
})

// The dash the range formatter joins both ends with is padded with thin spaces
// rather than plain ones, so the ranges are matched instead of compared.
describe('formatDateRange', () => {
	test('formats a range within a day as that single day', () => {
		expect(formatDateRange(new Date(2026, 7, 29, 9), new Date(2026, 7, 29, 18)))
			.toBe('29 August 2026')
	})

	test('leaves out the month and the year shared by both ends', () => {
		expect(formatDateRange(new Date(2026, 7, 3), new Date(2026, 7, 5)))
			.toMatch(/^3\s–\s5 August 2026$/)
	})

	test('leaves out only the year when the months differ', () => {
		expect(formatDateRange(new Date(2026, 6, 30), new Date(2026, 7, 2)))
			.toMatch(/^30 July\s–\s2 August 2026$/)
	})

	test('spells out both ends when the years differ', () => {
		expect(formatDateRange(new Date(2025, 11, 30), new Date(2026, 0, 2)))
			.toMatch(/^30 December 2025\s–\s2 January 2026$/)
	})

	test('follows the user locale', () => {
		getCanonicalLocale.mockReturnValue('en-US')
		expect(formatDateRange(new Date(2026, 7, 3), new Date(2026, 7, 5)))
			.toMatch(/^August 3\s–\s5, 2026$/)
	})
})
