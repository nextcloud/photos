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
		}"
		@ready="addOpenFreeMapLayer">
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
	LTooltip,
} from '@vue-leaflet/vue-leaflet'
import { computed } from 'vue'
import { addOpenFreeMapLayer, OPENFREEMAP_ATTRIBUTION } from '../utils/openFreeMap.ts'

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

// The zoom level of the map in the messages list
const previewZoom = 13
const attribution = OPENFREEMAP_ATTRIBUTION

const center = computed<[number, number]>(() => [props.latitude, props.longitude])
</script>

<style scoped lang="scss">
.location-map {
	position: relative;
	margin: 16px;
	border-radius: var(--border-radius-large);
}
</style>
