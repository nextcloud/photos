<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div v-if="Object.keys(filtersValue).length !== 0"
		class="photos-filters">
		<component :is="filter.displayComponent"
			v-for="filter in filters.filter(filter => filtersValue[filter.id] !== undefined)"
			:key="filter.id"
			class="photos-filters__filter"
			:value="filtersValue[filter.id]"
			:data-cy-photos-filters-display="filter.id" />
	</div>
</template>
<script lang="ts" setup>
import filters from '../../services/PhotosFilters'

defineProps<{
	filtersValue: Record<string, unknown>
}>()
</script>
<style lang="scss" scoped>
.photos-filters {
	&__filter {
		display: flex;
		gap: 4px;
		margin: 6px 0;
	}
}
</style>
