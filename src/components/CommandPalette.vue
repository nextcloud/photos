<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcModal
		:name="t('photos', 'Quick navigation')"
		size="normal"
		@close="emit('close')">
		<div class="command-palette" @keydown="onKeyDown">
			<div class="command-palette__field">
				<NcTextField
					ref="input"
					v-model="query"
					role="combobox"
					aria-autocomplete="list"
					aria-expanded="true"
					:aria-controls="listId"
					:aria-activedescendant="results.length > 0 ? optionId(activeIndex) : undefined"
					autocomplete="off"
					:label="t('photos', 'Go to a view, album, place or date, or run an action')">
					<template #icon>
						<Magnify :size="20" />
					</template>
				</NcTextField>
			</div>

			<ul
				:id="listId"
				ref="list"
				class="command-palette__list"
				role="listbox"
				:aria-label="t('photos', 'Quick navigation')">
				<li
					v-for="(command, index) in results"
					:id="optionId(index)"
					:key="command.id"
					class="command-palette__option"
					:class="{ 'command-palette__option--active': index === activeIndex }"
					role="option"
					:aria-selected="index === activeIndex"
					@mousemove="activeIndex = index"
					@click="run(command)">
					<span class="command-palette__label">{{ command.label }}</span>
					<span class="command-palette__kind">{{ command.kind }}</span>
				</li>
			</ul>

			<p class="command-palette__status" :class="{ 'hidden-visually': results.length > 0 }" aria-live="polite">
				{{ results.length > 0
					? n('photos', '{count} result', '{count} results', results.length, { count: results.length })
					: t('photos', 'No results') }}
			</p>
		</div>
	</NcModal>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { GridDensity } from '../store/userConfig.ts'
import type { RankableCommand } from '../utils/commandPalette.ts'

import { emit as emitEvent } from '@nextcloud/event-bus'
import { getCanonicalLocale, n, t } from '@nextcloud/l10n'
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NcModal from '@nextcloud/vue/components/NcModal'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import Magnify from 'vue-material-design-icons/Magnify.vue'
import { useFetchCollections } from '../composables/useFetchCollections.ts'
import { useFetchFaces } from '../composables/useFetchFaces.ts'
import { useGridDensity } from '../composables/useGridDensity.ts'
import { areTagsInstalled } from '../services/AreTagsInstalled.ts'
import { isRecognizeInstalled } from '../services/IsRecognizeInstalled.ts'
import { dateRangeFilterId } from '../services/PhotosFilters/dateRangeFilter.ts'
import { albumsExtraProps, albumsPrefix, useAlbumsStore } from '../store/albums.ts'
import { useFacesStore } from '../store/faces.ts'
import { useFilterStore } from '../store/filters.ts'
import { placesPrefix, usePlacesStore } from '../store/places.ts'
import { parseDateQuery, rankCommands } from '../utils/commandPalette.ts'
import { formatMonthAndYear } from '../utils/dateUtils.ts'

type Command = RankableCommand & {
	id: string
	/** What the command is, shown next to its label. */
	kind: string
	run: () => void
}

const props = defineProps<{
	/** Opens the settings of the app, called once the palette is closed. */
	openSettings: () => void
}>()

const emit = defineEmits<{
	close: []
}>()

/** Routes showing a timeline the date filter applies to. */
const FILTERABLE_ROUTES = ['all_media', 'photos', 'videos']
/** Routes showing a timeline a slideshow can be started from. */
const TIMELINE_ROUTES = [...FILTERABLE_ROUTES, 'favorites', 'thisday']

const route = useRoute()
const router = useRouter()
const albumsStore = useAlbumsStore()
const placesStore = usePlacesStore()
const facesStore = useFacesStore()
const filtersStore = useFilterStore()
const { setGridDensity } = useGridDensity()
const { fetchCollections } = useFetchCollections()
// The composable fetches the people on its own once the palette mounts.
if (isRecognizeInstalled) {
	useFetchFaces()
}

const listId = useId()
const input = useTemplateRef<InstanceType<typeof NcTextField>>('input')
const list = useTemplateRef<HTMLUListElement>('list')

const query = ref('')
const activeIndex = ref(0)

/**
 * @param label - Name of the view
 * @param to - Route of the view
 */
function viewCommand(label: string, to: RouteLocationRaw): Command {
	return { id: `view:${label}`, label, kind: t('photos', 'View'), run: () => router.push(to) }
}

/**
 * @param density - Tile density to switch to
 * @param label - Label of the action
 */
function densityCommand(density: GridDensity, label: string): Command {
	return {
		id: `density:${density}`,
		label,
		kind: t('photos', 'Action'),
		keywords: [t('photos', 'Density')],
		run: () => setGridDensity(density),
	}
}

const staticCommands = computed<Command[]>(() => [
	viewCommand(t('photos', 'All media'), { name: 'all_media' }),
	viewCommand(t('photos', 'Photos'), { name: 'photos' }),
	viewCommand(t('photos', 'Videos'), { name: 'videos' }),
	viewCommand(t('photos', 'Albums'), { name: 'albums' }),
	viewCommand(t('photos', 'Collaborative albums'), { name: 'sharedAlbums' }),
	...(isRecognizeInstalled ? [viewCommand(t('photos', 'People'), { name: 'faces' })] : []),
	viewCommand(t('photos', 'Folders'), { name: 'folders' }),
	viewCommand(t('photos', 'Favorites'), { name: 'favorites' }),
	viewCommand(t('photos', 'On this day'), { name: 'thisday' }),
	viewCommand(t('photos', 'Memories'), { name: 'memories' }),
	viewCommand(t('photos', 'Shared with you'), { name: 'shared' }),
	...(areTagsInstalled ? [viewCommand(t('photos', 'Tags'), { name: 'tags' })] : []),
	viewCommand(t('photos', 'Places'), { name: 'places' }),
	viewCommand(t('photos', 'Map'), { name: 'map' }),
	...(TIMELINE_ROUTES.includes(route.name as string)
		? [{
				id: 'slideshow',
				label: t('photos', 'Start slideshow'),
				kind: t('photos', 'Action'),
				run: () => emitEvent('photos:start-slideshow'),
			}]
		: []),
	{
		id: 'settings',
		label: t('photos', 'Photos settings'),
		kind: t('photos', 'Action'),
		run: () => props.openSettings(),
	},
	densityCommand('small', t('photos', 'Use small tiles')),
	densityCommand('medium', t('photos', 'Use default tile size')),
	densityCommand('large', t('photos', 'Use large tiles')),
])

const collectionCommands = computed<Command[]>(() => [
	...Object.values(albumsStore.albums).map((album) => ({
		id: `album:${album.basename}`,
		label: album.basename,
		kind: t('photos', 'Album'),
		run: () => router.push({ name: 'albumsContent', params: { albumName: album.basename } }),
	})),
	...Object.values(placesStore.places).map((place) => ({
		id: `place:${place.basename}`,
		label: place.basename,
		kind: t('photos', 'Place'),
		run: () => router.push({ name: 'placesContent', params: { placeName: place.basename } }),
	})),
	...Object.values(facesStore.faces).map((face) => ({
		id: `face:${face.basename}`,
		label: face.basename,
		kind: t('photos', 'Person'),
		run: () => router.push({ name: 'facecontent', params: { faceName: face.basename } }),
	})),
])

const dateCommand = computed<Command | null>(() => {
	const date = parseDateQuery(query.value, [getCanonicalLocale(), 'en'])
	if (date === null) {
		return null
	}

	const label = date.month === undefined
		? `${date.year}`
		: formatMonthAndYear(new Date(date.year, date.month))

	return {
		id: 'date',
		label: t('photos', 'Photos from {date}', { date: label }),
		kind: t('photos', 'Date'),
		async run() {
			// Leaving a timeline clears its filters, so the new one is set once there.
			if (!FILTERABLE_ROUTES.includes(route.name as string)) {
				await router.push({ name: 'all_media' })
			}
			filtersStore.selectedFilters[dateRangeFilterId] = [date.range]
		},
	}
})

// Albums, places and people are only found by name, the views and actions
// are what is offered before anything is typed.
const results = computed<Command[]>(() => {
	if (query.value.trim() === '') {
		return staticCommands.value
	}
	const ranked = rankCommands(query.value, [...staticCommands.value, ...collectionCommands.value])
	return dateCommand.value === null ? ranked : [dateCommand.value, ...ranked]
})

watch(results, () => {
	activeIndex.value = 0
})

watch(activeIndex, async () => {
	await nextTick()
	list.value?.querySelector('.command-palette__option--active')?.scrollIntoView({ block: 'nearest' })
})

/**
 * @param index - Position of an option in the list
 */
function optionId(index: number): string {
	return `${listId}-option-${index}`
}

/**
 * Close the palette before running the command, so that what the command
 * opens does not lose the focus to the closing palette.
 *
 * @param command - The command to run
 */
async function run(command: Command): Promise<void> {
	emit('close')
	await nextTick()
	command.run()
}

/**
 * @param event - The key press to handle
 */
function onKeyDown(event: KeyboardEvent): void {
	const count = results.value.length

	if (event.key === 'Escape') {
		// The modal does not get the presses made in a field.
		emit('close')
	} else if (count === 0) {
		return
	} else if (event.key === 'ArrowDown') {
		activeIndex.value = (activeIndex.value + 1) % count
	} else if (event.key === 'ArrowUp') {
		activeIndex.value = (activeIndex.value - 1 + count) % count
	} else if (event.key === 'Enter') {
		run(results.value[activeIndex.value])
	} else {
		return
	}
	event.preventDefault()
}

onMounted(async () => {
	input.value?.focus()
	// One at a time, the fetcher ignores a call made while another is running.
	await fetchCollections(albumsPrefix, albumsExtraProps)
	await fetchCollections(placesPrefix)
})
</script>

<style lang="scss" scoped>
.command-palette {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 2);
	padding: calc(var(--default-grid-baseline) * 3);

	// Room for the close button of the modal next to the field.
	&__field {
		margin-inline-end: var(--default-clickable-area);
	}

	&__list {
		max-height: min(50vh, 400px);
		overflow-y: auto;
	}

	&__option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: calc(var(--default-grid-baseline) * 2);
		min-height: var(--default-clickable-area);
		padding: 0 calc(var(--default-grid-baseline) * 3);
		border-radius: var(--border-radius-element, var(--border-radius-large));
		cursor: pointer;

		&--active {
			background-color: var(--color-primary-element-light);
			color: var(--color-primary-element-light-text);
		}
	}

	&__label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__kind {
		flex-shrink: 0;
		color: var(--color-text-maxcontrast);
	}

	&__status {
		padding: calc(var(--default-grid-baseline) * 3);
		color: var(--color-text-maxcontrast);
		text-align: center;
	}
}
</style>
