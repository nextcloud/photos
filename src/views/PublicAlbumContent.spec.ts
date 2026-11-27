/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type * as VueRouter from 'vue-router'
import type { PublicAlbum } from '../store/publicAlbums.ts'

import { File, Folder } from '@nextcloud/files'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { h, ref } from 'vue'
import PublicAlbumContent from './PublicAlbumContent.vue'
import { useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'

const { open, fetchCollection } = vi.hoisted(() => ({
	open: vi.fn(),
	fetchCollection: vi.fn(),
}))

vi.mock('@nextcloud/viewer', () => ({ getViewer: () => ({ open }) }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('vue-router', async (importOriginal) => ({
	...await importOriginal<typeof VueRouter>(),
	useRoute: () => ({ fullPath: '/' }),
	useRouter: () => ({ push: vi.fn() }),
}))
vi.mock('../components/FileComponent.vue', () => ({ default: { render: () => h('div') } }))
vi.mock('../components/FilesListViewer.vue', () => ({ default: { render: () => h('div') } }))
vi.mock('../composables/useFetchCollectionContent.ts', () => ({
	useFetchCollectionContent: () => ({
		fetchCollection,
		fetchCollectionFiles: async () => [],
		loadingCollection: ref(false),
		loadingCollectionFiles: ref(false),
		errorFetchingCollection: ref(null),
		errorFetchingCollectionFiles: ref(null),
	}),
}))

const TOKEN = 'abc123'

/**
 * @param fileId - Id of the photo
 */
function photo(fileId: number): File {
	return new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/photospublic/${TOKEN}/${fileId}.jpg`,
		owner: 'alice',
		root: '/photospublic',
		mime: 'image/jpeg',
		permissions: 1,
		attributes: { 'metadata-photos-original_date_time': 1710504000 + fileId },
	})
}

/**
 * Show the album with the given photos, the way the fetch leaves the stores.
 *
 * @param fileIds - Photos of the album
 */
async function mountAlbum(fileIds: number[]) {
	const album = new Folder({
		id: 1,
		source: `https://cloud.example.org/remote.php/dav/photospublic/${TOKEN}`,
		owner: 'alice',
		root: '/photospublic',
		attributes: { 'original-name': 'Holidays', location: '', nbItems: 0, 'last-photo': -1 },
	}) as unknown as PublicAlbum

	const collectionsStore = useCollectionsStore()
	collectionsStore.addCollections([album])
	collectionsStore.setCollectionFiles(`/photospublic/${TOKEN}`, fileIds.map(String))
	useFilesStore().appendFiles(fileIds.map(photo))
	fetchCollection.mockResolvedValue(album)

	const wrapper = mount(PublicAlbumContent, { props: { token: TOKEN } })
	await flushPromises()
	return wrapper
}

describe('PublicAlbumContent slideshow', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		open.mockReset()
	})

	test('plays the album in the viewer from its header', async () => {
		const wrapper = await mountAlbum([2, 1])

		await wrapper.find('[data-cy-header-action="slideshow"]').trigger('click')

		expect(open).toHaveBeenCalledTimes(1)
		const [list, first, options] = open.mock.calls[0]
		expect(list.map((file: File) => file.fileid)).toEqual([1, 2])
		expect(first.fileid).toBe(1)
		expect(options).toEqual({ enableSidebar: false, startSlideshow: true })
	})

	test('offers no slideshow for an empty album', async () => {
		const wrapper = await mountAlbum([])

		expect(wrapper.find('[data-cy-header-action="slideshow"]').exists()).toBe(false)
	})
})
