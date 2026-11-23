/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

const customRequest = vi.hoisted(() => vi.fn())
vi.mock('./DavClient.ts', () => ({ davClient: { customRequest } }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

const calendarHome = `<?xml version="1.0"?>
<d:multistatus xmlns:d="DAV:" xmlns:cal="urn:ietf:params:xml:ns:caldav" xmlns:oc="http://owncloud.org/ns">
	<d:response>
		<d:href>/remote.php/dav/calendars/alice/</d:href>
		<d:propstat><d:prop><d:resourcetype><d:collection/></d:resourcetype></d:prop></d:propstat>
	</d:response>
	<d:response>
		<d:href>/remote.php/dav/calendars/alice/personal/</d:href>
		<d:propstat><d:prop>
			<d:resourcetype><d:collection/><cal:calendar/></d:resourcetype>
			<oc:owner-principal>principals/users/alice</oc:owner-principal>
		</d:prop></d:propstat>
	</d:response>
	<d:response>
		<d:href>/remote.php/dav/calendars/alice/team_shared_by_bob/</d:href>
		<d:propstat><d:prop>
			<d:resourcetype><d:collection/><cal:calendar/></d:resourcetype>
			<oc:owner-principal>principals/users/bob</oc:owner-principal>
		</d:prop></d:propstat>
	</d:response>
	<d:response>
		<d:href>/remote.php/dav/calendars/alice/inbox/</d:href>
		<d:propstat><d:prop><d:resourcetype><d:collection/><cal:schedule-inbox/></d:resourcetype></d:prop></d:propstat>
	</d:response>
</d:multistatus>`

const report = `<?xml version="1.0"?>
<d:multistatus xmlns:d="DAV:" xmlns:cal="urn:ietf:params:xml:ns:caldav">
	<d:response>
		<d:href>/remote.php/dav/calendars/alice/personal/a.ics</d:href>
		<d:propstat><d:prop><cal:calendar-data>BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Anna &amp; Ben
DTSTART;VALUE=DATE:20250314
END:VEVENT
END:VCALENDAR
</cal:calendar-data></d:prop></d:propstat>
	</d:response>
</d:multistatus>`

describe('calendarEvents', () => {
	beforeEach(() => {
		vi.resetModules()
		customRequest.mockReset()
	})

	it('keeps the calendars owned by the user', async () => {
		const { parseOwnCalendarPaths } = await import('./calendarEvents.ts')
		const multistatus = new DOMParser().parseFromString(calendarHome, 'application/xml')

		expect(parseOwnCalendarPaths(multistatus, 'alice')).toEqual(['calendars/alice/personal/'])
	})

	it('queries each own calendar for the time range and parses the events', async () => {
		customRequest.mockImplementation(async (path: string, { method }: { method: string }) => ({
			text: async () => method === 'PROPFIND' ? calendarHome : report,
		}))
		const { fetchCalendarEvents } = await import('./calendarEvents.ts')

		const events = await fetchCalendarEvents(new Date(Date.UTC(2025, 2, 1)), new Date(Date.UTC(2025, 3, 1)))
		await fetchCalendarEvents(new Date(Date.UTC(2025, 3, 1)), new Date(Date.UTC(2025, 4, 1)))

		expect(events.map((event) => event.summary)).toEqual(['Anna & Ben'])
		// The calendars are listed once, then each range is one REPORT.
		expect(customRequest.mock.calls.map(([path, { method }]) => `${method} ${path}`)).toEqual([
			'PROPFIND calendars/alice/',
			'REPORT calendars/alice/personal/',
			'REPORT calendars/alice/personal/',
		])
		expect(customRequest.mock.calls[1][1].data).toContain('<c:time-range start="20250301T000000Z" end="20250401T000000Z"/>')
		expect(customRequest.mock.calls[1][1].data).toContain('<c:expand start="20250301T000000Z" end="20250401T000000Z"/>')
	})

	it('skips a calendar that cannot be read', async () => {
		customRequest.mockImplementation(async (path: string, { method }: { method: string }) => {
			if (method === 'REPORT') {
				throw new Error('Forbidden')
			}
			return { text: async () => calendarHome }
		})
		const { fetchCalendarEvents } = await import('./calendarEvents.ts')

		expect(await fetchCalendarEvents(new Date(2025, 2, 1), new Date(2025, 3, 1))).toEqual([])
	})
})
