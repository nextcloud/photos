/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from '../store/albums.ts'
import type { Collection } from './collectionFetcher.ts'

import { ShareType } from '@nextcloud/sharing'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useCollectionsStore } from '../store/collections.ts'
import { formatDate } from '../utils/dateUtils.ts'
import { getQuickShareAlbumName, QuickShareError, shareFilesByLink } from './quickShare.ts'

const { davClient, fetchCollection } = vi.hoisted(() => {
	// @nextcloud/files reads the user from the page, out of reach of the module mock.
	document.head.dataset.user = 'alice'

	return {
		davClient: { deleteFile: vi.fn() },
		fetchCollection: vi.fn(),
	}
})

vi.mock('./DavClient.ts', () => ({ davClient }))
vi.mock('./collectionFetcher.ts', () => ({ fetchCollection }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn(), showConfirmation: vi.fn() }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

const ALBUM = '/photos/alice/albums/Trip'

/**
 * The album as the server reports it after the share.
 *
 * @param collaborators - Collaborators it lists
 * @param nbItems - Number of photos it holds
 */
function fetchedAlbum(collaborators: object[], nbItems = 3): Album {
	return { basename: 'Trip', root: '/photos/alice/albums', path: '/Trip', attributes: { collaborators, nbItems } } as unknown as Album
}

const linkCollaborator = { id: 'aBc123', label: 'Public link', type: ShareType.Link }

describe('getQuickShareAlbumName', () => {
	const date = new Date(2026, 10, 22)
	const baseName = `Shared on ${formatDate(date)}`

	test('names the album after the day', () => {
		expect(getQuickShareAlbumName([], date)).toBe(baseName)
	})

	test('numbers the name when it is taken', () => {
		expect(getQuickShareAlbumName([baseName, `${baseName} (2)`, 'Other'], date)).toBe(`${baseName} (3)`)
	})
})

describe('shareFilesByLink', () => {
	let collectionsStore: ReturnType<typeof useCollectionsStore>

	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
		davClient.deleteFile.mockResolvedValue(undefined)

		collectionsStore = useCollectionsStore()
		vi.spyOn(collectionsStore, 'createCollection').mockImplementation(async (collection) => collection)
		vi.spyOn(collectionsStore, 'addFilesToCollection').mockResolvedValue([])
		vi.spyOn(collectionsStore, 'updateCollection').mockImplementation(async () => ({}) as Collection)
		vi.spyOn(collectionsStore, 'addCollections')
		vi.spyOn(collectionsStore, 'removeCollections')
	})

	test('creates the album, adds the photos and returns the public link', async () => {
		const album = fetchedAlbum([linkCollaborator])
		fetchCollection.mockResolvedValue(album)

		const result = await shareFilesByLink('Trip', ['1', '2', '3'])

		expect(collectionsStore.createCollection).toHaveBeenCalledWith(expect.objectContaining({ basename: 'Trip' }))
		expect(collectionsStore.addFilesToCollection).toHaveBeenCalledWith(ALBUM, ['1', '2', '3'])
		expect(collectionsStore.updateCollection).toHaveBeenCalledWith(ALBUM, {
			collaborators: [{ id: '', label: 'Public link', type: ShareType.Link }],
		})
		expect(collectionsStore.addCollections).toHaveBeenCalledWith([album])
		expect(result.album).toBe(album)
		expect(result.link).toMatch(/\/apps\/photos\/public\/aBc123$/)
		expect(result.skippedCount).toBe(0)
		expect(davClient.deleteFile).not.toHaveBeenCalled()
	})

	test('reports the photos the server did not take', async () => {
		fetchCollection.mockResolvedValue(fetchedAlbum([linkCollaborator], 2))

		const result = await shareFilesByLink('Trip', ['1', '2', '3'])

		expect(result.skippedCount).toBe(1)
	})

	test('stops before anything else when the album cannot be created', async () => {
		vi.mocked(collectionsStore.createCollection).mockResolvedValue(undefined)

		await expect(shareFilesByLink('Trip', ['1'])).rejects.toThrow(QuickShareError)

		expect(collectionsStore.addFilesToCollection).not.toHaveBeenCalled()
		expect(collectionsStore.updateCollection).not.toHaveBeenCalled()
		expect(davClient.deleteFile).not.toHaveBeenCalled()
	})

	test('deletes the album again when the link was not created', async () => {
		fetchCollection.mockResolvedValue(fetchedAlbum([]))

		await expect(shareFilesByLink('Trip', ['1'])).rejects.toThrow('The link could not be created, nothing was shared.')

		expect(davClient.deleteFile).toHaveBeenCalledWith(ALBUM)
		expect(collectionsStore.removeCollections).toHaveBeenCalledWith([ALBUM])
	})

	test('deletes the album again when it cannot be read back', async () => {
		fetchCollection.mockRejectedValue(new Error('Network error'))

		await expect(shareFilesByLink('Trip', ['1'])).rejects.toThrow(QuickShareError)

		expect(davClient.deleteFile).toHaveBeenCalledWith(ALBUM)
	})

	test('deletes the album again when no photo could be added', async () => {
		fetchCollection.mockResolvedValue(fetchedAlbum([linkCollaborator], 0))

		await expect(shareFilesByLink('Trip', ['1'])).rejects.toThrow('None of the photos could be added to the album, nothing was shared.')

		expect(davClient.deleteFile).toHaveBeenCalledWith(ALBUM)
	})

	test('points to the album when it cannot be deleted again', async () => {
		fetchCollection.mockResolvedValue(fetchedAlbum([]))
		davClient.deleteFile.mockRejectedValue(new Error('Server error'))

		await expect(shareFilesByLink('Trip', ['1'])).rejects.toThrow('Sharing failed and the album "Trip" could not be removed again. Check its sharing or delete it in Albums.')

		expect(collectionsStore.removeCollections).not.toHaveBeenCalled()
	})
})
