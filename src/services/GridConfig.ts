/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { reactive } from 'vue'
import sizes from '../assets/grid-sizes.js'

type GridSize = (typeof sizes)[keyof typeof sizes]

const state = reactive<{ gridConfig: GridSize }>({
	gridConfig: sizes.max,
})

function handleWindowResize() {
	// find the first grid size that fit the current window width
	const currentSize = Object.keys(sizes)
		.map((size) => Number.parseInt(size))
		.find((size) => size > document.documentElement.clientWidth)
	state.gridConfig = (currentSize !== undefined ? sizes[currentSize as keyof typeof sizes] : sizes.max) as GridSize
}

window.addEventListener('resize', handleWindowResize)
handleWindowResize()

export default state
