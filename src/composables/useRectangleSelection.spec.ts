/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TiledSection } from '../services/TiledLayout.ts'
import type { FileSelectRectangle } from './useFilesSelection.ts'

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, useTemplateRef } from 'vue'
import { autoScrollStep, tileBoxes, tilesInBox, useRectangleSelection } from './useRectangleSelection.ts'

/**
 * @param id - Id of the section
 * @param rows - Widths of the tiles of each row, along with the height of the row
 */
function section(id: string, rows: { height: number, widths: number[] }[]): TiledSection {
	return {
		id,
		key: id,
		height: rows.reduce((total, { height }) => total + height, 0),
		items: [],
		rows: rows.map(({ height, widths }, rowIndex) => ({
			key: `${id}-${rowIndex}`,
			sectionKey: id,
			height,
			items: widths.map((width, index) => ({ id: `${id}${rowIndex}${index}`, width, height, ratio: width / height })),
		})),
	}
}

describe('tileBoxes', () => {
	test('places the rows of each section below its header', () => {
		const boxes = tileBoxes([
			section('a', [{ height: 100, widths: [150, 50] }, { height: 80, widths: [200] }]),
			section('b', [{ height: 120, widths: [100, 100] }]),
		], 40)

		expect(boxes).toEqual([
			{ id: 'a00', left: 0, top: 40, right: 150, bottom: 140 },
			{ id: 'a01', left: 150, top: 40, right: 200, bottom: 140 },
			{ id: 'a10', left: 0, top: 140, right: 200, bottom: 220 },
			{ id: 'b00', left: 0, top: 260, right: 100, bottom: 380 },
			{ id: 'b01', left: 100, top: 260, right: 200, bottom: 380 },
		])
	})
})

describe('tilesInBox', () => {
	const boxes = tileBoxes([section('a', [{ height: 100, widths: [100, 100, 100] }, { height: 100, widths: [100, 100, 100] }])], 0)

	test('returns the tiles the box overlaps, in the order of the grid', () => {
		expect(tilesInBox(boxes, { left: 150, top: 50, right: 250, bottom: 150 })).toEqual(['a01', 'a02', 'a11', 'a12'])
	})

	test('ignores tiles the box only borders', () => {
		expect(tilesInBox(boxes, { left: 100, top: 0, right: 200, bottom: 100 })).toEqual(['a01'])
	})

	test('hits the tile under a box without width', () => {
		expect(tilesInBox(boxes, { left: 50, top: 20, right: 50, bottom: 150 })).toEqual(['a00', 'a10'])
	})

	test('returns nothing for a box outside the grid', () => {
		expect(tilesInBox(boxes, { left: 0, top: 300, right: 300, bottom: 400 })).toEqual([])
	})
})

describe('autoScrollStep', () => {
	test('does not scroll away from the edges', () => {
		expect(autoScrollStep(500, 0, 1000)).toBe(0)
	})

	test('scrolls up near the top edge and down near the bottom edge', () => {
		expect(autoScrollStep(24, 0, 1000)).toBe(-12)
		expect(autoScrollStep(976, 0, 1000)).toBe(12)
	})

	test('scrolls at full speed past an edge', () => {
		expect(autoScrollStep(-200, 0, 1000)).toBe(-24)
		expect(autoScrollStep(1200, 0, 1000)).toBe(24)
	})
})

describe('useRectangleSelection', () => {
	// Two rows of two 100px tiles, the first one at the top left corner of the viewport.
	const sections = [section('t', [{ height: 100, widths: [100, 100] }, { height: 100, widths: [100, 100] }])]
	const scrollContainer = {
		getBoundingClientRect: () => ({ left: 0, top: 0, right: 1000, bottom: 1000 }),
		scrollBy: vi.fn(),
	} as unknown as HTMLElement

	let wrapper: ReturnType<typeof mount> | undefined

	afterEach(async () => {
		wrapper?.unmount()
		wrapper = undefined
		// Lets the click swallowed after a drag expire.
		await new Promise((resolve) => setTimeout(resolve))
	})

	/**
	 * @param selectionActive - Whether files are selected
	 */
	function mountGrid(selectionActive = false) {
		const onSelect = vi.fn<(rectangle: FileSelectRectangle) => void>()
		const Grid = defineComponent({
			setup() {
				const root = useTemplateRef<HTMLElement>('root')
				const { rectangle, onPointerDown } = useRectangleSelection({
					root,
					boxes: () => tileBoxes(sections, 0),
					scrollContainer: () => scrollContainer,
					enabled: () => true,
					selectionActive: () => selectionActive,
					onSelect,
				})
				return () => h('div', { ref: 'root', onPointerdown: onPointerDown }, [
					h('div', { 'data-tile-id': 't00' }, [h('span', { class: 'checkbox-radio-switch' })]),
					h('div', { 'data-tile-id': 't10' }),
					h('div', { class: 'empty' }),
					rectangle.value && h('div', { class: 'rectangle' }),
				])
			},
		})

		wrapper = mount(Grid, { attachTo: document.body })
		const [first, second] = wrapper.findAll('[data-tile-id]')
		first.element.getBoundingClientRect = () => ({ left: 0, top: 0, bottom: 90 }) as DOMRect
		// The second row is drawn 10px higher than the layout places it, as if the header above it were shorter.
		second.element.getBoundingClientRect = () => ({ left: 0, top: 90, bottom: 190 }) as DOMRect
		return { wrapper, onSelect }
	}

	/**
	 * @param target - Element pressed
	 * @param init - Position and modifiers of the press
	 */
	function press(target: Element, init: PointerEventInit = {}) {
		target.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, bubbles: true, ...init }))
	}

	/**
	 * @param clientX - Horizontal position of the pointer
	 * @param clientY - Vertical position of the pointer
	 */
	function move(clientX: number, clientY: number) {
		window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX, clientY }))
	}

	test('selects the tiles a drag from outside of them touches', async () => {
		const { wrapper, onSelect } = mountGrid()

		press(wrapper.find('.empty').element, { clientX: 250, clientY: 50 })
		move(150, 150)
		await nextTick()

		expect(onSelect).toHaveBeenCalledWith({ fileIds: ['t01', 't11'], additive: false, start: true })
		expect(wrapper.find('.rectangle').exists()).toBe(true)

		window.dispatchEvent(new PointerEvent('pointerup'))
		await nextTick()
		expect(wrapper.find('.rectangle').exists()).toBe(false)
	})

	test('swallows the click ending a drag', () => {
		const { wrapper } = mountGrid()
		const onClick = vi.fn()
		wrapper.element.addEventListener('click', onClick)

		press(wrapper.find('.empty').element, { clientX: 250, clientY: 50 })
		move(150, 150)
		window.dispatchEvent(new PointerEvent('pointerup'))
		wrapper.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))

		expect(onClick).not.toHaveBeenCalled()
	})

	test('keeps a click without a drag', () => {
		const { wrapper, onSelect } = mountGrid()
		const onClick = vi.fn()
		wrapper.element.addEventListener('click', onClick)

		press(wrapper.find('.empty').element, { clientX: 250, clientY: 50 })
		move(252, 52)
		window.dispatchEvent(new PointerEvent('pointerup'))
		wrapper.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))

		expect(onSelect).not.toHaveBeenCalled()
		expect(onClick).toHaveBeenCalled()
	})

	test('adds to the selection with Ctrl or Cmd held', () => {
		const { wrapper, onSelect } = mountGrid()

		press(wrapper.find('.empty').element, { clientX: 250, clientY: 50, metaKey: true })
		move(150, 150)

		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ additive: true }))
	})

	test('ignores touch', () => {
		const { wrapper, onSelect } = mountGrid()

		press(wrapper.find('.empty').element, { clientX: 250, clientY: 50, pointerType: 'touch' })
		move(150, 150)

		expect(onSelect).not.toHaveBeenCalled()
	})

	test('leaves a drag on a tile to the tile while nothing is selected', () => {
		const { wrapper, onSelect } = mountGrid()

		press(wrapper.find('[data-tile-id]').element, { clientX: 50, clientY: 50 })
		move(150, 150)

		expect(onSelect).not.toHaveBeenCalled()
	})

	test('draws from the checkbox of a tile', () => {
		const { wrapper, onSelect } = mountGrid()

		press(wrapper.find('.checkbox-radio-switch').element, { clientX: 50, clientY: 50 })
		move(150, 50)

		expect(onSelect).toHaveBeenCalledWith({ fileIds: ['t00', 't01'], additive: false, start: true })
	})

	test('draws from anywhere on a tile while files are selected', () => {
		const { wrapper, onSelect } = mountGrid(true)

		press(wrapper.find('[data-tile-id]').element, { clientX: 50, clientY: 50 })
		move(50, 150)

		expect(onSelect).toHaveBeenCalledWith({ fileIds: ['t00', 't10'], additive: false, start: true })
	})

	test('places the pointer against the rendered tile closest to it', () => {
		const { wrapper, onSelect } = mountGrid()

		press(wrapper.find('.empty').element, { clientX: 250, clientY: 95 })
		move(150, 120)

		expect(onSelect).toHaveBeenCalledWith({ fileIds: ['t11'], additive: false, start: true })
	})
})
