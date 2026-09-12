/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { File, Folder } from '@nextcloud/files'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useFacesStore } from './faces.ts'
import { useFilesStore } from './files.ts'

const { davClient, showError } = vi.hoisted(() => ({
	davClient: {
		moveFile: vi.fn(),
		deleteFile: vi.fn(),
	},
	showError: vi.fn(),
}))

vi.mock('../services/DavClient.ts', () => ({ davClient }))
vi.mock('@nextcloud/dialogs', () => ({ showError }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

const FACES_ROOT = '/recognize/alice/faces'

/**
 * A face the way recognize lists them.
 *
 * @param name - Name of the face, the cluster id when nobody named it yet
 */
function face(name: string): Collection {
	return new Folder({
		id: 100,
		source: `https://cloud.example.org/remote.php/dav${FACES_ROOT}/${name}`,
		owner: 'alice',
		root: FACES_ROOT,
	}) as Collection
}

/**
 * Register a photo carrying face detections with the files store.
 *
 * @param fileId - Id of the photo
 * @param detections - Faces recognize found on it
 */
function seedPhoto(fileId: number, detections: Array<{ id: number, clusterId: number | null, title: string | null }>): void {
	useFilesStore().appendFiles([new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/files/alice/Photos/${fileId}.jpg`,
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
		attributes: { 'face-detections': detections },
	})])
}

describe('useFacesStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
	})

	test('addFileIdsToFace ignores photos already on the face', () => {
		const store = useFacesStore()

		store.addFileIdsToFace('Alice', ['1', '2'])
		store.addFileIdsToFace('Alice', ['2', '3'])

		expect(store.facesFiles.Alice).toEqual(['1', '2', '3'])
	})

	test('moveFilesToFace moves the detection file from the old face', async () => {
		const store = useFacesStore()
		store.addFaces([face('Alice'), face('Bob')])
		store.addFileIdsToFace('Bob', ['1'])
		seedPhoto(1, [{ id: 7, clusterId: 2, title: 'Bob' }])

		await store.moveFilesToFace('Alice', ['1'], 'Bob')

		expect(davClient.moveFile).toHaveBeenCalledWith(`${FACES_ROOT}/Bob/7-1.jpg`, `${FACES_ROOT}/Alice/7-1.jpg`)
		expect(store.facesFiles.Alice).toEqual(['1'])
		expect(store.facesFiles.Bob).toEqual([])
	})

	test('moveFilesToFace names an unassigned face', async () => {
		const store = useFacesStore()
		store.addFaces([face('Alice')])
		store.addUnassignedFiles(['1'])
		seedPhoto(1, [{ id: 7, clusterId: -1, title: null }])

		await store.moveFilesToFace('Alice', ['1'])

		expect(davClient.moveFile).toHaveBeenCalledWith('/recognize/alice/unassigned-faces/7-1.jpg', `${FACES_ROOT}/Alice/7-1.jpg`)
		expect(store.unassignedFiles).toEqual([])
		expect(store.facesFiles.Alice).toEqual(['1'])
	})

	test('moveFilesToFace leaves the state alone when the server refuses', async () => {
		const store = useFacesStore()
		store.addFaces([face('Alice'), face('Bob')])
		store.addFileIdsToFace('Bob', ['1'])
		seedPhoto(1, [{ id: 7, clusterId: 2, title: 'Bob' }])
		davClient.moveFile.mockRejectedValueOnce(new Error('Forbidden'))

		await expect(store.moveFilesToFace('Alice', ['1'], 'Bob')).rejects.toThrow('Forbidden')

		expect(showError).toHaveBeenCalledTimes(1)
		expect(store.facesFiles.Bob).toEqual(['1'])
		expect(store.facesFiles.Alice).toBeUndefined()
	})

	test('removeFilesFromFace puts a photo back when the server refuses', async () => {
		const store = useFacesStore()
		store.addFaces([face('Alice')])
		store.addFileIdsToFace('Alice', ['1', '2'])
		seedPhoto(1, [{ id: 7, clusterId: 1, title: 'Alice' }])
		seedPhoto(2, [{ id: 8, clusterId: 1, title: 'Alice' }])
		davClient.deleteFile.mockRejectedValueOnce(new Error('Locked'))

		await store.removeFilesFromFace('Alice', ['1', '2'])

		expect(davClient.deleteFile).toHaveBeenCalledWith(`${FACES_ROOT}/Alice/7-1.jpg`)
		expect(davClient.deleteFile).toHaveBeenCalledWith(`${FACES_ROOT}/Alice/8-2.jpg`)
		expect(store.facesFiles.Alice).toEqual(['1'])
	})

	test('renameFace reindexes the face under its new name', async () => {
		const store = useFacesStore()
		store.addFaces([face('12')])
		store.addFileIdsToFace('12', ['1'])

		await store.renameFace('12', 'Alice')

		expect(davClient.moveFile).toHaveBeenCalledWith(`${FACES_ROOT}/12`, `${FACES_ROOT}/Alice`)
		expect(Object.keys(store.faces)).toEqual(['Alice'])
		expect(store.faces.Alice.basename).toBe('Alice')
	})

	test('renameFace refuses a name that is taken', async () => {
		const store = useFacesStore()
		store.addFaces([face('12'), face('Alice')])

		await expect(store.renameFace('12', 'Alice')).rejects.toThrow('Name already exists')

		expect(davClient.moveFile).not.toHaveBeenCalled()
		expect(Object.keys(store.faces)).toEqual(['12', 'Alice'])
	})

	test('deleteFace forgets the face and its photos', async () => {
		const store = useFacesStore()
		store.addFaces([face('Alice')])
		store.addFileIdsToFace('Alice', ['1'])

		await store.deleteFace('Alice')

		expect(davClient.deleteFile).toHaveBeenCalledWith(`${FACES_ROOT}/Alice`)
		expect(store.faces.Alice).toBeUndefined()
		expect(store.facesFiles.Alice).toBeUndefined()
	})
})
