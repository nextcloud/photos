<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div v-if="!useWindow && containerElement === null" ref="container" class="vs-container">
		<div
			ref="rowsContainer"
			class="vs-rows-container"
			:style="rowsContainerStyle">
			<slot :visible-sections="visibleSections" />
			<slot name="loader" />
		</div>
	</div>
	<div
		v-else
		ref="rowsContainer"
		class="vs-rows-container"
		:style="rowsContainerStyle">
		<slot :visible-sections="visibleSections" />
		<slot name="loader" />
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'

import logger from '../services/logger.js'

export type Row = {
	key: string // Unique key for the row.
	height: number // The height of the row.
	sectionKey: string // Unique key for the row.
}

export type VisibleRow = Row & {
	distance: number // The distance from the visible viewport
}

export type Section = {
	id: string // Unique key for the section.
	rows: Row[] // The height of the row.
	height: number // Height of the section, excluding the header.
}

export type VisibleSection = Section & {
	rows: VisibleRow[] // The height of the row.
}

export default {
	name: 'VirtualScrolling',

	props: {
		sections: {
			type: Array as PropType<Section[]>,
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
			default: 0.5,
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
			resizeObserver: null as ResizeObserver | null,
		}
	},

	computed: {
		visibleSections(): VisibleSection[] {
			logger.debug('[VirtualScrolling] Computing visible section', { sections: this.sections })

			// Optimisation: get those computed properties once to not go through vue's internal every time we need them.
			const containerHeight = this.containerHeight
			const containerTop = this.scrollPosition
			const containerBottom = containerTop + containerHeight

			let currentRowTop = 0
			let currentRowBottom = 0

			// Compute whether a row should be included in the DOM (shouldRender)
			// And how visible the row is.
			const visibleSections = this.sections
				.map((section) => {
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
						}, [] as VisibleRow[]),
					}
				})
				.filter((section) => section.rows.length > 0)

			// To allow vue to recycle the DOM elements instead of adding and deleting new ones,
			// we assign a random key to each items. When a item removed, we recycle its key for new items,
			// so vue can replace the content of removed DOM elements with the content of new items, but keep the other DOM elements untouched.
			const visibleItems = visibleSections
				.flatMap(({ rows }) => rows)
				.flatMap(({ items }) => items)

			visibleItems.forEach((item) => (item.key = this.rowIdToKeyMap[item.id]))

			const usedTokens = visibleItems
				.map(({ key }) => key)
				.filter((key) => key !== undefined)

			const unusedTokens = Object.values(this.rowIdToKeyMap).filter((key) => !usedTokens.includes(key))

			visibleItems
				.filter(({ key }) => key === undefined)
				.forEach((item) => (item.key = unusedTokens.pop() ?? Math.random().toString(36).substr(2)))

			// this.rowIdToKeyMap is created in the beforeCreate hook, so value changes are not tracked.
			// Therefore, we wont trigger the computation of visibleSections again if we alter the value of this.rowIdToKeyMap.
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.rowIdToKeyMap = visibleItems.reduce((finalMapping, { id, key }) => ({ ...finalMapping, [`${id}`]: key }), {})

			return visibleSections
		},

		/**
		 * Total height of all the rows + some room for the loader.
		 */
		totalHeight(): number {
			const loaderHeight = 200

			return this.sections
				.map((section) => this.headerHeight + section.height)
				.reduce((totalHeight, sectionHeight) => totalHeight + sectionHeight, 0) + loaderHeight
		},

		paddingTop(): number {
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
		 */
		rowsContainerStyle(): { height: string, paddingTop: string } {
			return {
				height: `${this.totalHeight}px`,
				paddingTop: `${this.paddingTop}px`,
			}
		},

		/**
		 * Whether the user is near the bottom.
		 * If true, then the need-content event will be emitted.
		 */
		isNearBottom(): boolean {
			const buffer = this.containerHeight * this.bottomBufferRatio
			return this.scrollPosition + this.containerHeight >= this.totalHeight - buffer
		},

		container(): HTMLElement | Window {
			logger.debug('[VirtualScrolling] Computing container')
			if (this.containerElement !== null) {
				return this.containerElement
			} else if (this.useWindow) {
				return window
			} else {
				return this.$refs.container as HTMLElement
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
			;(this.$refs.container as Element).scrollTo({ top: currentRowTopDistanceFromTop, behavior: 'smooth' })
		},
	},

	beforeCreate() {
		this.rowIdToKeyMap = {}
	},

	mounted() {
		this.resizeObserver = new ResizeObserver((entries) => {
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
			window.addEventListener('resize', this.updateContainerSize, { passive: true })
			this.containerHeight = window.innerHeight
		} else {
			this.resizeObserver.observe(this.container as Element)
		}

		this.resizeObserver.observe(this.$refs.rowsContainer as Element)
		this.container?.addEventListener('scroll', this.updateScrollPosition, { passive: true })
	},

	beforeDestroy() {
		if (this.useWindow) {
			window.removeEventListener('resize', this.updateContainerSize)
		}

		this.resizeObserver?.disconnect()
		this.container?.removeEventListener('scroll', this.updateScrollPosition)
	},

	methods: {
		updateScrollPosition() {
			this._onScrollHandle ??= requestAnimationFrame(() => {
				this._onScrollHandle = null
				if (this.useWindow) {
					this.scrollPosition = (this.container as Window).scrollY
				} else {
					this.scrollPosition = (this.container as HTMLElement).scrollTop
				}
			})
		},

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
	will-change: scroll-position, padding;
	contain: layout paint style;
}
</style>
