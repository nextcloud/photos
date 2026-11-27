/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { CollageLayout, Rect } from './collageLayout.ts'

import { describe, expect, test } from 'vitest'
import { computeCollageGeometry, computeCoverCrop, getCollageFileName } from './collageLayout.ts'

const layouts: CollageLayout[] = ['grid', 'featured', 'strip']
const counts = [2, 3, 4, 5, 6, 7, 8, 9]

/**
 * @param rect1 - First cell
 * @param rect2 - Second cell
 */
function overlap(rect1: Rect, rect2: Rect): boolean {
	return rect1.x < rect2.x + rect2.width && rect2.x < rect1.x + rect1.width
		&& rect1.y < rect2.y + rect2.height && rect2.y < rect1.y + rect1.height
}

describe('computeCollageGeometry', () => {
	test.each([1, 10])('rejects %i photos', (count) => {
		expect(() => computeCollageGeometry('grid', count, 2400)).toThrow(RangeError)
	})

	describe.each(layouts)('%s layout', (layout) => {
		test.each(counts)('gives %i photos a cell each, inside the collage and without overlap', (count) => {
			const { width, height, cells } = computeCollageGeometry(layout, count, 2400, 24)

			expect(cells).toHaveLength(count)
			for (const [index, cell] of cells.entries()) {
				expect(cell.width).toBeGreaterThan(0)
				expect(cell.height).toBeGreaterThan(0)
				expect(cell.x).toBeGreaterThanOrEqual(24)
				expect(cell.y).toBeGreaterThanOrEqual(24)
				expect(cell.x + cell.width).toBeLessThanOrEqual(width - 23)
				expect(cell.y + cell.height).toBeLessThanOrEqual(height - 23)
				expect(cells.slice(index + 1).some((other) => overlap(cell, other))).toBe(false)
			}
		})

		test.each(counts)('covers the whole collage with %i photos when there is no gap', (count) => {
			const { width, height, cells } = computeCollageGeometry(layout, count, 2400)
			const area = cells.reduce((sum, cell) => sum + cell.width * cell.height, 0)

			// Rounding the cells to whole pixels may leave a hairline.
			expect(Math.abs(area - width * height)).toBeLessThan(width * 4)
		})
	})

	test('lays four photos out as a two by two grid', () => {
		expect(computeCollageGeometry('grid', 4, 1000)).toEqual({
			width: 1000,
			height: 1000,
			cells: [
				{ x: 0, y: 0, width: 500, height: 500 },
				{ x: 500, y: 0, width: 500, height: 500 },
				{ x: 0, y: 500, width: 500, height: 500 },
				{ x: 500, y: 500, width: 500, height: 500 },
			],
		})
	})

	test('widens the photos of an incomplete last row of the grid', () => {
		const { cells } = computeCollageGeometry('grid', 5, 1200)

		expect(cells[2]).toEqual({ x: 800, y: 0, width: 400, height: 400 })
		expect(cells.slice(3)).toEqual([
			{ x: 0, y: 400, width: 600, height: 400 },
			{ x: 600, y: 400, width: 600, height: 400 },
		])
	})

	test('puts the gap between the photos and around the collage', () => {
		expect(computeCollageGeometry('grid', 2, 1000, 20)).toEqual({
			width: 1000,
			height: 510,
			cells: [
				{ x: 20, y: 20, width: 470, height: 470 },
				{ x: 510, y: 20, width: 470, height: 470 },
			],
		})
	})

	test('makes the first photo of the featured layout the large one', () => {
		const { height, cells } = computeCollageGeometry('featured', 4, 1000)

		expect(cells[0]).toEqual({ x: 0, y: 0, width: 1000, height: 600 })
		expect(cells.slice(1).map((cell) => cell.y)).toEqual([600, 600, 600])
		expect(height).toBe(850)
	})

	test('splits the small photos of the featured layout over two rows', () => {
		const { cells } = computeCollageGeometry('featured', 8, 1000)

		expect(cells.filter((cell) => cell.y === 600)).toHaveLength(4)
		expect(cells.filter((cell) => cell.y === 850)).toHaveLength(3)
	})

	test('lays the strip out as a single row of portrait photos', () => {
		const { height, cells } = computeCollageGeometry('strip', 3, 900)

		expect(height).toBe(400)
		expect(cells.map((cell) => cell.x)).toEqual([0, 300, 600])
		expect(cells.every((cell) => cell.y === 0 && cell.width === 300 && cell.height === 400)).toBe(true)
	})
})

describe('computeCoverCrop', () => {
	test('keeps an image with the ratio of the cell whole', () => {
		expect(computeCoverCrop(800, 600, { width: 400, height: 300 })).toEqual({ x: 0, y: 0, width: 800, height: 600 })
	})

	test('crops the sides of an image wider than the cell', () => {
		expect(computeCoverCrop(1000, 500, { width: 300, height: 300 })).toEqual({ x: 250, y: 0, width: 500, height: 500 })
	})

	test('crops the top and bottom of an image taller than the cell', () => {
		expect(computeCoverCrop(500, 1000, { width: 300, height: 150 })).toEqual({ x: 0, y: 375, width: 500, height: 250 })
	})
})

describe('getCollageFileName', () => {
	test('names the collage after its date', () => {
		expect(getCollageFileName(new Date(2026, 2, 5))).toBe('Collage 2026-03-05.jpg')
	})

	test('numbers the following names', () => {
		expect(getCollageFileName(new Date(2026, 2, 5), 1)).toBe('Collage 2026-03-05 (2).jpg')
		expect(getCollageFileName(new Date(2026, 2, 5), 2)).toBe('Collage 2026-03-05 (3).jpg')
	})
})
