<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<p v-if="text !== ''" class="album-description" :title="text">
		{{ text }}
	</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	/** Description of the album, a number when the DAV parser read it as one. */
	description?: string | number
}>()

const text = computed(() => String(props.description ?? '').trim())
</script>

<style lang="scss" scoped>
.album-description {
	display: -webkit-box;
	overflow: hidden;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	white-space: pre-line;
	color: var(--color-text-maxcontrast);
}
</style>
