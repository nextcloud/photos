/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat } from 'webdav'

import { File, Folder } from '@nextcloud/files'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { davClient } from './DavClient.ts'
import { fetchTrashedMedia, filterTrashedMedia, getTrashedPreviewUrl, restoreTrashedItem, restoreTrashedItems } from './trashbin.ts'

vi.mock('./DavClient.ts', () => ({
	davClient: {
		getDirectoryContents: vi.fn(),
		moveFile: vi.fn(),
	},
}))
vi.mock('./AllowedMimes.ts', () => ({ allMimes: ['image/jpeg', 'video/mp4'] }))

// The current user, as the server announces it in the page.
vi.hoisted(() => document.head.setAttribute('data-user', 'alice'))

const ROOT = '/trashbin/alice/trash'

/**
 * An item of the trash bin of the user.
 *
 * @param id - Id of the item
 * @param name - Name of the item in the trash bin
 * @param mime - Mime type of the item
 * @param deletionTime - Moment the item was deleted, as a unix timestamp
 */
function trashed(id: number, name: string, mime: string, deletionTime: number): File {
	return new File({
		id,
		source: `https://cloud.example.org/remote.php/dav${ROOT}/${name}`,
		owner: 'alice',
		root: ROOT,
		mime,
		attributes: { 'trashbin-deletion-time': deletionTime },
	})
}

describe('filterTrashedMedia', () => {
	test('keeps the photos and videos, the most recently deleted first', () => {
		const folder = new Folder({
			id: 4,
			source: `https://cloud.example.org/remote.php/dav${ROOT}/Holidays.d300`,
			owner: 'alice',
			root: ROOT,
			attributes: { 'trashbin-deletion-time': 300 },
		})

		const result = filterTrashedMedia([
			trashed(1, 'old.jpg.d100', 'image/jpeg', 100),
			trashed(2, 'notes.txt.d400', 'text/plain', 400),
			trashed(3, 'clip.mp4.d200', 'video/mp4', 200),
			folder,
		])

		expect(result.map((node) => node.fileid)).toEqual([3, 1])
	})
})

describe('getTrashedPreviewUrl', () => {
	test('points to the preview endpoint of the trash bin', () => {
		expect(getTrashedPreviewUrl(42, 256)).toMatch(/\/apps\/files_trashbin\/preview\?fileId=42&x=256&y=256&a=1$/)
	})
})

describe('fetchTrashedMedia', () => {
	beforeEach(() => {
		vi.mocked(davClient.getDirectoryContents).mockReset()
	})

	test('lists the trash bin root of the user with the trash bin properties', async () => {
		const stat = (fileid: number, basename: string, mime: string, deletionTime: number): FileStat => ({
			filename: `${ROOT}/${basename}`,
			basename,
			lastmod: 'Mon, 02 Nov 2026 10:00:00 GMT',
			size: 10,
			type: 'file',
			etag: 'abc',
			mime,
			props: {
				fileid,
				getcontenttype: mime,
				permissions: 'GD',
				'trashbin-deletion-time': deletionTime,
				'trashbin-filename': basename.replace(/\.d\d+$/, ''),
			} as unknown as FileStat['props'],
		})

		vi.mocked(davClient.getDirectoryContents).mockResolvedValue({
			data: [
				stat(1, 'a.jpg.d100', 'image/jpeg', 100),
				stat(2, 'b.pdf.d300', 'application/pdf', 300),
				stat(3, 'c.jpg.d200', 'image/jpeg', 200),
			],
		} as never)

		const signal = new AbortController().signal
		const result = await fetchTrashedMedia(signal)

		const [path, options] = vi.mocked(davClient.getDirectoryContents).mock.calls[0]
		expect(path).toBe(ROOT)
		expect(options).toMatchObject({ details: true, signal })
		expect(options?.data).toContain('<nc:trashbin-deletion-time />')
		expect(result.map((node) => node.fileid)).toEqual([3, 1])
		expect(result[0].path).toBe('/c.jpg.d200')
	})
})

describe('restoreTrashedItem', () => {
	beforeEach(() => {
		vi.mocked(davClient.moveFile).mockReset()
	})

	test('moves the item to the restore folder of the user', async () => {
		await restoreTrashedItem(trashed(1, 'a.jpg.d100', 'image/jpeg', 100))

		expect(davClient.moveFile).toHaveBeenCalledWith(`${ROOT}/a.jpg.d100`, '/trashbin/alice/restore/a.jpg.d100')
	})

	test('reports the restored items and the refused ones', async () => {
		vi.mocked(davClient.moveFile).mockImplementation(async (from: string) => {
			if (from.endsWith('b.jpg.d200')) {
				throw new Error('Insufficient storage')
			}
		})

		const first = trashed(1, 'a.jpg.d100', 'image/jpeg', 100)
		const second = trashed(2, 'b.jpg.d200', 'image/jpeg', 200)
		const third = trashed(3, 'c.jpg.d300', 'image/jpeg', 300)

		const { restored, failed } = await restoreTrashedItems([first, second, third])

		expect(restored).toEqual(expect.arrayContaining([first, third]))
		expect(restored).toHaveLength(2)
		expect(failed).toEqual([{ node: second, error: new Error('Insufficient storage') }])
	})
})
