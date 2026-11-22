/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { Permission } from '@nextcloud/files'
import { describe, expect, test } from 'vitest'
import {
	getScreenshotSearchFilter,
	getTotalSize,
	getVideoSearchFilter,
	groupCleanupCandidates,
	isLargeVideo,
	isPhoneScreenSize,
	isScreenRecording,
	isScreenshot,
	LARGE_VIDEO_SIZE,
	matchesNamePattern,
	SCREENSHOT_NAME_PATTERNS,
} from './cleanup.ts'

const MB = 1024 * 1024

let nextFileId = 1

/**
 * @param file - Properties of the file to build
 * @param file.basename - File name
 * @param file.mime - Mime type
 * @param file.size - Size in bytes
 * @param file.width - Width of the picture
 * @param file.height - Height of the picture
 * @param file.permissions - Permissions of the user on the file
 */
function buildFile({ basename, mime, size = 1000, width = 4000, height = 3000, permissions = Permission.ALL }: {
	basename: string
	mime: string
	size?: number
	width?: number
	height?: number
	permissions?: number
}): PhotoFile {
	return {
		fileid: nextFileId++,
		basename,
		mime,
		size,
		permissions,
		attributes: { 'metadata-photos-size': { width, height } },
	} as unknown as PhotoFile
}

describe('matchesNamePattern', () => {
	test.each([
		'Screenshot_20240512-101112.png',
		'Screenshot 2024-05-12 at 10.11.12.png',
		'Screen Shot 2019-03-01 at 09.00.00.png',
		'Bildschirmfoto 2024-05-12 um 10.11.12.png',
		'Capture d\'écran 2024-05-12 à 10.11.12.png',
		'Capture d’écran 2024-05-12 à 10.11.12.png',
		'Capture d\'écran 2024-05-12.png',
		'Captura de pantalla 2024-05-12.jpg',
		'Schermafbeelding 2024-05-12.png',
		'SCREENSHOT.JPG',
	])('recognizes the screenshot name %s', (name) => {
		expect(matchesNamePattern(name, SCREENSHOT_NAME_PATTERNS)).toBe(true)
	})

	test.each([
		'IMG_1234.png',
		'Holidays screen.jpg',
		'shot on screen.png',
	])('ignores the name %s', (name) => {
		expect(matchesNamePattern(name, SCREENSHOT_NAME_PATTERNS)).toBe(false)
	})

	test('treats regular expression characters literally', () => {
		expect(matchesNamePattern('a+b.png', ['a+b'])).toBe(true)
		expect(matchesNamePattern('aab.png', ['a+b'])).toBe(false)
	})
})

describe('isPhoneScreenSize', () => {
	test('matches both orientations', () => {
		expect(isPhoneScreenSize({ width: 1170, height: 2532 })).toBe(true)
		expect(isPhoneScreenSize({ width: 2532, height: 1170 })).toBe(true)
	})

	test('ignores camera sizes', () => {
		expect(isPhoneScreenSize({ width: 4032, height: 3024 })).toBe(false)
	})
})

describe('isScreenshot', () => {
	test('recognizes pictures named like screenshots', () => {
		expect(isScreenshot(buildFile({ basename: 'Screenshot_1.jpg', mime: 'image/jpeg' }))).toBe(true)
	})

	test('recognizes PNG files with the size of a phone screen', () => {
		expect(isScreenshot(buildFile({ basename: 'IMG_0001.PNG', mime: 'image/png', width: 1179, height: 2556 }))).toBe(true)
	})

	test('ignores other pictures with the size of a phone screen', () => {
		expect(isScreenshot(buildFile({ basename: 'IMG_0001.jpg', mime: 'image/jpeg', width: 1179, height: 2556 }))).toBe(false)
	})

	test('ignores PNG files of other sizes', () => {
		expect(isScreenshot(buildFile({ basename: 'drawing.png', mime: 'image/png', width: 800, height: 600 }))).toBe(false)
	})

	test('ignores videos', () => {
		expect(isScreenshot(buildFile({ basename: 'Screenshot.mp4', mime: 'video/mp4' }))).toBe(false)
	})
})

describe('isScreenRecording', () => {
	test.each([
		'Screen Recording 2024-05-12 at 10.11.12.mov',
		'Screen_Recording_20240512_101112.mp4',
		'Screenrecorder-2024-05-12.mp4',
		'Bildschirmaufnahme 2024-05-12.mov',
		'Enregistrement de l’écran 2024-05-12.mov',
		'Grabación de pantalla 2024-05-12.mov',
	])('recognizes the video %s', (name) => {
		expect(isScreenRecording(buildFile({ basename: name, mime: 'video/mp4' }))).toBe(true)
	})

	test('ignores other videos and pictures', () => {
		expect(isScreenRecording(buildFile({ basename: 'VID_0001.mp4', mime: 'video/mp4' }))).toBe(false)
		expect(isScreenRecording(buildFile({ basename: 'Screen Recording.png', mime: 'image/png' }))).toBe(false)
	})
})

describe('isLargeVideo', () => {
	test('compares the size of videos to the threshold', () => {
		expect(isLargeVideo(buildFile({ basename: 'a.mp4', mime: 'video/mp4', size: LARGE_VIDEO_SIZE + 1 }))).toBe(true)
		expect(isLargeVideo(buildFile({ basename: 'a.mp4', mime: 'video/mp4', size: LARGE_VIDEO_SIZE }))).toBe(false)
		expect(isLargeVideo(buildFile({ basename: 'a.mp4', mime: 'video/mp4', size: 20 * MB }), 10 * MB)).toBe(true)
	})

	test('ignores pictures', () => {
		expect(isLargeVideo(buildFile({ basename: 'a.tiff', mime: 'image/tiff', size: 2 * LARGE_VIDEO_SIZE }))).toBe(false)
	})
})

describe('getTotalSize', () => {
	test('adds up the sizes', () => {
		expect(getTotalSize([])).toBe(0)
		expect(getTotalSize([
			buildFile({ basename: 'a.png', mime: 'image/png', size: 3 * MB }),
			buildFile({ basename: 'b.png', mime: 'image/png', size: 2 * MB }),
		])).toBe(5 * MB)
	})

	test('counts files without a known size as empty', () => {
		const file = buildFile({ basename: 'a.png', mime: 'image/png' })
		Object.assign(file, { size: undefined })
		expect(getTotalSize([file, buildFile({ basename: 'b.png', mime: 'image/png', size: 10 })])).toBe(10)
	})
})

describe('groupCleanupCandidates', () => {
	test('sorts the files into categories, the largest first', () => {
		const smallScreenshot = buildFile({ basename: 'Screenshot 1.png', mime: 'image/png', size: 1 * MB })
		const bigScreenshot = buildFile({ basename: 'Screenshot 2.png', mime: 'image/png', size: 2 * MB })
		const recording = buildFile({ basename: 'Screen Recording.mov', mime: 'video/quicktime', size: 300 * MB })
		const bigVideo = buildFile({ basename: 'VID_1.mp4', mime: 'video/mp4', size: 500 * MB })
		const biggerVideo = buildFile({ basename: 'VID_2.mp4', mime: 'video/mp4', size: 900 * MB })
		const photo = buildFile({ basename: 'IMG_1.jpg', mime: 'image/jpeg', size: 5 * MB })
		const smallVideo = buildFile({ basename: 'VID_3.mp4', mime: 'video/mp4', size: 5 * MB })

		const categories = groupCleanupCandidates([smallScreenshot, bigVideo, photo, recording, bigScreenshot, smallVideo, biggerVideo])

		expect(categories.screenshots).toEqual([bigScreenshot, smallScreenshot])
		expect(categories.screenRecordings).toEqual([recording])
		expect(categories.largeVideos).toEqual([biggerVideo, bigVideo])
		expect(getTotalSize(categories.largeVideos)).toBe(1400 * MB)
	})

	test('lists each file once', () => {
		const recording = buildFile({ basename: 'Screen Recording.mov', mime: 'video/quicktime', size: 300 * MB })

		const categories = groupCleanupCandidates([recording, recording])

		expect(categories.screenRecordings).toEqual([recording])
		expect(categories.largeVideos).toEqual([])
	})

	test('leaves out the files that cannot be deleted', () => {
		const readOnly = buildFile({ basename: 'Screenshot.png', mime: 'image/png', permissions: Permission.READ })

		expect(groupCleanupCandidates([readOnly]).screenshots).toEqual([])
	})
})

describe('search filters', () => {
	test('look for PNG files and screenshot names', () => {
		const filter = getScreenshotSearchFilter()

		expect(filter).toContain('<d:literal>image/png</d:literal>')
		expect(filter).toContain('<d:literal>%screen%shot%</d:literal>')
	})

	test('look for large videos and screen recording names', () => {
		const filter = getVideoSearchFilter(42)

		expect(filter).toContain('<d:literal>42</d:literal>')
		expect(filter).toContain('<d:literal>%screen%record%</d:literal>')
	})
})
