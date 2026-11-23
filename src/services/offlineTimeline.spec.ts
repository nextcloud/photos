/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File } from '@nextcloud/files'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { allMimes } from './AllowedMimes.ts'
import {
	filterOfflineFiles,
	getOfflinePreviewUrls,
	isPlainTimelineQuery,
	loadOfflineFiles,
	offlineFavoritesLimit,
	offlineRecentLimit,
	saveOfflineFiles,
	selectOfflineFiles,
} from './offlineTimeline.ts'

vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/router', async (importOriginal) => ({
	...await importOriginal<object>(),
	generateUrl: (url: string, params: Record<string, string> = {}) => `/index.php${url.replace('{user}', params.user)}`,
}))
vi.mock('./PhotoSearch.ts', () => ({ getPhotos: vi.fn() }))
vi.mock('./AllowedMimes.ts', () => ({ allMimes: ['image/jpeg', 'video/mp4'] }))

/**
 * @param id - Id of the file
 * @param favorite - Whether the file is a favorite
 * @param mime - Mime type of the file
 */
function makeFile(id: number, favorite = 0, mime = 'image/jpeg'): File {
	return new File({
		id,
		source: `http://localhost/remote.php/dav/files/alice/Photos/${id}.jpg`,
		root: '/files/alice',
		owner: 'alice',
		mime,
		mtime: new Date('2026-01-02T03:04:05Z'),
		attributes: { favorite, etag: `&quot;etag${id}&quot;` },
	})
}

/**
 * @param from - Id of the first file
 * @param count - Number of files
 * @param favorite - Whether the files are favorites
 */
function makeFiles(from: number, count: number, favorite = 0): File[] {
	return Array.from({ length: count }, (_, index) => makeFile(from + index, favorite))
}

describe('selectOfflineFiles', () => {
	test('keeps the most recent files and the favorites, each once', () => {
		const recent = [makeFile(1), makeFile(2, 1), makeFile(3)]
		const favorites = [makeFile(2, 1), makeFile(9, 1)]

		expect(selectOfflineFiles(recent, favorites).map((file) => file.fileid)).toEqual([1, 2, 3, 9])
	})

	test('caps both lists', () => {
		const recent = makeFiles(1, offlineRecentLimit + 50)
		const favorites = makeFiles(10000, offlineFavoritesLimit + 50, 1)

		const fileIds = selectOfflineFiles(recent, favorites).map((file) => file.fileid)

		expect(fileIds).toHaveLength(offlineRecentLimit + offlineFavoritesLimit)
		expect(fileIds).not.toContain(offlineRecentLimit + 1)
		expect(fileIds).toContain(10000 + offlineFavoritesLimit - 1)
		expect(fileIds).not.toContain(10000 + offlineFavoritesLimit)
	})
})

describe('isPlainTimelineQuery', () => {
	test('only accepts the unfiltered timeline', () => {
		expect(isPlainTimelineQuery({})).toBe(true)
		expect(isPlainTimelineQuery({ mimesType: allMimes, onlyFavorites: false, extraFilters: '' })).toBe(true)
		expect(isPlainTimelineQuery({ mimesType: ['image/jpeg'] })).toBe(false)
		expect(isPlainTimelineQuery({ onlyFavorites: true })).toBe(false)
		expect(isPlainTimelineQuery({ onThisDay: true })).toBe(false)
		expect(isPlainTimelineQuery({ extraFilters: '<d:eq/>' })).toBe(false)
	})
})

describe('filterOfflineFiles', () => {
	const files = [makeFile(1), makeFile(2, 1), makeFile(3, 0, 'video/mp4'), makeFile(4, 1, 'video/mp4')]

	test('answers the timeline, the favorites and the mime type views', () => {
		expect(filterOfflineFiles(files, {}).map((file) => file.fileid)).toEqual([1, 2, 3, 4])
		expect(filterOfflineFiles(files, { onlyFavorites: true }).map((file) => file.fileid)).toEqual([2, 4])
		expect(filterOfflineFiles(files, { mimesType: ['video/mp4'] }).map((file) => file.fileid)).toEqual([3, 4])
	})

	test('does not answer queries the saved files cannot answer faithfully', () => {
		expect(filterOfflineFiles(files, { onThisDay: true })).toEqual([])
		expect(filterOfflineFiles(files, { extraFilters: '<d:eq/>' })).toEqual([])
	})
})

describe('getOfflinePreviewUrls', () => {
	test('lists the small and the large preview of every file', () => {
		expect(getOfflinePreviewUrls([makeFile(7)], 256)).toEqual([
			'/index.php/apps/photos/api/v1/preview/7?etag=etag7&x=64&y=64',
			'/index.php/apps/photos/api/v1/preview/7?etag=etag7&x=256&y=256',
		])
	})
})

describe('saved files', () => {
	const entries = new Map<string, Response>()

	beforeEach(() => {
		entries.clear()
		vi.stubGlobal('caches', {
			open: async () => ({
				put: async (url: string, response: Response) => entries.set(url, response),
				match: async (url: string) => entries.get(url)?.clone(),
			}),
		})
	})

	test('are restored as they were saved, for the current user', async () => {
		await saveOfflineFiles([makeFile(1), makeFile(2, 1)])

		expect([...entries.keys()]).toEqual(['/index.php/apps/photos/offline/alice'])

		const files = await loadOfflineFiles()
		expect(files.map((file) => file.fileid)).toEqual([1, 2])
		expect(files[1].attributes.favorite).toBe(1)
		expect(files[1].path).toBe('/Photos/2.jpg')
		expect(files[1].mime).toBe('image/jpeg')
		expect(files[1].mtime).toEqual(new Date('2026-01-02T03:04:05Z'))
	})

	test('are empty when nothing was saved or the cache is unavailable', async () => {
		expect(await loadOfflineFiles()).toEqual([])

		vi.stubGlobal('caches', undefined)
		expect(await loadOfflineFiles()).toEqual([])
	})
})
