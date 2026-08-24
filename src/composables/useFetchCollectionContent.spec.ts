/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { Collection } from '../services/collectionFetcher.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchCollection, fetchCollectionFiles } from '../services/collectionFetcher.ts'
import { collectionFilesExtraProps } from '../store/collections.ts'
import store from '../store/index.ts'
import { mountComposable } from './mountComposable.ts'
import { useFetchCollectionContent } from './useFetchCollectionContent.ts'

vi.mock('../router/index.ts', () => ({ default: { beforeEach: () => () => {} } }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('../services/collectionFetcher.ts', () => ({
	fetchCollection: vi.fn(),
	fetchCollectionFiles: vi.fn(),
}))
vi.mock('../services/logger.ts', () => ({ default: { debug: vi.fn(), error: vi.fn() } }))
vi.mock('../store/index.ts', () => ({ default: { dispatch: vi.fn(), commit: vi.fn() } }))

const album = { basename: 'Holidays' } as Collection
const photos = [{ fileid: 1 }, { fileid: 2 }] as File[]

describe('useFetchCollectionContent', () => {
	beforeEach(() => {
		vi.mocked(fetchCollection).mockReset()
		vi.mocked(fetchCollectionFiles).mockReset()
		vi.mocked(store.dispatch).mockClear()
		vi.mocked(store.commit).mockClear()
	})

	describe('fetchCollection', () => {
		test('puts the collection it fetched in the store', async () => {
			vi.mocked(fetchCollection).mockResolvedValue(album)
			const { result } = mountComposable(() => useFetchCollectionContent())

			const collection = await result.fetchCollection('/photos/alice/albums/Holidays', ['<nc:extra />'])

			expect(collection).toBe(album)
			expect(fetchCollection).toHaveBeenCalledWith(
				'/photos/alice/albums/Holidays',
				{ signal: expect.any(AbortSignal) },
				['<nc:extra />'],
				undefined,
			)
			expect(store.dispatch).toHaveBeenCalledWith('addCollections', { collections: [album] })
			expect(result.loadingCollection.value).toBe(false)
		})

		test('does not fetch twice at once', async () => {
			vi.mocked(fetchCollection).mockReturnValue(new Promise(() => {}))
			const { result } = mountComposable(() => useFetchCollectionContent())

			result.fetchCollection('/photos/alice/albums/Holidays')
			const collection = await result.fetchCollection('/photos/alice/albums/Holidays')

			expect(collection).toBeNull()
			expect(fetchCollection).toHaveBeenCalledTimes(1)
		})

		test('reports a missing collection as a 404', async () => {
			vi.mocked(fetchCollection).mockRejectedValue({ response: { status: 404 } })
			const { result } = mountComposable(() => useFetchCollectionContent())

			const collection = await result.fetchCollection('/photos/alice/albums/Gone')

			expect(collection).toBeNull()
			expect(result.errorFetchingCollection.value).toBe(404)
			expect(result.loadingCollection.value).toBe(false)
		})

		test('keeps any other error as it is', async () => {
			const error = new Error('Network down')
			vi.mocked(fetchCollection).mockRejectedValue(error)
			const { result } = mountComposable(() => useFetchCollectionContent())

			await result.fetchCollection('/photos/alice/albums/Holidays')

			expect(result.errorFetchingCollection.value).toBe(error)
		})
	})

	describe('fetchCollectionFiles', () => {
		test('puts the files it fetched in the store', async () => {
			vi.mocked(fetchCollectionFiles).mockResolvedValue(photos)
			const { result } = mountComposable(() => useFetchCollectionContent())

			const files = await result.fetchCollectionFiles('/photos/alice/albums/Holidays')

			expect(files).toBe(photos)
			expect(store.dispatch).toHaveBeenCalledWith('appendFiles', photos)
			expect(store.commit).toHaveBeenCalledWith('setCollectionFiles', {
				collectionFileName: '/photos/alice/albums/Holidays',
				fileIds: ['1', '2'],
			})
			expect(result.loadingCollectionFiles.value).toBe(false)
		})

		test('always asks for the properties the collection files need', async () => {
			vi.mocked(fetchCollectionFiles).mockResolvedValue([])
			const { result } = mountComposable(() => useFetchCollectionContent())

			await result.fetchCollectionFiles('/photos/alice/albums/Holidays', ['<nc:extra />'])

			expect(fetchCollectionFiles).toHaveBeenCalledWith(
				'/photos/alice/albums/Holidays',
				{ signal: expect.any(AbortSignal) },
				['<nc:extra />', ...collectionFilesExtraProps],
				undefined,
			)
		})

		test('does not fetch twice at once', async () => {
			vi.mocked(fetchCollectionFiles).mockReturnValue(new Promise(() => {}))
			const { result } = mountComposable(() => useFetchCollectionContent())

			result.fetchCollectionFiles('/photos/alice/albums/Holidays')
			// The first call only holds the semaphore once it has been scheduled.
			await vi.waitFor(() => expect(result.loadingCollectionFiles.value).toBe(true))
			const files = await result.fetchCollectionFiles('/photos/alice/albums/Holidays')

			expect(files).toEqual([])
			expect(fetchCollectionFiles).toHaveBeenCalledTimes(1)
		})

		test('reports a missing collection as a 404', async () => {
			vi.mocked(fetchCollectionFiles).mockRejectedValue({ response: { status: 404 } })
			const { result } = mountComposable(() => useFetchCollectionContent())

			const files = await result.fetchCollectionFiles('/photos/alice/albums/Gone')

			expect(files).toEqual([])
			expect(result.errorFetchingCollectionFiles.value).toBe(404)
			expect(result.loadingCollectionFiles.value).toBe(false)
		})

		test('releases the semaphore so a later fetch can run', async () => {
			vi.mocked(fetchCollectionFiles).mockRejectedValueOnce(new Error('Network down'))
			const { result } = mountComposable(() => useFetchCollectionContent())
			await result.fetchCollectionFiles('/photos/alice/albums/Holidays')

			vi.mocked(fetchCollectionFiles).mockResolvedValue(photos)
			const files = await result.fetchCollectionFiles('/photos/alice/albums/Holidays')

			expect(files).toBe(photos)
			expect(result.errorFetchingCollectionFiles.value).toBeUndefined()
		})
	})
})
