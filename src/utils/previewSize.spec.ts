/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { drawnSize, previewBox, previewSizeBucket } from './previewSize.ts'

describe('previewSizeBucket', () => {
	test('rounds up to the next bucket', () => {
		expect(previewSizeBucket(1)).toBe(64)
		expect(previewSizeBucket(64)).toBe(64)
		expect(previewSizeBucket(65)).toBe(256)
		expect(previewSizeBucket(256)).toBe(256)
		expect(previewSizeBucket(257)).toBe(1024)
		expect(previewSizeBucket(1024)).toBe(1024)
	})

	test('caps at 1024, never the full max preview', () => {
		expect(previewSizeBucket(1025)).toBe(1024)
		expect(previewSizeBucket(10000)).toBe(1024)
	})
})

describe('drawnSize', () => {
	const tile = { width: 200, height: 200 }

	test('fills the tile with a cropped photo', () => {
		expect(drawnSize(tile, { width: 4000, height: 2000 }, true)).toEqual({ width: 400, height: 200 })
		expect(drawnSize(tile, { width: 1000, height: 2000 }, true)).toEqual({ width: 200, height: 400 })
	})

	test('fits an uncropped photo inside the tile', () => {
		expect(drawnSize(tile, { width: 4000, height: 2000 }, false)).toEqual({ width: 200, height: 100 })
		expect(drawnSize(tile, { width: 1000, height: 2000 }, false)).toEqual({ width: 100, height: 200 })
	})

	test('draws a photo of unknown size at the tile size', () => {
		expect(drawnSize(tile, undefined, true)).toEqual(tile)
		expect(drawnSize(tile, { width: 0, height: 0 }, false)).toEqual(tile)
	})
})

describe('previewBox', () => {
	const photo = { width: 4000, height: 3000 }

	test('is undefined for a tile not laid out yet', () => {
		expect(previewBox({ width: 0, height: 0 }, photo, true, 1)).toBeUndefined()
	})

	test('sizes the box for the tile at the pixel ratio', () => {
		// A tile of a justified row, in the aspect ratio of its photo.
		expect(previewBox({ width: 160, height: 120 }, photo, true, 1)).toEqual({ width: 256, height: 256 })
		expect(previewBox({ width: 267, height: 200 }, photo, true, 1)).toEqual({ width: 1024, height: 1024 })
		expect(previewBox({ width: 267, height: 200 }, photo, true, 2)).toEqual({ width: 1024, height: 1024 })
		expect(previewBox({ width: 960, height: 320 }, { width: 3, height: 1 }, true, 2)).toEqual({ width: 1024, height: 1024 })
	})

	test('is square, so a photo gets one stored preview per bucket', () => {
		const wide = { width: 3, height: 1 }
		expect(previewBox({ width: 240, height: 80 }, wide, true, 1)).toEqual({ width: 256, height: 256 })
		expect(previewBox({ width: 80, height: 80 }, wide, true, 1)).toEqual({ width: 256, height: 256 })
		expect(previewBox({ width: 80, height: 80 }, wide, false, 1)).toEqual({ width: 256, height: 256 })
	})

	test('caps the pixel ratio at 2 and raises it to at least 1', () => {
		expect(previewBox({ width: 160, height: 120 }, photo, true, 3)).toEqual(previewBox({ width: 160, height: 120 }, photo, true, 2))
		expect(previewBox({ width: 160, height: 120 }, photo, true, 0.5)).toEqual(previewBox({ width: 160, height: 120 }, photo, true, 1))
	})

	test('lets a dense screen fall a fifth short of its pixels, never the tile', () => {
		const square = { width: 1, height: 1 }
		expect(previewBox({ width: 160, height: 160 }, square, true, 2)).toEqual({ width: 256, height: 256 })
		expect(previewBox({ width: 161, height: 161 }, square, true, 2)).toEqual({ width: 1024, height: 1024 })
		expect(previewBox({ width: 250, height: 250 }, square, true, 1.2)).toEqual({ width: 256, height: 256 })
		expect(previewBox({ width: 257, height: 257 }, square, true, 1.2)).toEqual({ width: 1024, height: 1024 })
	})

	test('covers a square tile with a cropped photo', () => {
		expect(previewBox({ width: 220, height: 220 }, photo, true, 2)).toEqual({ width: 1024, height: 1024 })
		expect(previewBox({ width: 220, height: 220 }, photo, false, 1)).toEqual({ width: 256, height: 256 })
	})
})
