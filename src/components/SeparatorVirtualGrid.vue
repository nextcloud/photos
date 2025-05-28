<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<h2 v-if="item.injected.onThisDay" class="grid-title" :style="{ height: item.height + 'px' }">
		{{ n('photos', '{years} year ago', '{years} years ago', item.injected.onThisDay, { years: item.injected.onThisDay }) }}<span>  ·  {{ item.injected.month }} {{ item.injected.year }}</span>
	</h2>
	<h2 v-else class="grid-title" :style="{ height: item.height + 'px' }">
		{{ item.injected.month }}
		<span>{{ item.injected.year }}</span>
	</h2>
</template>

<script lang='ts'>
export default {
	name: 'SeparatorVirtualGrid',

	inheritAttrs: false,

	props: {
		item: {
			type: Object,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.grid-title {
	grid-column: 1/8;
	padding: 48px 0 12px 0;
	margin: 0;
	span {
		font-weight: normal;
	}
	&.first-title {
		padding: 0 0 12px 0;
	}
}
</style>
