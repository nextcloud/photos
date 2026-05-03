<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { GridSection } from './GridLayout.ts'

defineProps<{
	rows: GridSection[]
}>()
</script>

<template>
	<ul>
		<div
			v-for="row of rows"
			:key="row.key"
			class="grid-row"
			:style="{ height: `${row.height}px` }">
			<li
				v-for="item of row.items"
				:key="item.id"
				:style="{ width: `${item.width}px`, height: `${item.height}px` }">
				<slot :row="row" :item="item" />
			</li>
		</div>
	</ul>
</template>

<style lang="scss" scoped>
.grid-row {
	display: flex;
}
</style>
