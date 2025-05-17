<template>
	<div v-if="Object.keys(filtersPreset).length !== 0"
				class="photos-filters">
				<component :is="filter.displayComponent"
					v-for="filter in filters.filter(filter => filtersPreset[filter.id] !== undefined)"
					:key="filter.id"
					class="photos-filters__filter"
					:value="filtersPreset[filter.id]"
					:data-cy-photos-filters-display="filter.id" />
			</div>
</template>

<script setup lang="ts">
defineProps<{
	filtersPreset: Record<string, unknown>;
	filters: { id: string; inputComponent: import("/home/louis/workspace/nextcloud/instances/master/apps-extra/photos/node_modules/vue/types/v3-component-public-instance").ComponentPublicInstanceConstructor; displayComponent: import("/home/louis/workspace/nextcloud/instances/master/apps-extra/photos/node_modules/vue/types/v3-component-public-instance").ComponentPublicInstanceConstructor; getQuery: (value: unknown) => string; }[];
}>()
</script>
