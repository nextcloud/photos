/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, Ref } from 'vue'
import type { PhotoFile } from '../store/files.ts'
import type { CalendarEvent, MonthEvent } from '../utils/calendarEvents.ts'

import { computed, ref, shallowRef, watch } from 'vue'
import { fetchCalendarEvents } from '../services/calendarEvents.ts'
import { logger } from '../services/logger.ts'
import { mapEventsToMonths, monthsToRanges, toDateKey } from '../utils/calendarEvents.ts'

const STORAGE_KEY = 'photos:show-calendar-events'

/**
 * Read the opt-in from the browser storage, off when it cannot be read.
 */
function readSetting(): boolean {
	try {
		return window.localStorage.getItem(STORAGE_KEY) === 'true'
	} catch {
		return false
	}
}

// Whether calendar events are shown in the timeline, shared by the settings and the timeline.
export const showCalendarEvents = ref(readSetting())

/**
 * Turn the calendar events of the timeline on or off, for this browser.
 *
 * @param value - Whether to show the events.
 */
export function setShowCalendarEvents(value: boolean): void {
	showCalendarEvents.value = value
	try {
		window.localStorage.setItem(STORAGE_KEY, String(value))
	} catch {
		// The choice then only lasts until the page is reloaded.
	}
}

/**
 * Fetch the calendar events of the months of a timeline, when the user opted
 * in, and list them by month. Only events on days with photos are listed.
 *
 * @param months - The `YYYYMM` keys of the months loaded in the timeline.
 * @param fetchedFileIds - Ids of the photos of the timeline.
 * @param files - Photos of the store, by id.
 */
export function useCalendarEvents(
	months: Ref<string[]>,
	fetchedFileIds: Ref<number[]>,
	files: Ref<Record<string, PhotoFile>>,
): { eventsByMonth: ComputedRef<Record<string, MonthEvent[]>> } {
	const events = shallowRef<CalendarEvent[]>([])
	const requestedMonths = new Set<string>()

	watch([showCalendarEvents, months], async () => {
		if (!showCalendarEvents.value) {
			return
		}

		const missingMonths = months.value.filter((month) => !requestedMonths.has(month))
		missingMonths.forEach((month) => requestedMonths.add(month))

		for (const { start, end } of monthsToRanges(missingMonths)) {
			try {
				const fetchedEvents = await fetchCalendarEvents(start, end)
				events.value = [...events.value, ...fetchedEvents]
			} catch (error) {
				logger.debug('Could not fetch calendar events', { error })
			}
		}
	}, { immediate: true })

	const eventsByMonth = computed(() => {
		if (!showCalendarEvents.value || events.value.length === 0) {
			return {}
		}

		const photoDays = new Set<string>()
		for (const fileId of fetchedFileIds.value) {
			const timestamp = files.value[fileId]?.attributes.timestamp
			if (timestamp !== undefined) {
				photoDays.add(toDateKey(new Date(timestamp * 1000)))
			}
		}
		return mapEventsToMonths(events.value, photoDays)
	})

	return { eventsByMonth }
}
