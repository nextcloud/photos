/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, it } from 'vitest'
import { findDuplicateGroups } from './duplicates.ts'

/**
 * Build a minimal photo with a byte size and optional pixel dimensions.
 *
 * @param fileid - File id of the photo
 * @param size - Byte size
 * @param width - Pixel width
 * @param height - Pixel height
 */
function photo(fileid: number, size: number, width = 100, height = 100): PhotoFile {
	return {
		fileid,
		size,
		attributes: { 'metadata-photos-size': { width, height } },
	} as unknown as PhotoFile
}

describe('findDuplicateGroups', () => {
	it('returns nothing when every photo is a different size', () => {
		expect(findDuplicateGroups([photo(1, 100), photo(2, 200), photo(3, 300)])).toEqual([])
	})

	it('groups photos that share a byte size', () => {
		const groups = findDuplicateGroups([photo(1, 500), photo(2, 500), photo(3, 999)])

		expect(groups).toHaveLength(1)
		expect(groups[0].photos.map((p) => p.fileid)).toEqual([1, 2])
		expect(groups[0].size).toBe(500)
	})

	it('groups photos of equal size even when their dimensions differ', () => {
		// Dimensions are only filled in by a background job, so they must not gate
		// the match — a freshly added copy would otherwise be missed.
		const groups = findDuplicateGroups([photo(1, 500, 100, 100), photo(2, 500, 4000, 3000)])

		expect(groups).toHaveLength(1)
		expect(groups[0].photos.map((p) => p.fileid)).toEqual([1, 2])
	})

	it('skips photos without a real byte size', () => {
		const noSize = { fileid: 1, size: 0, attributes: {} } as unknown as PhotoFile

		expect(findDuplicateGroups([noSize, photo(2, 500)])).toEqual([])
	})

	it('orders groups by copy count first, then by size', () => {
		const groups = findDuplicateGroups([
			// Two copies of a large file.
			photo(1, 9000),
			photo(2, 9000),
			// Three copies of a small file.
			photo(3, 100),
			photo(4, 100),
			photo(5, 100),
		])

		expect(groups.map((group) => group.photos.length)).toEqual([3, 2])
	})
})
