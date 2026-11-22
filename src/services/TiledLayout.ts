/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type TiledItem = {
	id: string // Unique id for the item.
	width: number // Real width of the item.
	height: number // Real height of the item.
	ratio: number // The aspect ratio of the item.
	key?: string // Recycled DOM key, assigned by VirtualScrolling.
}

// Items may carry more than the layout needs, the extra data is passed
// along untouched, hence the type parameter.
export type Section<I extends TiledItem = TiledItem> = {
	id: string // Unique id for the section.
	items: I[] // Items of the section.
	groups?: Section<I>[] // Groups splitting the items, each one labelled above its first item.
}

export type TiledGroupLabel = {
	groupId: string // Id of the group starting in the row.
	itemId: string // Id of the first item of the group, the label sits above it.
	width: number // Width of the items of the group in the row, the room the label has.
}

export type TiledRow<I extends TiledItem = TiledItem> = {
	items: I[] // List of item in the row.
	height: number // Height of the row, the band of its group labels included.
	key: string // Unique key for the row.
	labels?: TiledGroupLabel[] // The groups starting in the row.
	labelHeight?: number // Height of the band above the items holding the group labels, when a group starts in the row.
}

export type TiledSectionRow<I extends TiledItem = TiledItem> = TiledRow<I> & {
	sectionKey: string // Key of the section the row belongs to.
}

export type TiledSection<I extends TiledItem = TiledItem> = Section<I> & {
	key: string // Unique key for the section.
	rows: TiledSectionRow<I>[] // Rows of the section.
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
export function splitItemsInRows<I extends TiledItem>(items: I[], containerWidth: number, baseHeight: number = 200): TiledRow<I>[] {
	if (containerWidth === 0) {
		return []
	}

	const rows: TiledRow<I>[] = []
	let rowNumber = 0
	let currentItem = 0

	while (currentItem < items.length) {
		const rowItems: I[] = []

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
 * Split the items of a section in rows. The groups of a section share its
 * rows: a group starts right after the one before it, so that small groups sit
 * side by side. A row in which a group starts is `groupLabelHeight` higher,
 * which leaves a band above its items for the labels of these groups.
 *
 * @param section - The section to lay out.
 * @param containerWidth - Width of the container.
 * @param baseHeight - Target height of the rows.
 * @param groupLabelHeight - Height of the band holding the labels of the groups.
 */
export function splitSectionInRows<I extends TiledItem>(section: Section<I>, containerWidth: number, baseHeight: number = 200, groupLabelHeight: number = 0): TiledRow<I>[] {
	if (section.groups === undefined) {
		return splitItemsInRows(section.items, containerWidth, baseHeight)
	}

	const groups = section.groups.filter((group) => group.items.length > 0)
	const groupIdByItemId = new Map(groups.flatMap((group) => group.items.map((item) => [item.id, group.id])))
	const groupIdByFirstItemId = new Map(groups.map((group) => [group.items[0].id, group.id]))

	return splitItemsInRows(groups.flatMap((group) => group.items), containerWidth, baseHeight).map((row) => {
		const labels = row.items
			.filter((item) => groupIdByFirstItemId.has(item.id))
			.map((item) => {
				const groupId = groupIdByFirstItemId.get(item.id) as string
				const width = row.items
					.filter(({ id }) => groupIdByItemId.get(id) === groupId)
					.reduce((sum, { width }) => sum + width, 0)
				return { groupId, itemId: item.id, width }
			})

		if (labels.length === 0) {
			return row
		}

		return { ...row, height: row.height + groupLabelHeight, labels, labelHeight: groupLabelHeight }
	})
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
