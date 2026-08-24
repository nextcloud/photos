/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { WebDAVClient } from 'webdav'
import type { Collection } from '../services/collectionFetcher.ts'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchCollections } from '../services/collectionFetcher.ts'
import { davClient } from '../services/DavClient.ts'
import store from '../store/index.ts'
import { mountComposable } from './mountComposable.ts'
import { useFetchCollections } from './useFetchCollections.ts'

vi.mock('../router/index.ts', () => ({ default: { beforeEach: () => () => {} } }))
vi.mock('../services/collectionFetcher.ts', () => ({ fetchCollections: vi.fn() }))
vi.mock('../services/DavClient.ts', () => ({ davClient: { id: 'user-client' } }))
vi.mock('../services/logger.ts', () => ({ default: { debug: vi.fn(), error: vi.fn() } }))
vi.mock('../store/index.ts', () => ({ default: { dispatch: vi.fn() } }))

const albums = [{ basename: 'Holidays' }] as Collection[]

describe('useFetchCollections', () => {
	beforeEach(() => {
		vi.mocked(fetchCollections).mockReset()
		vi.mocked(store.dispatch).mockClear()
	})

	test('puts the collections it fetched in the store', async () => {
		vi.mocked(fetchCollections).mockResolvedValue(albums)
		const { result } = mountComposable(() => useFetchCollections())

		const collections = await result.fetchCollections('/photos/alice/albums')

		expect(collections).toBe(albums)
		expect(store.dispatch).toHaveBeenCalledWith('addCollections', { collections: albums })
		expect(result.loadingCollections.value).toBe(false)
		expect(result.errorFetchingCollections.value).toBeUndefined()
	})

	test('fetches with the extra properties and the user client by default', async () => {
		vi.mocked(fetchCollections).mockResolvedValue(albums)
		const { result } = mountComposable(() => useFetchCollections())

		await result.fetchCollections('/photos/alice/albums', ['<nc:extra />'])

		expect(fetchCollections).toHaveBeenCalledWith(
			'/photos/alice/albums',
			{ signal: expect.any(AbortSignal) },
			['<nc:extra />'],
			davClient,
		)
	})

	test('fetches with the client it is handed', async () => {
		vi.mocked(fetchCollections).mockResolvedValue(albums)
		const publicClient = { id: 'public-client' } as unknown as WebDAVClient
		const { result } = mountComposable(() => useFetchCollections())

		await result.fetchCollections('/photos/publicalbums/token', [], publicClient)

		expect(fetchCollections).toHaveBeenCalledWith(expect.any(String), expect.any(Object), [], publicClient)
	})

	test('is loading while the request is in flight', async () => {
		let resolveFetch: (collections: Collection[]) => void = () => {}
		vi.mocked(fetchCollections).mockReturnValue(new Promise((resolve) => {
			resolveFetch = resolve
		}))
		const { result } = mountComposable(() => useFetchCollections())

		const pending = result.fetchCollections('/photos/alice/albums')
		expect(result.loadingCollections.value).toBe(true)

		resolveFetch(albums)
		await pending
		expect(result.loadingCollections.value).toBe(false)
	})

	test('does not fetch twice at once', async () => {
		vi.mocked(fetchCollections).mockReturnValue(new Promise(() => {}))
		const { result } = mountComposable(() => useFetchCollections())

		result.fetchCollections('/photos/alice/albums')
		const collections = await result.fetchCollections('/photos/alice/albums')

		expect(collections).toEqual([])
		expect(fetchCollections).toHaveBeenCalledTimes(1)
	})

	test('reports a missing collection home as a 404', async () => {
		vi.mocked(fetchCollections).mockRejectedValue({ response: { status: 404 } })
		const { result } = mountComposable(() => useFetchCollections())

		const collections = await result.fetchCollections('/photos/alice/albums')

		expect(collections).toEqual([])
		expect(result.errorFetchingCollections.value).toBe(404)
		expect(result.loadingCollections.value).toBe(false)
	})

	test('keeps any other error as it is', async () => {
		const error = new Error('Network down')
		vi.mocked(fetchCollections).mockRejectedValue(error)
		const { result } = mountComposable(() => useFetchCollections())

		await result.fetchCollections('/photos/alice/albums')

		expect(result.errorFetchingCollections.value).toBe(error)
	})

	test('clears the error of a previous attempt', async () => {
		vi.mocked(fetchCollections).mockRejectedValueOnce(new Error('Network down'))
		const { result } = mountComposable(() => useFetchCollections())
		await result.fetchCollections('/photos/alice/albums')

		vi.mocked(fetchCollections).mockResolvedValue(albums)
		await result.fetchCollections('/photos/alice/albums')

		expect(result.errorFetchingCollections.value).toBeUndefined()
	})
})
