/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { CalendarEvent } from '../utils/calendarEvents.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { parseCalendarEvents } from '../utils/calendarEvents.ts'
import { davClient } from './DavClient.ts'

const CALDAV_NS = 'urn:ietf:params:xml:ns:caldav'
const OWNCLOUD_NS = 'http://owncloud.org/ns'

let calendarPaths: Promise<string[]> | undefined

/**
 * Send a CalDAV request and parse its multistatus response.
 *
 * @param path - The path below the dav root.
 * @param method - The HTTP method.
 * @param data - The XML body.
 * @param signal - Signal to abort the request with.
 */
async function request(path: string, method: string, data: string, signal?: AbortSignal): Promise<Document> {
	const response = await davClient.customRequest(path, {
		method,
		data,
		signal,
		headers: { Depth: '1', 'Content-Type': 'application/xml; charset=utf-8' },
	})
	return new DOMParser().parseFromString(await response.text(), 'application/xml')
}

/**
 * Find the descendants of a node by namespace and local name.
 *
 * @param root - The node to search in.
 * @param namespace - The namespace of the elements.
 * @param name - The local name of the elements.
 */
function findElements(root: Document | Element, namespace: string, name: string): Element[] {
	return [...root.getElementsByTagName('*')]
		.filter((element) => element.namespaceURI === namespace && element.localName === name)
}

/**
 * Extract the paths of the calendars owned by a user from the listing of their
 * calendar home. Calendars shared by others and non-calendar collections are
 * left out.
 *
 * @param multistatus - The PROPFIND response.
 * @param uid - The id of the user.
 */
export function parseOwnCalendarPaths(multistatus: Document, uid: string): string[] {
	const paths: string[] = []
	for (const response of findElements(multistatus, 'DAV:', 'response')) {
		const href = findElements(response, 'DAV:', 'href')[0]?.textContent ?? ''
		const owner = findElements(response, OWNCLOUD_NS, 'owner-principal')[0]?.textContent?.trim() ?? ''
		const isCalendar = findElements(response, CALDAV_NS, 'calendar').length > 0
		const isOwn = owner === '' || owner.replace(/\/$/, '').endsWith(`/users/${uid}`)
		const path = href.match(/\/(calendars\/.+)$/)?.[1]
		if (isCalendar && isOwn && path !== undefined) {
			paths.push(path)
		}
	}
	return paths
}

/**
 * List the calendars of the current user, once.
 */
function getCalendarPaths(): Promise<string[]> {
	const uid = getCurrentUser()?.uid
	if (uid === undefined) {
		return Promise.resolve([])
	}

	calendarPaths ??= request(`calendars/${encodeURIComponent(uid)}/`, 'PROPFIND', `<?xml version="1.0"?>
		<d:propfind xmlns:d="DAV:" xmlns:oc="${OWNCLOUD_NS}">
			<d:prop><d:resourcetype/><oc:owner-principal/></d:prop>
		</d:propfind>`).then((multistatus) => parseOwnCalendarPaths(multistatus, uid))
	return calendarPaths
}

/**
 * Format a date as an iCalendar UTC date-time, like `20250314T100000Z`.
 *
 * @param date - The date to format.
 */
function toUtcDateTime(date: Date): string {
	return date.toISOString().replace(/[-:]|\.\d+/g, '')
}

/**
 * Fetch the events of the calendars of the current user in a time range.
 * Recurring events are expanded by the server, a calendar that cannot be read is
 * skipped.
 *
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @param signal - Signal to abort the requests with.
 */
export async function fetchCalendarEvents(start: Date, end: Date, signal?: AbortSignal): Promise<CalendarEvent[]> {
	const range = `start="${toUtcDateTime(start)}" end="${toUtcDateTime(end)}"`
	const query = `<?xml version="1.0"?>
		<c:calendar-query xmlns:d="DAV:" xmlns:c="${CALDAV_NS}">
			<d:prop><c:calendar-data><c:expand ${range}/></c:calendar-data></d:prop>
			<c:filter>
				<c:comp-filter name="VCALENDAR">
					<c:comp-filter name="VEVENT"><c:time-range ${range}/></c:comp-filter>
				</c:comp-filter>
			</c:filter>
		</c:calendar-query>`

	const results = await Promise.allSettled((await getCalendarPaths())
		.map((path) => request(path, 'REPORT', query, signal)))

	return results
		.flatMap((result) => result.status === 'fulfilled' ? findElements(result.value, CALDAV_NS, 'calendar-data') : [])
		.flatMap((calendarData) => parseCalendarEvents(calendarData.textContent ?? ''))
}
