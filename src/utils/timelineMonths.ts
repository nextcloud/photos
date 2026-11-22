/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TimelineDay } from '../services/TimelineDays.ts'

import { fromMonthKey } from './dateUtils.ts'

/**
 * Sum the photo counts of a days summary per `YYYYMM` month key.
 *
 * @param days - Photo count per `YYYY-MM-DD` day
 */
export function monthCountsFromDays(days: TimelineDay[]): Record<string, number> {
	const counts: Record<string, number> = {}
	for (const { day, count } of days) {
		const month = day.slice(0, 4) + day.slice(5, 7)
		counts[month] = (counts[month] ?? 0) + count
	}
	return counts
}

/**
 * Merge month counts from several sources, keeping the highest count of each
 * month. The days summary misses the photos of shares, while the loaded photos
 * miss the ones not fetched yet, so neither one alone is a lower bound.
 *
 * @param countsList - Photo count per month key, one record per source
 */
export function mergeMonthCounts(...countsList: Record<string, number>[]): Record<string, number> {
	const merged: Record<string, number> = {}
	for (const counts of countsList) {
		for (const [month, count] of Object.entries(counts)) {
			merged[month] = Math.max(merged[month] ?? 0, count)
		}
	}
	return merged
}

/**
 * Sort month keys newest first.
 *
 * @param months - `YYYYMM` month keys
 */
export function sortMonthsNewestFirst(months: string[]): string[] {
	return [...months].sort((month1, month2) => month1 > month2 ? -1 : 1)
}

/**
 * Unix timestamp, in seconds, of the first moment after a month, in local time
 * like the month keys photos are grouped by.
 *
 * @param month - `YYYYMM` month key
 */
export function endOfMonth(month: string): number {
	const start = fromMonthKey(month)
	return new Date(start.getFullYear(), start.getMonth() + 1).getTime() / 1000
}

/**
 * Loaded month to show for a requested month: the month itself, else the
 * closest older one, else the oldest loaded month. The requested month can be
 * missing when it only holds photos the search does not return.
 *
 * @param month - Requested `YYYYMM` month key
 * @param loadedMonths - Month keys with loaded photos, newest first
 */
export function closestLoadedMonth(month: string, loadedMonths: string[]): string {
	return loadedMonths.find((loadedMonth) => loadedMonth <= month)
		?? loadedMonths[loadedMonths.length - 1]
		?? ''
}
