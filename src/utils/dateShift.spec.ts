/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { applyDateChange, getTimestampRange, parseDateShift } from './dateShift.ts'

describe('parseDateShift', () => {
	test('adds up days, hours and minutes in seconds', () => {
		expect(parseDateShift({ days: '1', hours: '2', minutes: '3' })).toBe(86400 + 7200 + 180)
	})

	test('accepts negative parts and numbers', () => {
		expect(parseDateShift({ days: -1, hours: '0', minutes: '30' })).toBe(-86400 + 1800)
		expect(parseDateShift({ days: '0', hours: '-9', minutes: '' })).toBe(-9 * 3600)
	})

	test('counts empty parts as zero', () => {
		expect(parseDateShift({ days: '', hours: ' ', minutes: '' })).toBe(0)
	})

	test('rejects parts which are not whole numbers', () => {
		expect(parseDateShift({ days: '1.5', hours: '0', minutes: '0' })).toBeNull()
		expect(parseDateShift({ days: '0', hours: 'two', minutes: '0' })).toBeNull()
		expect(parseDateShift({ days: '1e400', hours: '0', minutes: '0' })).toBeNull()
	})
})

describe('applyDateChange', () => {
	// 2024-03-15T12:00:00Z, 2024-03-15T12:00:05Z and 2024-03-16T08:30:00Z
	const takenAt = [1710504000, 1710504005, 1710577800]

	test('shifts every photo by the same amount, keeping the time between them', () => {
		const offset = parseDateShift({ days: '-1', hours: '2', minutes: '0' }) as number
		const shifted = takenAt.map((timestamp) => applyDateChange(timestamp, { mode: 'shift', offset }) as number)

		expect(shifted).toEqual([1710504000 - 79200, 1710504005 - 79200, 1710577800 - 79200])
		expect(shifted[1] - shifted[0]).toBe(5)
		expect(shifted[2] - shifted[1]).toBe(takenAt[2] - takenAt[1])
	})

	test('sets every photo to the same date', () => {
		expect(takenAt.map((timestamp) => applyDateChange(timestamp, { mode: 'set', takenAt: 1000 }))).toEqual([1000, 1000, 1000])
	})

	test('leaves the date alone when it is kept', () => {
		expect(applyDateChange(takenAt[0], { mode: 'keep' })).toBeUndefined()
	})
})

describe('getTimestampRange', () => {
	test('returns the earliest and the latest timestamp', () => {
		expect(getTimestampRange([30, 10, 20])).toEqual({ first: 10, last: 30 })
		expect(getTimestampRange([5])).toEqual({ first: 5, last: 5 })
	})

	test('returns nothing without timestamps', () => {
		expect(getTimestampRange([])).toBeNull()
	})
})
