/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** Amount to move dates by, as typed by the user. Each part can be negative. */
export type DateShift = {
	days: string | number
	hours: string | number
	minutes: string | number
}

/** How the taken date of several photos is changed. */
export type DateChange = { mode: 'keep' }
	| { mode: 'shift', offset: number }
	| { mode: 'set', takenAt: number }

/**
 * Read a date shift typed by the user. Empty parts count as zero.
 *
 * @param shift - Days, hours and minutes to move the dates by
 * @return The shift in seconds, `null` when a part is not a whole number
 */
export function parseDateShift(shift: DateShift): number | null {
	const parts = [shift.days, shift.hours, shift.minutes].map((part) => {
		const value = String(part).trim()
		return value === '' ? 0 : Number(value)
	})

	if (parts.some((part) => !Number.isSafeInteger(part))) {
		return null
	}

	const [days, hours, minutes] = parts
	return ((days * 24 + hours) * 60 + minutes) * 60
}

/**
 * Apply a date change to the taken date of a photo. A shift moves every photo
 * by the same amount, which keeps the time elapsed between them.
 *
 * @param takenAt - Current taken date, as a unix timestamp in seconds
 * @param change - Change to apply
 * @return The new taken date, `undefined` when it is kept
 */
export function applyDateChange(takenAt: number, change: DateChange): number | undefined {
	switch (change.mode) {
		case 'shift':
			return takenAt + change.offset
		case 'set':
			return change.takenAt
		default:
			return undefined
	}
}

/**
 * @param timestamps - Unix timestamps
 * @return The earliest and the latest of them, `null` when there are none
 */
export function getTimestampRange(timestamps: number[]): { first: number, last: number } | null {
	if (timestamps.length === 0) {
		return null
	}

	return timestamps.reduce(
		({ first, last }, timestamp) => ({ first: Math.min(first, timestamp), last: Math.max(last, timestamp) }),
		{ first: timestamps[0], last: timestamps[0] },
	)
}
