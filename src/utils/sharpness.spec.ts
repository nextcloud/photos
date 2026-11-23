/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { indexOfSharpest, laplacianVariance } from './sharpness.ts'

const SIZE = 64

/**
 * A grey picture as RGBA pixels.
 *
 * @param luma - Brightness of each pixel, row by row.
 */
function toRgba(luma: number[]): Uint8ClampedArray {
	const rgba = new Uint8ClampedArray(luma.length * 4)
	luma.forEach((value, pixel) => rgba.set([value, value, value, 255], pixel * 4))
	return rgba
}

/**
 * A checkerboard of 8 pixel squares, the hard edges of a picture in focus.
 */
function checkerboard(): number[] {
	return Array.from({ length: SIZE * SIZE }, (_, pixel) => {
		const x = pixel % SIZE
		const y = Math.floor(pixel / SIZE)
		return (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0 ? 230 : 25
	})
}

/**
 * The picture a box blur leaves, which is what a missed focus does to it.
 *
 * @param luma - Brightness of each pixel, row by row.
 * @param radius - How far the blur reaches, in pixels.
 */
function blur(luma: number[], radius: number): number[] {
	return luma.map((_, pixel) => {
		const x = pixel % SIZE
		const y = Math.floor(pixel / SIZE)
		let sum = 0
		let count = 0
		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const nx = x + dx
				const ny = y + dy
				if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
					sum += luma[ny * SIZE + nx]
					count++
				}
			}
		}
		return sum / count
	})
}

describe('laplacianVariance', () => {
	test('scores a flat picture as zero', () => {
		expect(laplacianVariance(toRgba(new Array(SIZE * SIZE).fill(128)), SIZE, SIZE)).toBe(0)
	})

	test('scores a picture without an inner pixel as zero', () => {
		expect(laplacianVariance(toRgba([0, 255, 0, 255]), 2, 2)).toBe(0)
	})

	test('scores a sharp picture above its blurred copy', () => {
		const sharp = checkerboard()

		const sharpScore = laplacianVariance(toRgba(sharp), SIZE, SIZE)
		const softScore = laplacianVariance(toRgba(blur(sharp, 1)), SIZE, SIZE)
		const blurredScore = laplacianVariance(toRgba(blur(sharp, 3)), SIZE, SIZE)

		expect(sharpScore).toBeGreaterThan(softScore)
		expect(softScore).toBeGreaterThan(blurredScore)
		expect(blurredScore).toBeGreaterThan(0)
	})

	test('does not mistake a brighter picture for a sharper one', () => {
		const blurred = blur(checkerboard(), 3)
		const brighter = blurred.map((value) => Math.min(255, value + 20))

		expect(laplacianVariance(toRgba(brighter), SIZE, SIZE))
			.toBeLessThan(laplacianVariance(toRgba(checkerboard()), SIZE, SIZE))
	})

	test('ignores the alpha channel', () => {
		const opaque = toRgba(checkerboard())
		const translucent = opaque.map((value, index) => index % 4 === 3 ? 10 : value)

		expect(laplacianVariance(translucent, SIZE, SIZE)).toBe(laplacianVariance(opaque, SIZE, SIZE))
	})
})

describe('indexOfSharpest', () => {
	test('picks the highest score', () => {
		expect(indexOfSharpest([12, 340, 55])).toBe(1)
	})

	test('keeps the first picture on a tie', () => {
		expect(indexOfSharpest([7, 7])).toBe(0)
	})

	test('skips pictures that were not measured', () => {
		expect(indexOfSharpest([null, 3, null])).toBe(1)
	})

	test('picks none when nothing was measured', () => {
		expect(indexOfSharpest([null, null])).toBe(-1)
		expect(indexOfSharpest([])).toBe(-1)
	})
})
