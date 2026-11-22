/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { File } from '@nextcloud/files'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import FileComponent from './FileComponent.vue'

vi.mock('vue-router', () => ({ useRoute: () => undefined }))
// Neither shows up in these tests, and their dependencies do not load in vitest.
vi.mock('@nextcloud/vue/components/NcBlurHash', () => ({ default: {} }))
vi.mock('./PhotoActionsMenu.vue', () => ({ default: {} }))

/**
 * A photo of the user, as the grids list them.
 */
function photo(): PhotoFile {
	return new File({
		id: 42,
		source: 'https://cloud.example.org/remote.php/dav/files/alice/Photos/a.jpg',
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
		attributes: { etag: 'abc' },
	}) as PhotoFile
}

/**
 * @param props - Props of the tile on top of the photo
 */
async function mountTile(props: Record<string, unknown> = {}) {
	const wrapper = mount(FileComponent, {
		props: { file: photo(), showActionsMenu: false, allowSelection: false, ...props },
	})
	await flushPromises()
	return wrapper
}

describe('FileComponent', () => {
	test('loads the previews from the photos endpoint by default', async () => {
		const wrapper = await mountTile()

		const sources = wrapper.findAll('img').map((img) => img.attributes('src'))
		expect(sources).toHaveLength(2)
		sources.forEach((src) => expect(src).toContain('/apps/photos/api/v1/preview/42?etag=abc&x='))
		expect(wrapper.find('a').attributes('aria-label')).toBe('Open the full size "a.jpg" image')
	})

	test('loads the previews from the given URL builder and uses the given label', async () => {
		const previewUrl = (size: number) => `/preview/${size}`
		const wrapper = await mountTile({ previewUrl, label: 'Select a.jpg' })

		const sources = wrapper.findAll('img').map((img) => img.attributes('src'))
		expect(sources).toHaveLength(2)
		expect(sources[0]).toBe('/preview/64')
		expect(sources[1]).toMatch(/^\/preview\/\d+$/)
		expect(wrapper.find('a').attributes('aria-label')).toBe('Select a.jpg')
	})
})
