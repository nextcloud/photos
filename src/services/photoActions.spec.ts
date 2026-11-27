/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { savePhotoMetadata } from './photoActions.ts'

const { davClient } = vi.hoisted(() => ({
	davClient: {
		customRequest: vi.fn(),
	},
}))

vi.mock('./DavClient.ts', () => ({ davClient }))

const photo: PhotoTarget = { fileid: 1, basename: '1.jpg', davPath: '/files/alice/Photos/1.jpg', permissions: 31, favorite: false }

/**
 * @return The body of the last PROPPATCH request, without its indentation
 */
function lastRequestBody(): string {
	const [path, options] = davClient.customRequest.mock.lastCall as [string, { method: string, data: string }]

	expect(path).toBe(photo.davPath)
	expect(options.method).toBe('PROPPATCH')

	return options.data.replace(/>\s+</g, '><')
}

describe('savePhotoMetadata', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('sets the caption as escaped text', async () => {
		await savePhotoMetadata(photo, { takenAt: 1710504000, location: { latitude: 1, longitude: 2 }, caption: ' Tom & Anna </d:prop> ' })

		const body = lastRequestBody()
		expect(body).toContain('<nc:metadata-photos-description>Tom &#x26; Anna &#x3C;/d:prop&#x3E;</nc:metadata-photos-description>')
		expect(body).not.toContain('<d:remove>')
	})

	test('removes the caption once it is emptied', async () => {
		await savePhotoMetadata(photo, { takenAt: 1710504000, location: { latitude: 1, longitude: 2 }, caption: '  ' })

		expect(lastRequestBody()).toContain('<d:remove><d:prop><nc:metadata-photos-description /></d:prop></d:remove>')
	})

	test('removes the location and the caption in a single request', async () => {
		await savePhotoMetadata(photo, { takenAt: 1710504000, location: null, caption: '' })

		expect(lastRequestBody()).toContain('<d:remove><d:prop><nc:metadata-photos-gps /><nc:metadata-photos-description /></d:prop></d:remove>')
		expect(davClient.customRequest).toHaveBeenCalledTimes(1)
	})
})
