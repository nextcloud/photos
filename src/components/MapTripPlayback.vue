<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<section class="trip-playback" :aria-label="t('photos', 'Trip playback')">
		<NcSelect
			v-model="source"
			class="trip-playback__source"
			:options="sources"
			:clearable="false"
			:searchable="false"
			:ariaLabelCombobox="t('photos', 'Route to play')" />

		<div class="trip-playback__controls">
			<NcButton
				variant="tertiary"
				:aria-label="t('photos', 'Previous stop')"
				:disabled="index === 0"
				@click="index--">
				<template #icon>
					<SkipPrevious :size="20" />
				</template>
			</NcButton>
			<NcButton
				v-if="!reducedMotion"
				variant="primary"
				:aria-label="playing ? t('photos', 'Pause') : t('photos', 'Play')"
				:disabled="stops.length < 2"
				@click="togglePlaying">
				<template #icon>
					<Pause v-if="playing" :size="20" />
					<Play v-else :size="20" />
				</template>
			</NcButton>
			<NcButton
				variant="tertiary"
				:aria-label="t('photos', 'Next stop')"
				:disabled="index >= lastIndex"
				@click="index++">
				<template #icon>
					<SkipNext :size="20" />
				</template>
			</NcButton>
			<NcButton
				v-if="!reducedMotion"
				variant="tertiary"
				:aria-label="t('photos', 'Playback speed: {speed}×', { speed })"
				@click="speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]">
				{{ speed }}×
			</NcButton>
		</div>

		<input
			v-model.number="index"
			class="trip-playback__scrubber"
			type="range"
			min="0"
			:max="lastIndex"
			:disabled="stops.length < 2"
			:aria-label="t('photos', 'Position on the route')"
			:aria-valuetext="position">
		<span class="trip-playback__position" :aria-live="playing ? 'off' : 'polite'">
			{{ position }}
		</span>

		<NcButton
			class="trip-playback__close"
			variant="tertiary"
			:aria-label="t('photos', 'Close trip playback')"
			@click="emit('close')">
			<template #icon>
				<Close :size="20" />
			</template>
		</NcButton>
	</section>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { MapCluster } from '../utils/mapClusters.ts'

import { t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import L from 'leaflet'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import Close from 'vue-material-design-icons/Close.vue'
import Pause from 'vue-material-design-icons/Pause.vue'
import Play from 'vue-material-design-icons/Play.vue'
import SkipNext from 'vue-material-design-icons/SkipNext.vue'
import SkipPrevious from 'vue-material-design-icons/SkipPrevious.vue'
import { detectTrips } from '../services/memories.ts'
import { formatDate, formatDateRange } from '../utils/dateUtils.ts'
import { buildRoute, getStepDuration } from '../utils/tripRoute.ts'

type Source = {
	id: string
	label: string
	/** The photos of a trip, left out for the photos the map is showing. */
	photos?: PhotoFile[]
}

const props = defineProps<{
	/** The map to play the route on. */
	map: L.Map
	/** The geotagged photos routes are made of. */
	photos: PhotoFile[]
	getCoordinates: (photo: PhotoFile) => [number, number]
	createIcon: (stop: MapCluster<PhotoFile>) => L.DivIcon
}>()

const emit = defineEmits<{
	close: []
}>()

const SPEEDS = [0.5, 1, 2, 4]

/** Number of stops above which a route is simplified. */
const MAX_STOPS = 150

/** Closest zoom level the map follows the route at. */
const FOLLOW_MAX_ZOOM = 15

/** Space in pixels kept between the route and the edges of the map. */
const FOLLOW_PADDING = L.point(96, 96)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const visibleSource: Source = { id: 'visible', label: t('photos', 'What is visible') }
const sources = computed<Source[]>(() => [
	visibleSource,
	...detectTrips(props.photos).map((trip) => ({
		id: trip.id,
		label: formatDateRange(new Date(trip.startTimestamp * 1000), new Date(trip.endTimestamp * 1000)),
		photos: trip.photos,
	})),
])

const source = shallowRef<Source>(visibleSource)
const stops = shallowRef<MapCluster<PhotoFile>[]>([])
const index = ref(0)
const playing = ref(false)
const speed = ref(1)

const lastIndex = computed(() => Math.max(stops.value.length - 1, 0))
const position = computed(() => {
	const stop = stops.value[index.value]
	if (!stop) {
		return t('photos', 'No geotagged photos')
	}

	return t('photos', 'Stop {current} of {total} · {date}', {
		current: index.value + 1,
		total: stops.value.length,
		date: formatDate(new Date(stop.items[0].attributes.timestamp * 1000)),
	})
})

const line = L.polyline([], { className: 'photos-map-route', interactive: false }).addTo(props.map)
let marker: L.Marker | undefined

// The photos the map is showing are taken when the route is chosen, as the
// map moves away from them while the route is played.
watch(source, () => {
	const area = props.map.getBounds()
	const photos = source.value.photos
		?? props.photos.filter((photo) => area.contains(props.getCoordinates(photo)))

	playing.value = false
	index.value = 0
	stops.value = buildRoute(photos, props.getCoordinates, MAX_STOPS)

	if (reducedMotion && stops.value.length > 0) {
		props.map.fitBounds(L.latLngBounds(stops.value.map((stop) => stop.latLng)), {
			animate: false,
			padding: FOLLOW_PADDING,
			maxZoom: FOLLOW_MAX_ZOOM,
		})
	}
}, { immediate: true })

watch([stops, index], () => {
	const stop = stops.value[index.value]

	// The route grows as it is travelled, or is drawn whole when it is stepped through.
	line.setLatLngs(stops.value.slice(0, reducedMotion ? undefined : index.value + 1).map(({ latLng }) => latLng))
	marker?.remove()
	marker = undefined
	if (!stop) {
		return
	}

	marker = L.marker(stop.latLng, { icon: props.createIcon(stop) })
		.on('click', () => {
			playing.value = false
			getViewer().open(stop.items, stop.items[0])
		})
		.addTo(props.map)
	follow(stop)
}, { immediate: true })

watch([playing, index, speed, stops], (_new, _old, onCleanup) => {
	if (!playing.value) {
		return
	}

	if (index.value >= lastIndex.value) {
		playing.value = false
		return
	}

	const timer = setTimeout(() => index.value++, getStepDuration(stops.value.length, speed.value))
	onCleanup(() => clearTimeout(timer))
})

onBeforeUnmount(() => {
	line.remove()
	marker?.remove()
})

/**
 * Move the map to the given stop, at a zoom level showing the stops before
 * and after it too.
 *
 * @param stop - The stop the route has reached
 */
function follow(stop: MapCluster<PhotoFile>): void {
	if (reducedMotion) {
		if (!props.map.getBounds().contains(stop.latLng)) {
			props.map.panTo(stop.latLng, { animate: false })
		}
		return
	}

	const around = L.latLngBounds(stops.value.slice(Math.max(index.value - 1, 0), index.value + 2).map(({ latLng }) => latLng))
	const zoom = Math.min(FOLLOW_MAX_ZOOM, props.map.getBoundsZoom(around, false, FOLLOW_PADDING))
	const duration = getStepDuration(stops.value.length, speed.value) / 1000

	// Zooming at every stop would be restless, so the zoom level is kept
	// while it is close to the one the surrounding stops ask for.
	if (Math.abs(zoom - props.map.getZoom()) <= 1) {
		props.map.panTo(stop.latLng, { duration: Math.min(duration, 0.5) })
	} else {
		props.map.flyTo(stop.latLng, zoom, { duration })
	}
}

/**
 * Start or pause the playback, from the first stop again once the route ended.
 */
function togglePlaying(): void {
	if (!playing.value && index.value >= lastIndex.value) {
		index.value = 0
	}
	playing.value = !playing.value
}
</script>

<style lang="scss" scoped>
.trip-playback {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 2);
	padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 3);
	border-top: 1px solid var(--color-border);
	background-color: var(--color-main-background);

	&__source {
		flex: 0 1 260px;
		min-width: 200px;
		margin: 0;
	}

	&__controls {
		display: flex;
		gap: var(--default-grid-baseline);
	}

	&__scrubber {
		flex: 1 1 160px;
		min-width: 120px;
		accent-color: var(--color-primary-element);
	}

	&__position {
		color: var(--color-text-maxcontrast);
		font-variant-numeric: tabular-nums;
	}

	&__close {
		margin-inline-start: auto;
	}
}

:global(.photos-map-route) {
	stroke: var(--color-primary-element);
	stroke-width: 4;
}
</style>
