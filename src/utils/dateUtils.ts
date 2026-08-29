/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCanonicalLocale } from '@nextcloud/l10n'

/**
 * `Intl.DateTimeFormat` instances are expensive to build, so the ones used on
 * hot paths - the month grouping headers and the scrubber - are kept around.
 */
const formatterCache = new Map<string, Intl.DateTimeFormat>()

/**
 * Get a cached `Intl.DateTimeFormat` for the current locale.
 *
 * @param options - The formatting options, they double as the cache key.
 */
function getFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	const locale = getCanonicalLocale()
	// The locale is part of the key so a locale change invalidates the cache.
	const key = `${locale}:${JSON.stringify(options)}`
	let formatter = formatterCache.get(key)

	if (formatter === undefined) {
		formatter = new Intl.DateTimeFormat(locale, options)
		formatterCache.set(key, formatter)
	}

	return formatter
}

/**
 * Pad a number to two digits, as used by the `YYYYMM` and `MMDD` date keys.
 *
 * @param value - The number to pad.
 */
function pad(value: number): string {
	return String(value).padStart(2, '0')
}

/**
 * Build the `YYYYMM` key photos are grouped by, in local time.
 *
 * @param date - The date to build the key of.
 */
export function toMonthKey(date: Date): string {
	return `${date.getFullYear()}${pad(date.getMonth() + 1)}`
}

/**
 * Build the `MMDD` key the "On this day" filter matches on, in local time.
 *
 * @param date - The date to build the key of.
 */
export function toDayKey(date: Date): string {
	return `${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

/**
 * Parse a `YYYYMM` month key back into the first day of that month, in local time.
 *
 * @param month - The month key to parse.
 */
export function fromMonthKey(month: string): Date {
	return new Date(Number.parseInt(month.slice(0, 4)), Number.parseInt(month.slice(4, 6)) - 1)
}

/**
 * Format a month key as its month name only, like *August*.
 *
 * @param month - The `YYYYMM` month key to format.
 */
export function formatMonth(month: string): string {
	return getFormatter({ month: 'long' }).format(fromMonthKey(month))
}

/**
 * Format a month key as its year only, like *2026*.
 *
 * @param month - The `YYYYMM` month key to format.
 */
export function formatYear(month: string): string {
	return getFormatter({ year: 'numeric' }).format(fromMonthKey(month))
}

/**
 * Format a date as a month and a year, like *August 2026*.
 *
 * @param date - The date to format, or the `YYYYMM` month key of it.
 * @param short - Whether to abbreviate the month name, like *Aug 2026*.
 */
export function formatMonthAndYear(date: Date | string, short = false): string {
	return getFormatter({ month: short ? 'short' : 'long', year: 'numeric' })
		.format(typeof date === 'string' ? fromMonthKey(date) : date)
}

/**
 * Format a date without its time, like *29 Aug 2026*.
 *
 * @param date - The date to format.
 */
export function formatDate(date: Date): string {
	return getFormatter({ dateStyle: 'medium' }).format(date)
}

/**
 * Format the time of a date, like *14:53*.
 *
 * @param date - The date to format the time of.
 */
export function formatTime(date: Date): string {
	return getFormatter({ timeStyle: 'short' }).format(date)
}

/**
 * Format a date range as a single label, leaving out the parts shared by both
 * ends of the range, like *3 – 5 August 2026*.
 *
 * A range covering a single day is formatted as that one day.
 *
 * @param start - The start of the range.
 * @param end - The end of the range.
 */
export function formatDateRange(start: Date, end: Date): string {
	return getFormatter({ dateStyle: 'long' }).formatRange(start, end)
}
