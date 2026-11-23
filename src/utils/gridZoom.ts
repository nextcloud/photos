/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TiledSection } from '../services/TiledLayout.ts'
import type { GridDensity } from '../store/userConfig.ts'

/** Sizes of the tiles of the photo grids, from the smallest tiles to the largest. */
export const gridDensities = ['small', 'medium', 'large'] as const

/** 1 for larger tiles, -1 for smaller ones, 0 to stay on the level. */
export type ZoomDirection = -1 | 0 | 1

/** A point of the viewport, in client coordinates. */
export type ViewportPoint = { x: number, y: number }

/** A spot inside a grid, told by the item it lies on rather than by its coordinates. */
export type GridAnchor = {
	itemId: string // Item under the spot.
	ratio: number // How far down the row of the item the spot is, from 0 to 1.
	shift: number // Pixels between the spot and the row, when it lies on the header above it.
}

/** Wheel input gathered so far, to tell when it adds up to a level. */
export type WheelZoomState = {
	accumulated: number // Sum of the deltas since the last step.
	lastEvent: number // Timestamp of the last wheel event.
	lastStep: number // Timestamp of the last step.
}

/** Wheel distance of one level: a notch of a mouse wheel is about 100, a pinch on a trackpad comes in small parts. */
const WHEEL_STEP = 40
/** Pause after a step, so that one notch or one flick is not read as several levels. */
const WHEEL_COOLDOWN = 200
/** Pause after which the wheel input gathered so far is dropped. */
const WHEEL_IDLE = 400
/** How much two fingers have to move apart, or together, for one level. */
const PINCH_STEP = 1.25

/**
 * Density one level away from the current one, the current one at either end.
 *
 * @param current - The current density
 * @param direction - Towards larger or smaller tiles
 */
export function stepDensity(current: GridDensity, direction: ZoomDirection): GridDensity {
	const index = gridDensities.indexOf(current) + direction
	return gridDensities[Math.min(Math.max(index, 0), gridDensities.length - 1)]
}

/**
 * Gather a wheel event and tell whether it completes a level.
 *
 * @param state - The input gathered so far
 * @param delta - Vertical delta of the wheel event, in pixels
 * @param now - Timestamp of the wheel event
 */
export function trackWheelZoom(state: WheelZoomState, delta: number, now: number): { state: WheelZoomState, direction: ZoomDirection } {
	if (now - state.lastStep < WHEEL_COOLDOWN) {
		return { state: { ...state, lastEvent: now }, direction: 0 }
	}

	const accumulated = (now - state.lastEvent > WHEEL_IDLE ? 0 : state.accumulated) + delta
	if (Math.abs(accumulated) < WHEEL_STEP) {
		return { state: { ...state, accumulated, lastEvent: now }, direction: 0 }
	}

	// Scrolling up, which is also what spreading two fingers on a trackpad reports, zooms in.
	return {
		state: { accumulated: 0, lastEvent: now, lastStep: now },
		direction: accumulated < 0 ? 1 : -1,
	}
}

/**
 * Tell whether two fingers moved far enough for a level.
 *
 * @param startDistance - Distance between the fingers at the last level change
 * @param distance - Distance between the fingers now
 */
export function pinchDirection(startDistance: number, distance: number): ZoomDirection {
	if (startDistance <= 0 || distance <= 0) {
		return 0
	}

	if (distance / startDistance >= PINCH_STEP) {
		return 1
	}

	return startDistance / distance >= PINCH_STEP ? -1 : 0
}

/**
 * Find the item at a spot of a grid.
 *
 * @param sections - The laid out sections of the grid
 * @param headerHeight - Height of the header above each section
 * @param x - Horizontal offset of the spot from the start of the grid
 * @param y - Vertical offset of the spot from the top of the grid
 */
export function findAnchor(sections: TiledSection[], headerHeight: number, x: number, y: number): GridAnchor | null {
	let rowTop = 0

	for (const section of sections) {
		rowTop += headerHeight

		for (const row of section.rows) {
			if (y < rowTop + row.height) {
				let itemEnd = 0
				const item = row.items.find((item) => (itemEnd += item.width) > x) ?? row.items[row.items.length - 1]

				return y < rowTop
					? { itemId: item.id, ratio: 0, shift: y - rowTop }
					: { itemId: item.id, ratio: (y - rowTop) / row.height, shift: 0 }
			}

			rowTop += row.height
		}
	}

	return null
}

/**
 * Vertical offset of an anchor from the top of a grid, null when its item is not part of the grid.
 *
 * @param sections - The laid out sections of the grid
 * @param headerHeight - Height of the header above each section
 * @param anchor - The anchor to locate
 */
export function anchorOffset(sections: TiledSection[], headerHeight: number, anchor: GridAnchor): number | null {
	let rowTop = 0

	for (const section of sections) {
		rowTop += headerHeight

		for (const row of section.rows) {
			if (row.items.some((item) => item.id === anchor.itemId)) {
				return rowTop + anchor.ratio * row.height + anchor.shift
			}

			rowTop += row.height
		}
	}

	return null
}
