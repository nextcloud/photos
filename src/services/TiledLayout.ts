/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type TiledItem = {
	id: string // Unique id for the item.
	width: number // Real width of the item.
	height: number // Real height of the item.
	ratio: number // The aspect ratio of the item.
}

export type Section = {
	id: string // Unique id for the section.
	items: TiledItem[] // Real width of the item.
}

export type TiledRow = {
	items: TiledItem[] // List of item in the row.
	height: number // Height of the row.
	key: string // Unique key for the row.
}

export type TiledSection = Section & {
	key: string // Unique key for the section.
	rows: TiledRow[] // Real width of the item.
	height: number // Height of the section.
}

/**
 * Split items in rows of equal width.
 * The last row will not be forced to match containerWidth.
 *
 * @param items
 * @param containerWidth
 * @param baseHeight
 */
export function splitItemsInRows(items: TiledItem[], containerWidth: number, baseHeight: number = 200): TiledRow[] {
	if (containerWidth === 0) {
		return []
	}

	const rows: TiledRow[] = []
	let rowNumber = 0
	let currentItem = 0

	while (currentItem < items.length) {
		const rowItems: TiledItem[] = []

		// Fill the row with new items as long as the width is less than containerWidth.
		do {
			rowItems.push(items[currentItem++])
		} while (
			currentItem < items.length
			&& computeRowWidth([...rowItems, items[currentItem]], baseHeight) <= containerWidth
		)

		const rowHeight = computeRowHeight(
			rowItems,
			containerWidth,
			items.length === currentItem,
			baseHeight,
		)

		rows[rowNumber] = {
			items: rowItems.map((item) => ({ ...item, width: rowHeight * item.ratio, height: rowHeight })),
			// Key to help vue to keep track of the row in VirtualScrolling.
			height: rowHeight,
			key: rowItems.map((item) => item.id).join('-'),
		}

		rowNumber += 1
	}

	return rows
}

/**
 *
 * @param items
 * @param baseHeight
 */
function computeRowWidth(items: TiledItem[], baseHeight: number): number {
	return items
		.map((item) => baseHeight * item.ratio)
		.reduce((sum, itemWidth) => sum + itemWidth)
}

/**
 * Compute the row height based on its items and on the container's width.
 *
 * Math time !
 * With Rn the aspect ratio of item n
 * Wn the width of item n
 * Hn the height of item n
 * Wc the width of the container
 * Hr the height of the row
 * For n items we want: Wc = W1 + W2 + ... + Wn
 * We know Rn = Wn / Hn
 * So Wn = Rn * Hn
 * So Wc = (R1 * H1) + (R2 * H2) + ... + (Rn * Hn)
 * But we also want Hr === H1 === H2 === ... === Hn
 * So Wc = (R1 * Hr) + (R2 * Hr) + ... + (Rn * Hr)
 * So Wc = Hr * (R1 + R2 + ... + Rn)
 * So Hr = Wc / (R1 + R2 + ... + Rn)
 *
 * @param items
 * @param containerWidth
 * @param isLastRow
 * @param baseHeight
 */
function computeRowHeight(items: TiledItem[], containerWidth: number, isLastRow: boolean, baseHeight: number): number {
	const sumOfItemsRatio = items
		.map((item) => item.ratio)
		.reduce((sum, itemRatio) => sum + itemRatio)

	let rowHeight = containerWidth / sumOfItemsRatio

	// Exception 1: there is only one item which is larger than containerWidth.
	// Limit its height so that itemWidth === containerWidth
	if (items.length === 1 && items[0].width > containerWidth) {
		rowHeight = containerWidth / items[0].ratio
	}

	// Exception 2: we reached the last row.
	// Force the items width to match containerWidth, and limit their height to baseHeight + 20.
	if (isLastRow) {
		rowHeight = Math.min(baseHeight + 20, rowHeight)
	}

	return rowHeight
}
