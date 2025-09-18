<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div
		ref="gridLayoutContainer"
		class="grid-container">
		<!-- Slot to allow changing the rows before passing them to GridRows -->
		<!-- Useful for partially rendering rows like with VirtualScrolling -->
		<slot :grid-sections="gridSections">
			<!-- Default rendering -->
			<GridRows :rows="gridSections" />
		</slot>
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'

import GridRows from './GridRow.vue'
import logger from '../../services/logger.js'
import {
	type GridSection, type Section,

	splitItemsInRows,
} from './GridLayout.ts'

export default {
	name: 'GridLayout',

	components: {
		GridRows,
	},

	props: {
		sections: {
			type: Array as PropType<Section[]>,
			required: true,
		},

		itemWidth: {
			type: Number,
			default: 256,
		},

		itemHeight: {
			type: Number,
			default: 256,
		},

		gridGap: {
			type: Number,
			default: 50,
		},
	},

	data() {
		return {
			containerWidth: 0,
			resizeObserver: null as ResizeObserver | null,
		}
	},

	computed: {
		gridSections(): GridSection[] {
			logger.debug('[GridLayout] Computing rows', { items: this.sections })

			return this.sections.map((section) => {
				const rows = splitItemsInRows(section.items, this.containerWidth, this.itemWidth, this.itemHeight, this.gridGap)
				return {
					...section,
					key: section.id,
					rows: rows.map((row) => ({ ...row, sectionKey: section.id })),
					height: rows.reduce((totalHeight, row) => totalHeight + row.height, 0),
				}
			})
		},
	},

	mounted() {
		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const cr = entry.contentRect
				if (entry.target.classList.contains('grid-container')) {
					this.containerWidth = cr.width
				}
			}
		})

		this.resizeObserver.observe(this.$refs.gridLayoutContainer as Element)
	},

	beforeUnmount() {
		this.resizeObserver?.disconnect()
	},
}
</script>

<style scoped lang="scss">
.grid-container {
	height: 100%;

	.grid-row {
		display: flex;
	}
}
</style>
