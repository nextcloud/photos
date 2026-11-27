/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Zoom and position shared by the photos compared side by side.
 *
 * The offsets are fractions of the size of a pane rather than pixels, so the
 * same transform shows the same part of every photo whatever the size of the
 * pane it is drawn in.
 */
export type CompareTransform = {
	scale: number
	/** Horizontal offset of the center of the photo, as a fraction of the pane width. */
	x: number
	/** Vertical offset of the center of the photo, as a fraction of the pane height. */
	y: number
}

/** A point of a pane, as fractions of its size measured from its center. */
export type PanePoint = { x: number, y: number }

export const MIN_SCALE = 1
export const MAX_SCALE = 8

export const IDENTITY_TRANSFORM: Readonly<CompareTransform> = Object.freeze({ scale: 1, x: 0, y: 0 })

/**
 * @param value - Value to restrict
 * @param min - Lowest value allowed
 * @param max - Highest value allowed
 */
function clamp(value: number, min: number, max: number): number {
	// Adding zero turns the negative zero of an empty range into a plain one.
	return Math.min(Math.max(value, min), max) + 0
}

/**
 * Keep the zoom within its limits and the photo over the pane: zoomed in, its
 * edges cannot be dragged past the edges of the pane.
 *
 * @param transform - Transform to restrict
 */
export function clampTransform(transform: CompareTransform): CompareTransform {
	const scale = clamp(transform.scale, MIN_SCALE, MAX_SCALE)
	const maxOffset = (scale - 1) / 2

	return {
		scale,
		x: clamp(transform.x, -maxOffset, maxOffset),
		y: clamp(transform.y, -maxOffset, maxOffset),
	}
}

/**
 * Zoom in or out while keeping the part of the photo under a point in place.
 *
 * @param transform - Transform to start from
 * @param point - Point of the pane to zoom around
 * @param factor - Factor to multiply the zoom by
 */
export function zoomAt(transform: CompareTransform, point: PanePoint, factor: number): CompareTransform {
	const scale = clamp(transform.scale * factor, MIN_SCALE, MAX_SCALE)
	const ratio = scale / transform.scale

	return clampTransform({
		scale,
		x: point.x - (point.x - transform.x) * ratio,
		y: point.y - (point.y - transform.y) * ratio,
	})
}

/**
 * Move the photo.
 *
 * @param transform - Transform to start from
 * @param deltaX - Horizontal distance, as a fraction of the pane width
 * @param deltaY - Vertical distance, as a fraction of the pane height
 */
export function panBy(transform: CompareTransform, deltaX: number, deltaY: number): CompareTransform {
	return clampTransform({
		scale: transform.scale,
		x: transform.x + deltaX,
		y: transform.y + deltaY,
	})
}

/**
 * Follow two fingers: the photo moves with the point between them and is
 * zoomed around it by how much they moved apart.
 *
 * @param transform - Transform to start from
 * @param previous - Where the two fingers were
 * @param current - Where the two fingers are now
 */
export function pinch(transform: CompareTransform, previous: [PanePoint, PanePoint], current: [PanePoint, PanePoint]): CompareTransform {
	const middle = ([a, b]: [PanePoint, PanePoint]) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
	const distance = ([a, b]: [PanePoint, PanePoint]) => Math.hypot(a.x - b.x, a.y - b.y)

	const from = middle(previous)
	const to = middle(current)
	const previousDistance = distance(previous)
	const factor = previousDistance === 0 ? 1 : distance(current) / previousDistance

	// Zooming comes first: a photo that is not zoomed yet cannot be moved.
	const zoomed = zoomAt(transform, from, factor)
	return panBy(zoomed, to.x - from.x, to.y - from.y)
}

/**
 * Locate a pointer in a pane.
 *
 * @param clientX - Horizontal position of the pointer in the viewport
 * @param clientY - Vertical position of the pointer in the viewport
 * @param rect - Box of the pane in the viewport
 * @param rect.left - Left edge of the pane
 * @param rect.top - Top edge of the pane
 * @param rect.width - Width of the pane
 * @param rect.height - Height of the pane
 */
export function toPanePoint(clientX: number, clientY: number, rect: { left: number, top: number, width: number, height: number }): PanePoint {
	return {
		x: (clientX - rect.left) / rect.width - 0.5,
		y: (clientY - rect.top) / rect.height - 0.5,
	}
}

/**
 * @param transform - Transform to apply
 * @return The CSS transform of a photo filling its pane
 */
export function toCssTransform(transform: CompareTransform): string {
	return `translate(${transform.x * 100}%, ${transform.y * 100}%) scale(${transform.scale})`
}
