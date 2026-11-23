/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Ref } from 'vue'
import type { ViewportPoint, WheelZoomState, ZoomDirection } from '../utils/gridZoom.ts'

import { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { pinchDirection, stepDensity, trackWheelZoom } from '../utils/gridZoom.ts'
import { useGridDensity } from './useGridDensity.ts'

/** How long the level stays on screen after a change, in milliseconds. */
const INDICATOR_DURATION = 1200
/** Pixels a wheel reports as one line, respectively one page, in the other delta modes. */
const WHEEL_DELTA_UNITS = [1, 40, 800]

/**
 * Step through the tile densities of a grid with Ctrl or Cmd and the wheel,
 * a pinch on a trackpad or a touch screen, and the plus and minus keys.
 *
 * @param grid - Element the wheel and the pinch are listened on
 */
export function useGridZoom(grid: Ref<HTMLElement | null | undefined>): {
	zoomAnchor: Ref<ViewportPoint | null>
	zoomIndicatorShown: Ref<boolean>
} {
	const { gridDensity, setGridDensity } = useGridDensity()

	// Point whose photo stays in place during the change of density, null the rest of the time.
	const zoomAnchor = ref<ViewportPoint | null>(null)
	const zoomIndicatorShown = ref(false)

	let indicatorTimeout: ReturnType<typeof setTimeout> | null = null
	let wheelState: WheelZoomState = { accumulated: 0, lastEvent: 0, lastStep: 0 }
	let pinchDistance = 0

	/**
	 * @param direction - Towards larger or smaller tiles
	 * @param point - Point of the viewport to zoom around
	 */
	async function zoom(direction: ZoomDirection, point: ViewportPoint): Promise<void> {
		zoomIndicatorShown.value = true
		if (indicatorTimeout !== null) {
			clearTimeout(indicatorTimeout)
		}
		indicatorTimeout = setTimeout(() => (zoomIndicatorShown.value = false), INDICATOR_DURATION)

		const density = stepDensity(gridDensity.value, direction)
		if (density === gridDensity.value) {
			return
		}

		zoomAnchor.value = point
		setGridDensity(density)
		await nextTick()
		zoomAnchor.value = null
	}

	function onWheel(event: WheelEvent): void {
		if (!event.ctrlKey && !event.metaKey) {
			return
		}

		// Keeps the browser from zooming the whole page.
		event.preventDefault()

		const delta = event.deltaY * (WHEEL_DELTA_UNITS[event.deltaMode] ?? 1)
		const { state, direction } = trackWheelZoom(wheelState, delta, event.timeStamp)
		wheelState = state
		if (direction !== 0) {
			zoom(direction, { x: event.clientX, y: event.clientY })
		}
	}

	function touchDistance({ touches }: TouchEvent): number {
		return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
	}

	function onTouchStart(event: TouchEvent): void {
		if (event.touches.length !== 2) {
			pinchDistance = 0
			return
		}

		pinchDistance = touchDistance(event)
		// A pinch is no long press: lets the tiles under the fingers drop theirs.
		for (const touch of event.touches) {
			touch.target.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true }))
		}
	}

	function onTouchMove(event: TouchEvent): void {
		if (event.touches.length !== 2 || pinchDistance === 0) {
			return
		}

		const distance = touchDistance(event)
		const direction = pinchDirection(pinchDistance, distance)
		if (direction !== 0) {
			pinchDistance = distance
			zoom(direction, {
				x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
				y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
			})
		}
	}

	watch(grid, (element, _, onCleanup) => {
		if (!element) {
			return
		}

		element.addEventListener('wheel', onWheel, { passive: false })
		element.addEventListener('touchstart', onTouchStart, { passive: true })
		element.addEventListener('touchmove', onTouchMove, { passive: true })
		onCleanup(() => {
			element.removeEventListener('wheel', onWheel)
			element.removeEventListener('touchstart', onTouchStart)
			element.removeEventListener('touchmove', onTouchMove)
		})
	}, { immediate: true, flush: 'post' })

	// The keys zoom around the middle of the visible part of the grid.
	useHotKey(['+', '=', '-'], (event) => {
		const rect = grid.value?.getBoundingClientRect()
		// With Ctrl or Cmd the keys zoom the page, on every platform.
		if (rect === undefined || event.ctrlKey || event.metaKey) {
			return
		}

		const top = Math.max(rect.top, 0)
		const bottom = Math.min(rect.bottom, window.innerHeight)
		zoom(event.key === '-' ? -1 : 1, { x: rect.left + rect.width / 2, y: (top + bottom) / 2 })
	})

	onBeforeUnmount(() => {
		if (indicatorTimeout !== null) {
			clearTimeout(indicatorTimeout)
		}
	})

	return { zoomAnchor, zoomIndicatorShown }
}
