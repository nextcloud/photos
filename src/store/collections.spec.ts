/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { File, Folder } from '@nextcloud/files'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { isReactive } from 'vue'
import { useCollectionsStore } from './collections.ts'
import { useFilesStore } from './files.ts'

const { davClient, showError } = vi.hoisted(() => ({
	davClient: {
		moveFile: vi.fn(),
		customRequest: vi.fn(),
		copyFile: vi.fn(),
		deleteFile: vi.fn(),
	},
	showError: vi.fn(),
}))

vi.mock('../services/DavClient.ts', () => ({ davClient }))
vi.mock('@nextcloud/dialogs', () => ({ showError, showConfirmation: vi.fn() }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

const ALBUMS_ROOT = '/photos/alice/albums'

/**
 * Build an album the way the fetcher hands them to the store.
 *
 * @param name - Name of the album
 * @param fileIds - Photos it holds
 */
function album(name: string, fileIds: string[] = []): Collection {
	return new Folder({
		id: 42,
		source: `https://cloud.example.org/remote.php/dav${ALBUMS_ROOT}/${name}`,
		owner: 'alice',
		root: ALBUMS_ROOT,
		permissions: 31,
		attributes: {
			nbItems: fileIds.length,
			'last-photo': Number(fileIds.at(-1) ?? -1),
		},
	}) as Collection
}

/**
 * Register photos with the files store, which the collection actions read them from.
 *
 * @param fileIds - Ids of the photos
 */
function seedPhotos(fileIds: string[]): void {
	useFilesStore().appendFiles(fileIds.map((fileId) => new File({
		id: Number(fileId),
		source: `https://cloud.example.org/remote.php/dav/files/alice/Photos/${fileId}.jpg`,
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
		permissions: 31,
	})))
}

/**
 * The error axios raises for a response status.
 *
 * @param status - HTTP status of the response
 */
function axiosError(status: number) {
	return { isAxiosError: true, response: { status } }
}

describe('useCollectionsStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
	})

	test('renames a collection held in reactive state', async () => {
		const store = useCollectionsStore()
		store.addCollections([album('Holidays')])
		store.setCollectionFiles(`${ALBUMS_ROOT}/Holidays`, ['1', '2'])
		davClient.moveFile.mockResolvedValue(undefined)

		// The store hands back proxies, and a node clones itself through
		// structuredClone, which rejects a proxy: the rename has to unwrap it.
		expect(isReactive(store.collections[`${ALBUMS_ROOT}/Holidays`])).toBe(true)

		const renamed = await store.renameCollection(`${ALBUMS_ROOT}/Holidays`, 'Trips')

		expect(davClient.moveFile).toHaveBeenCalledWith(`${ALBUMS_ROOT}/Holidays`, `${ALBUMS_ROOT}/Trips`, { overwrite: false })
		expect(renamed.basename).toBe('Trips')
		expect(Object.keys(store.collections)).toEqual([`${ALBUMS_ROOT}/Trips`])
		expect(store.collectionsFiles[`${ALBUMS_ROOT}/Trips`]).toEqual(['1', '2'])
	})

	test('keeps the collection under its name when the rename is refused', async () => {
		const store = useCollectionsStore()
		const holidays = album('Holidays')
		store.addCollections([holidays])
		davClient.moveFile.mockRejectedValue(new Error('Conflict'))

		const result = await store.renameCollection(`${ALBUMS_ROOT}/Holidays`, 'Trips')

		expect(Object.keys(store.collections)).toEqual([`${ALBUMS_ROOT}/Holidays`])
		// The form tells a failed rename apart by getting the same album back.
		expect(result).toBe(store.collections[`${ALBUMS_ROOT}/Holidays`])
		expect(showError).toHaveBeenCalledOnce()
	})

	test('updates the properties of a collection', async () => {
		const store = useCollectionsStore()
		store.addCollections([album('Holidays')])
		davClient.customRequest.mockResolvedValue(undefined)

		const updated = await store.updateCollection(`${ALBUMS_ROOT}/Holidays`, { location: 'Lisbon' })

		expect(davClient.customRequest).toHaveBeenCalledWith(`${ALBUMS_ROOT}/Holidays`, expect.objectContaining({
			method: 'PROPPATCH',
			data: expect.stringContaining('<nc:location>Lisbon</nc:location>'),
		}))
		expect(updated.attributes.location).toBe('Lisbon')
		expect(store.collections[`${ALBUMS_ROOT}/Holidays`].attributes.location).toBe('Lisbon')
	})

	test('puts the files back when adding them to a collection fails', async () => {
		const store = useCollectionsStore()
		store.addCollections([album('Holidays', ['1'])])
		store.setCollectionFiles(`${ALBUMS_ROOT}/Holidays`, ['1'])
		seedPhotos(['2', '3'])
		davClient.copyFile.mockRejectedValue(axiosError(500))

		await store.addFilesToCollection(`${ALBUMS_ROOT}/Holidays`, ['2', '3'])

		expect(store.collectionsFiles[`${ALBUMS_ROOT}/Holidays`]).toEqual(['1'])
		expect(store.collections[`${ALBUMS_ROOT}/Holidays`].attributes.nbItems).toBe(1)
		// One failure is reported per photo, not one per batch.
		expect(showError).toHaveBeenCalledTimes(2)
	})

	test('treats a file already in the collection as added', async () => {
		const store = useCollectionsStore()
		store.addCollections([album('Holidays', ['1'])])
		store.setCollectionFiles(`${ALBUMS_ROOT}/Holidays`, ['1'])
		seedPhotos(['2'])
		davClient.copyFile.mockRejectedValue(axiosError(409))

		await store.addFilesToCollection(`${ALBUMS_ROOT}/Holidays`, ['2'])

		expect(store.collectionsFiles[`${ALBUMS_ROOT}/Holidays`]).toEqual(['1', '2'])
		expect(showError).not.toHaveBeenCalled()
	})

	test('puts the files back when removing them from a collection fails', async () => {
		const store = useCollectionsStore()
		store.addCollections([album('Holidays', ['1', '2'])])
		store.setCollectionFiles(`${ALBUMS_ROOT}/Holidays`, ['1', '2'])
		seedPhotos(['1', '2'])
		davClient.deleteFile.mockRejectedValue(axiosError(500))

		await store.removeFilesFromCollection(`${ALBUMS_ROOT}/Holidays`, ['2'])

		expect(store.collectionsFiles[`${ALBUMS_ROOT}/Holidays`]).toEqual(['1', '2'])
		expect(store.collections[`${ALBUMS_ROOT}/Holidays`].attributes.nbItems).toBe(2)
		expect(showError).toHaveBeenCalledOnce()
	})
})
