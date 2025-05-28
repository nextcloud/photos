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
		<slot :tiled-sections="tiledSections">
			<!-- Default rendering -->
			<TiledRows :rows="tiledSections" />
		</slot>
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'

import TiledRows from './TiledRows.vue'
import logger from '../../services/logger.js'
import {
	type Section, type TiledSection,

	splitItemsInRows,
} from '../../services/TiledLayout.js'

export default {
	name: 'TiledLayout',

	components: {
		TiledRows,
	},

	props: {
		sections: {
			type: Array as PropType<Section[]>,
			required: true,
		},

		baseHeight: {
			type: Number,
			default: 200,
		},
	},

	data() {
		return {
			containerWidth: 0,
			resizeObserver: null as ResizeObserver | null,
		}
	},

	computed: {
		tiledSections(): TiledSection[] {
			logger.debug('[TiledLayout] Computing rows', { items: this.sections })

			return this.sections.map((section) => {
				const rows = splitItemsInRows(section.items, this.containerWidth, this.baseHeight)
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
				if (entry.target.classList.contains('tiled-container')) {
					this.containerWidth = cr.width
				}
			}
		})

		this.resizeObserver.observe(this.$refs.tiledLayoutContainer as Element)
	},

	beforeDestroy() {
		this.resizeObserver?.disconnect()
	},
}
</script>

<style scoped lang="scss">
.tiled-container {
	height: 100%;

	.tiled-row {
		display: flex;
	}
}
</style>
