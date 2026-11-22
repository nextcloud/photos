/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test, vi } from 'vitest'
import {
	createPlaylist,
	createPreloader,
	DEFAULT_FRAME_SETTINGS,
	getPhotoFit,
	getPreviewSize,
	loadFrameSettings,
	saveFrameSettings,
	shuffle,
} from './photoFrame.ts'

/**
 * @param values - Numbers to return, one per call, repeating the last one
 * @return A predictable stand-in for Math.random
 */
function sequence(...values: number[]): () => number {
	let index = 0
	return () => values[Math.min(index++, values.length - 1)]
}

/**
 * @param content - Initial content of the storage
 * @return A minimal in-memory storage
 */
function memoryStorage(content: Record<string, string> = {}): Storage {
	return {
		getItem: (key: string) => content[key] ?? null,
		setItem: (key: string, value: string) => {
			content[key] = value
		},
	} as Storage
}

describe('shuffle', () => {
	test('keeps every item exactly once', () => {
		const items = Array.from({ length: 50 }, (_, index) => index)
		const shuffled = shuffle(items)
		expect([...shuffled].sort((a, b) => a - b)).toEqual(items)
	})

	test('does not modify the given items', () => {
		const items = [1, 2, 3]
		shuffle(items, () => 0)
		expect(items).toEqual([1, 2, 3])
	})

	test('follows the random numbers', () => {
		// Always picking the first remaining slot rotates the items by one.
		expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1])
		// Always picking the current slot keeps the order.
		expect(shuffle([1, 2, 3, 4], () => 0.999)).toEqual([1, 2, 3, 4])
	})

	test('handles empty and single item lists', () => {
		expect(shuffle([])).toEqual([])
		expect(shuffle(['a'])).toEqual(['a'])
	})
})

describe('createPlaylist', () => {
	test('keeps the order when not shuffled', () => {
		expect(createPlaylist([3, 1, 2], { shuffled: false, avoidFirst: 3 })).toEqual([3, 1, 2])
	})

	test('shuffles when asked to', () => {
		expect(createPlaylist([1, 2, 3, 4], { shuffled: true, random: () => 0 })).toEqual([2, 3, 4, 1])
	})

	test('does not start with the photo the previous round ended on', () => {
		// The shuffle puts 2 first, which is then swapped with another photo.
		const playlist = createPlaylist([1, 2, 3, 4], { shuffled: true, avoidFirst: 2, random: sequence(0, 0, 0, 0) })
		expect(playlist[0]).not.toBe(2)
		expect([...playlist].sort()).toEqual([1, 2, 3, 4])
	})

	test('compares photos by their key', () => {
		const photos = [{ fileid: 1 }, { fileid: 2 }]
		for (let i = 0; i < 20; i++) {
			const playlist = createPlaylist(photos, { shuffled: true, avoidFirst: 1, key: (photo) => photo.fileid })
			expect(playlist[0].fileid).toBe(2)
		}
	})

	test('keeps a single photo even when it must not come first', () => {
		expect(createPlaylist([1], { shuffled: true, avoidFirst: 1 })).toEqual([1])
	})
})

describe('getPreviewSize', () => {
	test('picks the smallest cached size covering the screen', () => {
		expect(getPreviewSize(1024, 768)).toBe(1024)
		expect(getPreviewSize(1920, 1080)).toBe(2048)
		expect(getPreviewSize(3840, 2160)).toBe(4096)
	})

	test('accounts for the pixel ratio, up to 2', () => {
		expect(getPreviewSize(390, 844, 1)).toBe(1024)
		expect(getPreviewSize(390, 844, 3)).toBe(2048)
		expect(getPreviewSize(1440, 900, 2)).toBe(4096)
	})

	test('never asks for more than the largest size', () => {
		expect(getPreviewSize(7680, 4320, 2)).toBe(4096)
	})
})

describe('getPhotoFit', () => {
	const screen = { width: 1920, height: 1080 }

	test('fills the screen with photos of about its shape', () => {
		expect(getPhotoFit({ width: 4000, height: 2250 }, screen)).toBe('cover')
		expect(getPhotoFit({ width: 6000, height: 4000 }, screen)).toBe('cover')
	})

	test('fits photos of another shape whole', () => {
		expect(getPhotoFit({ width: 3000, height: 4000 }, screen)).toBe('contain')
		expect(getPhotoFit({ width: 4000, height: 3000 }, screen)).toBe('contain')
		expect(getPhotoFit({ width: 6000, height: 2000 }, screen)).toBe('contain')
	})

	test('fits photos of unknown size whole', () => {
		expect(getPhotoFit(undefined, screen)).toBe('contain')
		expect(getPhotoFit({ width: 0, height: 0 }, screen)).toBe('contain')
	})
})

describe('createPreloader', () => {
	test('loads each image once', async () => {
		const load = vi.fn(async () => {})
		const preload = createPreloader(load)
		await preload('a')
		await preload('a')
		expect(load).toHaveBeenCalledTimes(1)
	})

	test('forgets the images used least recently', async () => {
		const load = vi.fn(async () => {})
		const preload = createPreloader(load, 2)
		await preload('a')
		await preload('b')
		await preload('a')
		await preload('c')
		// "b" was dropped to make room for "c", "a" was kept as it was used again.
		await preload('a')
		expect(load).toHaveBeenCalledTimes(3)
		await preload('b')
		expect(load).toHaveBeenCalledTimes(4)
	})

	test('tries a failed image again', async () => {
		const load = vi.fn()
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValue(undefined)
		const preload = createPreloader(load)
		await expect(preload('a')).rejects.toThrow('offline')
		await expect(preload('a')).resolves.toBeUndefined()
		expect(load).toHaveBeenCalledTimes(2)
	})
})

describe('frame settings', () => {
	test('falls back to the defaults', () => {
		expect(loadFrameSettings(memoryStorage())).toEqual(DEFAULT_FRAME_SETTINGS)
		expect(loadFrameSettings(null)).toEqual(DEFAULT_FRAME_SETTINGS)
		expect(loadFrameSettings(memoryStorage({ 'photos:frame-settings': 'not json' }))).toEqual(DEFAULT_FRAME_SETTINGS)
	})

	test('replaces invalid values only', () => {
		const storage = memoryStorage({
			'photos:frame-settings': JSON.stringify({ source: 'everything', albumName: 'Lisbon', interval: 7, shuffle: false }),
		})
		expect(loadFrameSettings(storage)).toEqual({ ...DEFAULT_FRAME_SETTINGS, albumName: 'Lisbon', shuffle: false })
	})

	test('reads back saved settings', () => {
		const storage = memoryStorage()
		const settings = { source: 'album' as const, albumName: 'Lisbon 2025', interval: 60, shuffle: false }
		saveFrameSettings(settings, storage)
		expect(loadFrameSettings(storage)).toEqual(settings)
	})

	test('survives a storage which refuses to be written', () => {
		const storage = {
			getItem: () => null,
			setItem: () => {
				throw new Error('QuotaExceededError')
			},
		} as unknown as Storage
		expect(() => saveFrameSettings(DEFAULT_FRAME_SETTINGS, storage)).not.toThrow()
	})
})
