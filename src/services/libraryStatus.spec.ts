/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { formatLastUpload, formatLibraryStatus, formatMediaCount } from './libraryStatus.ts'

const NOW = Date.UTC(2026, 10, 22, 12, 0, 0)
const nowInSeconds = NOW / 1000

const status = {
	photos: 12345,
	videos: 678,
	size: 54 * 1024 ** 3,
	lastUpload: nowInSeconds - 2 * 3600,
	cameraFolders: [],
}

beforeEach(() => {
	document.documentElement.lang = 'en'
	document.documentElement.dataset.locale = 'en'
	vi.useFakeTimers()
	vi.setSystemTime(NOW)
})

afterEach(() => {
	vi.useRealTimers()
})

describe('formatMediaCount', () => {
	test('formats the counts with grouping and the size', () => {
		expect(formatMediaCount(status)).toBe('12,345 photos and 678 videos (54 GB)')
	})

	test('leaves out a kind of media without files', () => {
		expect(formatMediaCount({ ...status, videos: 0 })).toBe('12,345 photos (54 GB)')
		expect(formatMediaCount({ ...status, photos: 0 })).toBe('678 videos (54 GB)')
	})

	test('uses the singular for one file', () => {
		expect(formatMediaCount({ photos: 1, videos: 1, size: 2048, lastUpload: null })).toBe('1 photo and 1 video (2 KB)')
	})
})

describe('formatLastUpload', () => {
	test('formats the time relative to now', () => {
		expect(formatLastUpload(nowInSeconds - 2 * 3600)).toBe('last upload 2 hours ago')
		expect(formatLastUpload(nowInSeconds - 3 * 86400)).toBe('last upload 3 days ago')
	})
})

describe('formatLibraryStatus', () => {
	test('summarizes the library with the last upload', () => {
		expect(formatLibraryStatus(status)).toBe('12,345 photos and 678 videos (54 GB) on this server · last upload 2 hours ago')
	})

	test('leaves out an unknown last upload', () => {
		expect(formatLibraryStatus({ ...status, lastUpload: null })).toBe('12,345 photos and 678 videos (54 GB) on this server')
	})

	test('says when the library is empty', () => {
		expect(formatLibraryStatus({ ...status, photos: 0, videos: 0, size: 0, lastUpload: null })).toBe('No photos or videos on this server yet')
	})
})
