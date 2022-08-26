/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @typedef {object} TiledItem
 * @property {string} id
 * @property {number} [width] Real width of the item.
 * @property {number} height Real height of the item.
 * @property {number} [ratio] The aspect ratio of the item.
 * @property {boolean} [sectionHeader] Whether this row is a section header.
 */

/**
 * @typedef {object} TiledRow
 * @property {TiledItem[]} items -
 * @property {number} height -
 * @property {string} key -
 */

/**
 * Split items in rows of equal width.
 * The last row will not be forced to match containerWidth.
 *
 * @param {TiledItem[]} items The list of item to split in row of equal width.
 * @param {number} containerWidth The width of a row.
 * @param {number} baseHeight The base height of the rows.
 * @return {TiledRow[]}
 */
export function splitItemsInRows(items, containerWidth, baseHeight = 200) {
	if (containerWidth === 0) {
		return []
	}

	const rows = []
	let rowNumber = 0
	let currentItem = 0

	while (currentItem < items.length) {
		/** @type { TiledItem[] } */
		const rowItems = []

		// Fill the row with new items as long as the width is less than containerWidth.
		do {
			// @ts-ignore - We know that items.shift() is not undefined as we always check that items.length > 0.
			rowItems.push(items[currentItem++])
		} while (
			currentItem < items.length
			&& !items[currentItem - 1].sectionHeader && !items[currentItem].sectionHeader
			&& computeRowWidth([...rowItems, items[currentItem]], baseHeight) <= containerWidth
		)

		rows[rowNumber] = {
			items: rowItems,
			height: computeRowHeight(
				rowItems,
				containerWidth,
				items.length === currentItem || items[currentItem].sectionHeader === true,
				baseHeight
			),
			// Key to help vue to keep track of the row in VirtualScrolling.
			key: rowItems.map(item => item.id).join('-'),
		}

		rowNumber += 1
	}

	return rows
}

/**
 *
 * @param {TiledItem[]} items The list of items in the row.
 * @param {number} baseHeight The base height of the rows.
 * @return {number} The width of the row
 */
function computeRowWidth(items, baseHeight) {
	return items
		.map(item => baseHeight * item.ratio)
		.reduce((sum, itemWidth) => sum + itemWidth)
}

/**
 * Compute the row height based on its items and on the container's width.
 *
 * Math time !
 * With Rn the aspect ratio of item n
 *      Wn the width of item n
 *      Hn the height of item n
 *      Wc the width of the container
 *      Hr the height of the row
 * For n items we want: Wc = W1 + W2 + ... + Wn
 * We know Rn = Wn / Hn
 * So Wn = Rn * Hn
 * So Wc = (R1 * H1) + (R2 * H2) + ... + (Rn * Hn)
 * But we also want Hr === H1 === H2 === ... === Hn
 * So Wc = (R1 * Hr) + (R2 * Hr) + ... + (Rn * Hr)
 * So Wc = Hr * (R1 + R2 + ... + Rn)
 * So Hr = Wc / (R1 + R2 + ... + Rn)
 *
 * @param {TiledItem[]} items The list of items in the row.
 * @param {number} containerWidth The width of the row.
 * @param {boolean} isLastRow Whether we are computing the height for the last row.
 * @param {number} baseHeight The base height of the rows.
 * @return {number} The height of the row
 */
function computeRowHeight(items, containerWidth, isLastRow, baseHeight) {
	// Exception 1: there is only one item and its width it is a sectionHeader, meaning take the full width.
	if (items.length === 1 && items[0].sectionHeader) {
		return items[0].height
	}

	const sumOfItemsRatio = items
		.map(item => item.ratio)
		.reduce((sum, itemRatio) => sum + itemRatio
		)

	let rowHeight = containerWidth / sumOfItemsRatio

	// Exception 2: there is only one item which is larger than containerWidth.
	// Limit its height so that itemWidth === containerWidth
	if (items.length === 1 && items[0].width > containerWidth) {
		rowHeight = containerWidth / items[0].ratio
	}

	// Exception 3: we reached the last row.
	// Force the items width to match containerWidth, and limit their heigh to baseHeight + 20.
	if (isLastRow) {
		rowHeight = Math.min(baseHeight + 20, rowHeight)
	}

	return rowHeight
}
