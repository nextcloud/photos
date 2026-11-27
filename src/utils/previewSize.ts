/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type Size = { width: number, height: number }

/**
 * Edge lengths previews are requested at. The server rounds every preview it
 * generates up to a power of four on one side, so a box made of these lengths
 * matches a preview it keeps in its cache, and a photo only ever has a handful
 * of distinct preview URLs for the browser to cache. Tiles stop at 1024: the
 * next size is the full max preview, several megabytes per photo.
 */
export const PREVIEW_SIZE_BUCKETS = [64, 256, 1024]

/**
 * Highest device pixel ratio previews are sized for. Denser screens get the
 * preview of this ratio, which is already hard to tell apart from a sharper one.
 */
export const MAX_PIXEL_RATIO = 2

/**
 * Share of the device pixels of a dense screen a preview may fall short of.
 * The buckets grow in steps of four, so a preview just short of a tile on a
 * dense screen would otherwise make way for one with up to 16 times the pixels.
 * A preview never falls short of the tile in CSS pixels.
 */
export const HIGH_DENSITY_TOLERANCE = 0.8

/**
 * The smallest bucket at least as long as the given length, or the largest one.
 *
 * @param length - Length in device pixels
 */
export function previewSizeBucket(length: number): number {
	return PREVIEW_SIZE_BUCKETS.find((bucket) => bucket >= length) ?? PREVIEW_SIZE_BUCKETS[PREVIEW_SIZE_BUCKETS.length - 1]
}

/**
 * The size a photo is drawn at in its tile, filling it when cropped and fit
 * whole inside it otherwise. A photo of unknown size is drawn at the tile size.
 *
 * @param tile - Size of the tile in CSS pixels
 * @param photo - Size of the photo, only its aspect ratio matters
 * @param cropped - Whether the photo is cropped to fill the tile
 */
export function drawnSize(tile: Size, photo: Size | undefined, cropped: boolean): Size {
	if (!photo?.width || !photo?.height) {
		return tile
	}

	const scale = (cropped ? Math.max : Math.min)(tile.width / photo.width, tile.height / photo.height)
	return { width: photo.width * scale, height: photo.height * scale }
}

/**
 * The box to request a tile's preview in, so that it is sharp at the given
 * device pixel ratio, capped at MAX_PIXEL_RATIO and within HIGH_DENSITY_TOLERANCE.
 * The server fits the photo inside the box, keeping its aspect ratio, so a
 * square box as long as the longer drawn side covers the tile, and a photo only
 * gets one stored preview per bucket. Undefined while the tile has not been
 * laid out.
 *
 * @param tile - Size of the tile in CSS pixels
 * @param photo - Size of the photo, only its aspect ratio matters
 * @param cropped - Whether the photo is cropped to fill the tile
 * @param pixelRatio - Device pixel ratio to size the preview for
 */
export function previewBox(tile: Size, photo: Size | undefined, cropped: boolean, pixelRatio: number): Size | undefined {
	if (tile.width <= 0 || tile.height <= 0) {
		return undefined
	}

	const ratio = Math.min(Math.max(pixelRatio, 1), MAX_PIXEL_RATIO)
	const scale = ratio > 1 ? Math.max(1, ratio * HIGH_DENSITY_TOLERANCE) : 1
	const drawn = drawnSize(tile, photo, cropped)
	const side = previewSizeBucket(Math.max(drawn.width, drawn.height) * scale)
	return { width: side, height: side }
}

const sizeObservers = new WeakMap<Element, (size: Size) => void>()
let resizeObserver: ResizeObserver | undefined

/**
 * Report every size the element is laid out at, through one ResizeObserver
 * shared by all the observed elements.
 *
 * @param element - Element to observe
 * @param callback - Called with the content size of the element
 * @return A function to stop observing
 */
export function observeSize(element: Element, callback: (size: Size) => void): () => void {
	if (typeof ResizeObserver === 'undefined') {
		return () => {}
	}

	resizeObserver ??= new ResizeObserver((entries) => {
		for (const entry of entries) {
			sizeObservers.get(entry.target)?.({ width: entry.contentRect.width, height: entry.contentRect.height })
		}
	})

	sizeObservers.set(element, callback)
	resizeObserver.observe(element)

	return () => {
		resizeObserver?.unobserve(element)
		sizeObservers.delete(element)
	}
}
