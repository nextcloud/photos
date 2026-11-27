/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'

import { computed, inject, toValue } from 'vue'

export type GridNavigationKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

export type GridNavigation = {
	// The one item of the grid reachable with Tab, all others are reached with the arrow keys.
	tabbableItemId: ComputedRef<string | null>
	setActiveItem: (id: string) => void
}

export const gridNavigationKey: InjectionKey<GridNavigation> = Symbol('gridNavigation')

// Attribute carrying the layout id of an item, by which the grid finds the element to focus.
export const GRID_ITEM_ATTRIBUTE = 'data-grid-item-id'

/**
 * @param key - The `key` of a keyboard event
 */
export function isGridNavigationKey(key: string): key is GridNavigationKey {
	return key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown'
}

/**
 * The index of the item to move to from the one at `index` when `key` is
 * pressed, or `index` itself when there is none in that direction.
 * Left and right follow the reading order across rows, up and down go to the
 * item of the adjacent row that lies under the middle of the current one.
 *
 * @param rows - The widths of the items of each row, in reading order. Indexes count through all rows.
 * @param index - The index of the current item
 * @param key - The arrow key pressed
 * @param rtl - Whether the rows run from right to left, which swaps left and right
 */
export function getNextGridIndex(rows: number[][], index: number, key: GridNavigationKey, rtl = false): number {
	const count = rows.reduce((total, row) => total + row.length, 0)
	if (index < 0 || index >= count) {
		return index
	}

	if (key === 'ArrowLeft' || key === 'ArrowRight') {
		const step = (key === 'ArrowRight') !== rtl ? 1 : -1
		return Math.min(Math.max(index + step, 0), count - 1)
	}

	let rowIndex = 0
	let rowStart = 0
	while (index >= rowStart + rows[rowIndex].length) {
		rowStart += rows[rowIndex].length
		rowIndex++
	}

	const targetRowIndex = rowIndex + (key === 'ArrowDown' ? 1 : -1)
	const targetRow = rows[targetRowIndex]
	if (targetRow === undefined || targetRow.length === 0) {
		return index
	}

	const row = rows[rowIndex]
	const column = index - rowStart
	const middle = row.slice(0, column).reduce((offset, width) => offset + width, 0) + row[column] / 2

	const targetRowStart = key === 'ArrowDown' ? rowStart + row.length : rowStart - targetRow.length
	let offset = 0
	for (const [targetColumn, width] of targetRow.entries()) {
		offset += width
		if (middle < offset) {
			return targetRowStart + targetColumn
		}
	}

	return targetRowStart + targetRow.length - 1
}

/**
 * Attributes making an element an item of the grid navigation provided by the
 * closest VirtualScrolling: reached with the arrow keys and holding the
 * grid's single tab stop while it is the active item. Empty outside such a grid.
 *
 * @param id - The id of the item in the layout of the grid
 */
export function useGridNavigationItem(id: MaybeRefOrGetter<string>): ComputedRef<Record<string, unknown>> {
	const navigation = inject(gridNavigationKey, null)

	return computed(() => {
		if (navigation === null) {
			return {}
		}

		const itemId = toValue(id)
		return {
			tabindex: navigation.tabbableItemId.value === itemId ? 0 : -1,
			[GRID_ITEM_ATTRIBUTE]: itemId,
			onFocus: () => navigation.setActiveItem(itemId),
		}
	})
}
