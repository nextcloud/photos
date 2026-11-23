/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Folder } from '@nextcloud/files'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import FolderComponent from './FolderComponent.vue'
import { getFolderContent } from '../services/FolderContent.ts'

vi.mock('../services/FolderContent.ts', () => ({
	getFolderContent: vi.fn(async () => ({ folder: undefined, folders: [], files: [] })),
}))
// The files store pulls the dialogs and their styles in, vitest cannot load those.
vi.mock('../services/DavClient.ts', () => ({ davClient: {} }))
vi.mock('../services/photoActions.ts', () => ({}))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/auth', () => ({ getCurrentUser: () => ({ uid: 'alice' }) }))

/**
 * A folder of the listing, as the folders view hands it over.
 *
 * @param id - Id of the folder
 * @param name - Name of the folder, at the root of the account
 * @param encrypted - Whether the server marks it end-to-end encrypted
 */
function folder(id: number, name: string, encrypted: boolean): Folder {
	return new Folder({
		id,
		source: `https://cloud.example.org/remote.php/dav/files/alice/${name}`,
		owner: 'alice',
		root: '/files/alice',
		attributes: { 'is-encrypted': encrypted ? 1 : 0 },
	})
}

/**
 * Mount the tile of a folder.
 *
 * @param item - Folder to show
 */
async function mountFolder(item: Folder) {
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [{ path: '/folders/:path*', name: 'folders', component: { render: () => null } }],
	})
	await router.push('/folders')

	const wrapper = mount(FolderComponent, { props: { item }, global: { plugins: [router] } })
	await flushPromises()
	return wrapper
}

describe('FolderComponent', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.mocked(getFolderContent).mockClear()
	})

	test('shows an encrypted folder locked, without listing it', async () => {
		const wrapper = await mountFolder(folder(10, 'Vault', true))

		expect(getFolderContent).not.toHaveBeenCalled()
		expect(wrapper.find('a').attributes('aria-label')).toBe('Open the end-to-end encrypted "Vault" folder')
		expect(wrapper.find('.folder-lock-outline-icon').exists()).toBe(true)
		expect(wrapper.find('img').exists()).toBe(false)
	})

	test('lists a regular folder for its cover', async () => {
		const wrapper = await mountFolder(folder(20, 'Trip', false))

		expect(getFolderContent).toHaveBeenCalledWith('/Trip', expect.anything())
		expect(wrapper.find('a').attributes('aria-label')).toBe('Open the "Trip" folder')
		expect(wrapper.find('.folder-lock-outline-icon').exists()).toBe(false)
	})
})
