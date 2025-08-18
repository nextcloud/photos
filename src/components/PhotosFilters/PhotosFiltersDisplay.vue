<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="photos-filters-display">
		<div
			v-for="filter in availableFilters"
			:key="filter.id"
			class="photos-filters-display__filter">
			<NcIconSvgWrapper :svg="filter.icon" />

			<div class="photos-filters-display__filter__options-container">
				<component
					:is="filter.renderOptionComponent"
					v-for="(value, i) in selectedFilters[filter.id]"
					:key="`${filter.id}_${i}`"
					class="photos-filters-display__filter__options-container__option"
					:value="value"
					@deselect="emit('deselect-filter', { filterId: filter.id, value })" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import filters from '../../services/PhotosFilters/index.ts'

const props = defineProps<{
	selectedFilters: Record<string, unknown[]>
}>()

const emit = defineEmits<{
	(e: 'deselect-filter', option: { filterId: string, value: unknown }): void
}>()

const availableFilters = computed(() => {
	return filters.filter((filter) => {
		const filterOptions = props.selectedFilters[filter.id]
		return filterOptions !== undefined && filterOptions.length !== 0
	})
})
</script>

<style lang="scss" scoped>
.photos-filters-display {
	&__filter {
		display: flex;
		align-items: flex-start;

		&__options-container {
			display: flex;
			flex-wrap: wrap;
			gap: 4px;

			&__option {
				margin: calc((32px - 24px) / 2) 0; // 32 is the size of the icon, 24 is the size of the option. We want to match the size of the icon.
			}
		}
	}
}
</style>
