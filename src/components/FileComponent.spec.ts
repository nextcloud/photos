/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import FileComponent from './FileComponent.vue'

vi.mock('vue-router', () => ({ useRoute: () => undefined }))
vi.mock('../services/PreviewService.js', () => ({ isCachedPreview: async () => false }))
vi.mock('@nextcloud/vue/components/NcBlurHash', () => ({ default: { render: () => h('div') } }))
vi.mock('./PhotoActionsMenu.vue', () => ({ default: { render: () => h('div') } }))

const file = {
	fileid: 42,
	basename: 'photo.jpg',
	source: 'https://cloud.example.org/remote.php/dav/files/alice/photo.jpg',
	mime: 'image/jpeg',
	attributes: { etag: 'etag', favorite: 0 },
} as unknown as PhotoFile

/**
 * @param props - Props of the tile besides its file
 */
function mountTile(props: Record<string, unknown> = {}) {
	return mount(FileComponent, { props: { file, ...props } })
}

describe('FileComponent', () => {
	test('opens the file on a plain click', async () => {
		const wrapper = mountTile()

		await wrapper.find('a.file').trigger('click')

		expect(wrapper.emitted('click')).toEqual([[42]])
		expect(wrapper.emitted('selectToggled')).toBeUndefined()
	})

	test('selects a range on a shift click', async () => {
		const wrapper = mountTile()

		await wrapper.find('a.file').trigger('click', { shiftKey: true })

		expect(wrapper.emitted('click')).toBeUndefined()
		expect(wrapper.emitted('selectToggled')).toEqual([[{ id: 42, value: true, range: true }]])
	})

	test('deselects a range on a shift click on a selected file', async () => {
		const wrapper = mountTile({ selected: true })

		await wrapper.find('a.file').trigger('click', { shiftKey: true })

		expect(wrapper.emitted('selectToggled')).toEqual([[{ id: 42, value: false, range: true }]])
	})

	test('opens the file on a shift click where it cannot be selected', async () => {
		const wrapper = mountTile({ allowSelection: false })

		await wrapper.find('a.file').trigger('click', { shiftKey: true })

		expect(wrapper.emitted('click')).toEqual([[42]])
		expect(wrapper.emitted('selectToggled')).toBeUndefined()
	})

	test('selects a range on a shift click on the checkbox', async () => {
		const wrapper = mountTile()

		await wrapper.find('.checkbox-radio-switch__content').trigger('click', { shiftKey: true })
		await wrapper.find('.checkbox-radio-switch__content').trigger('click')

		expect(wrapper.emitted('selectToggled')).toEqual([
			[{ id: 42, value: true, range: true }],
			[{ id: 42, value: true, range: false }],
		])
	})
})
