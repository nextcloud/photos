/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Attribute } from '@nextcloud/files'

import { File } from '@nextcloud/files'
import { describe, expect, test, vi } from 'vitest'
import { toViewerNode } from './fileUtils.ts'

vi.mock('@nextcloud/router', () => ({
	generateUrl: (url: string) => url,
}))

vi.mock('@nextcloud/files/dav', () => ({
	getRemoteURL: () => 'https://cloud.example.com/remote.php/dav',
	getRootPath: () => '/files/alice',
}))

/**
 * @param source - Where the photo is listed
 * @param root - The DAV root of that listing
 * @param attributes - The properties of the listing
 */
function photo(source: string, root: string, attributes: Attribute): File {
	return new File({
		id: 42,
		source,
		root,
		owner: 'alice',
		mime: 'image/jpeg',
		attributes: {
			etag: '"etag-value"',
			...attributes,
		},
	})
}

describe('toViewerNode', () => {
	test.each([
		'&quot;etag-value&quot;',
		'"etag-value"',
	])('previews off the endpoint of the app, with the etag quoted as %s', (etag) => {
		const node = toViewerNode(photo('https://cloud.example.com/remote.php/dav/files/alice/photo.jpg', '/files/alice', { etag }))

		expect(node.attributes.previewUrl).toBe('/apps/photos/api/v1/preview/42?etag=etag-value&x=4096&y=4096')
	})

	test('keeps a preview URL the listing already came with', () => {
		const node = toViewerNode(photo('https://cloud.example.com/remote.php/dav/files/alice/photo.jpg', '/files/alice', { previewUrl: '/public/preview/42' }))

		expect(node.attributes.previewUrl).toBe('/public/preview/42')
	})

	test('leaves a photo of the files where it is', () => {
		const file = photo('https://cloud.example.com/remote.php/dav/files/alice/Camera/photo.jpg', '/files/alice', {})
		const node = toViewerNode(file)

		expect(node.source).toBe(file.source)
		expect(node.path).toBe('/Camera/photo.jpg')
		expect(node.fileid).toBe(42)
		expect(node.mime).toBe('image/jpeg')
	})

	test('points a photo of a collection at its original file', () => {
		const node = toViewerNode(photo('https://cloud.example.com/remote.php/dav/photos/alice/albums/Holidays/42-photo.jpg', '/photos/alice/albums', {
			'photos-collection-file-original-filename': '/Camera/photo.jpg',
		}))

		expect(node.source).toBe('https://cloud.example.com/remote.php/dav/files/alice/Camera/photo.jpg')
		expect(node.root).toBe('/files/alice')
		expect(node.path).toBe('/Camera/photo.jpg')
		expect(node.basename).toBe('photo.jpg')
	})
})
