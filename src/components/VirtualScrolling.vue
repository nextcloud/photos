<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->
<template>
	<div v-if="!useWindow && containerElement === null" ref="container" class="vs-container">
		<div ref="rowsContainer"
			class="vs-rows-container"
			:style="rowsContainerStyle">
			<slot :rendered-rows="visibleRows" />
			<slot name="loader" />
		</div>
	</div>
	<div v-else
		ref="rowsContainer"
		class="vs-rows-container"
		:style="rowsContainerStyle">
		<slot :rendered-rows="visibleRows" />
		<slot name="loader" />
	</div>
</template>

<script>
import { debounce } from 'debounce'

import logger from '../services/logger.js'
/**
 * @typedef {object} Row
 * @property {number} height - The height of the row.
 */

/**
 * @typedef {Row} VisibleRow
 * @property {'none'|'near'|'visible'} visibility - The visibility state of the row
 * @property {boolean} shouldRender - Whether the row should be renderer in the DOM
 */

export default {
	name: 'VirtualScrolling',

	props: {
		rows: {
			type: Array,
			required: true,
		},

		containerElement: {
			type: HTMLElement,
			default: null,
		},

		useWindow: {
			type: Boolean,
			default: false,
		},

		renderWindowRatio: {
			type: Number,
			default: 4,
		},
		willBeVisibleWindowRatio: {
			type: Number,
			default: 4,
		},
		visibleWindowRatio: {
			type: Number,
			// A little bit more than the container's height to include items at its edges.
			default: 0,
		},
		bottomBufferRatio: {
			type: Number,
			default: 5,
		},
		scrollToKey: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			scrollPosition: 0,
			containerHeight: 0,
			rowsContainerHeight: 0,
			/** @type {ResizeObserver} */
			resizeObserver: null,
		}
	},

	computed: {
		/**
		 * @return {VisibleRow[]}
		 */
		visibleRows() {
			logger.debug('[VirtualScrolling] Computing visible rows', this.rows)

			// Optimisation: get those computed properties once to not go through vue's internal every time we need them.
			const scrollPosition = this.scrollPosition
			const containerHeight = this.containerHeight

			// Optimisation: different windows to hint the items how they should render themselves.
			// This will be forwarded with the visibility props.
			const shouldRenderedWindow = containerHeight * this.renderWindowRatio
			const willBeVisibleWindow = containerHeight * this.willBeVisibleWindowRatio
			const visibleWindow = containerHeight * this.visibleWindowRatio

			let currentRowTopDistanceFromTop = 0
			let currentRowBottomDistanceFromTop = 0

			// Compute whether a row should be included in the DOM (shouldRender)
			// And how visible the row is.
			return this.rows
				.reduce((visibleRows, row) => {
					currentRowTopDistanceFromTop = currentRowBottomDistanceFromTop
					currentRowBottomDistanceFromTop += row.height

					if (currentRowTopDistanceFromTop < scrollPosition - shouldRenderedWindow || scrollPosition + containerHeight + shouldRenderedWindow < currentRowTopDistanceFromTop) {
						return visibleRows
					}

					let visibility = 'none'

					if (scrollPosition - willBeVisibleWindow < currentRowTopDistanceFromTop && currentRowTopDistanceFromTop < scrollPosition + containerHeight + willBeVisibleWindow) {
						visibility = 'near'

						if (scrollPosition - visibleWindow < currentRowTopDistanceFromTop && currentRowTopDistanceFromTop < scrollPosition + containerHeight + visibleWindow) {
							visibility = 'visible'
						}
						if (scrollPosition - visibleWindow < currentRowBottomDistanceFromTop && currentRowBottomDistanceFromTop < scrollPosition + containerHeight + visibleWindow) {
							visibility = 'visible'
						}
					}

					return [
						...visibleRows,
						{
							...row,
							visibility,
						},
					]
				}, [])
		},

		/**
		 * Total height of all the rows + some room for the loader.
		 *
		 * @return {number}
		 */
		rowsHeight() {
			const loaderHeight = 200

			return this.rows
				.map(row => row.height)
				.reduce((totalHeight, rowHeight) => totalHeight + rowHeight, 0) + loaderHeight
		},

		/**
		 * @return {number}
		 */
		paddingTop() {
			if (this.visibleRows.length === 0) {
				return 0
			}

			const firstVisibleRowIndex = this.rows.findIndex(row => row.items === this.visibleRows[0].items)

			return this.rows
				.map(row => row.height)
				.slice(0, firstVisibleRowIndex)
				.reduce((totalHeight, rowHeight) => totalHeight + rowHeight, 0)
		},

		/**
		 * padding-top is used to replace not included item in the container.
		 *
		 * @return {object}
		 */
		rowsContainerStyle() {
			return {
				height: `${this.rowsHeight}px`,
				paddingTop: `${this.paddingTop}px`,
			}
		},

		/**
		 * Whether the user is near the bottom.
		 * If true, then the need-content event will be emitted.
		 *
		 * @return {boolean}
		 */
		isNearBottom() {
			const buffer = this.containerHeight * this.bottomBufferRatio
			return this.scrollPosition + this.containerHeight >= this.rowsHeight - buffer
		},

		/**
		 * @return {HTMLElement}
		 */
		container() {
			logger.debug('[VirtualScrolling] Computing container')
			if (this.containerElement !== null) {
				return this.containerElement
			} else if (this.useWindow) {
				return window
			} else {
				return this.$refs.container
			}
		},
	},

	watch: {
		isNearBottom(value) {
			if (value) {
				this.$emit('need-content')
			}
		},

		rows() {
			// Re-emit need-content when rows is updated and isNearBottom is still true.
			// If the height of added rows is under `bottomBufferRatio`, `isNearBottom` will still be true so we need more content.
			if (this.isNearBottom) {
				this.$emit('need-content')
			}
		},

		scrollToKey(key) {
			let currentRowTopDistanceFromTop = 0
			for (const row of this.rows) {
				if (row.key === key) {
					this.$refs.container.scrollTo({ top: currentRowTopDistanceFromTop, behavior: 'smooth' })
					return
				}

				currentRowTopDistanceFromTop += row.height
			}
		},
	},

	mounted() {
		this.resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const cr = entry.contentRect
				if (entry.target.classList.contains('vs-container')) {
					this.containerHeight = cr.height
				}
				if (entry.target.classList.contains('vs-rows-container')) {
					this.rowsContainerHeight = cr.height
				}
			}
		})

		if (this.useWindow) {
			window.addEventListener('resize', this.updateContainerSize)
			this.containerHeight = window.innerHeight
		} else {
			this.resizeObserver.observe(this.container)
		}

		this.resizeObserver.observe(this.$refs.rowsContainer)
		this.container.addEventListener('scroll', this.updateScrollPosition)
	},

	beforeDestroy() {
		if (this.useWindow) {
			window.removeEventListener('resize', this.updateContainerSize)
		}

		this.resizeObserver.disconnect()
		this.container.removeEventListener('scroll', this.updateScrollPosition)
	},

	methods: {
		updateScrollPosition: debounce(function() {
			if (this.useWindow) {
				this.scrollPosition = this.container.scrollY
			} else {
				this.scrollPosition = this.container.scrollTop
			}
		}, 200),

		updateContainerSize() {
			this.containerHeight = window.innerHeight
		},
	},
}
</script>

<style scoped lang="scss">
.vs-container {
	overflow-y: scroll;
	height: 100%;
}

.vs-rows-container {
	box-sizing: border-box;
}
</style>
