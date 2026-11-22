/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TiledItem, TiledSection } from '../services/TiledLayout.ts'

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { defineComponent, h } from 'vue'
import VirtualScrolling from './VirtualScrolling.vue'
import { useGridNavigationItem } from '../composables/useGridNavigation.ts'

const Tile = defineComponent({
	props: { id: { type: String, required: true } },
	setup(props) {
		const attrs = useGridNavigationItem(() => props.id)
		return () => h('a', { href: '#', ...attrs.value })
	},
})

/**
 * @param id - Id of the section
 * @param rows - Ids of the items of each row
 */
function section(id: string, rows: string[][]): TiledSection {
	return {
		id,
		key: id,
		items: [],
		height: rows.length * 100,
		rows: rows.map((ids) => ({
			key: ids.join('-'),
			sectionKey: id,
			height: 100,
			items: ids.map((itemId): TiledItem => ({ id: itemId, width: 100, height: 100, ratio: 1 })),
		})),
	}
}

/**
 * @param sections - The sections to lay out
 */
async function mountGrid(sections: TiledSection[]) {
	const wrapper = mount(VirtualScrolling, {
		attachTo: document.body,
		props: { sections, useWindow: true },
		slots: {
			default: ({ visibleSections }) => visibleSections
				.flatMap(({ rows }) => rows)
				.flatMap(({ items }) => items)
				.map(({ id }) => h(Tile, { id, key: id })),
		},
	})
	// The rows are laid out against the viewport height, read once mounted.
	await flushPromises()
	return wrapper
}

/**
 * @param wrapper - The mounted grid
 * @param id - Id of the item
 */
function tile(wrapper: Awaited<ReturnType<typeof mountGrid>>, id: string) {
	return wrapper.get(`[data-grid-item-id="${id}"]`)
}

describe('VirtualScrolling keyboard navigation', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	test('only the first item is in the tab order at first', async () => {
		const wrapper = await mountGrid([section('a', [['1', '2'], ['3']])])

		expect(tile(wrapper, '1').attributes('tabindex')).toBe('0')
		expect(tile(wrapper, '2').attributes('tabindex')).toBe('-1')
		expect(tile(wrapper, '3').attributes('tabindex')).toBe('-1')
	})

	test('arrow keys move the focus and the tab stop across rows and sections', async () => {
		const wrapper = await mountGrid([section('a', [['1', '2']]), section('b', [['3', '4']])])

		;(tile(wrapper, '1').element as HTMLElement).focus()
		await tile(wrapper, '1').trigger('keydown', { key: 'ArrowRight' })
		await flushPromises()
		expect(document.activeElement).toBe(tile(wrapper, '2').element)
		expect(tile(wrapper, '2').attributes('tabindex')).toBe('0')
		expect(tile(wrapper, '1').attributes('tabindex')).toBe('-1')

		await tile(wrapper, '2').trigger('keydown', { key: 'ArrowDown' })
		await flushPromises()
		expect(document.activeElement).toBe(tile(wrapper, '4').element)
	})

	test('arrow keys with a modifier are left alone', async () => {
		const wrapper = await mountGrid([section('a', [['1', '2']])])

		;(tile(wrapper, '1').element as HTMLElement).focus()
		await tile(wrapper, '1').trigger('keydown', { key: 'ArrowRight', shiftKey: true })
		await flushPromises()
		expect(document.activeElement).toBe(tile(wrapper, '1').element)
	})
})
