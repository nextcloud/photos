/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoTarget } from '../utils/fileUtils.ts'

import { File, Folder } from '@nextcloud/files'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useFilesStore } from './files.ts'
import { useFoldersStore } from './folders.ts'

const { davClient, photoActions, showError } = vi.hoisted(() => ({
	davClient: {
		deleteFile: vi.fn(),
		customRequest: vi.fn(),
	},
	photoActions: {
		savePhotoMetadata: vi.fn(),
		setPhotoFavorite: vi.fn(),
		deletePhoto: vi.fn(),
	},
	showError: vi.fn(),
}))

vi.mock('../services/DavClient.ts', () => ({ davClient }))
vi.mock('../services/photoActions.ts', () => photoActions)
vi.mock('@nextcloud/dialogs', () => ({ showError }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

// 2024-03-15T12:00:00Z
const TAKEN_AT = 1710504000

/**
 * A photo the way a DAV listing hands it to the store.
 *
 * @param fileId - Id of the photo
 * @param attributes - Extra DAV properties
 */
function photo(fileId: number, attributes: Record<string, unknown> = {}): File {
	return new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/files/alice/Photos/${fileId}.jpg`,
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
		permissions: 31,
		mtime: new Date(TAKEN_AT * 1000),
		attributes: {
			'metadata-photos-original_date_time': TAKEN_AT,
			...attributes,
		},
	})
}

/**
 * @param fileId - Id of the photo
 */
function target(fileId: number): PhotoTarget {
	return { fileid: fileId, basename: `${fileId}.jpg`, davPath: `/files/alice/Photos/${fileId}.jpg`, permissions: 31, favorite: false }
}

describe('useFilesStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
	})

	test('appendFiles indexes photos by id and precalculates their dates', () => {
		const store = useFilesStore()

		store.appendFiles([photo(1), photo(2, { hidden: true })])

		expect(Object.keys(store.files)).toEqual(['1'])
		expect(store.files[1].attributes.timestamp).toBe(TAKEN_AT)
		expect(store.files[1].attributes.month).toBe('202403')
		expect(store.files[1].attributes.day).toBe('0315')
		expect(store.files[1].attributes['metadata-photos-size']).toEqual({ width: 256, height: 256 })
	})

	test('appendFiles skips photos under a .nomedia path', () => {
		const store = useFilesStore()
		store.setNomediaPaths(['/Photos/Private'])

		store.appendFiles([
			photo(1),
			new File({
				id: 3,
				source: 'https://cloud.example.org/remote.php/dav/files/alice/Photos/Private/3.jpg',
				owner: 'alice',
				root: '/files/alice',
				mime: 'image/jpeg',
				mtime: new Date(TAKEN_AT * 1000),
			}),
		])

		expect(Object.keys(store.files)).toEqual(['1'])
	})

	test('updatePhotoMetadata moves the photo to its new month', async () => {
		const store = useFilesStore()
		store.appendFiles([photo(1, { 'metadata-photos-gps': { latitude: '1', longitude: '2' } })])

		// 2023-12-24T18:30:00Z
		await store.updatePhotoMetadata(target(1), { takenAt: 1703442600, location: null })

		expect(photoActions.savePhotoMetadata).toHaveBeenCalledWith(target(1), { takenAt: 1703442600, location: null })
		expect(store.files[1].attributes.month).toBe('202312')
		expect(store.files[1].attributes.day).toBe('1224')
		expect(store.files[1].attributes['metadata-photos-gps']).toBeUndefined()
	})

	test('updatePhotoMetadata stores the coordinates as strings', async () => {
		const store = useFilesStore()
		store.appendFiles([photo(1)])

		await store.updatePhotoMetadata(target(1), { takenAt: TAKEN_AT, location: { latitude: 38.7, longitude: -9.1 } })

		expect(store.files[1].attributes['metadata-photos-gps']).toEqual({ latitude: '38.7', longitude: '-9.1' })
	})

	test('setPhotoFavorite marks the photo in the timeline and the folders listings', async () => {
		const store = useFilesStore()
		const foldersStore = useFoldersStore()
		store.appendFiles([photo(1)])
		foldersStore.updateFoldersFiles(new Folder({
			id: 10,
			source: 'https://cloud.example.org/remote.php/dav/files/alice/Photos',
			owner: 'alice',
			root: '/files/alice',
		}), [photo(1)], [])

		await store.setPhotoFavorite(target(1), true)

		expect(photoActions.setPhotoFavorite).toHaveBeenCalledWith(target(1), true)
		expect(store.files[1].attributes.favorite).toBe(1)
		expect(foldersStore.files[1].attributes.favorite).toBe(1)
	})

	test('setPhotoFavorite leaves the state alone when the server refuses', async () => {
		const store = useFilesStore()
		store.appendFiles([photo(1, { favorite: 0 })])
		photoActions.setPhotoFavorite.mockRejectedValueOnce(new Error('Forbidden'))

		await expect(store.setPhotoFavorite(target(1), true)).rejects.toThrow('Forbidden')

		expect(store.files[1].attributes.favorite).toBe(0)
	})

	test('deletePhoto drops the photo once the server deleted it', async () => {
		const store = useFilesStore()
		store.appendFiles([photo(1), photo(2)])

		await store.deletePhoto(target(1))

		expect(photoActions.deletePhoto).toHaveBeenCalledWith(target(1))
		expect(Object.keys(store.files)).toEqual(['2'])
	})

	test('deleteFiles puts a photo back when the server refuses to delete it', async () => {
		const store = useFilesStore()
		store.appendFiles([photo(1), photo(2)])
		davClient.deleteFile.mockRejectedValueOnce(new Error('Locked'))

		await store.deleteFiles(['1', '2'])

		expect(davClient.deleteFile).toHaveBeenCalledTimes(2)
		expect(showError).toHaveBeenCalledTimes(1)
		expect(Object.keys(store.files)).toEqual(['1'])
	})

	test('toggleFavoriteForFiles rolls a photo back when the server refuses', async () => {
		const store = useFilesStore()
		store.appendFiles([photo(1, { favorite: 0 }), photo(2, { favorite: 0 })])
		davClient.customRequest.mockRejectedValueOnce(new Error('Forbidden'))

		await store.toggleFavoriteForFiles(['1', '2'], 1)

		expect(davClient.customRequest).toHaveBeenCalledTimes(2)
		expect(davClient.customRequest.mock.calls[0][1].data).toContain('<oc:favorite>1</oc:favorite>')
		expect(store.files[1].attributes.favorite).toBe(0)
		expect(store.files[2].attributes.favorite).toBe(1)
	})
})
