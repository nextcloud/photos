/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import FolderTagPreview from './FolderTagPreview.vue'

vi.mock('vue-router', () => ({
	useRoute: () => ({ name: 'folders' }),
	RouterLink: defineComponent({ setup: (_props, { slots }) => () => h('a', slots.default?.()) }),
}))

/**
 * @param count - How many photos the folder is shown with
 */
function previews(count: number): { id: string, etag: string }[] {
	return Array.from({ length: count }, (_, index) => ({ id: String(index + 1), etag: `etag${index + 1}` }))
}

/**
 * @param count - How many photos the listing gave for the folder
 */
function mountFolder(count: number) {
	return mount(FolderTagPreview, { props: { name: 'Travel', path: '/Photos/Travel', previews: previews(count) } })
}

describe('FolderTagPreview', () => {
	test('shows the icon of a folder without photos', () => {
		const wrapper = mountFolder(0)

		expect(wrapper.findAll('img')).toHaveLength(0)
		expect(wrapper.find('.folder__image--placeholder').exists()).toBe(true)
	})

	test('shows up to four photos of the folder', () => {
		const wrapper = mountFolder(6)

		const images = wrapper.findAll('img')
		expect(images).toHaveLength(4)
		expect(images[0].attributes('src')).toContain('fileId=1&c=etag1')
		expect(wrapper.find('.folder__previews--4').exists()).toBe(true)
	})

	test('lays out fewer photos than four', () => {
		expect(mountFolder(3).find('.folder__previews--3').exists()).toBe(true)
		expect(mountFolder(1).find('.folder__previews--1').exists()).toBe(true)
	})

	test('drops a photo whose preview fails, down to the icon', async () => {
		const wrapper = mountFolder(2)

		await wrapper.findAll('img')[0].trigger('error')
		expect(wrapper.findAll('img')).toHaveLength(1)
		expect(wrapper.find('img').attributes('src')).toContain('fileId=2')

		await wrapper.find('img').trigger('error')
		expect(wrapper.findAll('img')).toHaveLength(0)
		expect(wrapper.find('.folder__image--placeholder').exists()).toBe(true)
	})
})
