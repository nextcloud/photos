/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type PageFormat = 'a4' | 'letter'
export type PageOrientation = 'landscape' | 'portrait'
/** Photos per page, `auto` picks one or two depending on their orientation. */
export type PhotoBookLayout = '1' | '2' | '4' | 'auto'
export type Size = { width: number, height: number }
export type Rect = Size & { x: number, y: number }

/** Short and long side of the paper formats, in PDF points (1/72 inch). */
const PAGE_FORMATS: Record<PageFormat, [number, number]> = {
	a4: [595.28, 841.89],
	letter: [612, 792],
}

const PAGE_MARGIN = 36
const SLOT_GAP = 14

/**
 * Size of a page in PDF points.
 *
 * @param format - Paper format
 * @param orientation - Orientation of the page
 */
export function getPageSize(format: PageFormat, orientation: PageOrientation): Size {
	const [short, long] = PAGE_FORMATS[format]
	return orientation === 'landscape' ? { width: long, height: short } : { width: short, height: long }
}

/**
 * Distribute photos over pages, keeping their order.
 *
 * The automatic layout gives a photo with the orientation of the page a page
 * of its own, and puts two consecutive photos of the other orientation next
 * to each other.
 *
 * @param ratios - Width divided by height of every photo
 * @param layout - Photos per page
 * @param landscapePage - Whether the pages are wider than high
 * @return For every page the indexes of its photos
 */
export function paginate(ratios: number[], layout: PhotoBookLayout, landscapePage: boolean): number[][] {
	const pages: number[][] = []
	const fitsPage = (index: number) => (ratios[index]! >= 1) === landscapePage

	for (let index = 0; index < ratios.length;) {
		let count = Number(layout)
		if (layout === 'auto') {
			count = !fitsPage(index) && index + 1 < ratios.length && !fitsPage(index + 1) ? 2 : 1
		}

		pages.push(ratios.slice(index, index + count).map((_, offset) => index + offset))
		index += count
	}

	return pages
}

/**
 * Areas of a page the photos are placed in, in reading order with the origin
 * at the top left corner. Two photos share the long side of the page, three
 * and four are put on a two by two grid.
 *
 * @param count - Number of photos on the page
 * @param page - Size of the page
 * @param captionHeight - Space to keep free below every photo
 */
export function getPageSlots(count: number, page: Size, captionHeight = 0): Rect[] {
	const landscapePage = page.width >= page.height
	const columns = count > 2 || (count === 2 && landscapePage) ? 2 : 1
	const rows = Math.ceil(count / columns)
	const width = (page.width - 2 * PAGE_MARGIN - (columns - 1) * SLOT_GAP) / columns
	const height = (page.height - 2 * PAGE_MARGIN - (rows - 1) * SLOT_GAP) / rows

	return Array.from({ length: count }, (_, index) => ({
		x: PAGE_MARGIN + (index % columns) * (width + SLOT_GAP),
		y: PAGE_MARGIN + Math.floor(index / columns) * (height + SLOT_GAP),
		width,
		height: height - captionHeight,
	}))
}

/**
 * Largest area with the given aspect ratio that fits in a slot, centered in it.
 *
 * @param ratio - Width divided by height of the photo
 * @param slot - Area to place the photo in
 */
export function fitRect(ratio: number, slot: Rect): Rect {
	const width = Math.min(slot.width, slot.height * ratio)
	const height = width / ratio

	return {
		x: slot.x + (slot.width - width) / 2,
		y: slot.y + (slot.height - height) / 2,
		width,
		height,
	}
}
