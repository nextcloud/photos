/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { buildHeatmap, buildHeatmapYear, dayToTimestamp, heatmapCap, heatmapLevel, shiftDay } from './calendarHeatmap.ts'

describe('dayToTimestamp and shiftDay', () => {
	it('reads a day as the start of it in UTC', () => {
		expect(dayToTimestamp('2024-06-14')).toBe(Date.UTC(2024, 5, 14))
	})

	it('moves across months, years and daylight saving changes', () => {
		expect(shiftDay('2024-03-01', -1)).toBe('2024-02-29')
		expect(shiftDay('2024-12-30', 7)).toBe('2025-01-06')
		expect(shiftDay('2024-03-31', 1)).toBe('2024-04-01')
		expect(shiftDay('2024-10-27', 1)).toBe('2024-10-28')
	})
})

describe('heatmapCap and heatmapLevel', () => {
	it('caps the scale at the 95th percentile of the days with photos', () => {
		const days = Array.from({ length: 100 }, (_, index) => ({ day: `d${index}`, count: index + 1 }))
		expect(heatmapCap(days)).toBe(95)
		expect(heatmapCap([{ day: 'a', count: 0 }])).toBe(1)
		expect(heatmapCap([])).toBe(1)
	})

	it('spreads the counts over the colour steps', () => {
		expect(heatmapLevel(0, 20)).toBe(0)
		expect(heatmapLevel(1, 20)).toBe(1)
		expect(heatmapLevel(5, 20)).toBe(1)
		expect(heatmapLevel(6, 20)).toBe(2)
		expect(heatmapLevel(15, 20)).toBe(3)
		expect(heatmapLevel(20, 20)).toBe(4)
		expect(heatmapLevel(500, 20)).toBe(4)
	})
})

describe('buildHeatmapYear', () => {
	it('lays 2024 out with weeks starting on Monday', () => {
		const counts = new Map([['2024-06-14', 23], ['2024-01-01', 2]])
		const year = buildHeatmapYear(2024, counts, 1, 23)

		// 2024 starts on a Monday and has 366 days.
		expect(year.weekCount).toBe(53)
		expect(year.rows).toHaveLength(7)
		expect(year.rows.every((row) => row.length === 53)).toBe(true)
		expect(year.rows[0][0]).toEqual({ day: '2024-01-01', count: 2, level: 1 })
		expect(year.rows[6][0]?.day).toBe('2024-01-07')
		expect(year.rows[0][52]?.day).toBe('2024-12-30')
		expect(year.rows[1][52]?.day).toBe('2024-12-31')
		expect(year.rows[2][52]).toBeNull()
		expect(year.total).toBe(25)

		const cells = year.rows.flat().filter((cell) => cell !== null)
		expect(cells).toHaveLength(366)
		expect(cells.find((cell) => cell.day === '2024-06-14')).toEqual({ day: '2024-06-14', count: 23, level: 4 })
	})

	it('pads the first week when the year does not start on the first day of the week', () => {
		// The 1st of January 2024 is a Monday, the second row of a week starting on Sunday.
		const sunday = buildHeatmapYear(2024, new Map(), 0, 1)
		expect(sunday.rows[0][0]).toBeNull()
		expect(sunday.rows[1][0]?.day).toBe('2024-01-01')
		expect(sunday.rows[0][1]?.day).toBe('2024-01-07')

		// The 1st of January 2023 is a Sunday, the last row of a week starting on Monday.
		const monday = buildHeatmapYear(2023, new Map(), 1, 1)
		expect(monday.rows[6][0]?.day).toBe('2023-01-01')
		expect(monday.rows[5][0]).toBeNull()
		expect(monday.weekCount).toBe(53)
		expect(monday.rows.flat().filter((cell) => cell !== null)).toHaveLength(365)
	})

	it('keeps every weekday on its own row', () => {
		for (const firstDay of [0, 1, 6]) {
			const year = buildHeatmapYear(2025, new Map(), firstDay, 1)
			year.rows.forEach((row, index) => {
				for (const cell of row) {
					if (cell !== null) {
						expect(new Date(dayToTimestamp(cell.day)).getUTCDay()).toBe((firstDay + index) % 7)
					}
				}
			})
		}
	})

	it('labels the twelve months over all the week columns', () => {
		for (const [year, firstDay] of [[2023, 1], [2024, 0], [2024, 1], [2026, 6]]) {
			const { months, weekCount } = buildHeatmapYear(year, new Map(), firstDay, 1)
			expect(months.map(({ month }) => month)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
			expect(months.reduce((sum, { span }) => sum + span, 0)).toBe(weekCount)
			expect(months.every(({ span }) => span >= 4)).toBe(true)
		}
	})
})

describe('buildHeatmap', () => {
	it('builds the years with photos, newest first', () => {
		const years = buildHeatmap([
			{ day: '2021-05-02', count: 4 },
			{ day: '2024-06-14', count: 23 },
			{ day: '2024-06-15', count: 1 },
			{ day: '2019-01-01', count: 0 },
		], 1)

		expect(years.map(({ year }) => year)).toEqual([2024, 2021])
		expect(years.map(({ total }) => total)).toEqual([24, 4])
	})

	it('returns nothing for an empty library', () => {
		expect(buildHeatmap([], 1)).toEqual([])
	})
})
