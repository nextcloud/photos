/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Ref } from 'vue'
import type { TiledSection } from '../services/TiledLayout.ts'
import type { FileSelectRectangle } from './useFilesSelection.ts'

import { onBeforeUnmount, ref } from 'vue'

export type Box = {
	left: number
	top: number
	right: number
	bottom: number
}

export type TileBox = Box & {
	id: string
}

// How far, in pixels, the pointer has to move before a press becomes a drag.
const DRAG_THRESHOLD = 5

// Controls a press outside of a tile keeps for itself.
const INTERACTIVE_ELEMENTS = 'a, button, input, select, textarea, label, [role="button"], [contenteditable]'

/**
 * Where the tiles sit in the grid, relative to its top left corner, laid out
 * the way VirtualScrolling places them: each section a header followed by its rows.
 *
 * @param sections - The tiled sections of the grid
 * @param headerHeight - Height of a section header
 */
export function tileBoxes(sections: TiledSection[], headerHeight: number): TileBox[] {
	const boxes: TileBox[] = []
	let top = 0

	for (const section of sections) {
		top += headerHeight
		for (const row of section.rows) {
			let left = 0
			for (const item of row.items) {
				boxes.push({ id: item.id, left, top, right: left + item.width, bottom: top + row.height })
				left += item.width
			}
			top += row.height
		}
	}

	return boxes
}

/**
 * Ids of the tiles a box overlaps.
 *
 * @param boxes - The tiles of the grid
 * @param box - The box to test against
 */
export function tilesInBox(boxes: TileBox[], box: Box): string[] {
	return boxes
		.filter((tile) => tile.left < box.right && tile.right > box.left && tile.top < box.bottom && tile.bottom > box.top)
		.map(({ id }) => id)
}

/**
 * Pixels to scroll by in one frame, for a pointer close to or past the top or bottom edge of the scrolled area.
 *
 * @param pointerY - Vertical position of the pointer
 * @param top - Top edge of the scrolled area
 * @param bottom - Bottom edge of the scrolled area
 * @param edge - Distance from an edge within which scrolling starts
 * @param maxStep - Step for a pointer on or past an edge
 */
export function autoScrollStep(pointerY: number, top: number, bottom: number, edge = 48, maxStep = 24): number {
	if (pointerY < top + edge) {
		return -Math.ceil(maxStep * Math.min(1, (top + edge - pointerY) / edge))
	}

	if (pointerY > bottom - edge) {
		return Math.ceil(maxStep * Math.min(1, (pointerY - bottom + edge) / edge))
	}

	return 0
}

/**
 * Selects the tiles of a grid by drawing a rectangle over them with the mouse.
 *
 * A drag draws the rectangle when it starts outside of the tiles, on the
 * checkbox of a tile, or anywhere on a tile while files are selected. The
 * tiles are hit tested against the layout, so the ones the virtual scroller
 * has not rendered are selected too.
 *
 * @param options - The grid to draw on
 * @param options.root - Element holding the grid, the rectangle is positioned against it
 * @param options.boxes - The tiles of the grid, as returned by tileBoxes
 * @param options.scrollContainer - The element scrolling the grid
 * @param options.enabled - Whether the rectangle can be drawn
 * @param options.selectionActive - Whether files are selected
 * @param options.onSelect - Called with the tiles the rectangle touches whenever they change
 */
export function useRectangleSelection({ root, boxes, scrollContainer, enabled, selectionActive, onSelect }: {
	root: Readonly<Ref<HTMLElement | null>>
	boxes: () => TileBox[]
	scrollContainer: () => HTMLElement | Window
	enabled: () => boolean
	selectionActive: () => boolean
	onSelect: (rectangle: FileSelectRectangle) => void
}) {
	// The drawn rectangle, relative to root.
	const rectangle = ref<{ left: number, top: number, width: number, height: number } | null>(null)

	// Where the press started, in grid coordinates.
	let origin: { x: number, y: number } | null = null
	let pressPosition = { x: 0, y: 0 }
	let pointerPosition = { x: 0, y: 0 }
	let pointerId = 0
	let additive = false
	let dragging = false
	// Whether the tiles of the drag have been reported once.
	let reported = false
	let lastFileIds = ''
	let frame: number | null = null

	// Offset from grid coordinates to the viewport, measured on the rendered
	// tile closest to a height, as the sections of the grid may not be exactly
	// as high in the page as in the layout.
	function gridOffset(clientY: number): { x: number, y: number } | null {
		let closest: { element: HTMLElement, rect: DOMRect, distance: number } | null = null
		for (const element of root.value?.querySelectorAll<HTMLElement>('[data-tile-id]') ?? []) {
			const rect = element.getBoundingClientRect()
			const distance = Math.max(rect.top - clientY, clientY - rect.bottom, 0)
			if (closest === null || distance < closest.distance) {
				closest = { element, rect, distance }
			}
		}

		if (closest === null) {
			return null
		}

		const { element, rect } = closest
		const box = boxes().find(({ id }) => id === element.dataset.tileId)
		if (box === undefined) {
			return null
		}

		return { x: rect.left - box.left, y: rect.top - box.top }
	}

	function visibleArea(): Box {
		const container = scrollContainer()
		if (container instanceof Window) {
			return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }
		}

		return container.getBoundingClientRect()
	}

	function onPointerDown(event: PointerEvent): void {
		if (!enabled() || event.pointerType !== 'mouse' || event.button !== 0 || event.shiftKey || event.altKey) {
			return
		}

		const target = event.target as Element
		const pressedOnTile = target.closest('[data-tile-id]') !== null
		if (pressedOnTile
			? !selectionActive() && target.closest('.checkbox-radio-switch') === null
			: target.closest(INTERACTIVE_ELEMENTS) !== null) {
			return
		}

		const offset = gridOffset(event.clientY)
		if (offset === null) {
			return
		}

		origin = { x: event.clientX - offset.x, y: event.clientY - offset.y }
		pressPosition = { x: event.clientX, y: event.clientY }
		pointerPosition = pressPosition
		pointerId = event.pointerId
		additive = event.ctrlKey || event.metaKey

		window.addEventListener('pointermove', onPointerMove)
		window.addEventListener('pointerup', stop)
		window.addEventListener('pointercancel', stop)
		document.addEventListener('dragstart', preventDefault, true)
		document.addEventListener('selectstart', preventDefault, true)
	}

	function onPointerMove(event: PointerEvent): void {
		pointerPosition = { x: event.clientX, y: event.clientY }

		if (dragging || Math.hypot(pointerPosition.x - pressPosition.x, pointerPosition.y - pressPosition.y) < DRAG_THRESHOLD) {
			return
		}

		dragging = true
		window.getSelection()?.removeAllRanges()
		// Capturing the pointer moves it off the pressed tile, which ends its long press.
		try {
			root.value?.setPointerCapture(pointerId)
		} catch {
			// The pointer is already gone, the coming pointerup stops the drag.
		}
		update()
		frame = requestAnimationFrame(tick)
	}

	function tick(): void {
		const area = visibleArea()
		const step = autoScrollStep(pointerPosition.y, area.top, area.bottom)
		if (step !== 0) {
			scrollContainer().scrollBy(0, step)
		}

		update()
		frame = requestAnimationFrame(tick)
	}

	function update(): void {
		const offset = gridOffset(pointerPosition.y)
		if (origin === null || offset === null || root.value === null) {
			return
		}

		const x = pointerPosition.x - offset.x
		const y = pointerPosition.y - offset.y
		const box = {
			left: Math.min(origin.x, x),
			top: Math.min(origin.y, y),
			right: Math.max(origin.x, x),
			bottom: Math.max(origin.y, y),
		}

		const fileIds = tilesInBox(boxes(), box)
		if (!reported || fileIds.join() !== lastFileIds) {
			onSelect({ fileIds, additive, start: !reported })
			reported = true
			lastFileIds = fileIds.join()
		}

		// The rectangle is drawn within the visible part of the grid.
		const area = visibleArea()
		const rootRect = root.value.getBoundingClientRect()
		const left = Math.max(box.left + offset.x, area.left)
		const top = Math.max(box.top + offset.y, area.top)
		rectangle.value = {
			left: left - rootRect.left,
			top: top - rootRect.top,
			width: Math.max(0, Math.min(box.right + offset.x, area.right) - left),
			height: Math.max(0, Math.min(box.bottom + offset.y, area.bottom) - top),
		}
	}

	function stop(): void {
		window.removeEventListener('pointermove', onPointerMove)
		window.removeEventListener('pointerup', stop)
		window.removeEventListener('pointercancel', stop)
		document.removeEventListener('dragstart', preventDefault, true)
		document.removeEventListener('selectstart', preventDefault, true)

		if (frame !== null) {
			cancelAnimationFrame(frame)
			frame = null
		}

		// The click ending a drag neither opens nor toggles the tile it lands on.
		if (dragging) {
			window.addEventListener('click', swallowClick, true)
			setTimeout(() => window.removeEventListener('click', swallowClick, true))
		}

		origin = null
		dragging = false
		reported = false
		lastFileIds = ''
		rectangle.value = null
	}

	onBeforeUnmount(stop)

	return {
		rectangle,
		onPointerDown,
	}
}

function preventDefault(event: Event): void {
	event.preventDefault()
}

function swallowClick(event: MouseEvent): void {
	event.preventDefault()
	event.stopPropagation()
}
