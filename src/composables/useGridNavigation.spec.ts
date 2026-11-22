/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, h, ref } from 'vue'
import {
	getNextGridIndex,
	gridNavigationKey,
	isGridNavigationKey,
	useGridNavigationItem,
} from './useGridNavigation.ts'

// Index layout:
//  0    1  2
//  3  4    5  6
//  7
const rows = [
	[100, 50, 150],
	[50, 100, 100, 50],
	[200],
]

describe('getNextGridIndex', () => {
	test('left and right follow the reading order across rows', () => {
		expect(getNextGridIndex(rows, 1, 'ArrowRight')).toBe(2)
		expect(getNextGridIndex(rows, 2, 'ArrowRight')).toBe(3)
		expect(getNextGridIndex(rows, 3, 'ArrowLeft')).toBe(2)
		expect(getNextGridIndex(rows, 1, 'ArrowLeft')).toBe(0)
	})

	test('left and right stop at the ends of the grid', () => {
		expect(getNextGridIndex(rows, 0, 'ArrowLeft')).toBe(0)
		expect(getNextGridIndex(rows, 7, 'ArrowRight')).toBe(7)
	})

	test('left and right are swapped in right to left layouts', () => {
		expect(getNextGridIndex(rows, 1, 'ArrowRight', true)).toBe(0)
		expect(getNextGridIndex(rows, 1, 'ArrowLeft', true)).toBe(2)
	})

	test('down goes to the item under the middle of the current one', () => {
		// Middle of 0 is at 50, within 4 (50 to 150).
		expect(getNextGridIndex(rows, 0, 'ArrowDown')).toBe(4)
		// Middle of 1 is at 125, within 4 (50 to 150).
		expect(getNextGridIndex(rows, 1, 'ArrowDown')).toBe(4)
		// Middle of 2 is at 225, within 5 (150 to 250).
		expect(getNextGridIndex(rows, 2, 'ArrowDown')).toBe(5)
	})

	test('up goes to the item above the middle of the current one', () => {
		expect(getNextGridIndex(rows, 3, 'ArrowUp')).toBe(0)
		expect(getNextGridIndex(rows, 5, 'ArrowUp')).toBe(2)
		expect(getNextGridIndex(rows, 7, 'ArrowUp')).toBe(4)
	})

	test('moving to a shorter row lands on its last item', () => {
		expect(getNextGridIndex(rows, 6, 'ArrowDown')).toBe(7)
		expect(getNextGridIndex([[100], [100, 100]], 2, 'ArrowUp')).toBe(0)
	})

	test('up and down stop at the first and last rows', () => {
		expect(getNextGridIndex(rows, 1, 'ArrowUp')).toBe(1)
		expect(getNextGridIndex(rows, 7, 'ArrowDown')).toBe(7)
	})

	test('an index outside the grid is returned unchanged', () => {
		expect(getNextGridIndex([], 0, 'ArrowRight')).toBe(0)
		expect(getNextGridIndex(rows, 8, 'ArrowUp')).toBe(8)
		expect(getNextGridIndex(rows, -1, 'ArrowDown')).toBe(-1)
	})
})

describe('isGridNavigationKey', () => {
	test('accepts the arrow keys only', () => {
		expect(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].every(isGridNavigationKey)).toBe(true)
		expect(isGridNavigationKey('Enter')).toBe(false)
		expect(isGridNavigationKey(' ')).toBe(false)
	})
})

describe('useGridNavigationItem', () => {
	const Item = defineComponent({
		props: { id: { type: String, required: true } },
		setup(props) {
			const attrs = useGridNavigationItem(() => props.id)
			return () => h('a', attrs.value)
		},
	})

	test('adds nothing outside a grid', () => {
		const wrapper = mount(Item, { props: { id: '1' } })
		expect(wrapper.attributes('tabindex')).toBeUndefined()
		expect(wrapper.attributes('data-grid-item-id')).toBeUndefined()
	})

	test('gives the tab stop to the tabbable item only and reports focus', async () => {
		const tabbableItemId = ref<string | null>('1')
		const setActiveItem = vi.fn()
		const provide = { [gridNavigationKey as symbol]: { tabbableItemId: computed(() => tabbableItemId.value), setActiveItem } }

		const first = mount(Item, { props: { id: '1' }, global: { provide } })
		const second = mount(Item, { props: { id: '2' }, global: { provide } })

		expect(first.attributes('tabindex')).toBe('0')
		expect(first.attributes('data-grid-item-id')).toBe('1')
		expect(second.attributes('tabindex')).toBe('-1')

		await second.trigger('focus')
		expect(setActiveItem).toHaveBeenCalledWith('2')

		tabbableItemId.value = '2'
		await second.vm.$nextTick()
		expect(first.attributes('tabindex')).toBe('-1')
		expect(second.attributes('tabindex')).toBe('0')
	})
})
