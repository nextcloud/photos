/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node } from '@nextcloud/files'

import { describe, expect, test, vi } from 'vitest'
import { toViewerFileInfo } from './fileUtils.ts'

vi.mock('@nextcloud/router', () => ({
	generateUrl: (url: string) => url,
}))

vi.mock('@nextcloud/files/dav', () => ({
	getRootPath: () => '/files/alice',
	getRemoteURL: () => 'https://example.com/remote.php/dav',
	parsePermissions: (perms: number) => perms,
}))

describe('toViewerFileInfo', () => {
	test.each([
		'&quot;etag-value&quot;',
		'"etag-value"',
	])('adds the file etag to the default preview URL when quoted as %s', (etag) => {
		const file = {
			fileid: 42,
			basename: 'photo.jpg',
			path: '/photo.jpg',
			source: '/remote.php/dav/files/alice/photo.jpg',
			owner: 'alice',
			permissions: 0,
			attributes: {
				etag,
				hasPreview: true,
			},
		} as unknown as Node

		expect(toViewerFileInfo(file).previewUrl)
			.toBe('/apps/photos/api/v1/preview/42?etag=etag-value&x=4096&y=4096')
	})

	test('sets correct davPath when photos-collection-file-original-filename is not defined', () => {
		const file = {
			fileid: 42,
			basename: 'photo.jpg',
			path: '/photo.jpg',
			root: '/files/alice',
			source: '/remote.php/dav/files/alice/photo.jpg',
			owner: 'alice',
			permissions: 0,
			attributes: {
				etag: 'etag-value',
				hasPreview: true,
			},
		} as unknown as Node

		expect(toViewerFileInfo(file).davPath).toBe('/files/alice/photo.jpg')
	})

	test('sets correct davPath when photos-collection-file-original-filename is defined', () => {
		const file = {
			fileid: 42,
			basename: 'photo.jpg',
			path: '/photo.jpg',
			root: '/files/alice',
			source: '/remote.php/dav/files/alice/photo.jpg',
			owner: 'alice',
			permissions: 0,
			attributes: {
				etag: 'etag-value',
				hasPreview: true,
				'photos-collection-file-original-filename': '/Photos/original.jpg',
			},
		} as unknown as Node

		expect(toViewerFileInfo(file).davPath).toBe('/files/alice/Photos/original.jpg')
	})
})
