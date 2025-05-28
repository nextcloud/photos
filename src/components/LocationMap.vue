<!--
 - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<LMap
		class="location-map"
		:zoom="previewZoom"
		:center="center"
		:options="{
			scrollWheelZoom: false,
			zoomControl: false,
			dragging: false,
			attributionControl: false,
		}"
		@scroll.prevent="">
		<LTileLayer :url="url" />
		<LControlAttribution
			position="bottomright"
			:prefix="attribution" />
		<LMarker :lat-lng="center">
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

<script lang='ts'>
import {
	LControlAttribution,
	LMap,
	LMarker,
	LTileLayer,
	LTooltip,
} from 'vue2-leaflet'

// Leaflet icon patch
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'

export default {
	name: 'LocationMap',
	components: {
		LControlAttribution,
		LTileLayer,
		LMap,
		LMarker,
		LTooltip,
	},

	props: {
		/**
		 * The latitude of the location
		 */
		latitude: {
			type: Number,
			required: true,
		},

		/**
		 * The longitude of the location
		 */
		longitude: {
			type: Number,
			required: true,
		},

		/**
		 * The name of the location
		 */
		name: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			// The zoom level of the map in the messages list
			previewZoom: 13,
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}
	},

	computed: {
		center(): [number, number] {
			return [this.latitude, this.longitude]
		},
	},
}
</script>

<style scoped lang="scss">
.location-map {
	position: relative;
	margin: 16px;
	border-radius: var(--border-radius-large);
	height: 250px;
	width: 90%;
}
</style>
