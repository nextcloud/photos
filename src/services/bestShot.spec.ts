/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type { Pixels } from './bestShot.ts'

import { describe, expect, test, vi } from 'vitest'
import { isComparableBurst, scoreSharpness } from './bestShot.ts'

/**
 * @param fileid - Id of the photo.
 * @param etag - Etag of the photo.
 * @param mime - Mime type of the photo.
 */
function photo(fileid: number, etag = 'a', mime = 'image/jpeg'): PhotoFile {
	return { fileid, mime, basename: `${fileid}.jpg`, attributes: { etag } } as unknown as PhotoFile
}

/**
 * A 4x4 picture of vertical stripes with the given contrast.
 *
 * @param contrast - Brightness of the bright stripes, the dark ones being black.
 */
function stripes(contrast: number): Pixels {
	const data = new Uint8ClampedArray(4 * 4 * 4)
	for (let pixel = 0; pixel < 16; pixel++) {
		const value = pixel % 2 === 0 ? contrast : 0
		data.set([value, value, value, 255], pixel * 4)
	}
	return { data, width: 4, height: 4 }
}

describe('scoreSharpness', () => {
	test('scores every photo, in the order given', async () => {
		const loader = vi.fn(async (file: PhotoFile) => stripes(file.fileid === 11 ? 200 : 20))

		const [soft, sharp] = await scoreSharpness([photo(10), photo(11)], loader)

		expect(sharp).toBeGreaterThan(soft as number)
		expect(soft).toBeGreaterThan(0)
	})

	test('measures a photo once per etag', async () => {
		const loader = vi.fn(async () => stripes(100))

		await scoreSharpness([photo(20, 'a')], loader)
		await scoreSharpness([photo(20, 'a')], loader)
		expect(loader).toHaveBeenCalledTimes(1)

		await scoreSharpness([photo(20, 'b')], loader)
		expect(loader).toHaveBeenCalledTimes(2)
	})

	test('shares the measurement of a photo that is asked for twice at once', async () => {
		const loader = vi.fn(async () => stripes(100))

		await Promise.all([scoreSharpness([photo(30)], loader), scoreSharpness([photo(30)], loader)])

		expect(loader).toHaveBeenCalledTimes(1)
	})

	test('reports a photo whose preview fails as unmeasured, and tries it again', async () => {
		const loader = vi.fn()
			.mockRejectedValueOnce(new Error('404'))
			.mockResolvedValue(stripes(100))

		expect(await scoreSharpness([photo(40)], loader)).toEqual([null])
		expect((await scoreSharpness([photo(40)], loader))[0]).toBeGreaterThan(0)
	})
})

describe('isComparableBurst', () => {
	test('accepts a run of still images', () => {
		expect(isComparableBurst([photo(1), photo(2)])).toBe(true)
	})

	test('rejects a single photo', () => {
		expect(isComparableBurst([photo(1)])).toBe(false)
	})

	test('rejects a run holding a video', () => {
		expect(isComparableBurst([photo(1), photo(2, 'a', 'video/quicktime')])).toBe(false)
	})

	test('rejects a run holding a live photo', () => {
		const live = photo(2)
		live.attributes['metadata-files-live-photo'] = 3

		expect(isComparableBurst([photo(1), live])).toBe(false)
	})
})
