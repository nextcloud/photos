/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoSearchOptions } from '../services/PhotoSearch.ts'

import { File } from '@nextcloud/files'
import { beforeEach, describe, expect, test, vi } from 'vitest'

const { getPhotos, showError } = vi.hoisted(() => ({
	getPhotos: vi.fn(),
	showError: vi.fn(),
}))

vi.mock('../services/PhotoSearch.ts', () => ({ getPhotos }))
vi.mock('../services/AllowedMimes.ts', () => ({ allMimes: ['image/jpeg'] }))
vi.mock('../services/DavClient.ts', () => ({ davClient: {} }))
vi.mock('@nextcloud/dialogs', () => ({ showError }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

/**
 * @param fileId - Id of the photo
 */
function photo(fileId: number): File {
	return new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/files/alice/Photos/${fileId}.jpg`,
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
		permissions: 31,
		mtime: new Date(fileId * 1000),
	})
}

/**
 * Serve a library of the given size the way the paged DAV search does.
 *
 * @param size - Number of photos in the library
 */
function serveLibrary(size: number): void {
	getPhotos.mockImplementation(async ({ firstResult = 0, nbResults = 200 }: Partial<PhotoSearchOptions>) => {
		const count = Math.max(0, Math.min(nbResults, size - firstResult))
		return Array.from({ length: count }, (_, index) => photo(firstResult + index + 1))
	})
}

/**
 * Load fresh copies of the modules, as the composable remembers at module level
 * whether the library was loaded, and run the composable in an effect scope.
 */
async function setup() {
	vi.resetModules()
	const { createPinia, setActivePinia } = await import('pinia')
	const { effectScope } = await import('vue')
	const { useLoadedPhotos, MAX_PHOTOS } = await import('./useLoadedPhotos.ts')
	setActivePinia(createPinia())

	const scope = effectScope()
	const api = scope.run(() => useLoadedPhotos())!
	return { ...api, scope, MAX_PHOTOS }
}

describe('useLoadedPhotos', () => {
	beforeEach(() => {
		getPhotos.mockReset()
		showError.mockReset()
	})

	test('fetches batches until one comes back short', async () => {
		serveLibrary(1234)
		const { photos, loading, loadPhotos } = await setup()

		await loadPhotos()

		expect(getPhotos.mock.calls.map(([options]) => [options.firstResult, options.nbResults]))
			.toEqual([[0, 500], [500, 500], [1000, 500]])
		expect(photos.value).toHaveLength(1234)
		expect(photos.value[0].fileid).toBe(1234)
		expect(loading.value).toBe(false)
	})

	test('stops after an empty batch when the library is a multiple of the batch size', async () => {
		serveLibrary(1000)
		const { photos, loadPhotos } = await setup()

		await loadPhotos()

		expect(getPhotos).toHaveBeenCalledTimes(3)
		expect(photos.value).toHaveLength(1000)
	})

	test('stops at the upper bound', async () => {
		serveLibrary(100000)
		const { photos, loadPhotos, MAX_PHOTOS } = await setup()

		await loadPhotos()

		expect(getPhotos).toHaveBeenCalledTimes(MAX_PHOTOS / 500)
		expect(photos.value).toHaveLength(MAX_PHOTOS)
	})

	test('updates the photos while the batches arrive', async () => {
		serveLibrary(700)
		const { photos, loading, loadPhotos } = await setup()
		const seen: Array<[number, boolean]> = []
		const implementation = getPhotos.getMockImplementation()!
		getPhotos.mockImplementation(async (options) => {
			seen.push([photos.value.length, loading.value])
			return implementation(options)
		})

		await loadPhotos()

		expect(seen).toEqual([[0, true], [500, true]])
	})

	test('does not fetch again once the library is loaded unless forced', async () => {
		serveLibrary(10)
		const { loadPhotos } = await setup()

		await loadPhotos()
		await loadPhotos()
		expect(getPhotos).toHaveBeenCalledTimes(1)

		await loadPhotos(true)
		expect(getPhotos).toHaveBeenCalledTimes(2)
	})

	test('fetches again when the media folders change', async () => {
		serveLibrary(10)
		const { loadPhotos } = await setup()
		const { emit } = await import('@nextcloud/event-bus')

		await loadPhotos()
		emit('photos:user-config-changed', { key: 'croppedLayout', value: true })
		await loadPhotos()
		expect(getPhotos).toHaveBeenCalledTimes(1)

		emit('photos:user-config-changed', { key: 'photosSourceFolders', value: ['/Photos', '/Camera'] })
		await loadPhotos()
		expect(getPhotos).toHaveBeenCalledTimes(2)
	})

	test('ignores calls while loading', async () => {
		serveLibrary(10)
		const { loadPhotos } = await setup()

		await Promise.all([loadPhotos(), loadPhotos()])

		expect(getPhotos).toHaveBeenCalledTimes(1)
	})

	test('aborts the remaining batches when the scope is disposed', async () => {
		serveLibrary(5000)
		const { photos, loading, loadPhotos, scope } = await setup()
		const implementation = getPhotos.getMockImplementation()!
		getPhotos.mockImplementation(async (options) => {
			const files = await implementation(options)
			scope.stop()
			return files
		})

		await loadPhotos()

		expect(getPhotos).toHaveBeenCalledTimes(1)
		expect(getPhotos.mock.calls[0][0].signal.aborted).toBe(true)
		expect(photos.value).toHaveLength(0)
		expect(loading.value).toBe(false)
		expect(showError).not.toHaveBeenCalled()
	})

	test('keeps the photos loaded so far and reports an error', async () => {
		serveLibrary(5000)
		const { photos, loadPhotos } = await setup()
		const implementation = getPhotos.getMockImplementation()!
		getPhotos.mockImplementation(async (options) => {
			if (options.firstResult > 0) {
				throw new Error('Network error')
			}
			return implementation(options)
		})

		await loadPhotos()

		expect(photos.value).toHaveLength(500)
		expect(showError).toHaveBeenCalledTimes(1)

		serveLibrary(600)
		await loadPhotos()
		expect(photos.value).toHaveLength(600)
	})
})
