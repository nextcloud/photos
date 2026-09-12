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
			<slot :visibleSections="visibleSections" />
			<slot name="loader" />
		</div>
	</div>
	<div
		v-else
		ref="rowsContainer"
		class="vs-rows-container"
		:style="rowsContainerStyle">
		<slot :visibleSections="visibleSections" />
		<slot name="loader" />
	</div>
</template>

<script setup lang="ts" generic="I extends TiledItem">
import type { TiledItem, TiledSection, TiledSectionRow } from '../services/TiledLayout.ts'

import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { logger } from '../services/logger.ts'

export type VisibleRow<I extends TiledItem = TiledItem> = TiledSectionRow<I> & {
	distance: number // The distance from the visible viewport
}

export type VisibleSection<I extends TiledItem = TiledItem> = Omit<TiledSection<I>, 'rows'> & {
	rows: VisibleRow<I>[] // Rows close enough to the viewport to be rendered.
}

const props = withDefaults(defineProps<{
	sections: TiledSection<I>[]
	containerElement?: HTMLElement | null
	useWindow?: boolean
	headerHeight?: number
	renderDistance?: number
	bottomBufferRatio?: number
	scrollToKey?: string
}>(), {
	containerElement: null,
	useWindow: false,
	headerHeight: 75,
	renderDistance: 0.5,
	bottomBufferRatio: 2,
	scrollToKey: '',
})

const emit = defineEmits<{
	needContent: []
}>()

defineSlots<{
	default(props: { visibleSections: VisibleSection<I>[] }): unknown
	loader(): unknown
}>()

const container = useTemplateRef<HTMLDivElement>('container')
const rowsContainer = useTemplateRef<HTMLDivElement>('rowsContainer')

const scrollPosition = ref(0)
const containerHeight = ref(0)
const rowsContainerHeight = ref(0)
let resizeObserver: ResizeObserver | null = null
let rowIdToKeyMap: Record<string, string> = {}
let onScrollHandle: number | null = null

const visibleSections = computed<VisibleSection<I>[]>(() => {
	logger.debug('[VirtualScrolling] Computing visible section', { sections: props.sections })

	// Optimisation: get those computed properties once to not go through vue's internal every time we need them.
	const containerHeightValue = containerHeight.value
	const containerTop = scrollPosition.value
	const containerBottom = containerTop + containerHeightValue

	let currentRowTop = 0
	let currentRowBottom = 0

	// Compute whether a row should be included in the DOM (shouldRender)
	// And how visible the row is.
	const visibleSections = props.sections
		.map((section) => {
			currentRowBottom += props.headerHeight

			return {
				...section,
				rows: section.rows.reduce((visibleRows, row) => {
					currentRowTop = currentRowBottom
					currentRowBottom += row.height

					let distance = 0

					if (currentRowBottom < containerTop) {
						distance = (containerTop - currentRowBottom) / containerHeightValue
					} else if (currentRowTop > containerBottom) {
						distance = (currentRowTop - containerBottom) / containerHeightValue
					}

					if (distance > props.renderDistance) {
						return visibleRows
					}

					return [
						...visibleRows,
						{
							...row,
							distance,
						},
					]
				}, [] as VisibleRow<I>[]),
			}
		})
		.filter((section) => section.rows.length > 0)

	// To allow vue to recycle the DOM elements instead of adding and deleting new ones,
	// we assign a random key to each items. When a item removed, we recycle its key for new items,
	// so vue can replace the content of removed DOM elements with the content of new items, but keep the other DOM elements untouched.
	const visibleItems = visibleSections
		.flatMap(({ rows }) => rows)
		.flatMap(({ items }) => items)

	visibleItems.forEach((item) => (item.key = rowIdToKeyMap[item.id]))

	const usedTokens = visibleItems
		.map(({ key }) => key)
		.filter((key) => key !== undefined)

	const unusedTokens = Object.values(rowIdToKeyMap).filter((key) => !usedTokens.includes(key))

	visibleItems
		.filter(({ key }) => key === undefined)
		.forEach((item) => (item.key = unusedTokens.pop() ?? Math.random().toString(36).substr(2)))

	// rowIdToKeyMap is a plain variable, so value changes are not tracked.
	// Therefore, we wont trigger the computation of visibleSections again if we alter the value of rowIdToKeyMap.
	rowIdToKeyMap = visibleItems.reduce((finalMapping, { id, key }) => ({ ...finalMapping, [`${id}`]: key }), {})

	return visibleSections
})

/**
 * Total height of all the rows + some room for the loader.
 */
const totalHeight = computed<number>(() => {
	const loaderHeight = 200

	return props.sections
		.map((section) => props.headerHeight + section.height)
		.reduce((totalHeight, sectionHeight) => totalHeight + sectionHeight, 0) + loaderHeight
})

const paddingTop = computed<number>(() => {
	if (visibleSections.value.length === 0) {
		return 0
	}

	let paddingTop = 0

	for (const section of props.sections) {
		if (section.key !== visibleSections.value[0].rows[0].sectionKey) {
			paddingTop += props.headerHeight + section.height
			continue
		}

		for (const row of section.rows) {
			if (row.key === visibleSections.value[0].rows[0].key) {
				return paddingTop
			}

			paddingTop += row.height
		}

		paddingTop += props.headerHeight
	}

	return paddingTop
})

/**
 * padding-top is used to replace not included item in the container.
 */
const rowsContainerStyle = computed<{ height: string, paddingTop: string }>(() => ({
	height: `${totalHeight.value}px`,
	paddingTop: `${paddingTop.value}px`,
}))

/**
 * Whether the user is near the bottom.
 * If true, then the need-content event will be emitted.
 */
const isNearBottom = computed<boolean>(() => {
	const buffer = containerHeight.value * props.bottomBufferRatio
	return scrollPosition.value + containerHeight.value >= totalHeight.value - buffer
})

const scrollContainer = computed<HTMLElement | Window>(() => {
	logger.debug('[VirtualScrolling] Computing container')
	if (props.containerElement !== null) {
		return props.containerElement
	} else if (props.useWindow) {
		return window
	} else {
		return container.value as HTMLElement
	}
})

watch(isNearBottom, (value) => {
	logger.debug('[VirtualScrolling] isNearBottom changed', { value })
	if (value) {
		emit('needContent')
	}
})

watch(visibleSections, () => {
	// Re-emit need-content when rows is updated and isNearBottom is still true.
	// If the height of added rows is under `bottomBufferRatio`, `isNearBottom` will still be true so we need more content.
	if (isNearBottom.value) {
		emit('needContent')
	}
})

watch(() => props.scrollToKey, (key) => {
	if (!props.sections.some((section) => section.key === key)) {
		return
	}

	let currentRowTopDistanceFromTop = 0

	for (const section of props.sections) {
		if (section.key !== key) {
			currentRowTopDistanceFromTop += props.headerHeight + section.height
			continue
		}

		break
	}

	// Section offsets are relative to the rows container, which is not
	// necessarily at the top of the scroll container - the timeline
	// renders its own header above the grid.
	const rowsContainerElement = rowsContainer.value as HTMLElement
	const containerTop = props.useWindow ? 0 : (scrollContainer.value as HTMLElement).getBoundingClientRect().top
	const scrollTop = props.useWindow ? window.scrollY : (scrollContainer.value as HTMLElement).scrollTop
	const top = scrollTop + rowsContainerElement.getBoundingClientRect().top - containerTop + currentRowTopDistanceFromTop

	logger.debug('[VirtualScrolling] Scrolling to', { top })
	scrollContainer.value.scrollTo({ top, behavior: 'smooth' })
})

function updateScrollPosition() {
	onScrollHandle ??= requestAnimationFrame(() => {
		onScrollHandle = null
		if (props.useWindow) {
			scrollPosition.value = (scrollContainer.value as Window).scrollY
		} else {
			scrollPosition.value = (scrollContainer.value as HTMLElement).scrollTop
		}
	})
}

function updateContainerSize() {
	containerHeight.value = window.innerHeight
}

onMounted(() => {
	resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const cr = entry.contentRect
			if (entry.target === scrollContainer.value) {
				containerHeight.value = cr.height
			}
			if (entry.target.classList.contains('vs-rows-container')) {
				rowsContainerHeight.value = cr.height
			}
		}
	})

	if (props.useWindow) {
		window.addEventListener('resize', updateContainerSize, { passive: true })
		containerHeight.value = window.innerHeight
	} else {
		resizeObserver.observe(scrollContainer.value as Element)
	}

	resizeObserver.observe(rowsContainer.value as Element)
	scrollContainer.value?.addEventListener('scroll', updateScrollPosition, { passive: true })
})

onBeforeUnmount(() => {
	if (props.useWindow) {
		window.removeEventListener('resize', updateContainerSize)
	}

	resizeObserver?.disconnect()
	scrollContainer.value?.removeEventListener('scroll', updateScrollPosition)
})
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
