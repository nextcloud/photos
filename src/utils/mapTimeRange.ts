/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Turn a `YYYYMM` month key into a number of months, so that consecutive
 * months are consecutive numbers.
 *
 * @param month - The month key
 */
export function toMonthIndex(month: string): number {
	return Number.parseInt(month.slice(0, 4)) * 12 + Number.parseInt(month.slice(4, 6)) - 1
}

/**
 * Turn a number of months back into its `YYYYMM` month key.
 *
 * @param index - The number of months
 */
export function fromMonthIndex(index: number): string {
	return `${Math.floor(index / 12)}${String(index % 12 + 1).padStart(2, '0')}`
}

/**
 * @param items - The items to get the range of
 * @param getMonth - Get the `YYYYMM` month key of an item
 * @return The month indices of the oldest and the newest item, `undefined` when there are no items
 */
export function getMonthRange<T>(items: T[], getMonth: (item: T) => string): [number, number] | undefined {
	if (items.length === 0) {
		return undefined
	}

	let oldest = Infinity
	let newest = -Infinity
	for (const item of items) {
		const index = toMonthIndex(getMonth(item))
		oldest = Math.min(oldest, index)
		newest = Math.max(newest, index)
	}

	return [oldest, newest]
}

/**
 * Keep the items of the months from `start` to `end`, both included.
 *
 * @param items - The items to filter
 * @param getMonth - Get the `YYYYMM` month key of an item
 * @param start - Month index of the first month to keep, `undefined` for no lower bound
 * @param end - Month index of the last month to keep, `undefined` for no upper bound
 */
export function filterByMonthRange<T>(items: T[], getMonth: (item: T) => string, start?: number, end?: number): T[] {
	if (start === undefined && end === undefined) {
		return items
	}

	return items.filter((item) => {
		const index = toMonthIndex(getMonth(item))
		return index >= (start ?? -Infinity) && index <= (end ?? Infinity)
	})
}
