/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from '../store/albums.ts'
import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { albumCoverFileId, pickAlbumCover } from './albumCover.ts'

/**
 * Build the parts of a photo the cover is picked by.
 *
 * @param fileid - File id of the photo
 * @param timestamp - When the photo was taken
 * @param hasPreview - Whether a preview can be generated for it
 */
function photo(fileid: number, timestamp: number, hasPreview: boolean): PhotoFile {
	return { fileid, attributes: { hasPreview, timestamp } } as unknown as PhotoFile
}

describe('pickAlbumCover', () => {
	test('keeps the photo the album points at when it has a preview', () => {
		const files = [photo(1, 100, true), photo(2, 200, true)]

		expect(pickAlbumCover(files, 1)).toBe(files[0])
	})

	test('falls back to the most recent photo with a preview', () => {
		const files = [photo(1, 100, true), photo(2, 300, true), photo(3, 200, true), photo(4, 400, false)]

		expect(pickAlbumCover(files, 4)).toBe(files[1])
	})

	test('keeps the photo the album points at when no photo has a preview', () => {
		const files = [photo(1, 100, false), photo(2, 200, false)]

		expect(pickAlbumCover(files, 2)).toBe(files[1])
	})

	test('picks a photo with a preview while the album cover is not loaded yet', () => {
		const files = [photo(1, 100, true)]

		expect(pickAlbumCover(files, 42)).toBe(files[0])
	})

	test('has no cover for an album without photos', () => {
		expect(pickAlbumCover([], -1)).toBeUndefined()
	})
})

describe('albumCoverFileId', () => {
	/**
	 * Build the parts of an album its cover is read from.
	 *
	 * @param cover - File id of the photo picked as cover
	 * @param lastPhoto - File id of the photo the album points at
	 */
	function album(cover: number | undefined, lastPhoto: number): Album {
		return { attributes: { cover, 'last-photo': lastPhoto } } as unknown as Album
	}

	test('uses the photo picked by the owner', () => {
		expect(albumCoverFileId(album(5, 9))).toBe(5)
	})

	test('falls back to the photo the album points at when none was picked', () => {
		expect(albumCoverFileId(album(-1, 9))).toBe(9)
		expect(albumCoverFileId(album(undefined, 9))).toBe(9)
	})
})
