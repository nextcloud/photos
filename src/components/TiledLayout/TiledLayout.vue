<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div
		ref="tiledLayoutContainer"
		class="tiled-container">
		<!-- Slot to allow changing the rows before passing them to TiledRows -->
		<!-- Useful for partially rendering rows like with VirtualScrolling -->
		<slot :tiledSections="tiledSections">
			<!-- Default rendering -->
			<TiledRows :rows="tiledSections" />
		</slot>
	</div>
</template>

<script setup lang="ts" generic="I extends TiledItem">
import type { Section, TiledItem, TiledSection } from '../../services/TiledLayout.ts'

import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import TiledRows from './TiledRows.vue'
import { logger } from '../../services/logger.ts'
import { splitItemsInRows } from '../../services/TiledLayout.ts'

const props = withDefaults(defineProps<{
	sections: Section<I>[]
	baseHeight?: number
}>(), {
	baseHeight: 200,
})

defineSlots<{
	default(props: { tiledSections: TiledSection<I>[] }): unknown
}>()

const tiledLayoutContainer = useTemplateRef<HTMLDivElement>('tiledLayoutContainer')

const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

const tiledSections = computed<TiledSection<I>[]>(() => {
	logger.debug('[TiledLayout] Computing rows', { items: props.sections })

	return props.sections.map((section) => {
		const rows = splitItemsInRows(section.items, containerWidth.value, props.baseHeight)
		return {
			...section,
			key: section.id,
			rows: rows.map((row) => ({ ...row, sectionKey: section.id })),
			height: rows.reduce((totalHeight, row) => totalHeight + row.height, 0),
		}
	})
})

onMounted(() => {
	resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const cr = entry.contentRect
			if (entry.target.classList.contains('tiled-container')) {
				containerWidth.value = cr.width
			}
		}
	})

	resizeObserver.observe(tiledLayoutContainer.value as Element)
})

onBeforeUnmount(() => {
	resizeObserver?.disconnect()
})
</script>

<style scoped lang="scss">
.tiled-container {
	height: 100%;

	.tiled-row {
		display: flex;
	}
}
</style>
