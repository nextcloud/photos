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
			<slot :visible-sections="visibleSections" />
			<slot name="loader" />
		</div>
	</div>
	<div v-else
		ref="rowsContainer"
		class="vs-rows-container"
		:style="rowsContainerStyle">
		<slot :visible-sections="visibleSections" />
		<slot name="loader" />
	</div>
</template>

<script>
import { debounce } from 'debounce'

import logger from '../services/logger.js'

/**
 * @typedef {object} Section
 * @property {string} key - Unique key for the section.
 * @property {Row[]} rows - The height of the row.
 * @property {number} height - Height of the section, excluding the header.
 */

/**
 * @typedef {Section} VisibleSection
 * @property {VisibleRow[]} rows - The height of the row.
 */

/**
 * @typedef {object} Row
 * @property {string} key - Unique key for the row.
 * @property {number} height - The height of the row.
 * @property {string} sectionKey - Unique key for the row.
 */

/**
 * @typedef {Row} VisibleRow
 * @property {number} distance - The distance from the visible viewport
 */

export default {
	name: 'VirtualScrolling',

	props: {
		/** @type {import('vue').PropType<Section[]}>} */
		sections: {
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

		headerHeight: {
			type: Number,
			default: 75,
		},
		renderDistance: {
			type: Number,
			default: 10,
		},
		bottomBufferRatio: {
			type: Number,
			default: 2,
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
		/** @return {VisibleSection[]} */
		visibleSections() {
			logger.debug('[VirtualScrolling] Computing visible section', { sections: this.sections })

			// Optimisation: get those computed properties once to not go through vue's internal every time we need them.
			const containerHeight = this.containerHeight
			const containerTop = this.scrollPosition
			const containerBottom = containerTop + containerHeight

			let currentRowTop = 0
			let currentRowBottom = 0

			// Compute whether a row should be included in the DOM (shouldRender)
			// And how visible the row is.
			return this.sections
				.map(section => {
					currentRowBottom += this.headerHeight

					return {
						...section,
						rows: section.rows.reduce((visibleRows, row) => {
							currentRowTop = currentRowBottom
							currentRowBottom += row.height

							let distance = 0

							if (currentRowBottom < containerTop) {
								distance = (containerTop - currentRowBottom) / containerHeight
							} else if (currentRowTop > containerBottom) {
								distance = (currentRowTop - containerBottom) / containerHeight
							}

							if (distance > this.renderDistance) {
								return visibleRows
							}

							return [
								...visibleRows,
								{
									...row,
									distance,
								},
							]
						}, []),
					}
				})
				.filter(section => section.rows.length > 0)
		},

		/**
		 * Total height of all the rows + some room for the loader.
		 *
		 * @return {number}
		 */
		totalHeight() {
			const loaderHeight = 200

			return this.sections
				.map(section => this.headerHeight + section.height)
				.reduce((totalHeight, sectionHeight) => totalHeight + sectionHeight, 0) + loaderHeight
		},

		/**
		 * @return {number}
		 */
		paddingTop() {
			if (this.visibleSections.length === 0) {
				return 0
			}

			let paddingTop = 0

			for (const section of this.sections) {
				if (section.key !== this.visibleSections[0].rows[0].sectionKey) {
					paddingTop += this.headerHeight + section.height
					continue
				}

				for (const row of section.rows) {
					if (row.key === this.visibleSections[0].rows[0].key) {
						return paddingTop
					}

					paddingTop += row.height
				}

				paddingTop += this.headerHeight
			}

			return paddingTop
		},

		/**
		 * padding-top is used to replace not included item in the container.
		 *
		 * @return {{heigh: string, paddingTop: string}}
		 */
		rowsContainerStyle() {
			return {
				height: `${this.totalHeight}px`,
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
			return this.scrollPosition + this.containerHeight >= this.totalHeight - buffer
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
			logger.debug('[VirtualScrolling] isNearBottom changed', { value })
			if (value) {
				this.$emit('need-content')
			}
		},

		visibleSections() {
			// Re-emit need-content when rows is updated and isNearBottom is still true.
			// If the height of added rows is under `bottomBufferRatio`, `isNearBottom` will still be true so we need more content.
			if (this.isNearBottom) {
				this.$emit('need-content')
			}
		},

		scrollToKey(key) {
			let currentRowTopDistanceFromTop = 0

			for (const section of this.sections) {
				if (section.key !== key) {
					currentRowTopDistanceFromTop += this.headerHeight + section.height
					continue
				}

				break
			}

			logger.debug('[VirtualScrolling] Scrolling to', { currentRowTopDistanceFromTop })
			this.$refs.container.scrollTo({ top: currentRowTopDistanceFromTop, behavior: 'smooth' })
		},
	},

	mounted() {
		this.resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const cr = entry.contentRect
				if (entry.target === this.container) {
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
