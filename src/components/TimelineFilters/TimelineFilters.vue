<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="timeline-filters">
		<component :is="filter.component"
			v-for="filter in filters"
			:key="filter.id"
			v-model="innerValue[filter.id]"
			:data-cy-timeline-filters="filter.id"
			@input="emit('input', innerValue)" />
	</div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'

import filters from '../../services/TimelineFilters'

const props = defineProps<{
	value: Record<string, unknown>
}>()

const emit = defineEmits<{
	(event: 'input', value: Record<string, unknown>): void
}>()

const innerValue = ref<Record<string, unknown>>({})

watch(
	() => props.value,
	(newValue) => { innerValue.value = newValue },
	{ deep: true, immediate: true },
)
</script>
<style lang="scss" scoped>
.timeline-filters {
	display: flex;
	align-items: center;
	gap: 16px;
}
</style>
