/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import sizes from '../assets/grid-sizes.js'

export default new Vue({
	data() {
		return {
			gridConfig: sizes.max,
		}
	},
	watch: {
		gridConfig(val) {
			this.$emit('changed', val)
		},
	},
	created() {
		window.addEventListener('resize', this.handleWindowResize)
		this.handleWindowResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleWindowResize)
	},
	methods: {
		handleWindowResize() {
			// find the first grid size that fit the current window width
			const currentSize = Object.keys(sizes).map((size) => Number.parseInt(size)).find((size) => size > document.documentElement.clientWidth)
			this.gridConfig = sizes[currentSize as number] || sizes.max
		},
	},
})
