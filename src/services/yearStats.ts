/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { toDayKey, toMonthKey } from '../utils/dateUtils.ts'

export type YearStats = {
	/** Year the numbers cover. */
	year: number
	/** Number of photos taken during that year, videos left out. */
	photoCount: number
	/** Number of videos taken during that year. */
	videoCount: number
	/** Number of days at least one photo or video was taken on. */
	dayCount: number
	/** Number of distinct places the photos were taken in. */
	placeCount: number
	/** Month the most photos and videos were taken in, as a `YYYYMM` key. */
	busiestMonth: { month: string, count: number } | null
	/** Day the most photos and videos were taken on. */
	busiestDay: { date: Date, count: number } | null
	/** Places the most photos were taken in, the most visited first. */
	topPlaces: { name: string, count: number }[]
}

/** Number of places listed in the numbers of a year. */
const TOP_PLACES_COUNT = 3

/**
 * Sum up the photos taken during a year.
 *
 * @param photos - Photos to count, of any year
 * @param year - Year to sum up
 */
export function buildYearStats(photos: PhotoFile[], year: number): YearStats {
	const months = new Map<string, number>()
	const days = new Map<string, { date: Date, count: number }>()
	const places = new Map<string, number>()
	let photoCount = 0
	let videoCount = 0

	for (const photo of photos) {
		const date = new Date(photo.attributes.timestamp * 1000)
		if (date.getFullYear() !== year) {
			continue
		}

		if (photo.mime?.startsWith('video/')) {
			videoCount++
		} else {
			photoCount++
		}

		const month = toMonthKey(date)
		months.set(month, (months.get(month) ?? 0) + 1)

		const day = days.get(toDayKey(date)) ?? { date, count: 0 }
		day.count++
		days.set(toDayKey(date), day)

		const place = photo.attributes['metadata-photos-place']
		if (typeof place === 'string' && place !== '') {
			places.set(place, (places.get(place) ?? 0) + 1)
		}
	}

	// The earliest of equally busy months or days wins.
	const [busiestMonth] = [...months.entries()].sort(([month1, count1], [month2, count2]) => count2 - count1 || month1.localeCompare(month2))
	const [busiestDay] = [...days.entries()].sort(([day1, { count: count1 }], [day2, { count: count2 }]) => count2 - count1 || day1.localeCompare(day2))

	return {
		year,
		photoCount,
		videoCount,
		dayCount: days.size,
		placeCount: places.size,
		busiestMonth: busiestMonth === undefined ? null : { month: busiestMonth[0], count: busiestMonth[1] },
		busiestDay: busiestDay === undefined ? null : busiestDay[1],
		topPlaces: [...places.entries()]
			.sort(([name1, count1], [name2, count2]) => count2 - count1 || name1.localeCompare(name2))
			.slice(0, TOP_PLACES_COUNT)
			.map(([name, count]) => ({ name, count })),
	}
}
