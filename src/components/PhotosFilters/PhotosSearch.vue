<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="photos-search" data-cy-photos-search>
		<NcTextField
			v-model="query"
			:label="t('photos', 'Search photos')"
			role="combobox"
			aria-autocomplete="list"
			:aria-expanded="isOpen ? 'true' : 'false'"
			:aria-controls="listboxId"
			:aria-activedescendant="activeSuggestion ? optionId(activeSuggestion) : undefined"
			autocomplete="off"
			:showTrailingButton="query.length > 0"
			:trailingButtonLabel="t('photos', 'Clear search')"
			@trailingButtonClick="query = ''"
			@input="open"
			@click="open"
			@focus="loadOptions"
			@blur="close"
			@keydown="handleKeydown">
			<template #icon>
				<Magnify :size="20" />
			</template>
		</NcTextField>

		<div
			v-show="isOpen"
			:id="listboxId"
			class="photos-search__listbox"
			role="listbox"
			:aria-label="t('photos', 'Search suggestions')">
			<div
				v-for="group in groups"
				:key="group.id"
				role="group"
				:aria-labelledby="`${listboxId}-${group.id}`">
				<div :id="`${listboxId}-${group.id}`" class="photos-search__group-label" role="presentation">
					{{ group.label }}
				</div>
				<div
					v-for="suggestion in group.suggestions"
					:id="optionId(suggestion)"
					:key="suggestion.id"
					class="photos-search__option"
					:class="{ 'photos-search__option--active': suggestion === activeSuggestion }"
					role="option"
					:aria-selected="suggestion === activeSuggestion ? 'true' : 'false'"
					@mousedown.prevent
					@click="pick(suggestion)">
					<img
						v-if="suggestion.imgSrc"
						class="photos-search__option-image"
						:src="suggestion.imgSrc"
						alt="">
					<NcIconSvgWrapper v-else class="photos-search__option-image" :svg="group.icon" />
					<span class="photos-search__option-label">{{ suggestion.label }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { FilterOption } from '../../services/PhotosFilters/PhotosFilter.ts'
import type { SearchSuggestion } from '../../services/PhotosFilters/searchSuggestions.ts'

import { t } from '@nextcloud/l10n'
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useRouter } from 'vue-router'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import Magnify from 'vue-material-design-icons/Magnify.vue'
import { useFetchCollections } from '../../composables/useFetchCollections.ts'
import { photosFilters as filters } from '../../services/PhotosFilters/index.ts'
import { buildSearchSuggestions, getNameOption } from '../../services/PhotosFilters/searchSuggestions.ts'
import { albumsExtraProps, albumsPrefix, useAlbumsStore } from '../../store/albums.ts'

const props = defineProps<{
	selectedFilters: Record<string, unknown[]>
}>()

const emit = defineEmits<{
	(e: 'selectFilter', option: FilterOption<unknown>): void
}>()

const router = useRouter()
const albumsStore = useAlbumsStore()
const { fetchCollections } = useFetchCollections()

const listboxId = `photos-search-${useId()}`
const query = ref('')
const expanded = ref(false)
const activeIndex = ref(-1)
const filterOptions = ref<FilterOption<unknown>[]>([])
let optionsRequested = false

const groups = computed(() => buildSearchSuggestions(query.value, filterOptions.value, Object.values(albumsStore.albums), props.selectedFilters))
const suggestions = computed(() => groups.value.flatMap((group) => group.suggestions))
const activeSuggestion = computed(() => suggestions.value[activeIndex.value])
const isOpen = computed(() => expanded.value && suggestions.value.length > 0)

watch(groups, () => {
	activeIndex.value = -1
})

watch(activeSuggestion, async (suggestion) => {
	await nextTick()
	if (suggestion) {
		document.getElementById(optionId(suggestion))?.scrollIntoView({ block: 'nearest' })
	}
})

/**
 * Fetch the options of the filters and the albums once, when the field is first used.
 */
function loadOptions() {
	if (optionsRequested) {
		return
	}
	optionsRequested = true

	for (const filter of filters) {
		filter.getOptions().then((options) => filterOptions.value.push(...options))
	}

	if (Object.keys(albumsStore.albums).length === 0) {
		fetchCollections(albumsPrefix, albumsExtraProps)
	}
}

/**
 * @param suggestion - Suggestion of the list
 */
function optionId(suggestion: SearchSuggestion): string {
	return `${listboxId}-${suggestion.id}`
}

function open() {
	loadOptions()
	expanded.value = true
}

function close() {
	expanded.value = false
	activeIndex.value = -1
}

/**
 * @param step - 1 to move down, -1 to move up, wrapping around
 */
function moveActive(step: number) {
	const count = suggestions.value.length
	if (count === 0) {
		return
	}

	activeIndex.value = activeIndex.value === -1 && step < 0
		? count - 1
		: (activeIndex.value + step + count) % count
}

/**
 * @param event - Keyboard event of the field
 */
function handleKeydown(event: KeyboardEvent) {
	switch (event.key) {
		case 'ArrowDown':
		case 'ArrowUp':
			event.preventDefault()
			if (!isOpen.value) {
				open()
				if (event.altKey) {
					return
				}
			}
			moveActive(event.key === 'ArrowDown' ? 1 : -1)
			break
		case 'Enter':
			event.preventDefault()
			if (isOpen.value && activeSuggestion.value) {
				pick(activeSuggestion.value)
			} else if (query.value.trim() !== '') {
				selectOption(getNameOption(query.value))
			}
			break
		case 'Escape':
			if (isOpen.value) {
				event.preventDefault()
				close()
			} else if (query.value !== '') {
				event.preventDefault()
				query.value = ''
			}
			break
	}
}

/**
 * @param suggestion - Picked suggestion
 */
async function pick(suggestion: SearchSuggestion) {
	if (suggestion.to !== undefined) {
		close()
		query.value = ''
		router.push(suggestion.to)
	} else if (suggestion.filterOption !== undefined) {
		await selectOption(suggestion.filterOption)
	}
}

/**
 * Add the value of a filter option, asking for it first when needed, like a custom date range.
 *
 * @param option - Option of a filter
 */
async function selectOption(option: FilterOption<unknown>) {
	close()
	query.value = ''

	const value = option.getValue !== undefined ? await option.getValue() : option.value
	if (value === undefined || props.selectedFilters[option.filterId]?.includes(value)) {
		return
	}

	emit('selectFilter', { ...option, value })
}
</script>

<style lang="scss" scoped>
.photos-search {
	position: relative;
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 2) 0;

	&__listbox {
		position: absolute;
		// Above the navigation entries, which use z-index 100 to 250.
		z-index: 300;
		inset-inline: calc(var(--default-grid-baseline) * 2);
		max-height: 50vh;
		overflow-y: auto;
		margin-top: var(--default-grid-baseline);
		padding: var(--default-grid-baseline);
		background-color: var(--color-main-background);
		border-radius: var(--border-radius-large);
		box-shadow: 0 2px 8px var(--color-box-shadow);
	}

	&__group-label {
		padding: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 2);
		color: var(--color-text-maxcontrast);
		font-weight: bold;
	}

	&__option {
		display: flex;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		min-height: var(--default-clickable-area);
		padding: 0 calc(var(--default-grid-baseline) * 2);
		border-radius: var(--border-radius-element);
		cursor: pointer;

		&:hover,
		&--active {
			background-color: var(--color-background-hover);
		}

		&--active {
			outline: 2px solid var(--color-main-text);
			outline-offset: -2px;
		}
	}

	&__option-image {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: var(--border-radius-small);
		object-fit: cover;
	}

	&__option-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
