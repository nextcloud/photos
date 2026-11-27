/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Tag } from '../../store/systemtags.ts'

import { File } from '@nextcloud/files'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useSystemTagsStore } from '../../store/systemtags.ts'
import { tagsFilter } from './tagsFilter.ts'

const { getSystemTags, getTaggedImages } = vi.hoisted(() => ({
	getSystemTags: vi.fn(),
	getTaggedImages: vi.fn(),
}))

vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('../AreTagsInstalled.ts', () => ({ areTagsInstalled: true }))
vi.mock('../SystemTags.ts', () => ({ getSystemTags }))
vi.mock('../TaggedImages.ts', () => ({ getTaggedImages }))
vi.mock('../../components/PhotosFilters/TagOption.vue', () => ({ default: {} }))

/**
 * A system tag the way the tags listing returns them.
 *
 * @param id - Id of the tag
 * @param name - Display name of the tag
 */
function tag(id: string, name: string | number): Tag {
	return {
		id,
		type: 'folder',
		attributes: {
			'display-name': name,
			'user-visible': true,
			'user-assignable': false,
			'can-assign': false,
			'files-assigned': 1,
			'reference-fileid': Number(id) * 100,
		},
	} as unknown as Tag
}

/**
 * @param fileId - Id of the photo
 */
function photo(fileId: number): File {
	return new File({
		id: fileId,
		source: `https://cloud.example.org/remote.php/dav/files/alice/Photos/${fileId}.jpg`,
		owner: 'alice',
		root: '/files/alice',
		mime: 'image/jpeg',
	})
}

/**
 * Extract the file ids the query matches.
 *
 * @param query - The DAV query to extract the literals from
 */
function getFileIds(query: string): number[] {
	return [...query.matchAll(/<d:literal>(.*)<\/d:literal>/g)].map(([, literal]) => Number(literal))
}

describe('tagsFilter', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		getSystemTags.mockReset()
		getTaggedImages.mockReset()
	})

	test('suggests each visible tag once, sorted by name', async () => {
		getSystemTags.mockResolvedValue([tag('1', 'dog'), tag('2', 'beach'), tag('3', 'dog'), tag('4', 2024)])

		const options = await tagsFilter.getOptions()

		expect(options.map(({ filterId, label, value }) => ({ filterId, label, value }))).toEqual([
			{ filterId: 'tags', label: '2024', value: '2024' },
			{ filterId: 'tags', label: 'beach', value: 'beach' },
			{ filterId: 'tags', label: 'dog', value: 'dog' },
		])
		expect(options[1].imgSrc).toContain('/core/preview?fileId=200&')
	})

	test('reuses the tags already fetched', async () => {
		useSystemTagsStore().updateTags([tag('1', 'dog')])

		expect((await tagsFilter.getOptions()).map(({ value }) => value)).toEqual(['dog'])
		expect(getSystemTags).not.toHaveBeenCalled()
	})

	test('fetches the files of every tag with the picked name', async () => {
		getSystemTags.mockResolvedValue([tag('1', 'dog'), tag('2', 'beach'), tag('3', 'dog'), tag('4', 'cat')])
		getTaggedImages.mockImplementation(async (id: string) => (id === '1' ? [photo(10), photo(11)] : [photo(11), photo(12)]))

		const [, , dogOption] = await tagsFilter.getOptions()

		expect(await dogOption.getValue!()).toBe('dog')
		expect(getTaggedImages.mock.calls.map(([id]) => id).sort()).toEqual(['1', '3'])
		expect(getFileIds(tagsFilter.getQuery(['dog'])).sort()).toEqual([10, 11, 12])
	})

	test('matches the files of any of the tags', () => {
		const systemTagsStore = useSystemTagsStore()
		systemTagsStore.updateTags([tag('1', 'dog'), tag('2', 'beach'), tag('3', 'cat')])
		systemTagsStore.tagsFiles = { 1: [10, 11], 2: [11, 20], 3: [30] }

		const query = tagsFilter.getQuery(['dog', 'beach'])

		expect(query.startsWith('<d:or>')).toBe(true)
		expect(query).toContain('<oc:fileid/>')
		expect(getFileIds(query)).toEqual([10, 11, 20])
	})

	test('matches nothing while the tagged files are not known', () => {
		useSystemTagsStore().updateTags([tag('1', 'dog')])

		expect(getFileIds(tagsFilter.getQuery(['dog']))).toEqual([0])
		expect(getFileIds(tagsFilter.getQuery(['unknown']))).toEqual([0])
	})
})
