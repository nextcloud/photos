/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { fromMonthKey, toDayKey, toMonthKey } from './dateUtils.ts'

export type CalendarEvent = {
	summary: string
	start: Date
	/** Exclusive end, equal to the start for an event without a duration. */
	end: Date
}

/** An event as listed under a month of the timeline. */
export type MonthEvent = {
	summary: string
	/** Days of the month the event covers, like *14* or *20–22*. */
	days: string
	/** First and last day of the whole event, as local midnight timestamps. */
	start: number
	end: number
}

const DAY_IN_MS = 24 * 60 * 60 * 1000
// Longest stretch of an event that is matched against the days with photos.
const MAX_EVENT_DAYS = 366

/**
 * Build the `YYYYMMDD` key of a day, in local time.
 *
 * @param date - The date to build the key of.
 */
export function toDateKey(date: Date): string {
	return toMonthKey(date) + toDayKey(date).slice(2)
}

/**
 * Parse an iCalendar DATE or DATE-TIME value. UTC values are converted to local
 * time, every other value is read as local time, whatever its TZID.
 *
 * @param value - The property value, like `20250314` or `20250314T100000Z`.
 */
function parseDate(value: string): Date | null {
	const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/)
	if (match === null) {
		return null
	}

	const [year, month, day, hours, minutes, seconds] = match.slice(1, 7).map((part) => Number.parseInt(part ?? '0'))
	return match[7] === 'Z'
		? new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
		: new Date(year, month - 1, day, hours, minutes, seconds)
}

/**
 * Parse an iCalendar DURATION value, like `P1D` or `PT1H30M`, into milliseconds.
 *
 * @param value - The property value.
 */
function parseDuration(value: string): number {
	const match = value.match(/^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/)
	if (match === null) {
		return 0
	}

	const [weeks, days, hours, minutes, seconds] = match.slice(1).map((part) => Number.parseInt(part ?? '0'))
	return (weeks * 7 + days) * DAY_IN_MS + ((hours * 60 + minutes) * 60 + seconds) * 1000
}

/**
 * Extract the events of an iCalendar document: their title, start and end.
 * Recurrence rules are not expanded, cancelled and untitled events are skipped.
 *
 * @param ics - The iCalendar document.
 */
export function parseCalendarEvents(ics: string): CalendarEvent[] {
	const events: CalendarEvent[] = []
	// Components the current line is nested in, to ignore the alarms of an event.
	const components: string[] = []
	let properties: Record<string, string> = {}

	// Long lines are folded onto continuation lines starting with a whitespace.
	for (const line of ics.replace(/\r?\n[ \t]/g, '').split(/\r?\n/)) {
		const match = line.match(/^([A-Za-z0-9-]+)((?:;[^=;:]+=(?:"[^"]*"|[^;:]*))*):(.*)$/)
		if (match === null) {
			continue
		}

		const name = match[1].toUpperCase()
		const value = match[3]
		if (name === 'BEGIN') {
			components.push(value.toUpperCase())
			if (value.toUpperCase() === 'VEVENT') {
				properties = {}
			}
		} else if (name === 'END') {
			if (components.pop() === 'VEVENT') {
				const event = toEvent(properties)
				if (event !== null) {
					events.push(event)
				}
			}
		} else if (components.at(-1) === 'VEVENT') {
			properties[name] = value
		}
	}

	return events
}

/**
 * Build an event from the properties of a VEVENT.
 *
 * @param properties - The property values by name.
 */
function toEvent(properties: Record<string, string>): CalendarEvent | null {
	const start = parseDate(properties.DTSTART ?? '')
	const summary = (properties.SUMMARY ?? '')
		.replace(/\\n/gi, ' ')
		.replace(/\\([\\;,])/g, '$1')
		.trim()
	if (start === null || summary === '' || properties.STATUS === 'CANCELLED') {
		return null
	}

	let end = parseDate(properties.DTEND ?? '')
	if (end === null && properties.DURATION !== undefined) {
		end = new Date(start.getTime() + parseDuration(properties.DURATION))
	} else if (end === null && !properties.DTSTART.includes('T')) {
		// An all-day event without an end lasts that one day.
		end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
	}

	return { summary, start, end: end !== null && end > start ? end : start }
}

/**
 * Group months into the time ranges to fetch events of, so that months close to
 * each other are covered by a single request.
 *
 * @param months - The `YYYYMM` month keys, in any order.
 * @param maxGap - How many months without photos a range may bridge.
 */
export function monthsToRanges(months: string[], maxGap = 2): { start: Date, end: Date }[] {
	const ranges: { start: Date, end: Date }[] = []
	for (const month of [...months].sort()) {
		const start = fromMonthKey(month)
		const end = new Date(start.getFullYear(), start.getMonth() + 1)
		const last = ranges.at(-1)
		if (last !== undefined && start <= new Date(last.end.getFullYear(), last.end.getMonth() + maxGap)) {
			last.end = end
		} else {
			ranges.push({ start, end })
		}
	}
	return ranges
}

/**
 * List, for every month, the events that happened on a day photos were taken.
 *
 * @param events - The events to map.
 * @param photoDays - The `YYYYMMDD` keys of the days with photos.
 */
export function mapEventsToMonths(events: CalendarEvent[], photoDays: Set<string>): Record<string, MonthEvent[]> {
	const eventsByMonth: Record<string, MonthEvent[]> = {}
	// The same event can be in several calendars.
	const seen = new Set<string>()

	for (const event of [...events].sort((a, b) => a.start.getTime() - b.start.getTime() || a.summary.localeCompare(b.summary))) {
		const key = `${event.summary}|${event.start.getTime()}|${event.end.getTime()}`
		if (seen.has(key)) {
			continue
		}
		seen.add(key)

		// The end is exclusive: an event ending at midnight does not cover that day.
		const last = new Date(Math.max(event.start.getTime(), event.end.getTime() - 1))
		const firstDay = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate())
		const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate())

		// The days of the event in each month it spans, and whether any has photos.
		const months: Record<string, { from: number, to: number, hasPhotos: boolean }> = {}
		const day = new Date(firstDay)
		for (let count = 0; day <= lastDay && count < MAX_EVENT_DAYS; count++) {
			const month = toMonthKey(day)
			months[month] = {
				from: months[month]?.from ?? day.getDate(),
				to: day.getDate(),
				hasPhotos: months[month]?.hasPhotos === true || photoDays.has(toDateKey(day)),
			}
			day.setDate(day.getDate() + 1)
		}

		for (const [month, { from, to, hasPhotos }] of Object.entries(months)) {
			if (!hasPhotos) {
				continue
			}
			eventsByMonth[month] = eventsByMonth[month] ?? []
			eventsByMonth[month].push({
				summary: event.summary,
				days: from === to ? `${from}` : `${from}–${to}`,
				start: firstDay.getTime(),
				end: lastDay.getTime(),
			})
		}
	}

	return eventsByMonth
}
