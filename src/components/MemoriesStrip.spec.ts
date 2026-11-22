/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { File } from '@nextcloud/files'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import MemoriesStrip from './MemoriesStrip.vue'

const { getPhotos, openViewer } = vi.hoisted(() => ({
	getPhotos: vi.fn(),
	openViewer: vi.fn(),
}))

vi.mock('../services/PhotoSearch.ts', () => ({ getPhotos }))
vi.mock('@nextcloud/viewer', () => ({ getViewer: () => ({ open: openViewer }) }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))
vi.mock('@nextcloud/router', () => ({ generateUrl: (url: string) => url }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))

const STORAGE_KEY = 'photos:memories-strip-collapsed:alice'

/**
 * A photo the way the DAV search hands it over.
 *
 * @param fileId - Id of the photo
 * @param takenAt - Capture date of the photo
 */
function photo(fileId: number, takenAt: Date): File {
	return new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/files/alice/Photos/${fileId}.jpg`,
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
		attributes: {
			'metadata-photos-original_date_time': takenAt.getTime() / 1000,
			etag: `etag-${fileId}`,
		},
	})
}

describe('MemoriesStrip', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2026, 10, 22, 10, 0))
		window.localStorage.clear()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.clearAllMocks()
	})

	test('renders nothing when no photo matches', async () => {
		getPhotos.mockResolvedValue([])

		const wrapper = mount(MemoriesStrip)
		await flushPromises()

		expect(getPhotos).toHaveBeenCalledWith(expect.objectContaining({ onThisDay: true }))
		expect(wrapper.find('section').exists()).toBe(false)
	})

	test('shows a card per year, most recent first', async () => {
		getPhotos.mockResolvedValue([
			photo(1, new Date(2025, 10, 22)),
			photo(2, new Date(2023, 10, 21)),
			photo(3, new Date(2023, 10, 22)),
		])

		const wrapper = mount(MemoriesStrip)
		await flushPromises()

		const titles = wrapper.findAll('.memories-strip__card__title').map((title) => title.text())
		expect(titles).toEqual(['1 year ago', '3 years ago'])
	})

	test('plays the photos of a year as a slideshow', async () => {
		getPhotos.mockResolvedValue([
			photo(1, new Date(2025, 10, 22)),
			photo(3, new Date(2023, 10, 22, 12)),
			photo(2, new Date(2023, 10, 21)),
		])

		const wrapper = mount(MemoriesStrip)
		await flushPromises()
		await wrapper.findAll('.memories-strip__card')[1].trigger('click')

		const [photos, startPhoto, options] = openViewer.mock.calls[0]
		expect(photos.map((file: File) => file.fileid)).toEqual([2, 3])
		expect(startPhoto.fileid).toBe(2)
		expect(options).toEqual({ startSlideshow: true })
	})

	test('remembers the collapsed state per user', async () => {
		getPhotos.mockResolvedValue([photo(1, new Date(2025, 10, 22))])

		const wrapper = mount(MemoriesStrip)
		await flushPromises()
		expect(wrapper.find('.memories-strip__list').isVisible()).toBe(true)

		await wrapper.find('[aria-expanded]').trigger('click')

		expect(window.localStorage.getItem(STORAGE_KEY)).toBe('1')
		expect(wrapper.find('.memories-strip__list').attributes('style')).toContain('display: none')

		const remounted = mount(MemoriesStrip)
		await flushPromises()
		expect(remounted.find('.memories-strip__list').attributes('style')).toContain('display: none')
	})

	test('stays usable when the storage is not available', async () => {
		getPhotos.mockResolvedValue([photo(1, new Date(2025, 10, 22))])
		const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('denied')
		})
		const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('denied')
		})

		const wrapper = mount(MemoriesStrip)
		await flushPromises()
		await wrapper.find('[aria-expanded]').trigger('click')

		expect(wrapper.find('[aria-expanded]').attributes('aria-expanded')).toBe('false')
		getItem.mockRestore()
		setItem.mockRestore()
	})
})
