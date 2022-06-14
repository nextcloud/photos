<!--
 - @copyright Copyright (c) 2019 Louis Chemineau <louis@chmn.me>
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
	<div ref="tiledLayoutContainer"
		class="tiled-container">
		<!-- Slot to allow changing the rows before passing them to TiledRows -->
		<!-- Useful for partially rendering rows like in VirtualScrolling -->
		<slot :rows="rows">
			<!-- Default rendering -->
			<TiledRows :rows="rows" />
		</slot>
	</div>
</template>

<script>
import { splitItemsInRows } from '../services/TiledLayout.js'
import TiledRows from './TiledRows.vue'

export default {
	name: 'TiledLayout',

	components: {
		TiledRows,
	},

	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			containerWidth: 0,
			/** @type {ResizeObserver} */
			resizeObserver: null,
		}
	},

	computed: {
		/** @return {import('../services/TiledLayout').TiledRow[]} */
		rows() {
			return splitItemsInRows(this.items, this.containerWidth)
		},
	},

	mounted() {
		this.resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const cr = entry.contentRect
				if (entry.target.classList.contains('tiled-container')) {
					this.containerWidth = cr.width
				}
			}
		})

		this.resizeObserver.observe(this.$refs.tiledLayoutContainer)
	},

	beforeDestroy() {
		this.resizeObserver.disconnect()
	},
}
</script>

<style scoped lang="scss">
.photos-header {
	height: 50px;
}

.tiled-container {
	margin: 0 24px;

	.tiled-row {
		display: flex;
		justify-content: space-around;
		width: fit-content; // Prevent solitary image to be rendered in the middle because of the flex layout.
	}
}
</style>
