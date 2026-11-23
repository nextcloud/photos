/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File } from '@nextcloud/files'
import { describe, expect, test, vi } from 'vitest'
import { toPhotoTarget } from './fileUtils.ts'

vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/files/dav', async (importOriginal) => ({
	...await importOriginal<Record<string, unknown>>(),
	defaultRootPath: '/files/alice',
}))

/**
 * A photo the way a DAV listing of the files of alice hands it over.
 *
 * @param data - Values overriding the ones of a photo of her own
 * @param data.owner - Owner of the photo
 * @param data.permissions - Permissions of alice on the photo
 * @param data.attributes - Extra DAV properties
 */
function photo({ owner = 'alice', permissions = 31, attributes = {} }: { owner?: string, permissions?: number, attributes?: Record<string, unknown> } = {}): File {
	return new File({
		id: 1,
		source: 'https://cloud.example.org/remote.php/dav/files/alice/Photos/a.jpg',
		owner,
		root: '/files/alice',
		mime: 'image/jpeg',
		permissions,
		attributes: { 'mount-type': '', ...attributes },
	})
}

describe('toPhotoTarget', () => {
	test('lets the account archive its own photos', () => {
		expect(toPhotoTarget(photo())).toMatchObject({ davPath: '/files/alice/Photos/a.jpg', archivable: true })
	})

	test('keeps the photos of shares and group folders where they are', () => {
		expect(toPhotoTarget(photo({ attributes: { 'mount-type': 'shared' } })).archivable).toBe(false)
		expect(toPhotoTarget(photo({ attributes: { 'mount-type': 'group' } })).archivable).toBe(false)
		expect(toPhotoTarget(photo({ owner: 'bob' })).archivable).toBe(false)
	})

	test('needs the permission to move the photo away', () => {
		expect(toPhotoTarget(photo({ permissions: 1 })).archivable).toBe(false)
	})

	test('leaves the photos of a collection alone', () => {
		const target = toPhotoTarget(photo({ attributes: { 'photos-collection-file-original-filename': '/Photos/a.jpg' } }))

		expect(target.archivable).toBe(false)
	})
})
