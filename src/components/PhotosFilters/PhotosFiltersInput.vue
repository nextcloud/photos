<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="photos-filters">
		<component :is="filter.inputComponent"
			v-for="filter in filters"
			:key="filter.id"
			v-model="innerValue[filter.id]"
			:data-cy-photos-filters="filter.id"
			@update:value="newFilterValue => updateFilterValue(filter.id, newFilterValue)" />
	</div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'

import filters from '../../services/PhotosFilters'

const props = defineProps<{
	value: Record<string, unknown>
}>()

const emit = defineEmits<{
	(event: 'update:value', value: Record<string, unknown>): void
}>()

const innerValue = ref<Record<string, unknown>>({})

watch(
	() => props.value,
	(newValue) => { innerValue.value = { ...newValue } },
	{ immediate: true },
)

function updateFilterValue(filterId: string, newFilterValue: unknown) {
	emit('update:value', {
		...innerValue.value,
		[filterId]: newFilterValue,
	})
}
</script>
<style lang="scss" scoped>
.photos-filters {
	display: flex;
	align-items: center;
	gap: 16px;
	flex-wrap: wrap;
}
</style>
