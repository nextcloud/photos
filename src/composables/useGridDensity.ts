/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ComputedRef } from 'vue'
import type { GridDensity } from '../store/userConfig.ts'

import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed } from 'vue'
import store from '../store/index.ts'

/**
 * Target height of a tile row for each density, per form factor.
 * The row justification adapts the real height to the container width.
 */
const BASE_HEIGHTS: Record<GridDensity, { mobile: number, desktop: number }> = {
	small: { mobile: 80, desktop: 120 },
	medium: { mobile: 120, desktop: 200 },
	large: { mobile: 200, desktop: 320 },
}

/**
 * Access the tile density of the photo grids and the base height it maps to.
 */
export function useGridDensity(): {
	gridDensity: ComputedRef<GridDensity>
	tileBaseHeight: ComputedRef<number>
	setGridDensity: (value: GridDensity) => void
} {
	const isMobile = useIsMobile()

	const gridDensity = computed(() => store.state.userConfig.gridDensity)

	const tileBaseHeight = computed(() => {
		const baseHeight = BASE_HEIGHTS[gridDensity.value] ?? BASE_HEIGHTS.medium
		return isMobile.value ? baseHeight.mobile : baseHeight.desktop
	})

	/**
	 * @param value - The density to persist
	 */
	function setGridDensity(value: GridDensity): void {
		store.dispatch('updateUserConfig', { key: 'gridDensity', value })
	}

	return {
		gridDensity,
		tileBaseHeight,
		setGridDensity,
	}
}
