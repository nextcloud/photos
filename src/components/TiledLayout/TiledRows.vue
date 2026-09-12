<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<ul>
		<div
			v-for="row of rows"
			:key="row.key"
			class="tiled-row"
			:style="{ height: `${row.height}px` }">
			<li
				v-for="item of row.items"
				:key="item.id"
				:style="{ width: item.ratio ? `${row.height * item.ratio}px` : '100%', height: `${row.height}px` }">
				<slot :row="row" :item="item" />
			</li>
		</div>
	</ul>
</template>

<script setup lang="ts">
import type { TiledRow } from '../../services/TiledLayout.ts'

defineProps<{
	rows: TiledRow[]
}>()
</script>

<style lang="scss" scoped>
.tiled-row {
	display: flex;
}
</style>
