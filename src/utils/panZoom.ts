/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** Smallest zoom: the photo fitted to the viewport. */
export const MIN_SCALE = 1

/** Largest zoom, to keep a photo from turning into a wall of pixels. */
export const MAX_SCALE = 5

/** Zoom a double-click / double-tap jumps to from the fitted size. */
export const DOUBLE_TAP_SCALE = 2.5

/**
 * Clamp a zoom factor to the allowed range.
 *
 * @param scale - Desired zoom
 */
export function clampScale(scale: number): number {
	return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

/**
 * How far, in pixels, the scaled content may be panned along one axis before its
 * edge would cross the centre of the viewport. Zero at the fitted size, so a
 * non-zoomed photo cannot be dragged around at all.
 *
 * @param scale - Current zoom
 * @param viewportSize - Viewport length on this axis, in pixels
 */
export function maxOffset(scale: number, viewportSize: number): number {
	return Math.max(0, (scale - 1) * viewportSize / 2)
}

/**
 * Clamp a pan offset so the scaled content cannot be dragged off the viewport.
 *
 * @param offset - Desired offset in pixels
 * @param scale - Current zoom
 * @param viewportSize - Viewport length on this axis, in pixels
 */
export function clampOffset(offset: number, scale: number, viewportSize: number): number {
	const limit = maxOffset(scale, viewportSize)
	return Math.min(limit, Math.max(-limit, offset))
}

export type Point = { x: number, y: number }

/**
 * Distance between two points, e.g. the two pointers of a pinch.
 *
 * @param a - First point
 * @param a.x - First point, x coordinate
 * @param a.y - First point, y coordinate
 * @param b - Second point
 * @param b.x - Second point, x coordinate
 * @param b.y - Second point, y coordinate
 */
export function distance(a: Point, b: Point): number {
	return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * The zoom a double-tap toggles to: back to the fitted size when already zoomed
 * in, otherwise in to the default zoom.
 *
 * @param scale - Current zoom
 */
export function toggledScale(scale: number): number {
	return scale > MIN_SCALE ? MIN_SCALE : DOUBLE_TAP_SCALE
}
