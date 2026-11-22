/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { findDuplicateGroups, getDuplicateKey } from './duplicates.ts'

// 2024-03-15T12:00:00Z
const TAKEN_AT = 1710504000

/**
 * Build a photo with the properties the grouping looks at.
 *
 * @param fileid - Id of the photo
 * @param path - Path of the photo
 * @param overrides - Values replacing the default size, capture time and dimensions
 * @param overrides.size - Size in bytes
 * @param overrides.takenAt - Capture time, in unix seconds
 * @param overrides.width - Width in pixels
 * @param overrides.height - Height in pixels
 */
function buildPhoto(fileid: number, path: string, { size = 1000, takenAt = TAKEN_AT, width = 4000, height = 3000 }: Partial<{ size: number, takenAt: number, width: number, height: number }> = {}): PhotoFile {
	return {
		fileid,
		path,
		size,
		attributes: {
			'metadata-photos-original_date_time': takenAt,
			'metadata-photos-size': { width, height },
		},
	} as unknown as PhotoFile
}

describe('getDuplicateKey', () => {
	test('combines the size, the capture time and the dimensions', () => {
		expect(getDuplicateKey(buildPhoto(1, '/a.jpg'))).toBe(`1000-${TAKEN_AT}-4000x3000`)
	})

	test('leaves out files without a size', () => {
		expect(getDuplicateKey(buildPhoto(1, '/a.jpg', { size: 0 }))).toBeNull()
	})

	test('leaves out files without a capture time', () => {
		expect(getDuplicateKey(buildPhoto(1, '/a.jpg', { takenAt: 0 }))).toBeNull()
	})
})

describe('findDuplicateGroups', () => {
	test('returns no group without files', () => {
		expect(findDuplicateGroups([])).toEqual([])
	})

	test('groups the copies of a file, sorted by path', () => {
		const groups = findDuplicateGroups([
			buildPhoto(1, '/Photos/b.jpg'),
			buildPhoto(2, '/Backup/a.jpg'),
			buildPhoto(3, '/Photos/c.jpg', { size: 2000 }),
		])

		expect(groups.map((group) => group.map((file) => file.fileid))).toEqual([[2, 1]])
	})

	test.each([
		['size', { size: 1001 }],
		['capture time', { takenAt: TAKEN_AT + 1 }],
		['width', { width: 3000 }],
		['height', { height: 4000 }],
	])('does not group files with a different %s', (_, overrides) => {
		expect(findDuplicateGroups([
			buildPhoto(1, '/a.jpg'),
			buildPhoto(2, '/b.jpg', overrides),
		])).toEqual([])
	})

	test('does not group files that cannot be compared', () => {
		expect(findDuplicateGroups([
			buildPhoto(1, '/a.jpg', { takenAt: 0 }),
			buildPhoto(2, '/b.jpg', { takenAt: 0 }),
		])).toEqual([])
	})

	test('puts the groups taking the most space first', () => {
		const groups = findDuplicateGroups([
			buildPhoto(1, '/small-1.jpg', { size: 1000 }),
			buildPhoto(2, '/small-2.jpg', { size: 1000 }),
			buildPhoto(3, '/small-3.jpg', { size: 1000 }),
			buildPhoto(4, '/big-1.jpg', { size: 5000 }),
			buildPhoto(5, '/big-2.jpg', { size: 5000 }),
			buildPhoto(6, '/medium-1.jpg', { size: 1500 }),
			buildPhoto(7, '/medium-2.jpg', { size: 1500 }),
		])

		expect(groups.map((group) => group[0].fileid)).toEqual([4, 1, 6])
	})
})
