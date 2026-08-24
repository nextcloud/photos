/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { mountComposable } from './mountComposable.ts'
import { useFilesSelection } from './useFilesSelection.ts'

const { router } = vi.hoisted(() => {
	const afterEach: ((to: object, from: object) => void)[] = []

	return {
		router: {
			guards: afterEach,
			afterEach(guard: (to: object, from: object) => void) {
				afterEach.push(guard)
				return () => afterEach.splice(afterEach.indexOf(guard), 1)
			},
			navigate() {
				afterEach.forEach((guard) => guard({ path: '/to' }, { path: '/from' }))
			},
		},
	}
})

vi.mock('../router/index.ts', () => ({ default: router }))

describe('useFilesSelection', () => {
	beforeEach(() => {
		router.guards.splice(0)
	})

	test('starts with nothing selected', () => {
		const { result } = mountComposable(() => useFilesSelection())

		expect(result.selection.value).toEqual({})
		expect(result.selectedFileIds.value).toEqual([])
	})

	test('picks a photo up and drops it again', () => {
		const { result } = mountComposable(() => useFilesSelection())

		result.onFileSelectToggle({ id: '1', value: true })
		expect(result.selectedFileIds.value).toEqual(['1'])

		result.onFileSelectToggle({ id: '1', value: false })
		expect(result.selectedFileIds.value).toEqual([])
	})

	test('only lists the photos that are selected', () => {
		const { result } = mountComposable(() => useFilesSelection())

		result.onFileSelectToggle({ id: '1', value: true })
		result.onFileSelectToggle({ id: '2', value: false })
		result.onFileSelectToggle({ id: '3', value: true })

		expect(result.selectedFileIds.value).toEqual(['1', '3'])
	})

	test('picks several photos up at once', () => {
		const { result } = mountComposable(() => useFilesSelection())

		result.setSelected(['1', '2', '3'], true)

		expect(result.selectedFileIds.value).toEqual(['1', '2', '3'])
	})

	test('drops the photos it is handed', () => {
		const { result } = mountComposable(() => useFilesSelection())
		result.setSelected(['1', '2', '3'], true)

		result.onUncheckFiles(['1', '3'])

		expect(result.selectedFileIds.value).toEqual(['2'])
	})

	test('drops the whole selection', () => {
		const { result } = mountComposable(() => useFilesSelection())
		result.setSelected(['1', '2'], true)

		result.resetSelection()

		expect(result.selection.value).toEqual({})
		expect(result.selectedFileIds.value).toEqual([])
	})

	test('drops the selection when the user navigates away', () => {
		const { result } = mountComposable(() => useFilesSelection())
		result.setSelected(['1'], true)

		router.navigate()

		expect(result.selectedFileIds.value).toEqual([])
	})

	test('drops its navigation guard when the component is destroyed', () => {
		const { wrapper } = mountComposable(() => useFilesSelection())
		expect(router.guards).toHaveLength(1)

		wrapper.destroy()

		expect(router.guards).toHaveLength(0)
	})

	test('re-renders on a photo picked up for the first time', async () => {
		const { result, wrapper } = mountComposable(() => useFilesSelection())
		const selected: string[][] = []
		wrapper.vm.$watch(() => result.selectedFileIds.value, (value) => selected.push(value))

		result.onFileSelectToggle({ id: '1', value: true })
		await wrapper.vm.$nextTick()

		expect(selected).toEqual([['1']])
	})
})
