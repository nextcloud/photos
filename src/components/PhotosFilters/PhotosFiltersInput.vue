<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div
		class="photos-filters-input"
		data-cy-photos-filters-input>
		<NcSelect
			:modelValue="null"
			:options="groupedOptions"
			:aria-label-combobox="t('photos', 'Filter by date or place')"
			:placeholder="t('photos', 'Filter by date or place')"
			:loading="loading"
			:selectable="isSelectable"
			:filter="searchFilterOptions"
			@update:modelValue="handleSelectOption">
			<template #option="option">
				<span v-if="option.heading" class="photos-filters-input__heading">
					{{ option.label }}
				</span>
				<span v-else class="photos-filters-input__option">
					<img
						v-if="option.imgSrc && !brokenPreviews.has(option.imgSrc)"
						class="photos-filters-input__option-preview"
						:src="option.imgSrc"
						alt=""
						@error="brokenPreviews.add(option.imgSrc)">
					<NcIconSvgWrapper
						v-else
						class="photos-filters-input__option-icon"
						:svg="filterIcons[option.filterId]" />
					<span class="photos-filters-input__option-label">{{ option.label }}</span>
				</span>
			</template>
		</NcSelect>
	</div>
</template>

<script lang="ts" setup>
import type { FilterOptionsEntry } from '../../services/PhotosFilters/optionGroups.ts'
import type { FilterOption } from '../../services/PhotosFilters/PhotosFilter.ts'

import { t } from '@nextcloud/l10n'
import { computed, reactive, ref } from 'vue'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import { photosFilters as filters } from '../../services/PhotosFilters/index.ts'
import { groupFilterOptions, isHeading, searchFilterOptions } from '../../services/PhotosFilters/optionGroups.ts'

const props = defineProps<{
	selectedFilters: Record<string, unknown[]>
}>()

const emit = defineEmits<{
	(e: 'selectFilter', option: FilterOption<unknown>): void
}>()

const filterIcons = Object.fromEntries(filters.map((filter) => [filter.id, filter.icon]))

const availableOptions = ref<Record<string, FilterOption<unknown>[]>>({})
const groupedOptions = computed(() => {
	const selectableOptions = Object.fromEntries(Object.entries(availableOptions.value)
		.map(([filterId, options]) => [filterId, options.filter((option) => !optionIsSelected(option))]))

	return groupFilterOptions(filters, selectableOptions)
})
const loading = ref<boolean>(true)

/** Previews that failed to load, their options fall back to the icon of the filter. */
const brokenPreviews = reactive(new Set<string>())

const getOptionsPromises = filters.map(async (filter) => {
	availableOptions.value[filter.id] = await filter.getOptions()
})

Promise.all(getOptionsPromises).then(() => {
	loading.value = false
})

/**
 * @param entry - Entry of the options list
 */
function isSelectable(entry: FilterOptionsEntry): boolean {
	return !isHeading(entry)
}

/**
 * @param option - The option picked by the user, `null` when the select is cleared
 */
async function handleSelectOption(option: FilterOption<unknown> | null): Promise<void> {
	if (option === null) {
		return
	}

	if (option.getValue !== undefined) {
		option.value = await option.getValue()
	}

	if (option.value === undefined) {
		return
	}

	emit('selectFilter', option)
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

	&__heading {
		color: var(--color-text-maxcontrast);
		font-size: var(--font-size-small, 13px);
		font-weight: bold;
	}

	&__option {
		display: flex;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		min-width: 0;
	}

	&__option-preview,
	&__option-icon {
		flex-shrink: 0;
		width: calc(var(--default-grid-baseline) * 6);
		min-width: 0;
		height: calc(var(--default-grid-baseline) * 6);
		min-height: 0;
	}

	&__option-preview {
		border-radius: var(--border-radius-small);
		object-fit: cover;
	}

	&__option-icon {
		color: var(--color-text-maxcontrast);
	}

	&__option-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

:deep(.vs__dropdown-toggle) {
	background-color: var(--color-main-background);
}
</style>

<style lang="scss">
// The options list is moved to the body, out of reach of the scoped styles.
.vs__dropdown-option--disabled:has(.photos-filters-input__heading) {
	min-height: 0;
	padding-block: calc(var(--default-grid-baseline) * 2) var(--default-grid-baseline);
	background-color: transparent;
	cursor: default;
}
</style>
