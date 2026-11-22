/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchPhotoExif } from './exifFetcher.ts'

const { stat } = vi.hoisted(() => ({ stat: vi.fn() }))

vi.mock('./DavClient.ts', () => ({ davClient: { stat } }))
vi.mock('./logger.ts', () => ({ logger: { error: vi.fn() } }))

const photo = { fileid: 1, basename: 'beach.jpg', davPath: '/files/alice/Family/beach.jpg' } as PhotoTarget

describe('fetchPhotoExif', () => {
	beforeEach(() => {
		stat.mockReset()
	})

	test('asks for who added the photo', async () => {
		stat.mockResolvedValue({ data: { props: {} } })

		await fetchPhotoExif(photo)

		const request = stat.mock.calls[0]![1].data as string
		expect(request).toContain('<nc:metadata-photos-added-by />')
		expect(request).toContain('<nc:photos-added-by-display-name />')
		expect(request).toContain('<oc:owner-id />')
	})

	test('returns who added the photo', async () => {
		stat.mockResolvedValue({
			data: {
				props: {
					'metadata-photos-added-by': 'bob',
					'photos-added-by-display-name': 'Bob Builder',
					'owner-id': 'alice',
				},
			},
		})

		expect((await fetchPhotoExif(photo)).addedBy).toEqual({ userId: 'bob', displayName: 'Bob Builder' })
	})
})
