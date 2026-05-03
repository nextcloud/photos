<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-map">
		<HeaderNavigation
			key="navigation"
			:loading="loadingFiles"
			path="/"
			:title="rootTitle"
			:rootTitle="rootTitle"
			@refresh="refresh" />

		<NcEmptyContent
			v-if="!loadingFiles && geotaggedPhotos.length === 0"
			class="photos-map__empty"
			:name="t('photos', 'No geotagged photos')"
			:description="t('photos', 'Photos with GPS metadata will appear here. Take more photos with location enabled, or scroll the timeline first to load more.')">
			<template #icon>
				<MapMarkerOutline />
			</template>
		</NcEmptyContent>

		<LMap
			v-else
			class="photos-map__map"
			:zoom="initialZoom"
			:center="initialCenter"
			:options="{ scrollWheelZoom: true, attributionControl: false }">
			<LTileLayer
				:url="tileUrl"
				:attribution="osmAttribution" />
			<LControlAttribution
				position="bottomright"
				:prefix="osmAttribution" />
			<!--
				Plain LMarker per photo. With very large libraries (~5000+
				geotagged photos) this becomes slow; switch to
				leaflet.markercluster as a follow-up if real-world libraries
				exceed that. For now the simple approach keeps the page
				dependency-light.
			-->
			<LMarker
				v-for="photo in geotaggedPhotos"
				:key="photo.fileid"
				:latLng="latLng(photo)"
				@click="openPhoto(photo)" />
		</LMap>
	</div>
</template>

<script lang="ts">
import type { PhotoFile } from '../store/files.ts'

import { translate as t } from '@nextcloud/l10n'
import {
	LControlAttribution,
	LMap,
	LMarker,
	LTileLayer,
} from '@vue-leaflet/vue-leaflet'
import { defineComponent } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import { allMimes } from '../services/AllowedMimes.ts'
import { toViewerFileInfo } from '../utils/fileUtils.ts'

// Leaflet icon patch
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'

type Gps = { latitude: string | number, longitude: string | number, altitude?: string | number }

export default defineComponent({
	name: 'MapView',

	components: {
		HeaderNavigation,
		LControlAttribution,
		LMap,
		LMarker,
		LTileLayer,
		MapMarkerOutline,
		NcEmptyContent,
	},

	mixins: [FetchFilesMixin],

	props: {
		rootTitle: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			osmAttribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		// Photos with valid lat/lng metadata. The server stores GPS as
		// `{ latitude, longitude, altitude }` strings; we coerce to
		// numbers and drop entries that didn't parse.
		geotaggedPhotos(): PhotoFile[] {
			return Object.values(this.files).filter((file: PhotoFile) => {
				const gps = (file.attributes as Record<string, unknown>)['metadata-photos-gps'] as Gps | undefined
				if (!gps) {
					return false
				}
				const lat = Number(gps.latitude)
				const lng = Number(gps.longitude)
				return Number.isFinite(lat) && Number.isFinite(lng)
					&& !(lat === 0 && lng === 0) // Drop the (0,0) fallback off the African coast
			})
		},

		// Center on the centroid of the first batch of geotagged photos
		// when possible; otherwise show the world.
		initialCenter(): [number, number] {
			if (this.geotaggedPhotos.length === 0) {
				return [20, 0]
			}
			const sample = this.geotaggedPhotos.slice(0, 200)
			const sumLat = sample.reduce((sum, photo) => sum + this.latLng(photo)[0], 0)
			const sumLng = sample.reduce((sum, photo) => sum + this.latLng(photo)[1], 0)
			return [sumLat / sample.length, sumLng / sample.length]
		},

		initialZoom(): number {
			return this.geotaggedPhotos.length === 0 ? 2 : 4
		},
	},

	async mounted() {
		// Load a generous batch on first visit so the map isn't empty.
		if (Object.keys(this.files).length === 0) {
			await this.fetchFiles({ mimesType: allMimes, nbResults: 500 })
		}
	},

	methods: {
		t,

		refresh() {
			this.resetFetchFilesState()
			this.fetchFiles({ mimesType: allMimes, nbResults: 500 })
		},

		latLng(photo: PhotoFile): [number, number] {
			const gps = (photo.attributes as Record<string, unknown>)['metadata-photos-gps'] as Gps
			return [Number(gps.latitude), Number(gps.longitude)]
		},

		openPhoto(photo: PhotoFile) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(photo),
				list: this.geotaggedPhotos.map((p) => toViewerFileInfo(p)),
				onClose() { window.OCA.Files.Sidebar.close() },
			})
		},
	},
})
</script>

<style lang="scss" scoped>
.photos-map {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__map {
		flex: 1;
		min-height: 0;
		// Match the rest of the photos UI which uses no rounded edges
		// at the page-level — leaflet renders with rounded corners by
		// default if a parent does.
		border: none;
	}

	&__empty {
		flex: 1;
	}
}
</style>
