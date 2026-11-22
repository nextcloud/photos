/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import FileComponent from './FileComponent.vue'

// Not rendered by the tiles below, and NcBlurHash cannot load in happy-dom.
vi.mock('@nextcloud/vue/components/NcBlurHash', () => ({ default: {} }))
vi.mock('@nextcloud/vue/components/NcCheckboxRadioSwitch', () => ({ default: {} }))
vi.mock('./PhotoActionsMenu.vue', () => ({ default: {} }))

vi.mock('vue-router', () => ({
	useRoute: () => undefined,
}))

vi.mock('../services/PreviewService.js', () => ({
	isCachedPreview: async () => false,
}))

vi.mock('../utils/fileUtils.ts', () => ({
	getVideoDurationFromUrl: async () => 0,
	toPhotoTarget: (file: PhotoFile) => file,
}))

/**
 * A tile showing a file of the given mime type.
 *
 * @param mime - Mime type of the file
 */
async function mountTile(mime: string) {
	const file = {
		fileid: 42,
		basename: 'clip',
		mime,
		source: 'https://cloud.example/remote.php/dav/files/admin/clip',
		attributes: {
			etag: '"abc"',
		},
	} as unknown as PhotoFile

	const wrapper = mount(FileComponent, {
		props: { file, allowSelection: false, showActionsMenu: false },
	})
	await flushPromises()
	return wrapper
}

describe('FileComponent', () => {
	test('shimmers while the previews are loading', async () => {
		const wrapper = await mountTile('image/gif')

		expect(wrapper.find('.file__layer--shimmer').exists()).toBe(true)
		expect(wrapper.find('[data-test="preview-placeholder"]').exists()).toBe(false)
	})

	test('keeps waiting for the large preview when only the small one failed', async () => {
		const wrapper = await mountTile('image/gif')

		await wrapper.find('.file__layer--small').trigger('error')

		expect(wrapper.find('.file__layer--shimmer').exists()).toBe(true)
		expect(wrapper.find('[data-test="preview-placeholder"]').exists()).toBe(false)
	})

	test('shows an image placeholder instead of shimmering when no preview can be rendered', async () => {
		const wrapper = await mountTile('image/gif')

		await wrapper.find('.file__layer--small').trigger('error')
		await wrapper.find('.file__layer--large').trigger('error')

		const placeholder = wrapper.find('[data-test="preview-placeholder"]')
		expect(placeholder.exists()).toBe(true)
		expect(placeholder.find('.image-outline-icon').exists()).toBe(true)
		expect(wrapper.find('.file__layer--shimmer').exists()).toBe(false)
	})

	test('shows a video placeholder for a video without a preview', async () => {
		const wrapper = await mountTile('video/x-matroska')

		await wrapper.find('.file__layer--small').trigger('error')
		await wrapper.find('.file__layer--large').trigger('error')

		const placeholder = wrapper.find('[data-test="preview-placeholder"]')
		expect(placeholder.find('.video-outline-icon').exists()).toBe(true)
	})
})
