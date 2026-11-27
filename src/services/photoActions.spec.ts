/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { savePhotoMetadata } from './photoActions.ts'

const { davClient } = vi.hoisted(() => ({
	davClient: { customRequest: vi.fn() },
}))

vi.mock('./DavClient.ts', () => ({ davClient }))

const photo: PhotoTarget = { fileid: 1, basename: '1.jpg', davPath: '/files/alice/1.jpg', permissions: 31, favorite: false }

/**
 * @return The body of the PROPPATCH request that was sent
 */
function sentBody(): string {
	expect(davClient.customRequest).toHaveBeenCalledWith(photo.davPath, expect.objectContaining({ method: 'PROPPATCH' }))
	return davClient.customRequest.mock.calls[0][1].data
}

describe('savePhotoMetadata', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('sends the taken date and the position', async () => {
		await savePhotoMetadata(photo, { takenAt: 1710504000, location: { latitude: 38.7, longitude: -9.1 } })

		const body = sentBody()
		expect(body).toContain('<nc:metadata-photos-original_date_time>1710504000</nc:metadata-photos-original_date_time>')
		expect(body).toContain('<nc:latitude>38.7</nc:latitude>')
		expect(body).not.toContain('<d:remove>')
	})

	test('leaves the position alone when only the date is given', async () => {
		await savePhotoMetadata(photo, { takenAt: 1710504000 })

		const body = sentBody()
		expect(body).toContain('metadata-photos-original_date_time')
		expect(body).not.toContain('metadata-photos-gps')
	})

	test('only removes the position when no date is given', async () => {
		await savePhotoMetadata(photo, { location: null })

		const body = sentBody()
		expect(body).not.toContain('<d:set>')
		expect(body).not.toContain('metadata-photos-original_date_time')
		expect(body).toContain('<d:remove><d:prop><nc:metadata-photos-gps /></d:prop></d:remove>')
	})
})
