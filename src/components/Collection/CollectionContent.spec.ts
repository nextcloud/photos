/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../../services/collectionFetcher.ts'

import { File, Folder } from '@nextcloud/files'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'
import CollectionContent from './CollectionContent.vue'
import { useFilesStore } from '../../store/files.ts'

const { open } = vi.hoisted(() => ({ open: vi.fn() }))

vi.mock('@nextcloud/viewer', () => ({ getViewer: () => ({ open }) }))
vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('vue-router', () => ({ useRoute: () => ({ fullPath: '/' }) }))
vi.mock('../FileComponent.vue', () => ({ default: { render: () => h('div') } }))
vi.mock('../FilesListViewer.vue', () => ({ default: { render: () => h('div') } }))

/**
 * @param fileId - Id of the photo
 * @param takenAt - When the photo was taken, in seconds since the epoch
 */
function photo(fileId: number, takenAt: number): File {
	return new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/photospublic/token/${fileId}.jpg`,
		owner: 'alice',
		root: '/photospublic',
		mime: 'image/jpeg',
		permissions: 1,
		attributes: { 'metadata-photos-original_date_time': takenAt },
	})
}

const collection = new Folder({
	id: 1,
	source: 'https://cloud.example.org/remote.php/dav/photospublic/token',
	owner: 'alice',
	root: '/photospublic',
}) as unknown as Collection

/**
 * Mount the collection and hand back what its header slot was given.
 *
 * @param collectionFileIds - Photos of the collection
 */
function mountHeader(collectionFileIds: string[]): { startSlideshow: () => void } {
	let headerProps: { startSlideshow: () => void } | undefined

	mount(CollectionContent, {
		props: { collection, collectionFileIds },
		slots: {
			header: (props: { startSlideshow: () => void }) => {
				headerProps = props
				return h('div')
			},
		},
	})

	if (headerProps === undefined) {
		throw new Error('The header slot was not rendered')
	}

	return headerProps
}

describe('CollectionContent slideshow', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		open.mockReset()
	})

	test('plays the collection in the viewer in the order of the grid', () => {
		const filesStore = useFilesStore()
		filesStore.appendFiles([photo(10, 1710504000), photo(11, 1700000000), photo(12, 1720000000)])

		mountHeader(['10', '11', '12']).startSlideshow()

		expect(open).toHaveBeenCalledTimes(1)
		const [list, first, options] = open.mock.calls[0]
		expect(list.map((file: File) => file.fileid)).toEqual([11, 10, 12])
		expect(first.fileid).toBe(11)
		expect(options).toEqual({ enableSidebar: false, startSlideshow: true })
	})

	test('does not open the viewer for an empty collection', () => {
		mountHeader([]).startSlideshow()

		expect(open).not.toHaveBeenCalled()
	})
})
