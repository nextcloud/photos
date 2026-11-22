/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useLoadedPhotos } from './useLoadedPhotos.ts'

const { getPhotos } = vi.hoisted(() => ({ getPhotos: vi.fn() }))

vi.mock('../services/PhotoSearch.ts', () => ({ getPhotos }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('../services/AllowedMimes.ts', () => ({ allMimes: ['image/jpeg'] }))

/**
 * Build a batch of photos with consecutive ids.
 *
 * @param firstFileId - Id of the first photo
 * @param count - Number of photos
 */
function buildBatch(firstFileId: number, count: number) {
	return Array.from({ length: count }, (_, index) => ({
		fileid: firstFileId + index,
		path: `/photo-${firstFileId + index}.jpg`,
		mime: 'image/jpeg',
		attributes: { 'metadata-photos-original_date_time': 1710504000 },
	}))
}

/**
 * Run the composable inside a component, as it ties itself to its lifecycle.
 */
function setup(): ReturnType<typeof useLoadedPhotos> {
	let result: ReturnType<typeof useLoadedPhotos> | undefined
	mount(defineComponent({
		setup() {
			result = useLoadedPhotos()
			return () => null
		},
	}))
	return result!
}

describe('useLoadedPhotos', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		getPhotos.mockReset()
	})

	test('loadPhotos fetches a single batch', async () => {
		getPhotos.mockResolvedValue(buildBatch(1, 500))

		const { photos, loadPhotos } = setup()
		await loadPhotos()

		expect(getPhotos).toHaveBeenCalledTimes(1)
		expect(photos.value).toHaveLength(500)
	})

	test('loadAllPhotos fetches batches until a short one', async () => {
		getPhotos
			.mockResolvedValueOnce(buildBatch(1, 500))
			.mockResolvedValueOnce(buildBatch(501, 500))
			.mockResolvedValueOnce(buildBatch(1001, 20))

		const { photos, loadAllPhotos } = setup()
		await loadAllPhotos()

		expect(getPhotos.mock.calls.map(([options]) => options.firstResult)).toEqual([0, 500, 1000])
		expect(photos.value).toHaveLength(1020)
	})
})
