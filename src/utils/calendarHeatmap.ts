/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type DayCount = { day: string, count: number }

export type HeatmapDay = {
	/** The day as `YYYY-MM-DD`. */
	day: string
	count: number
	/** Colour step of the day, 0 for a day without photos up to `HEATMAP_LEVELS`. */
	level: number
}

export type HeatmapYear = {
	year: number
	/** Number of photos taken in the year. */
	total: number
	/** Number of week columns of the grid. */
	weekCount: number
	/** One row per weekday, starting with the first day of the week, one cell per week. Cells outside of the year are `null`. */
	rows: (HeatmapDay | null)[][]
	/** The months in order, with the number of week columns their label spans. */
	months: { month: number, span: number }[]
}

/** Number of colour steps for the days with photos. */
export const HEATMAP_LEVELS = 4

const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Timestamp of the start of a day, in UTC.
 *
 * @param day - The day as `YYYY-MM-DD`
 */
export function dayToTimestamp(day: string): number {
	const [year, month, date] = day.split('-').map(Number)
	return Date.UTC(year, month - 1, date)
}

/**
 * The day `days` days away from a day, as `YYYY-MM-DD`.
 *
 * @param day - The day as `YYYY-MM-DD`
 * @param days - Number of days to move by, negative to go back
 */
export function shiftDay(day: string, days: number): string {
	return new Date(dayToTimestamp(day) + days * MS_PER_DAY).toISOString().slice(0, 10)
}

/**
 * Photo count from which a day gets the strongest colour.
 *
 * It is the 95th percentile of the days with photos, so a few exceptional
 * days do not flatten every other day down to the weakest colour.
 *
 * @param days - Photo count per day
 */
export function heatmapCap(days: DayCount[]): number {
	const counts = days
		.map(({ count }) => count)
		.filter((count) => count > 0)
		.sort((count1, count2) => count1 - count2)

	return counts.length === 0 ? 1 : counts[Math.ceil(counts.length * 0.95) - 1]
}

/**
 * Colour step of a day.
 *
 * @param count - Number of photos of the day
 * @param cap - Photo count from which a day gets the strongest colour
 */
export function heatmapLevel(count: number, cap: number): number {
	if (count <= 0) {
		return 0
	}
	return Math.min(HEATMAP_LEVELS, Math.max(1, Math.ceil((count / cap) * HEATMAP_LEVELS)))
}

/**
 * Lay a year out as a grid of week columns and weekday rows.
 *
 * @param year - The year to lay out
 * @param counts - Photo count per `YYYY-MM-DD` day, days without photos can be left out
 * @param firstDay - First day of the week, 0 being Sunday
 * @param cap - Photo count from which a day gets the strongest colour
 */
export function buildHeatmapYear(year: number, counts: Map<string, number>, firstDay: number, cap: number): HeatmapYear {
	const start = Date.UTC(year, 0, 1)
	const dayCount = (Date.UTC(year + 1, 0, 1) - start) / MS_PER_DAY
	// Row of the 1st of January.
	const offset = (new Date(start).getUTCDay() - firstDay + 7) % 7
	const weekCount = Math.ceil((offset + dayCount) / 7)

	const rows: (HeatmapDay | null)[][] = Array.from({ length: 7 }, () => Array(weekCount).fill(null))
	// A week belongs to the month of its first day inside the year.
	const weekMonths: number[] = []
	let total = 0

	for (let index = 0; index < dayCount; index++) {
		const date = new Date(start + index * MS_PER_DAY)
		const day = date.toISOString().slice(0, 10)
		const count = counts.get(day) ?? 0
		const week = Math.floor((offset + index) / 7)

		rows[(offset + index) % 7][week] = { day, count, level: heatmapLevel(count, cap) }
		weekMonths[week] ??= date.getUTCMonth()
		total += count
	}

	const months: HeatmapYear['months'] = []
	for (const month of weekMonths) {
		const last = months.at(-1)
		if (last?.month === month) {
			last.span++
		} else {
			months.push({ month, span: 1 })
		}
	}

	return { year, total, weekCount, rows, months }
}

/**
 * Build the grids of every year with photos, newest year first.
 *
 * @param days - Photo count per day
 * @param firstDay - First day of the week, 0 being Sunday
 */
export function buildHeatmap(days: DayCount[], firstDay: number): HeatmapYear[] {
	const counts = new Map(days.filter(({ count }) => count > 0).map(({ day, count }) => [day, count]))
	const years = [...new Set([...counts.keys()].map((day) => Number(day.slice(0, 4))))]
	const cap = heatmapCap(days)

	return years
		.sort((year1, year2) => year2 - year1)
		.map((year) => buildHeatmapYear(year, counts, firstDay, cap))
}
