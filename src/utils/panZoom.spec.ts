/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import {
	clampOffset,
	clampScale,
	distance,
	DOUBLE_TAP_SCALE,
	MAX_SCALE,
	maxOffset,
	MIN_SCALE,
	toggledScale,
} from './panZoom.ts'

describe('clampScale', () => {
	it('keeps a scale that is already in range', () => {
		expect(clampScale(2)).toBe(2)
	})

	it('clamps below the minimum up to MIN_SCALE', () => {
		expect(clampScale(0.2)).toBe(MIN_SCALE)
	})

	it('clamps above the maximum down to MAX_SCALE', () => {
		expect(clampScale(99)).toBe(MAX_SCALE)
	})
})

describe('maxOffset', () => {
	it('is zero at the fitted size, so a non-zoomed photo cannot pan', () => {
		expect(maxOffset(1, 1000)).toBe(0)
	})

	it('grows with the zoom: half the extra width at 2x', () => {
		expect(maxOffset(2, 1000)).toBe(500)
	})

	it('never returns a negative limit', () => {
		expect(maxOffset(0.5, 1000)).toBe(0)
	})
})

describe('clampOffset', () => {
	it('leaves an offset within the limit untouched', () => {
		expect(clampOffset(100, 2, 1000)).toBe(100)
	})

	it('clamps a positive offset to the limit', () => {
		expect(clampOffset(9999, 2, 1000)).toBe(500)
	})

	it('clamps a negative offset to the negative limit', () => {
		expect(clampOffset(-9999, 2, 1000)).toBe(-500)
	})

	it('pins the offset to zero when not zoomed', () => {
		expect(clampOffset(200, 1, 1000)).toBe(0)
	})
})

describe('distance', () => {
	it('measures the euclidean distance between two points', () => {
		expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
	})
})

describe('toggledScale', () => {
	it('zooms in from the fitted size', () => {
		expect(toggledScale(MIN_SCALE)).toBe(DOUBLE_TAP_SCALE)
	})

	it('zooms back out when already zoomed in', () => {
		expect(toggledScale(3)).toBe(MIN_SCALE)
	})
})
