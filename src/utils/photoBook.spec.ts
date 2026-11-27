/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { fitRect, getPageSize, getPageSlots, paginate } from './photoBook.ts'

const LANDSCAPE = 1.5
const PORTRAIT = 2 / 3

describe('getPageSize', () => {
	it('swaps the sides with the orientation', () => {
		expect(getPageSize('a4', 'portrait')).toEqual({ width: 595.28, height: 841.89 })
		expect(getPageSize('a4', 'landscape')).toEqual({ width: 841.89, height: 595.28 })
		expect(getPageSize('letter', 'landscape')).toEqual({ width: 792, height: 612 })
	})
})

describe('paginate', () => {
	it('puts a fixed number of photos on every page and the rest on the last one', () => {
		const ratios = Array.from({ length: 10 }, () => LANDSCAPE)

		expect(paginate(ratios, '1', true)).toHaveLength(10)
		expect(paginate(ratios, '2', true)).toHaveLength(5)
		expect(paginate(ratios, '4', true)).toEqual([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9]])
	})

	it('returns no page for no photo', () => {
		expect(paginate([], 'auto', true)).toEqual([])
		expect(paginate([], '4', true)).toEqual([])
	})

	it('pairs consecutive photos that do not have the orientation of the page', () => {
		const ratios = [LANDSCAPE, PORTRAIT, PORTRAIT, PORTRAIT, LANDSCAPE, PORTRAIT]

		expect(paginate(ratios, 'auto', true)).toEqual([[0], [1, 2], [3], [4], [5]])
		expect(paginate(ratios, 'auto', false)).toEqual([[0], [1], [2], [3], [4], [5]])
		expect(paginate([LANDSCAPE, LANDSCAPE, PORTRAIT, LANDSCAPE], 'auto', false)).toEqual([[0, 1], [2], [3]])
	})

	it('keeps every photo exactly once and in order', () => {
		const ratios = Array.from({ length: 137 }, (_, index) => index % 3 === 0 ? PORTRAIT : LANDSCAPE)

		for (const layout of ['1', '2', '4', 'auto'] as const) {
			expect(paginate(ratios, layout, true).flat()).toEqual(ratios.map((_, index) => index))
		}
	})
})

describe('getPageSlots', () => {
	const landscapePage = getPageSize('a4', 'landscape')
	const portraitPage = getPageSize('a4', 'portrait')

	it('gives a single photo the page without its margins', () => {
		expect(getPageSlots(1, landscapePage)).toEqual([{ x: 36, y: 36, width: 841.89 - 72, height: 595.28 - 72 }])
	})

	it('puts two photos along the long side of the page', () => {
		const [left, right] = getPageSlots(2, landscapePage)
		expect(right!.y).toBe(left!.y)
		expect(right!.x).toBeCloseTo(left!.x + left!.width + 14)

		const [top, bottom] = getPageSlots(2, portraitPage)
		expect(bottom!.x).toBe(top!.x)
		expect(bottom!.y).toBeCloseTo(top!.y + top!.height + 14)
	})

	it('puts three and four photos on a two by two grid', () => {
		const slots = getPageSlots(4, portraitPage)
		expect(new Set(slots.map((slot) => slot.x)).size).toBe(2)
		expect(new Set(slots.map((slot) => slot.y)).size).toBe(2)
		expect(getPageSlots(3, portraitPage)).toEqual(slots.slice(0, 3))
	})

	it('keeps all slots inside the margins and apart from each other', () => {
		for (const page of [landscapePage, portraitPage]) {
			for (const count of [1, 2, 3, 4]) {
				const slots = getPageSlots(count, page, 18)
				for (const slot of slots) {
					expect(slot.x).toBeGreaterThanOrEqual(36)
					expect(slot.y).toBeGreaterThanOrEqual(36)
					expect(slot.x + slot.width).toBeLessThanOrEqual(page.width - 36 + 1e-6)
					// The caption is printed in the space left below the slot.
					expect(slot.y + slot.height + 18).toBeLessThanOrEqual(page.height - 36 + 1e-6)
				}
			}
		}
	})
})

describe('fitRect', () => {
	const slot = { x: 10, y: 20, width: 200, height: 100 }

	it('fits a wide photo to the width of the slot', () => {
		expect(fitRect(4, slot)).toEqual({ x: 10, y: 45, width: 200, height: 50 })
	})

	it('fits a high photo to the height of the slot', () => {
		expect(fitRect(0.5, slot)).toEqual({ x: 85, y: 20, width: 50, height: 100 })
	})
})
