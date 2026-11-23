/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { CompareTransform, PanePoint } from './compareTransform.ts'

import { describe, expect, test } from 'vitest'
import {
	clampTransform,
	IDENTITY_TRANSFORM,
	MAX_SCALE,
	panBy,
	pinch,
	toCssTransform,
	toPanePoint,
	zoomAt,
} from './compareTransform.ts'

/**
 * Point of the photo, as a fraction of its size from its center, shown at a
 * point of the pane.
 *
 * @param transform - Transform applied to the photo
 * @param point - Point of the pane
 */
function photoPointAt(transform: CompareTransform, point: PanePoint): PanePoint {
	return { x: (point.x - transform.x) / transform.scale, y: (point.y - transform.y) / transform.scale }
}

/**
 * @param actual - Point to check
 * @param expected - Point it should be at
 */
function expectClose(actual: PanePoint, expected: PanePoint): void {
	expect(actual.x).toBeCloseTo(expected.x)
	expect(actual.y).toBeCloseTo(expected.y)
}

describe('clampTransform', () => {
	test('keeps the zoom within its limits', () => {
		expect(clampTransform({ scale: 0.2, x: 0, y: 0 }).scale).toBe(1)
		expect(clampTransform({ scale: 50, x: 0, y: 0 }).scale).toBe(MAX_SCALE)
	})

	test('a photo that is not zoomed cannot be moved', () => {
		expect(clampTransform({ scale: 1, x: 0.3, y: -0.3 })).toEqual({ scale: 1, x: 0, y: 0 })
	})

	test('a zoomed photo stops at the edges of the pane', () => {
		expect(clampTransform({ scale: 3, x: 5, y: -5 })).toEqual({ scale: 3, x: 1, y: -1 })
		expect(clampTransform({ scale: 3, x: 0.4, y: -0.2 })).toEqual({ scale: 3, x: 0.4, y: -0.2 })
	})
})

describe('zoomAt', () => {
	test('zooming at the center leaves the photo centered', () => {
		expect(zoomAt(IDENTITY_TRANSFORM, { x: 0, y: 0 }, 2)).toEqual({ scale: 2, x: 0, y: 0 })
	})

	test('the part of the photo under the pointer stays under it', () => {
		const point = { x: 0.2, y: -0.1 }
		const start = { scale: 2, x: 0.1, y: 0.05 }

		const zoomed = zoomAt(start, point, 1.5)

		expect(zoomed.scale).toBe(3)
		expectClose(photoPointAt(zoomed, point), photoPointAt(start, point))
	})

	test('zooming in and back out at the same point returns to the start', () => {
		const point = { x: -0.3, y: 0.25 }
		const start = { scale: 2, x: 0.2, y: -0.1 }

		const back = zoomAt(zoomAt(start, point, 2), point, 0.5)

		expect(back.scale).toBeCloseTo(start.scale)
		expectClose(back, start)
	})

	test('stops at the highest zoom without moving the photo any further', () => {
		const point = { x: 0.4, y: 0.4 }
		const atLimit = zoomAt(IDENTITY_TRANSFORM, point, 100)

		expect(atLimit.scale).toBe(MAX_SCALE)
		expect(zoomAt(atLimit, point, 2)).toEqual(atLimit)
	})

	test('zooming all the way out centers the photo again', () => {
		const zoomed = zoomAt(IDENTITY_TRANSFORM, { x: 0.5, y: 0.5 }, 4)

		expect(zoomAt(zoomed, { x: -0.5, y: 0 }, 0.01)).toEqual({ scale: 1, x: 0, y: 0 })
	})
})

describe('panBy', () => {
	test('moves a zoomed photo by the given distance', () => {
		const moved = panBy({ scale: 4, x: 0, y: 0 }, 0.25, -0.5)

		expect(moved).toEqual({ scale: 4, x: 0.25, y: -0.5 })
	})

	test('stops at the edges of the pane', () => {
		expect(panBy({ scale: 2, x: 0.4, y: 0 }, 0.4, -3)).toEqual({ scale: 2, x: 0.5, y: -0.5 })
	})
})

describe('pinch', () => {
	test('fingers moving apart zoom around the point between them', () => {
		const previous: [PanePoint, PanePoint] = [{ x: 0.1, y: 0 }, { x: 0.3, y: 0 }]
		const current: [PanePoint, PanePoint] = [{ x: 0, y: 0 }, { x: 0.4, y: 0 }]

		const pinched = pinch(IDENTITY_TRANSFORM, previous, current)

		expect(pinched.scale).toBeCloseTo(2)
		expectClose(photoPointAt(pinched, { x: 0.2, y: 0 }), { x: 0.2, y: 0 })
	})

	test('fingers moving together move the photo without zooming', () => {
		const previous: [PanePoint, PanePoint] = [{ x: 0, y: 0 }, { x: 0.2, y: 0 }]
		const current: [PanePoint, PanePoint] = [{ x: 0.1, y: 0.1 }, { x: 0.3, y: 0.1 }]

		const pinched = pinch({ scale: 3, x: 0, y: 0 }, previous, current)

		expect(pinched.scale).toBeCloseTo(3)
		expectClose(pinched, { x: 0.1, y: 0.1 })
	})

	test('a pinch starting on the whole photo follows the fingers', () => {
		const previous: [PanePoint, PanePoint] = [{ x: 0.1, y: 0 }, { x: 0.2, y: 0 }]
		const current: [PanePoint, PanePoint] = [{ x: 0, y: 0 }, { x: 0.2, y: 0 }]

		const pinched = pinch(IDENTITY_TRANSFORM, previous, current)

		expect(pinched.scale).toBeCloseTo(2)
		expectClose(photoPointAt(pinched, { x: 0.1, y: 0 }), { x: 0.15, y: 0 })
	})

	test('fingers on the same spot leave the zoom alone', () => {
		const spot: [PanePoint, PanePoint] = [{ x: 0, y: 0 }, { x: 0, y: 0 }]

		expect(pinch({ scale: 2, x: 0, y: 0 }, spot, spot)).toEqual({ scale: 2, x: 0, y: 0 })
	})
})

describe('toPanePoint', () => {
	const rect = { left: 100, top: 50, width: 400, height: 200 }

	test('the center of the pane is the origin', () => {
		expect(toPanePoint(300, 150, rect)).toEqual({ x: 0, y: 0 })
	})

	test('the corners are half a pane away', () => {
		expect(toPanePoint(100, 50, rect)).toEqual({ x: -0.5, y: -0.5 })
		expect(toPanePoint(500, 250, rect)).toEqual({ x: 0.5, y: 0.5 })
	})

	test('the same spot of two panes of different sizes is the same point', () => {
		const small = { left: 0, top: 0, width: 200, height: 100 }

		expect(toPanePoint(150, 25, small)).toEqual(toPanePoint(400, 100, rect))
	})
})

describe('toCssTransform', () => {
	test('offsets are percentages of the pane', () => {
		expect(toCssTransform({ scale: 2, x: 0.25, y: -0.5 })).toBe('translate(25%, -50%) scale(2)')
	})
})
