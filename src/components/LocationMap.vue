<!--
 - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<LMap
		class="location-map"
		:style="{ height }"
		:zoom="previewZoom"
		:center="center"
		:options="{
			scrollWheelZoom: false,
			zoomControl: false,
			dragging: false,
			attributionControl: false,
		}">
		<LTileLayer :url="url" :options="tileLayerOptions" />
		<LControlAttribution
			position="bottomright"
			:prefix="attribution" />
		<LMarker :latLng="center">
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
}>(), {
	height: '250px',
	name: '',
})

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
// Nextcloud answers every request with `Referrer-Policy: no-referrer`,
// and the tile server turns a request that carries no referrer down.
// Setting the policy on the tiles themselves overrides that for them
// alone, and the origin is all it hands out — the instance identifies
// itself without telling the tile server which page of it is open.
const tileLayerOptions = { referrerPolicy: 'strict-origin-when-cross-origin' }
// The zoom level of the map in the messages list
const previewZoom = 13
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

const center = computed<[number, number]>(() => [props.latitude, props.longitude])
</script>

<style scoped lang="scss">
.location-map {
	position: relative;
	margin: 16px;
	border-radius: var(--border-radius-large);
}
</style>
