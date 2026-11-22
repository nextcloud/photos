/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCanonicalLocale, translate as t } from '@nextcloud/l10n'

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

/** Largest UTC offset in use, in minutes (UTC+14 and UTC-12 are the extremes). */
const MAX_UTC_OFFSET = 14 * 60

/**
 * Read a UTC offset as written in the EXIF `OffsetTime*` entries, like *+09:00*.
 *
 * @param value - Raw offset entry
 * @return The offset in minutes east of UTC, `null` when it cannot be read
 */
export function parseUtcOffset(value: unknown): number | null {
	if (typeof value !== 'string') {
		return null
	}

	const match = value.trim().match(/^([+-])(\d{2}):?(\d{2})$/)
	if (match === null) {
		return null
	}

	const [, sign, hours, minutes] = match
	const offset = Number(hours) * 60 + Number(minutes)
	if (Number(minutes) >= 60 || offset > MAX_UTC_OFFSET) {
		return null
	}

	return sign === '-' ? -offset : offset
}

/**
 * Format a UTC offset, like *UTC+9* or *UTC-3:30*.
 *
 * @param offset - The offset in minutes east of UTC
 */
export function formatUtcOffset(offset: number): string {
	if (offset === 0) {
		return 'UTC'
	}

	const hours = Math.floor(Math.abs(offset) / 60)
	const minutes = Math.abs(offset) % 60
	return `UTC${offset < 0 ? '-' : '+'}${hours}${minutes === 0 ? '' : `:${pad(minutes)}`}`
}

/**
 * Format the moment a photo was taken with its date and time, like *14 June
 * 2024 at 09:12*.
 *
 * When the UTC offset of the place the photo was taken at is known, it is
 * written as the wall clock time of that place followed by the offset, like *14
 * June 2024 at 09:12 (UTC+9)*, instead of in the time zone of the viewer.
 *
 * @param date - The moment the photo was taken
 * @param utcOffset - The offset in minutes east of UTC, `null` when unknown
 */
export function formatCaptureTime(date: Date, utcOffset: number | null = null): string {
	const options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'short' }

	if (utcOffset === null) {
		return getFormatter(options).format(date)
	}

	// Shifting the moment by the offset and formatting it in UTC spells out the
	// wall clock time at that offset, without relying on offset time zones.
	const wallClock = new Date(date.getTime() + utcOffset * 60 * 1000)
	return t('photos', '{dateTime} ({utcOffset})', {
		dateTime: getFormatter({ ...options, timeZone: 'UTC' }).format(wallClock),
		utcOffset: formatUtcOffset(utcOffset),
	}, undefined, { escape: false, sanitize: false })
}

/**
 * Keep a formatted time together with what follows it, like its day period
 * and UTC offset, so a line only ever wraps before the time.
 *
 * @param dateTime - A formatted date and time, like *14 June 2024 at 9:12 AM (UTC+9)*
 * @return The text with non-breaking spaces from the time on
 */
export function keepTimeTogether(dateTime: string): string {
	const timeStart = dateTime.search(/\d{1,2}[:.]\d{2}/)
	if (timeStart === -1) {
		return dateTime
	}

	return dateTime.slice(0, timeStart) + dateTime.slice(timeStart).replace(/ /g, '\u00A0')
}
