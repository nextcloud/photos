/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File } from '@nextcloud/files'
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { davClient } from '../services/DavClient.ts'
import { getFileByIdSearch, getLivePhotoVideoId, getLivePhotoVideoUrl, isLivePhotoVideo } from './livePhoto.ts'

vi.hoisted(() => document.head.setAttribute('data-user', 'alice'))
vi.mock('../services/DavClient.ts', () => ({ davClient: { search: vi.fn() } }))

const search = vi.mocked(davClient.search)

/**
 * A file of alice.
 *
 * @param mime - Mime type of the file
 * @param attributes - Attributes from the listing
 */
function file(mime: string, attributes: Record<string, unknown> = {}): File {
	return new File({
		id: 1,
		source: 'https://cloud.example.org/remote.php/dav/files/alice/Photos/IMG_0001.HEIC',
		owner: 'alice',
		root: '/files/alice',
		mime,
		attributes,
	})
}

/**
 * The response of a SEARCH finding the given files.
 *
 * @param results - What the search found
 */
function found(...results: { filename: string, mime: string }[]) {
	return {
		data: {
			truncated: false,
			results: results.map(({ filename, mime }) => ({
				filename,
				basename: filename.split('/').pop(),
				lastmod: 'Mon, 01 Jan 2024 00:00:00 GMT',
				size: 1,
				type: 'file',
				etag: 'etag',
				mime,
				props: { fileid: 2 },
			})),
		},
	} as unknown as Awaited<ReturnType<typeof davClient.search>>
}

describe('getLivePhotoVideoId', () => {
	test('is the id of the paired video for the still of a live photo', () => {
		expect(getLivePhotoVideoId(file('image/heic', { 'metadata-files-live-photo': 2 }))).toBe(2)
		expect(getLivePhotoVideoId(file('image/jpeg', { 'metadata-files-live-photo': '2' }))).toBe(2)
	})

	test('is nothing for a photo that is not a live photo', () => {
		expect(getLivePhotoVideoId(file('image/jpeg'))).toBeUndefined()
		expect(getLivePhotoVideoId(file('image/jpeg', { 'metadata-files-live-photo': '' }))).toBeUndefined()
		expect(getLivePhotoVideoId(file('image/jpeg', { 'metadata-files-live-photo': 'abc' }))).toBeUndefined()
	})

	test('is nothing for the video half of the pair', () => {
		expect(getLivePhotoVideoId(file('video/quicktime', { 'metadata-files-live-photo': 1 }))).toBeUndefined()
	})
})

describe('isLivePhotoVideo', () => {
	test('is the QuickTime video paired with a still', () => {
		expect(isLivePhotoVideo(file('video/quicktime', { 'metadata-files-live-photo': 1 }))).toBe(true)
	})

	test('is not the still, nor a video of its own', () => {
		expect(isLivePhotoVideo(file('image/heic', { 'metadata-files-live-photo': 2 }))).toBe(false)
		expect(isLivePhotoVideo(file('video/quicktime'))).toBe(false)
		expect(isLivePhotoVideo(file('video/mp4', { 'metadata-files-live-photo': 1 }))).toBe(false)
	})
})

describe('getFileByIdSearch', () => {
	test('searches the files of the user for the id', () => {
		const request = getFileByIdSearch(42)

		expect(request).toContain('<d:href>/files/alice</d:href>')
		expect(request).toMatch(/<oc:fileid\/>\s*<\/d:prop>\s*<d:literal>42<\/d:literal>/)
		expect(request).toContain('<d:nresults>1</d:nresults>')
	})
})

describe('getLivePhotoVideoUrl', () => {
	beforeEach(() => {
		search.mockReset()
	})

	test('is the source of the video found by its id, looked up once', async () => {
		search.mockResolvedValue(found({ filename: '/remote.php/dav/files/alice/Photos/IMG_0001.MOV', mime: 'video/quicktime' }))

		expect(await getLivePhotoVideoUrl(100)).toBe(`${defaultRemoteURL}/files/alice/Photos/IMG_0001.MOV`)
		expect(await getLivePhotoVideoUrl(100)).toBe(`${defaultRemoteURL}/files/alice/Photos/IMG_0001.MOV`)
		expect(search).toHaveBeenCalledOnce()
		expect(search.mock.calls[0][1]?.data).toContain('<d:literal>100</d:literal>')
	})

	test('is null when the user cannot reach the video', async () => {
		search.mockResolvedValue(found())

		expect(await getLivePhotoVideoUrl(101)).toBeNull()
	})

	test('is null when the id points at something that is not a video', async () => {
		search.mockResolvedValue(found({ filename: '/remote.php/dav/files/alice/Documents/notes.txt', mime: 'text/plain' }))

		expect(await getLivePhotoVideoUrl(102)).toBeNull()
	})

	test('looks the video up again after a failed request', async () => {
		search.mockRejectedValueOnce(new Error('offline'))
		search.mockResolvedValueOnce(found({ filename: '/remote.php/dav/files/alice/IMG_0002.MOV', mime: 'video/quicktime' }))

		expect(await getLivePhotoVideoUrl(103)).toBeNull()
		expect(await getLivePhotoVideoUrl(103)).toBe(`${defaultRemoteURL}/files/alice/IMG_0002.MOV`)
		expect(search).toHaveBeenCalledTimes(2)
	})
})
