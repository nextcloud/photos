/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File, Folder } from '@nextcloud/files'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useFilesStore } from './files.ts'
import { useFoldersStore } from './folders.ts'

// The files store pulls the dialogs and their styles in, vitest cannot load those.
vi.mock('../services/DavClient.ts', () => ({ davClient: {} }))
vi.mock('../services/photoActions.ts', () => ({}))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

const ROOT = '/files/alice'

/**
 * A folder of the user, as the folders view lists them.
 *
 * @param id - Id of the folder, -1 for an external storage mount
 * @param path - Path inside the user root
 */
function folder(id: number, path: string): Folder {
	return new Folder({
		id,
		source: `https://cloud.example.org/remote.php/dav${ROOT}${path}`,
		owner: 'alice',
		root: ROOT,
	})
}

/**
 * A photo of the user.
 *
 * @param id - Id of the photo
 * @param path - Path inside the user root
 * @param mtime - Modification time, drives the listing order
 */
function photo(id: number, path: string, mtime = new Date(0)): File {
	return new File({
		id,
		source: `https://cloud.example.org/remote.php/dav${ROOT}${path}`,
		owner: 'alice',
		root: ROOT,
		mime: 'image/jpeg',
		mtime,
	})
}

describe('useFoldersStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	test('updateFolders lists the files by modification time and indexes the subfolder paths', () => {
		const store = useFoldersStore()

		store.updateFolders(10, [
			photo(1, '/Photos/old.jpg', new Date('2024-01-01')),
			photo(2, '/Photos/new.jpg', new Date('2025-01-01')),
			photo(-1, '/Photos/broken.jpg'),
		], [folder(20, '/Photos/Trip'), folder(-1, '/Photos/External')])

		expect(store.folders[10]).toEqual([2, 1])
		expect(store.paths).toEqual({ '/Photos/Trip': 20 })
	})

	test('updateFolders ignores a folder without id', () => {
		const store = useFoldersStore()

		store.updateFolders(undefined, [photo(1, '/Photos/a.jpg')], [])

		expect(store.folders).toEqual({})
	})

	test('addFilesToFolder prepends the new files to a known listing', () => {
		const store = useFoldersStore()
		store.updateFolders(10, [photo(1, '/Photos/a.jpg', new Date('2024-01-01'))], [])

		store.addFilesToFolder(10, [
			photo(2, '/Photos/b.jpg', new Date('2025-01-01')),
			photo(3, '/Photos/c.jpg', new Date('2026-01-01')),
		])
		store.addFilesToFolder(10, [])
		store.addFilesToFolder(-1, [photo(4, '/Photos/d.jpg')])

		expect(store.folders).toEqual({ 10: [3, 2, 1] })
	})

	test('updateFoldersFiles indexes the folder, its files and its subfolders', () => {
		const store = useFoldersStore()
		const parent = folder(10, '/Photos')
		store.updateFolders(10, [], [])

		store.updateFoldersFiles(parent, [photo(1, '/Photos/a.jpg')], [folder(20, '/Photos/Trip'), folder(-1, '/Photos/External')])

		expect(Object.keys(store.files).map(Number).sort()).toEqual([-1, 1, 10, 20])
		expect(store.subFolders[10]).toEqual([20])
	})

	test('setSubFolders only records subfolders of a listed folder', () => {
		const store = useFoldersStore()

		store.setSubFolders(10, [folder(20, '/Photos/Trip')])
		store.setSubFolders(undefined, [folder(20, '/Photos/Trip')])

		expect(store.subFolders).toEqual({})
	})

	test('appendFoldersFiles skips files under a .nomedia path', () => {
		const store = useFoldersStore()
		useFilesStore().setNomediaPaths(['/Photos/Private'])

		store.appendFoldersFiles([photo(1, '/Photos/a.jpg'), photo(2, '/Photos/Private/b.jpg')])

		expect(Object.keys(store.files)).toEqual(['1'])
	})

	test('deleteFolderFile forgets the file', () => {
		const store = useFoldersStore()
		store.appendFoldersFiles([photo(1, '/Photos/a.jpg'), photo(2, '/Photos/b.jpg')])

		store.deleteFolderFile(1)

		expect(Object.keys(store.files)).toEqual(['2'])
	})

	test('favoriteFolderFile marks a known file and ignores unknown ones', () => {
		const store = useFoldersStore()
		store.appendFoldersFiles([photo(1, '/Photos/a.jpg')])

		store.favoriteFolderFile(1, 1)
		store.favoriteFolderFile(2, 1)

		expect(store.files[1].attributes.favorite).toBe(1)
		expect(store.files[2]).toBeUndefined()
	})
})
