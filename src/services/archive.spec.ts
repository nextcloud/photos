/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getArchiveDestination, isArchiveInFolders, isInArchive, isPhotoArchived, setPhotoArchived } from './archive.ts'

const { davClient } = vi.hoisted(() => ({
	davClient: {
		moveFile: vi.fn(),
		createDirectory: vi.fn(),
	},
}))

vi.mock('./DavClient.ts', () => ({ davClient }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/files/dav', async (importOriginal) => ({
	...await importOriginal<Record<string, unknown>>(),
	defaultRootPath: '/files/alice',
}))

/**
 * An error of the DAV client, the way it rejects a request.
 *
 * @param status - HTTP status of the response
 */
function davError(status: number): Error {
	return Object.assign(new Error(`Status ${status}`), { response: { status } })
}

/**
 * @param path - Path of the photo, relative to the files of the account
 * @param archivable - Whether the photo is one of the account's own files
 */
function target(path: string, archivable = true): PhotoTarget {
	return { fileid: 1, basename: 'a.jpg', davPath: `/files/alice${path}`, permissions: 31, favorite: false, archivable }
}

describe('archive paths', () => {
	test('isInArchive matches the content of the archive only', () => {
		expect(isInArchive('/.archive/Photos/a.jpg')).toBe(true)
		expect(isInArchive('/.archive')).toBe(false)
		expect(isInArchive('/.archived/a.jpg')).toBe(false)
		expect(isInArchive('/Photos/.archive/a.jpg')).toBe(false)
	})

	test('isArchiveInFolders spots the media folders holding the archive', () => {
		expect(isArchiveInFolders(['/Photos'])).toBe(false)
		expect(isArchiveInFolders(['/Photos', '/'])).toBe(true)
		expect(isArchiveInFolders(['/.archive'])).toBe(true)
		expect(isArchiveInFolders(['/.arch'])).toBe(false)
	})

	test('getArchiveDestination mirrors the folders of the photo', () => {
		expect(getArchiveDestination('/Photos/2024/a.jpg', true)).toBe('/.archive/Photos/2024/a.jpg')
		expect(getArchiveDestination('/.archive/Photos/2024/a.jpg', false)).toBe('/Photos/2024/a.jpg')
		expect(getArchiveDestination('/a.jpg', true)).toBe('/.archive/a.jpg')
	})

	test('getArchiveDestination refuses to archive twice or unarchive what is not archived', () => {
		expect(() => getArchiveDestination('/.archive/a.jpg', true)).toThrow()
		expect(() => getArchiveDestination('/Photos/a.jpg', false)).toThrow()
	})

	test('isPhotoArchived reads the path of the photo', () => {
		expect(isPhotoArchived(target('/.archive/Photos/a.jpg'))).toBe(true)
		expect(isPhotoArchived(target('/Photos/a.jpg'))).toBe(false)
	})
})

describe('setPhotoArchived', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	test('moves the photo into the archive without overwriting anything', async () => {
		const davPath = await setPhotoArchived(target('/Photos/a.jpg'), true)

		expect(davPath).toBe('/files/alice/.archive/Photos/a.jpg')
		expect(davClient.moveFile).toHaveBeenCalledExactlyOnceWith('/files/alice/Photos/a.jpg', '/files/alice/.archive/Photos/a.jpg', { overwrite: false })
		expect(davClient.createDirectory).not.toHaveBeenCalled()
	})

	test('creates the missing folders before moving the photo again', async () => {
		davClient.moveFile.mockRejectedValueOnce(davError(409))
		davClient.createDirectory
			.mockRejectedValueOnce(davError(409)) // /Photos/2024 is missing its parent
			.mockRejectedValueOnce(davError(405)) // /Photos exists after all
			.mockResolvedValueOnce(undefined) // /Photos/2024

		await setPhotoArchived(target('/.archive/Photos/2024/a.jpg'), false)

		expect(davClient.createDirectory.mock.calls.map(([path]) => path)).toEqual([
			'/files/alice/Photos/2024',
			'/files/alice/Photos',
			'/files/alice/Photos/2024',
		])
		expect(davClient.moveFile).toHaveBeenCalledTimes(2)
		expect(davClient.moveFile).toHaveBeenLastCalledWith('/files/alice/.archive/Photos/2024/a.jpg', '/files/alice/Photos/2024/a.jpg', { overwrite: false })
	})

	test('reports a file in the way', async () => {
		davClient.moveFile.mockRejectedValueOnce(davError(412))

		await expect(setPhotoArchived(target('/Photos/a.jpg'), true)).rejects.toThrow('Status 412')
		expect(davClient.createDirectory).not.toHaveBeenCalled()
	})

	test('refuses photos which are not the account\'s own', async () => {
		await expect(setPhotoArchived(target('/Shared/a.jpg', false), true)).rejects.toThrow()
		expect(davClient.moveFile).not.toHaveBeenCalled()
	})
})
