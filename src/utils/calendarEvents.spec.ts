/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { mapEventsToMonths, monthsToRanges, parseCalendarEvents, toDateKey } from './calendarEvents.ts'

/**
 * Wrap VEVENT bodies into an iCalendar document.
 *
 * @param events - The property lines of each event.
 */
function calendar(...events: string[][]): string {
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		...events.flatMap((lines) => ['BEGIN:VEVENT', ...lines, 'END:VEVENT']),
		'END:VCALENDAR',
	].join('\r\n')
}

describe('parseCalendarEvents', () => {
	it('parses an all-day event with an exclusive end', () => {
		const events = parseCalendarEvents(calendar([
			'SUMMARY:Conference Berlin',
			'DTSTART;VALUE=DATE:20250320',
			'DTEND;VALUE=DATE:20250323',
		]))

		expect(events).toEqual([{
			summary: 'Conference Berlin',
			start: new Date(2025, 2, 20),
			end: new Date(2025, 2, 23),
		}])
	})

	it('gives an all-day event without an end a single day', () => {
		const [event] = parseCalendarEvents(calendar(['SUMMARY:Birthday', 'DTSTART;VALUE=DATE:20250314']))

		expect(event.end).toEqual(new Date(2025, 2, 15))
	})

	it('converts UTC times to local time', () => {
		const [event] = parseCalendarEvents(calendar([
			'SUMMARY:Dinner',
			'DTSTART:20250314T180000Z',
			'DTEND:20250314T200000Z',
		]))

		// The tests run in CET, one hour ahead of UTC in March.
		expect(event.start).toEqual(new Date(2025, 2, 14, 19))
		expect(event.end).toEqual(new Date(2025, 2, 14, 21))
	})

	it('reads times with a time zone or without one as local time', () => {
		const events = parseCalendarEvents(calendar(
			['SUMMARY:Zoned', 'DTSTART;TZID=Europe/Berlin:20250314T100000', 'DTEND;TZID="Europe/Berlin":20250314T110000'],
			['SUMMARY:Floating', 'DTSTART:20250314T100000'],
		))

		expect(events[0].start).toEqual(new Date(2025, 2, 14, 10))
		expect(events[0].end).toEqual(new Date(2025, 2, 14, 11))
		expect(events[1].end).toEqual(events[1].start)
	})

	it('computes the end from a duration', () => {
		const [event] = parseCalendarEvents(calendar(['SUMMARY:Hike', 'DTSTART:20250314T100000', 'DURATION:P1DT2H30M']))

		expect(event.end).toEqual(new Date(2025, 2, 15, 12, 30))
	})

	it('unfolds long lines and unescapes the title', () => {
		const [event] = parseCalendarEvents(calendar([
			'SUMMARY:Anna\\, Ben\\; and a very long',
			'  title\\nsecond line',
			'DTSTART;VALUE=DATE:20250314',
		]))

		expect(event.summary).toBe('Anna, Ben; and a very long title second line')
	})

	it('ignores the properties of alarms', () => {
		const [event] = parseCalendarEvents(calendar([
			'SUMMARY:Dentist',
			'DTSTART:20250314T100000',
			'BEGIN:VALARM',
			'SUMMARY:Reminder',
			'TRIGGER:-PT15M',
			'END:VALARM',
		]))

		expect(event.summary).toBe('Dentist')
	})

	it('skips cancelled, untitled and undated events', () => {
		const events = parseCalendarEvents(calendar(
			['SUMMARY:Cancelled', 'DTSTART;VALUE=DATE:20250314', 'STATUS:CANCELLED'],
			['DTSTART;VALUE=DATE:20250314'],
			['SUMMARY:No date'],
			['SUMMARY:Broken date', 'DTSTART:yesterday'],
		))

		expect(events).toEqual([])
	})

	it('returns every instance of an expanded recurring event', () => {
		const events = parseCalendarEvents(calendar(
			['SUMMARY:Yoga', 'DTSTART:20250303T180000Z', 'RECURRENCE-ID:20250303T180000Z'],
			['SUMMARY:Yoga', 'DTSTART:20250310T180000Z', 'RECURRENCE-ID:20250310T180000Z'],
		))

		expect(events.map((event) => event.start.getDate())).toEqual([3, 10])
	})
})

describe('monthsToRanges', () => {
	it('covers months close to each other with one range', () => {
		expect(monthsToRanges(['202503', '202501', '202412'])).toEqual([
			{ start: new Date(2024, 11, 1), end: new Date(2025, 3, 1) },
		])
	})

	it('splits months that are far apart', () => {
		expect(monthsToRanges(['202503', '201907'])).toEqual([
			{ start: new Date(2019, 6, 1), end: new Date(2019, 7, 1) },
			{ start: new Date(2025, 2, 1), end: new Date(2025, 3, 1) },
		])
	})

	it('returns nothing without months', () => {
		expect(monthsToRanges([])).toEqual([])
	})
})

describe('mapEventsToMonths', () => {
	const birthday = { summary: 'Anna\'s birthday', start: new Date(2025, 2, 14), end: new Date(2025, 2, 15) }
	const conference = { summary: 'Conference Berlin', start: new Date(2025, 2, 20), end: new Date(2025, 2, 23) }

	it('builds the day key of a date', () => {
		expect(toDateKey(new Date(2025, 2, 4))).toBe('20250304')
	})

	it('lists the events of days with photos, in order', () => {
		const eventsByMonth = mapEventsToMonths([conference, birthday], new Set(['20250314', '20250321']))

		expect(eventsByMonth).toEqual({
			202503: [
				{ summary: 'Anna\'s birthday', days: '14', start: new Date(2025, 2, 14).getTime(), end: new Date(2025, 2, 14).getTime() },
				{ summary: 'Conference Berlin', days: '20–22', start: new Date(2025, 2, 20).getTime(), end: new Date(2025, 2, 22).getTime() },
			],
		})
	})

	it('leaves out events without photos', () => {
		expect(mapEventsToMonths([birthday, conference], new Set(['20250315', '20250323']))).toEqual({})
	})

	it('lists a timed event on its day, also when it ends at midnight', () => {
		const party = { summary: 'Party', start: new Date(2025, 2, 14, 20), end: new Date(2025, 2, 15) }
		const instant = { summary: 'Departure', start: new Date(2025, 2, 14, 9), end: new Date(2025, 2, 14, 9) }

		const eventsByMonth = mapEventsToMonths([party, instant], new Set(['20250314', '20250315']))

		expect(eventsByMonth['202503'].map(({ summary, days }) => `${summary} ${days}`)).toEqual(['Departure 14', 'Party 14'])
	})

	it('clamps an event spanning two months to each month with photos', () => {
		const trip = { summary: 'Trip', start: new Date(2025, 2, 30), end: new Date(2025, 3, 3) }
		const range = { start: new Date(2025, 2, 30).getTime(), end: new Date(2025, 3, 2).getTime() }

		expect(mapEventsToMonths([trip], new Set(['20250331', '20250401']))).toEqual({
			202503: [{ summary: 'Trip', days: '30–31', ...range }],
			202504: [{ summary: 'Trip', days: '1–2', ...range }],
		})
		expect(Object.keys(mapEventsToMonths([trip], new Set(['20250402'])))).toEqual(['202504'])
	})

	it('lists an event found in several calendars once', () => {
		const eventsByMonth = mapEventsToMonths([birthday, { ...birthday }], new Set(['20250314']))

		expect(eventsByMonth['202503']).toHaveLength(1)
	})
})
