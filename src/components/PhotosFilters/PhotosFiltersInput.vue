<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div
		class="photos-filters-input"
		data-cy-photos-filters-input>
		<NcSelect
			class="places-select"
			:options="availableOptionsWithSelection"
			:aria-label-combobox="t('photos', 'Select filters')"
			:placeholder="t('photos', 'Select filters')"
			:loading="loading"
			:multiple="true"
			@option:selected="handleSelectOptions">
			<template #option="option">
				<NcListItemIcon
					:name="option.label"
					:is-no-user="true"
					:url="option.imgSrc" />
			</template>
		</NcSelect>
	</div>
</template>

<script lang="ts" setup>
import type { FilterOption } from '../../services/PhotosFilters/PhotosFilter.ts'

import { t } from '@nextcloud/l10n'
import { computed, ref } from 'vue'
import NcListItemIcon from '@nextcloud/vue/components/NcListItemIcon'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import filters from '../../services/PhotosFilters/index.ts'

const props = defineProps<{
	selectedFilters: Record<string, unknown[]>
}>()

const emit = defineEmits<{
	(e: 'select-filter', option: FilterOption<unknown>): void
}>()

const availableOptions = ref<FilterOption<unknown>[]>([])
const availableOptionsWithSelection = computed(() => availableOptions.value.filter((option) => !optionIsSelected(option)))
const loading = ref<boolean>(true)

const getOptionsPromises = filters.map(async (filter) => {
	const options = await filter.getOptions()
	availableOptions.value.push(...options)
})

Promise.all(getOptionsPromises).then(() => {
	loading.value = false
})

function handleSelectOptions(options: FilterOption<unknown>[]): void {
	options.forEach(async (option) => {
		if (option.getValue !== undefined) {
			option.value = await option.getValue()
		}

		if (option.value === undefined) {
			return
		}

		emit('select-filter', option)
	})
}

function optionIsSelected(option: FilterOption<unknown>): boolean {
	return props.selectedFilters[option.filterId]?.includes(option.value)
}
</script>

<style lang="scss" scoped>
.photos-filters-input {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px 8px 0 8px;
}

:deep(.vs__dropdown-toggle) {
	background-color: var(--color-main-background);
}
</style>
