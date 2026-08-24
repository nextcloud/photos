/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { davClient } from '../services/DavClient.ts'
import getPhotos from '../services/PhotoSearch.ts'
import store from '../store/index.ts'
import { mountComposable } from './mountComposable.ts'
import { useFetchFiles } from './useFetchFiles.ts'

const { router } = vi.hoisted(() => {
	const afterEach: ((to: object, from: object) => void)[] = []

	return {
		router: {
			guards: afterEach,
			afterEach(guard: (to: object, from: object) => void) {
				afterEach.push(guard)
				return () => afterEach.splice(afterEach.indexOf(guard), 1)
			},
			beforeEach: () => () => {},
			navigate(toPath: string, fromPath: string) {
				afterEach.forEach((guard) => guard({ path: toPath }, { path: fromPath }))
			},
		},
	}
})

vi.mock('../router/index.ts', () => ({ default: router }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('../services/DavClient.ts', () => ({ davClient: { createDirectory: vi.fn() } }))
vi.mock('../services/logger.ts', () => ({ default: { debug: vi.fn(), error: vi.fn() } }))
vi.mock('../services/PhotoSearch.ts', () => ({ default: vi.fn() }))
vi.mock('../store/index.ts', () => ({
	default: {
		state: { userConfig: { photosSourceFolders: ['Photos'] } },
		dispatch: vi.fn(),
	},
}))

/**
 * A batch of photos, as the search returns them.
 *
 * @param count - Number of photos in the batch
 * @param firstFileId - File id of the first photo
 */
function batch(count: number, firstFileId: number = 1): File[] {
	return Array.from({ length: count }, (_, index) => ({ fileid: firstFileId + index } as File))
}

describe('useFetchFiles', () => {
	beforeEach(() => {
		router.guards.splice(0)
		vi.mocked(getPhotos).mockReset()
		vi.mocked(store.dispatch).mockClear()
	})

	test('puts the photos it fetched in the store', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(3))
		const { result } = mountComposable(() => useFetchFiles())

		const fileIds = await result.fetchFiles()

		expect(fileIds).toEqual([1, 2, 3])
		expect(result.fetchedFileIds.value).toEqual([1, 2, 3])
		expect(store.dispatch).toHaveBeenCalledWith('appendFiles', expect.any(Array))
		expect(result.loadingFiles.value).toBe(false)
	})

	test('asks for the next batch from where the last one stopped', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(200))
		const { result } = mountComposable(() => useFetchFiles())

		await result.fetchFiles({ onlyFavorites: true })
		await result.fetchFiles({ onlyFavorites: true })

		expect(getPhotos).toHaveBeenNthCalledWith(1, expect.objectContaining({ firstResult: 0, nbResults: 200 }))
		expect(getPhotos).toHaveBeenNthCalledWith(2, expect.objectContaining({ firstResult: 200, onlyFavorites: true }))
	})

	test('stops fetching once a batch comes back short', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(3))
		const { result } = mountComposable(() => useFetchFiles())

		await result.fetchFiles()
		expect(result.doneFetchingFiles.value).toBe(true)

		const fileIds = await result.fetchFiles()

		expect(fileIds).toEqual([])
		expect(getPhotos).toHaveBeenCalledTimes(1)
	})

	test('fetches again when forced to', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(3))
		const { result } = mountComposable(() => useFetchFiles())
		await result.fetchFiles()

		await result.fetchFiles({}, undefined, true)

		expect(getPhotos).toHaveBeenCalledTimes(2)
	})

	test('keeps only the photos the caller wants', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(4))
		const { result } = mountComposable(() => useFetchFiles())

		const fileIds = await result.fetchFiles({}, (file) => (file.fileid as number) % 2 === 0)

		expect(fileIds).toEqual([2, 4])
	})

	test('never holds the same photo twice', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(200))
		const { result } = mountComposable(() => useFetchFiles())

		await result.fetchFiles()
		const fileIds = await result.fetchFiles()

		expect(fileIds).toEqual([])
		expect(result.fetchedFileIds.value).toHaveLength(200)
	})

	test('does not fetch twice at once', async () => {
		vi.mocked(getPhotos).mockReturnValue(new Promise(() => {}))
		const { result } = mountComposable(() => useFetchFiles())

		result.fetchFiles()
		// The first call only holds the semaphore once it has been scheduled.
		await vi.waitFor(() => expect(result.loadingFiles.value).toBe(true))
		const fileIds = await result.fetchFiles()

		expect(fileIds).toEqual([])
		expect(getPhotos).toHaveBeenCalledTimes(1)
	})

	test('says nothing when the user navigated away mid-request', async () => {
		vi.mocked(getPhotos).mockRejectedValue(new DOMException('Aborted', 'AbortError'))
		const { result } = mountComposable(() => useFetchFiles())

		const fileIds = await result.fetchFiles()

		expect(fileIds).toEqual([])
		expect(result.errorFetchingFiles.value).toBeUndefined()
	})

	test('creates the source folder the server could not find', async () => {
		vi.mocked(getPhotos).mockRejectedValue({
			response: { status: 404, data: 'File with name /Photos could not be located' },
		})
		const { result } = mountComposable(() => useFetchFiles())

		await result.fetchFiles()

		expect(davClient.createDirectory).toHaveBeenCalledWith(expect.stringContaining('Photos'))
		expect(result.errorFetchingFiles.value).toBeUndefined()
	})

	test('keeps any other error as it is', async () => {
		const error = new Error('Network down')
		vi.mocked(getPhotos).mockRejectedValue(error)
		const { result } = mountComposable(() => useFetchFiles())

		await result.fetchFiles()

		expect(result.errorFetchingFiles.value).toBe(error)
		expect(result.loadingFiles.value).toBe(false)
	})

	test('starts over when its state is reset', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(3))
		const { result } = mountComposable(() => useFetchFiles())
		await result.fetchFiles()

		result.resetFetchFilesState()

		expect(result.fetchedFileIds.value).toEqual([])
		expect(result.doneFetchingFiles.value).toBe(false)
		expect(result.errorFetchingFiles.value).toBeUndefined()
		expect(result.loadingFiles.value).toBe(false)
	})

	test('starts over when the user opens another path', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(3))
		const { result } = mountComposable(() => useFetchFiles())
		await result.fetchFiles()

		router.navigate('/favorites', '/')

		expect(result.fetchedFileIds.value).toEqual([])
	})

	test('keeps the photos it holds when only the query changed', async () => {
		vi.mocked(getPhotos).mockResolvedValue(batch(3))
		const { result } = mountComposable(() => useFetchFiles())
		await result.fetchFiles()

		router.navigate('/', '/')

		expect(result.fetchedFileIds.value).toEqual([1, 2, 3])
	})

	test('drops its navigation hook when the component is destroyed', () => {
		const { wrapper } = mountComposable(() => useFetchFiles())
		expect(router.guards).toHaveLength(1)

		wrapper.destroy()

		expect(router.guards).toHaveLength(0)
	})
})
