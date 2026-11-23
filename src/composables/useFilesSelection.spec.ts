/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { fileIdsBetween, useFilesSelection } from './useFilesSelection.ts'

const route = vi.hoisted(() => ({ value: { fullPath: '/' } }))

vi.mock('vue-router', async () => {
	const { reactive } = await import('vue')
	route.value = reactive({ fullPath: '/' })
	return { useRoute: () => route.value }
})

describe('fileIdsBetween', () => {
	const fileIds = ['1', '2', '3', '4', '5']

	test('returns the files between both ends, both included', () => {
		expect(fileIdsBetween(fileIds, '2', '4')).toEqual(['2', '3', '4'])
	})

	test('keeps the order of the list when going backwards', () => {
		expect(fileIdsBetween(fileIds, '4', '2')).toEqual(['2', '3', '4'])
	})

	test('returns a single file when both ends are the same', () => {
		expect(fileIdsBetween(fileIds, '3', '3')).toEqual(['3'])
	})

	test('returns only the target when an end is not in the list', () => {
		expect(fileIdsBetween(fileIds, '9', '3')).toEqual(['3'])
		expect(fileIdsBetween(fileIds, '3', '9')).toEqual(['9'])
	})
})

describe('useFilesSelection', () => {
	test('toggles single files', () => {
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(['1', '2', '3'])

		onFileSelectToggle({ id: 1, value: true })
		onFileSelectToggle({ id: 3, value: true })
		expect(selectedFileIds.value).toEqual(['1', '3'])

		onFileSelectToggle({ id: 1, value: false })
		expect(selectedFileIds.value).toEqual(['3'])
	})

	test('selects the range from the last toggled file in the order of the grid', () => {
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(['5', '1', '4', '2', '3'])

		onFileSelectToggle({ id: 1, value: true })
		onFileSelectToggle({ id: 2, value: true, range: true })
		expect(selectedFileIds.value.toSorted()).toEqual(['1', '2', '4'])
	})

	test('chains ranges from the end of the previous one', () => {
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(['1', '2', '3', '4', '5', '6'])

		onFileSelectToggle({ id: 2, value: true })
		onFileSelectToggle({ id: 3, value: true, range: true })
		onFileSelectToggle({ id: 5, value: true, range: true })
		expect(selectedFileIds.value).toEqual(['2', '3', '4', '5'])
	})

	test('deselects a range', () => {
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(['1', '2', '3', '4'])

		onFileSelectToggle({ id: 1, value: true })
		onFileSelectToggle({ id: 4, value: true, range: true })
		onFileSelectToggle({ id: 3, value: false })
		onFileSelectToggle({ id: 2, value: false, range: true })
		expect(selectedFileIds.value).toEqual(['1', '4'])
	})

	test('toggles a single file when nothing is selected', () => {
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(['1', '2', '3'])

		onFileSelectToggle({ id: 1, value: true })
		onFileSelectToggle({ id: 1, value: false })
		onFileSelectToggle({ id: 3, value: true, range: true })
		expect(selectedFileIds.value).toEqual(['3'])
	})

	test('forgets where a range starts when the selection is reset', () => {
		const { selectedFileIds, onFileSelectToggle, resetSelection } = useFilesSelection(['1', '2', '3'])

		onFileSelectToggle({ id: 1, value: true })
		resetSelection()
		onFileSelectToggle({ id: 2, value: true })
		onFileSelectToggle({ id: 3, value: true, range: true })
		expect(selectedFileIds.value).toEqual(['2', '3'])

		resetSelection()
		onFileSelectToggle({ id: 3, value: true, range: true })
		expect(selectedFileIds.value).toEqual(['3'])
	})

	test('toggles a single file when the last toggled one left the grid', () => {
		const fileIds = ref(['1', '2', '3'])
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(fileIds)

		onFileSelectToggle({ id: 1, value: true })
		fileIds.value = ['2', '3']
		onFileSelectToggle({ id: 3, value: true, range: true })
		expect(selectedFileIds.value).toEqual(['1', '3'])
	})

	test('selects every file a tile of the range stands for', () => {
		const stacks: Record<string, string[]> = { 2: ['2', '7', '8'] }
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(
			() => ['1', '2', '3'],
			(fileId) => stacks[fileId] ?? [fileId],
		)

		onFileSelectToggle({ id: 1, value: true })
		onFileSelectToggle({ id: 3, value: true, range: true })
		expect(selectedFileIds.value.toSorted()).toEqual(['1', '2', '3', '7', '8'])
	})

	test('drops the selection on navigation', async () => {
		const { selectedFileIds, onFileSelectToggle } = useFilesSelection(['1', '2'])

		onFileSelectToggle({ id: 1, value: true })
		route.value.fullPath = '/albums'
		await nextTick()
		expect(selectedFileIds.value).toEqual([])

		onFileSelectToggle({ id: 2, value: true, range: true })
		expect(selectedFileIds.value).toEqual(['2'])
	})
})
