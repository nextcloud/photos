/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TiledItem, TiledSection } from '../services/TiledLayout.ts'
import type { GridDensity } from '../store/userConfig.ts'
import type { WheelZoomState } from './gridZoom.ts'

import { describe, expect, test } from 'vitest'
import { splitItemsInRows } from '../services/TiledLayout.ts'
import { anchorOffset, findAnchor, gridDensities, pinchDirection, stepDensity, trackWheelZoom } from './gridZoom.ts'

const HEADER_HEIGHT = 75
const idle: WheelZoomState = { accumulated: 0, lastEvent: 0, lastStep: -1000 }

/**
 * Lay out two sections of twelve square photos each in a 400 pixels wide grid.
 *
 * @param baseHeight - Target height of the rows
 */
function layout(baseHeight: number): TiledSection[] {
	return ['a', 'b'].map((id) => {
		const items: TiledItem[] = Array.from({ length: 12 }, (_, index) => ({ id: `${id}${index}`, width: 100, height: 100, ratio: 1 }))
		const rows = splitItemsInRows(items, 400, baseHeight).map((row) => ({ ...row, sectionKey: id }))
		return { id, key: id, items, rows, height: rows.reduce((height, row) => height + row.height, 0) }
	})
}

describe('stepDensity', () => {
	test('steps to the neighbouring level', () => {
		expect(stepDensity('medium', 1)).toBe('large')
		expect(stepDensity('medium', -1)).toBe('small')
	})

	test('stays on the level at either end', () => {
		const smallest = gridDensities[0]
		const largest = gridDensities[gridDensities.length - 1]
		expect(stepDensity(smallest, -1)).toBe(smallest)
		expect(stepDensity(largest, 1)).toBe(largest)
	})

	test('walks through every level', () => {
		let density: GridDensity = gridDensities[0]
		const walked: GridDensity[] = [density]
		for (let step = 1; step < gridDensities.length; step++) {
			density = stepDensity(density, 1)
			walked.push(density)
		}
		expect(walked).toEqual([...gridDensities])
	})
})

describe('trackWheelZoom', () => {
	test('zooms in on a notch up and out on a notch down', () => {
		expect(trackWheelZoom(idle, -100, 1000).direction).toBe(1)
		expect(trackWheelZoom(idle, 100, 1000).direction).toBe(-1)
	})

	test('gathers the small deltas of a pinch until they add up to a level', () => {
		let state = idle
		const directions = [10, 20, 30, 40].map((now) => {
			const result = trackWheelZoom(state, -12, 1000 + now)
			state = result.state
			return result.direction
		})
		expect(directions).toEqual([0, 0, 0, 1])
	})

	test('ignores the rest of a notch right after a step', () => {
		const { state } = trackWheelZoom(idle, -60, 1000)
		expect(trackWheelZoom(state, -60, 1050).direction).toBe(0)
		expect(trackWheelZoom(state, -60, 1300).direction).toBe(1)
	})

	test('drops what was gathered after a pause', () => {
		const { state } = trackWheelZoom(idle, -30, 1000)
		expect(trackWheelZoom(state, -30, 1100).direction).toBe(1)
		expect(trackWheelZoom(state, -30, 2000).direction).toBe(0)
	})
})

describe('pinchDirection', () => {
	test('zooms in when the fingers spread and out when they close', () => {
		expect(pinchDirection(100, 130)).toBe(1)
		expect(pinchDirection(100, 75)).toBe(-1)
	})

	test('ignores small moves and missing distances', () => {
		expect(pinchDirection(100, 110)).toBe(0)
		expect(pinchDirection(100, 90)).toBe(0)
		expect(pinchDirection(0, 90)).toBe(0)
	})
})

describe('findAnchor', () => {
	// Four tiles of 100 pixels per row, three rows per section.
	const sections = layout(100)

	test('finds the item under a spot', () => {
		expect(findAnchor(sections, HEADER_HEIGHT, 250, HEADER_HEIGHT + 150)).toEqual({ itemId: 'a6', ratio: 0.5, shift: 0 })
	})

	test('finds items of later sections', () => {
		expect(findAnchor(sections, HEADER_HEIGHT, 10, 2 * HEADER_HEIGHT + 300 + 25)).toEqual({ itemId: 'b0', ratio: 0.25, shift: 0 })
	})

	test('anchors a spot on a header to the row below it', () => {
		expect(findAnchor(sections, HEADER_HEIGHT, 10, 45)).toEqual({ itemId: 'a0', ratio: 0, shift: -30 })
	})

	test('uses the last item of a row that ends before the spot', () => {
		expect(findAnchor(sections, HEADER_HEIGHT, 5000, HEADER_HEIGHT + 10)?.itemId).toBe('a3')
	})

	test('finds nothing below the grid', () => {
		expect(findAnchor(sections, HEADER_HEIGHT, 10, 5000)).toBeNull()
	})
})

describe('anchorOffset', () => {
	test('returns the spot it was found at in the same layout', () => {
		const sections = layout(100)
		const anchor = findAnchor(sections, HEADER_HEIGHT, 250, 2 * HEADER_HEIGHT + 300 + 130)
		expect(anchorOffset(sections, HEADER_HEIGHT, anchor!)).toBe(2 * HEADER_HEIGHT + 300 + 130)
	})

	test('follows the item into a denser layout', () => {
		const anchor = findAnchor(layout(100), HEADER_HEIGHT, 250, HEADER_HEIGHT + 150)
		// Eight tiles of 50 pixels per row: a6 is now in the first row.
		expect(anchorOffset(layout(50), HEADER_HEIGHT, anchor!)).toBe(HEADER_HEIGHT + 25)
	})

	test('follows the item into a sparser layout', () => {
		const anchor = findAnchor(layout(100), HEADER_HEIGHT, 250, HEADER_HEIGHT + 150)
		// Two tiles of 200 pixels per row: a6 is now in the fourth row.
		expect(anchorOffset(layout(200), HEADER_HEIGHT, anchor!)).toBe(HEADER_HEIGHT + 3 * 200 + 100)
	})

	test('keeps the distance of a spot on a header', () => {
		const anchor = findAnchor(layout(100), HEADER_HEIGHT, 10, HEADER_HEIGHT + 300 + 45)
		expect(anchorOffset(layout(200), HEADER_HEIGHT, anchor!)).toBe(HEADER_HEIGHT + 6 * 200 + 45)
	})

	test('returns null for an item that left the grid', () => {
		expect(anchorOffset(layout(100), HEADER_HEIGHT, { itemId: 'gone', ratio: 0, shift: 0 })).toBeNull()
	})
})
