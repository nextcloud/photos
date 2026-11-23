/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PropType } from 'vue'
import type { PhotoExif } from '../utils/exif.ts'

import { File } from '@nextcloud/files'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import PhotosTab from './PhotosTab.vue'

const { fetchPhotoExif } = vi.hoisted(() => ({ fetchPhotoExif: vi.fn() }))

vi.mock('../services/exifFetcher.ts', () => ({ fetchPhotoExif }))

vi.mock('../components/PhotoMetadataList.vue', () => ({
	default: defineComponent({
		props: { metadata: { type: Object as PropType<PhotoExif>, required: true } },
		setup: (props) => () => h('div', { class: 'metadata-list' }, props.metadata.place),
	}),
}))

/**
 * @param name - Name of the photo
 */
function photo(name: string): File {
	return new File({
		source: `http://nextcloud.local/remote.php/dav/files/admin/Photos/${name}`,
		root: '/files/admin',
		owner: 'admin',
		mime: 'image/jpeg',
		id: name.length,
	})
}

/**
 * Metadata only differing by place, so the rendered output tells them apart.
 *
 * @param place - Place of the photo
 */
function metadataOf(place: string): PhotoExif {
	return { exif: {}, ifd0: {}, place }
}

beforeEach(() => {
	fetchPhotoExif.mockReset()
})

describe('PhotosTab', () => {
	test('fetches the metadata of the node once the tab is shown', async () => {
		fetchPhotoExif.mockResolvedValue(metadataOf('Lisbon'))
		const wrapper = mount(PhotosTab, { props: { active: false, node: photo('a.jpg') } })
		await flushPromises()

		expect(fetchPhotoExif).not.toHaveBeenCalled()

		await wrapper.setProps({ active: true })
		await flushPromises()

		expect(fetchPhotoExif).toHaveBeenCalledOnce()
		expect(fetchPhotoExif.mock.calls[0][0].davPath).toBe('/files/admin/Photos/a.jpg')
		expect(wrapper.find('.metadata-list').text()).toBe('Lisbon')
	})

	test('does not fetch the same node again when the tab is shown again', async () => {
		fetchPhotoExif.mockResolvedValue(metadataOf('Lisbon'))
		const wrapper = mount(PhotosTab, { props: { active: true, node: photo('a.jpg') } })
		await flushPromises()
		await wrapper.setProps({ active: false })
		await wrapper.setProps({ active: true })
		await flushPromises()

		expect(fetchPhotoExif).toHaveBeenCalledOnce()
	})

	test('keeps the metadata of the current node when an older response arrives late', async () => {
		let resolveFirst: (metadata: PhotoExif) => void = () => {}
		fetchPhotoExif
			.mockReturnValueOnce(new Promise((resolve) => {
				resolveFirst = resolve
			}))
			.mockResolvedValueOnce(metadataOf('Porto'))

		const wrapper = mount(PhotosTab, { props: { active: true, node: photo('a.jpg') } })
		await wrapper.setProps({ node: photo('bb.jpg') })
		await flushPromises()
		resolveFirst(metadataOf('Lisbon'))
		await flushPromises()

		expect(wrapper.find('.metadata-list').text()).toBe('Porto')
	})
})
