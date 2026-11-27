/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import FileComponent from './FileComponent.vue'

vi.mock('@nextcloud/vue/components/NcBlurHash', () => ({ default: {} }))
vi.mock('@nextcloud/vue/components/NcCheckboxRadioSwitch', () => ({ default: {} }))
vi.mock('./PhotoActionsMenu.vue', () => ({ default: {} }))

vi.mock('../services/PreviewService.js', () => ({
	isCachedPreview: async () => false,
}))

const file = {
	fileid: 42,
	basename: 'photo.jpg',
	source: 'https://example.com/photo.jpg',
	mime: 'image/jpeg',
	attributes: { etag: 'etag', favorite: 0 },
} as unknown as PhotoFile

/**
 * @param props - Props on top of the file
 */
function mountFile(props: Record<string, unknown> = {}) {
	return mount(FileComponent, {
		props: { file, showActionsMenu: false, ...props },
	})
}

describe('FileComponent keyboard', () => {
	test('space toggles the selection', async () => {
		const wrapper = mountFile({ selected: false })
		await wrapper.get('a.file').trigger('keydown', { key: ' ' })
		expect(wrapper.emitted('selectToggled')).toEqual([[{ id: 42, value: true }]])

		await wrapper.setProps({ selected: true })
		await wrapper.get('a.file').trigger('keydown', { key: ' ' })
		expect(wrapper.emitted('selectToggled')?.[1]).toEqual([{ id: 42, value: false }])
	})

	test('space does nothing where photos cannot be selected', async () => {
		const wrapper = mountFile({ allowSelection: false })
		await wrapper.get('a.file').trigger('keydown', { key: ' ' })
		expect(wrapper.emitted('selectToggled')).toBeUndefined()
	})

	test('space with a modifier is left alone', async () => {
		const wrapper = mountFile()
		await wrapper.get('a.file').trigger('keydown', { key: ' ', shiftKey: true })
		expect(wrapper.emitted('selectToggled')).toBeUndefined()
	})
})
