/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type CollageLayout = 'grid' | 'featured' | 'strip'

export type Rect = { x: number, y: number, width: number, height: number }

export type CollageGeometry = {
	width: number
	height: number
	/** Where each photo goes, in the order of the photos. */
	cells: Rect[]
}

export const COLLAGE_MIN_PHOTOS = 2
export const COLLAGE_MAX_PHOTOS = 9

/** Most small photos the featured layout puts on a single row. */
const FEATURED_ROW_SIZE = 4

/**
 * Lay out a row of cells sharing the width left by the gaps.
 *
 * @param count - Number of cells of the row
 * @param y - Top of the row
 * @param height - Height of the row
 * @param width - Width of the collage
 * @param gap - Space between the cells and around the collage
 */
function layoutRow(count: number, y: number, height: number, width: number, gap: number): Rect[] {
	const cellWidth = (width - gap * (count + 1)) / count
	return Array.from({ length: count }, (_, index) => ({
		x: Math.round(gap + index * (cellWidth + gap)),
		y: Math.round(y),
		width: Math.round(cellWidth),
		height: Math.round(height),
	}))
}

/**
 * Compute the size of a collage and the cell of each of its photos.
 *
 * - `grid`: rows of equal cells, the photos of an incomplete last row are widened to fill it.
 * - `featured`: the first photo large, the others in one or two rows below it.
 * - `strip`: all the photos side by side, as portrait cells.
 *
 * @param layout - The layout to compute
 * @param count - Number of photos
 * @param width - Width of the collage, in pixels
 * @param gap - Space between the photos and around the collage, in pixels
 */
export function computeCollageGeometry(layout: CollageLayout, count: number, width: number, gap: number = 0): CollageGeometry {
	if (count < COLLAGE_MIN_PHOTOS || count > COLLAGE_MAX_PHOTOS) {
		throw new RangeError(`A collage takes ${COLLAGE_MIN_PHOTOS} to ${COLLAGE_MAX_PHOTOS} photos`)
	}

	// Number of photos and height of every row, from top to bottom.
	const rows: { count: number, height: number }[] = []

	if (layout === 'strip') {
		rows.push({ count, height: ((width - gap * (count + 1)) / count) * 4 / 3 })
	} else if (layout === 'featured') {
		const smallCount = count - 1
		const smallRows = Math.ceil(smallCount / FEATURED_ROW_SIZE)
		rows.push({ count: 1, height: width * 0.6 })
		for (let row = 0; row < smallRows; row++) {
			// The first rows take the extra photo when they do not split evenly.
			rows.push({ count: Math.ceil((smallCount - row) / smallRows), height: width / FEATURED_ROW_SIZE })
		}
	} else {
		const columns = Math.ceil(Math.sqrt(count))
		const height = (width - gap * (columns + 1)) / columns
		for (let remaining = count; remaining > 0; remaining -= columns) {
			rows.push({ count: Math.min(columns, remaining), height })
		}
	}

	const cells: Rect[] = []
	let y = gap
	for (const row of rows) {
		cells.push(...layoutRow(row.count, y, row.height, width, gap))
		y += row.height + gap
	}

	return { width, height: Math.round(y), cells }
}

/**
 * Compute the part of an image to draw so it covers a cell without being
 * distorted: the image is cropped around its center.
 *
 * @param imageWidth - Width of the image
 * @param imageHeight - Height of the image
 * @param cell - The cell to cover
 */
export function computeCoverCrop(imageWidth: number, imageHeight: number, cell: Pick<Rect, 'width' | 'height'>): Rect {
	const scale = Math.min(imageWidth / cell.width, imageHeight / cell.height)
	const width = cell.width * scale
	const height = cell.height * scale

	return { x: (imageWidth - width) / 2, y: (imageHeight - height) / 2, width, height }
}

/**
 * Name of a collage file, numbered when the previous names are taken.
 *
 * @param date - Date the collage is created at
 * @param attempt - How many names were already tried
 */
export function getCollageFileName(date: Date, attempt: number = 0): string {
	const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
		.map((part) => String(part).padStart(2, '0'))
		.join('-')

	return attempt === 0 ? `Collage ${day}.jpg` : `Collage ${day} (${attempt + 1}).jpg`
}
