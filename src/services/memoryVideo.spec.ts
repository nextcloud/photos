/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { buildTimeline, getFrameLayers, getVideoFilename, MAX_VIDEO_PHOTOS, pickVideoMimeType, sampleVideoPhotos, saveVideoToFiles } from './memoryVideo.ts'

const mocks = vi.hoisted(() => ({
	getFolder: vi.fn(),
	getDirectoryContents: vi.fn(),
	putFileContents: vi.fn(),
}))

vi.mock('../store/userConfig.ts', () => ({ getFolder: mocks.getFolder }))
vi.mock('./DavClient.ts', () => ({
	davClient: {
		getDirectoryContents: mocks.getDirectoryContents,
		putFileContents: mocks.putFileContents,
	},
}))

/**
 * @param count - Number of photos to build, taken an hour apart
 * @param favorites - File ids of the photos marked as favorite
 */
function buildPhotos(count: number, favorites: number[] = []): PhotoFile[] {
	return Array.from({ length: count }, (_, index) => ({
		fileid: index + 1,
		attributes: { timestamp: index * 3600, favorite: favorites.includes(index + 1) ? 1 : 0 },
	} as unknown as PhotoFile))
}

describe('sampleVideoPhotos', () => {
	test('keeps every photo of a short memory', () => {
		const photos = buildPhotos(10)

		expect(sampleVideoPhotos(photos)).toEqual(photos)
	})

	test('puts the photos in chronological order', () => {
		const photos = buildPhotos(5)

		expect(sampleVideoPhotos([...photos].reverse())).toEqual(photos)
	})

	test('spreads the picks over a long memory', () => {
		const picked = sampleVideoPhotos(buildPhotos(100), 10).map(({ fileid }) => fileid)

		expect(picked).toEqual([6, 16, 26, 36, 46, 56, 66, 76, 86, 96])
	})

	test('limits a long memory to the default maximum', () => {
		expect(sampleVideoPhotos(buildPhotos(500))).toHaveLength(MAX_VIDEO_PHOTOS)
	})

	test('always picks the favorites', () => {
		const picked = sampleVideoPhotos(buildPhotos(100, [2, 3, 99]), 5).map(({ fileid }) => fileid)

		expect(picked).toHaveLength(5)
		expect(picked).toEqual(expect.arrayContaining([2, 3, 99]))
	})

	test('spreads the favorites when they do not all fit', () => {
		const favorites = Array.from({ length: 20 }, (_, index) => index + 1)

		const picked = sampleVideoPhotos(buildPhotos(100, favorites), 4).map(({ fileid }) => fileid)

		expect(picked).toEqual([3, 8, 13, 18])
	})
})

describe('buildTimeline', () => {
	test('overlaps the slides by the fade duration', () => {
		expect(buildTimeline(3, 3000, 800)).toEqual({ slideCount: 3, slideDuration: 3000, fadeDuration: 800, duration: 7400 })
	})

	test('is empty without slides', () => {
		expect(buildTimeline(0).duration).toBe(0)
	})
})

describe('getFrameLayers', () => {
	const timeline = buildTimeline(3, 3000, 1000)

	test('fades the first slide in from black', () => {
		expect(getFrameLayers(timeline, 500, false)).toEqual([{ slide: 0, opacity: 0.5, scale: 1, offsetX: 0, offsetY: 0 }])
	})

	test('shows a single slide between two fades', () => {
		expect(getFrameLayers(timeline, 1500, false).map(({ slide, opacity }) => [slide, opacity])).toEqual([[0, 1]])
	})

	test('cross-fades the next slide over the previous one', () => {
		expect(getFrameLayers(timeline, 2500, false).map(({ slide, opacity }) => [slide, opacity])).toEqual([[0, 1], [1, 0.5]])
	})

	test('drops a slide once the next one fully covers it', () => {
		expect(getFrameLayers(timeline, 3001, false).map(({ slide }) => slide)).toEqual([1])
	})

	test('fades the last slide out to black', () => {
		const layers = getFrameLayers(timeline, timeline.duration - 250, false)

		expect(layers.map(({ slide, opacity }) => [slide, opacity])).toEqual([[2, 0.25]])
	})

	test('shows nothing outside of the video', () => {
		expect(getFrameLayers(timeline, -1, true)).toEqual([])
		expect(getFrameLayers(timeline, timeline.duration + 1, true)).toEqual([])
	})

	test('zooms in and out on alternate slides', () => {
		const [startOfFirst] = getFrameLayers(timeline, 0, true)
		const [endOfFirst, startOfSecond] = getFrameLayers(timeline, 2000, true)

		expect(endOfFirst.scale).toBeGreaterThan(startOfFirst.scale)
		expect(startOfSecond.scale).toBeGreaterThan(endOfFirst.scale)
	})

	test('keeps the pan within the margin left by the zoom', () => {
		for (let time = 0; time <= timeline.duration; time += 100) {
			for (const layer of getFrameLayers(timeline, time, true)) {
				expect(Math.abs(layer.offsetX)).toBeLessThanOrEqual((layer.scale - 1) / 2)
				expect(Math.abs(layer.offsetY)).toBeLessThanOrEqual((layer.scale - 1) / 2)
			}
		}
	})

	test('keeps the slides static when motion is reduced', () => {
		for (let time = 0; time <= timeline.duration; time += 100) {
			for (const layer of getFrameLayers(timeline, time, false)) {
				expect(layer).toMatchObject({ scale: 1, offsetX: 0, offsetY: 0 })
			}
		}
	})
})

describe('pickVideoMimeType', () => {
	test('prefers MP4 when supported', () => {
		expect(pickVideoMimeType(() => true, false)).toBe('video/mp4;codecs=avc1.42E01F')
	})

	test('falls back to WebM', () => {
		expect(pickVideoMimeType((type) => type.startsWith('video/webm'), true)).toBe('video/webm;codecs=vp9,opus')
	})

	test('asks for a sound codec only with a sound track', () => {
		const asked: string[] = []
		pickVideoMimeType((type) => asked.push(type) > 10, false)

		expect(asked.some((type) => type.includes('opus') || type.includes('mp4a'))).toBe(false)
	})

	test('gives nothing when no format is supported', () => {
		expect(pickVideoMimeType(() => false, false)).toBeUndefined()
	})
})

describe('getVideoFilename', () => {
	test('uses the extension of the format', () => {
		expect(getVideoFilename('Lisbon', 'video/mp4;codecs=avc1')).toBe('Lisbon.mp4')
		expect(getVideoFilename('Lisbon', 'video/webm')).toBe('Lisbon.webm')
	})

	test('strips characters that are not allowed in file names', () => {
		expect(getVideoFilename('Trip: 1/2 "best"?', 'video/webm')).toBe('Trip 1 2 best.webm')
	})

	test('falls back to a default name', () => {
		expect(getVideoFilename(' / ', 'video/webm')).toBe('Memory.webm')
	})
})

describe('saveVideoToFiles', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mocks.getDirectoryContents.mockResolvedValue([{ basename: 'Lisbon.webm' }])
		mocks.putFileContents.mockResolvedValue(true)
	})

	test('saves the video in the Memories folder of the upload location without overwriting', async () => {
		const blob = new Blob(['video'], { type: 'video/webm' })

		const path = await saveVideoToFiles(blob, 'Lisbon.webm', '/Photos')

		expect(mocks.getFolder).toHaveBeenCalledWith('/Photos/Memories')
		expect(mocks.putFileContents).toHaveBeenCalledWith(
			expect.stringMatching(/^\/files\/.+\/Photos\/Memories\/Lisbon \(1\)\.webm$/),
			expect.any(ArrayBuffer),
			{ overwrite: false },
		)
		expect(path).toBe('/Photos/Memories/Lisbon (1).webm')
	})
})
