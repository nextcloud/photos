<!--
 - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<LMap
		class="location-map"
		:style="{ height }"
		:class="{ 'location-map--pickable': pickable }"
		:zoom="zoom"
		:center="center"
		:options="{
			scrollWheelZoom: pickable,
			zoomControl: pickable,
			dragging: pickable,
			attributionControl: false,
		}"
		@click="onClick">
		<LTileLayer :url="url" :options="tileLayerOptions" />
		<LControlAttribution
			position="bottomright"
			:prefix="attribution" />
		<LMarker v-if="!hideMarker" :latLng="center">
			<LTooltip
				:options="{
					direction: 'top',
					permanent: 'true',
					offset: [-16, -14],
				}">
				{{ name }}
			</LTooltip>
		</LMarker>
	</LMap>
</template>

<script setup lang="ts">
import type { PhotoLocation } from '../utils/exif.ts'

import {
	LControlAttribution,
	LMap,
	LMarker,
	LTileLayer,
	LTooltip,
} from '@vue-leaflet/vue-leaflet'
import { computed } from 'vue'

import 'leaflet/dist/leaflet.css'
import '../utils/leaflet-icons.ts'

const props = withDefaults(defineProps<{
	/**
	 * The latitude of the location
	 */
	latitude: number

	/**
	 * The longitude of the location
	 */
	longitude: number

	/**
	 * Height of the map. It is set inline because the map element carries an
	 * inline height of its own, which a stylesheet cannot override.
	 */
	height?: string

	/**
	 * The name of the location
	 */
	name?: string

	/**
	 * Zoom level the map opens at
	 */
	zoom?: number

	/**
	 * Whether the marker of the location is left out
	 */
	hideMarker?: boolean

	/**
	 * Whether the map can be moved around and a location picked by clicking it
	 */
	pickable?: boolean
}>(), {
	height: '250px',
	name: '',
	// The zoom level of the map in the messages list
	zoom: 13,
	hideMarker: false,
	pickable: false,
})

const emit = defineEmits<{
	(event: 'pick', location: PhotoLocation): void
}>()

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
// Nextcloud answers every request with `Referrer-Policy: no-referrer`,
// and the tile server turns a request that carries no referrer down.
// Setting the policy on the tiles themselves overrides that for them
// alone, and the origin is all it hands out — the instance identifies
// itself without telling the tile server which page of it is open.
const tileLayerOptions = { referrerPolicy: 'strict-origin-when-cross-origin' }
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

const center = computed<[number, number]>(() => [props.latitude, props.longitude])

/** The part of a Leaflet mouse event the map reads. */
type MapClickEvent = {
	latlng: { wrap(): { lat: number, lng: number } }
}

/**
 * @param event - Click on the map
 */
function onClick(event: MapClickEvent): void {
	if (!props.pickable) {
		return
	}

	// Coordinates are wrapped around the world once the map is panned past it.
	const { lat, lng } = event.latlng.wrap()
	emit('pick', { latitude: lat, longitude: lng })
}
</script>

<style scoped lang="scss">
.location-map {
	position: relative;
	margin: 16px;
	border-radius: var(--border-radius-large);

	&--pickable {
		cursor: crosshair;
	}
}
</style>
