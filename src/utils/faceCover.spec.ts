/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Face } from './faceCover.ts'

import { describe, expect, test } from 'vitest'
import { getFaceCover, getFaceCoverStyle } from './faceCover.ts'

/**
 * A face carrying the given cover, encoded the way recognize sends it.
 *
 * @param cover - The `face-preview-image` property, as an object
 */
function face(cover?: object): Face {
	return {
		attributes: {
			'face-preview-image': cover === undefined
				? undefined
				: JSON.stringify(cover).replace(/"/g, '&quot;'),
		},
	} as Face
}

describe('getFaceCover', () => {
	test('has no cover for a face without a preview', () => {
		expect(getFaceCover(face())).toEqual({})
	})

	test('decodes the preview the face carries', () => {
		const cover = { fileid: 42, detection: { x: 0.1, y: 0.2, width: 0.3, height: 0.4 } }

		expect(getFaceCover(face(cover))).toEqual(cover)
	})
})

describe('getFaceCoverStyle', () => {
	test('has no style for a face without a preview', () => {
		expect(getFaceCoverStyle(face())).toEqual({})
	})

	test('has no style for a preview without a detection', () => {
		expect(getFaceCoverStyle(face({ fileid: 42 }))).toEqual({})
	})

	test('zooms toward the center of the detected face', () => {
		// A face taking up a fifth of the picture, centered on it.
		const style = getFaceCoverStyle(face({ detection: { x: 0.4, y: 0.4, width: 0.2, height: 0.2 } }))

		expect(style).toEqual({
			width: '100%',
			transform: 'translate(calc( var(--photos-face-width)/2 - 50% ), calc( var(--photos-face-width)/2 - 50% )) scale(2)',
			transformOrigin: '50% 50%',
		})
	})

	test('never zooms out of a face larger than the box it fills', () => {
		const style = getFaceCoverStyle(face({ detection: { x: 0, y: 0, width: 1, height: 1 } })) as { transform: string }

		expect(style.transform).toContain('scale(1)')
	})
})
