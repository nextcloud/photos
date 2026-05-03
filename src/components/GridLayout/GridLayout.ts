/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type GridItem = {
	id: string // Unique id for the item.
	width: number // Real width of the item.
	height: number // Real height of the item.
}

export type Section = {
	id: string // Unique id for the section.
	items: GridItem[] // Real width of the item.
}

export type GridRow = {
	items: GridItem[] // List of item in the row.
	height: number // Height of the row.
	key: string // Unique key for the row.
}

export type GridSection = Section & {
	key: string // Unique key for the section.
	rows: GridRow[] // Real width of the item.
	height: number // Height of the section.
}

/**
 * Split items in rows of equal width.
 * The last row will not be forced to match containerWidth.
 *
 * @param items
 * @param containerWidth
 * @param itemWidth
 * @param itemHeight
 * @param gridGap
 */
export function splitItemsInRows(items: GridItem[], containerWidth: number, itemWidth: number, itemHeight: number, gridGap: number): GridRow[] {
	if (containerWidth === 0) {
		return []
	}

	const itemsPerRow = Math.floor((containerWidth + gridGap) / (itemWidth + gridGap))

	// Split items in chunks of itemsPerRow.
	const rows: GridRow[] = []
	for (let i = 0; i < items.length; i += itemsPerRow) {
		const row = items.slice(i, i + itemsPerRow)
		rows.push({
			items: row.map((item) => ({ ...item, width: itemWidth, height: itemHeight })),
			height: itemHeight,
			key: row.map((item) => item.id).join('-'),
		})
	}

	return rows
}
