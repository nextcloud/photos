<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-map">
		<HeaderNavigation
			key="navigation"
			:loading="loading"
			path="/"
			:title="rootTitle"
			:root-title="rootTitle"
			@refresh="loadPhotos">
			<NcButton
				v-if="isMapsInstalled"
				:href="mapsAppUrl"
				target="_blank">
				<template #icon>
					<MapIcon :size="20" />
				</template>
				{{ t('photos', 'Open the Maps app') }}
			</NcButton>
		</HeaderNavigation>

		<NcEmptyContent
			v-if="geotaggedPhotos.length === 0"
			class="photos-map__empty-content empty-content-with-illustration"
			:name="loading ? t('photos', 'Looking for geotagged photos…') : t('photos', 'No geotagged photos')"
			:description="t('photos', 'Photos taken with a device recording its location are shown on this map.')">
			<template #icon>
				<EmptyIllustration variant="map" />
			</template>
		</NcEmptyContent>

		<LMap
			v-else
			class="photos-map__map"
			:zoom="zoom"
			:center="center"
			:options="{ attributionControl: false }">
			<LTileLayer :url="tileServerUrl" />
			<LControlAttribution position="bottomright" :prefix="attribution" />
			<!--
				One marker per photo: libraries with more than a few thousand
				geotagged photos would need clustering to stay responsive.
			-->
			<LMarker
				v-for="photo in geotaggedPhotos"
				:key="photo.fileid"
				:lat-lng="getCoordinates(photo)"
				:options="{ title: photo.basename }"
				@click="openPhoto(photo)" />
		</LMap>
	</div>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'

import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onMounted, ref, watch } from 'vue'
import {
	LControlAttribution,
	LMap,
	LMarker,
	LTileLayer,
} from 'vue2-leaflet'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import MapIcon from 'vue-material-design-icons/Map.vue'
import EmptyIllustration from '../components/EmptyIllustration.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import isMapsInstalled from '../services/IsMapsInstalled.ts'
import { toViewerFileInfo } from '../utils/fileUtils.ts'

// Leaflet icon patch
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'

defineProps<{
	rootTitle: string
}>()

/** Number of photos used to compute the initial center of the map. */
const CENTER_SAMPLE_SIZE = 200

const tileServerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const mapsAppUrl = generateUrl('/apps/maps')

const { photos, loading, loadPhotos } = useLoadedPhotos()

const geotaggedPhotos = computed<PhotoFile[]>(() => photos.value.filter((photo) => {
	const [latitude, longitude] = getCoordinates(photo)
	return Number.isFinite(latitude) && Number.isFinite(longitude)
		// Photos without GPS metadata sometimes carry a null island position.
		&& !(latitude === 0 && longitude === 0)
}))

const center = ref<[number, number]>([20, 0])
const zoom = ref(2)

// The view is centered on the photos loaded first, and left alone afterwards so
// that the map does not move under the user while more photos are coming in.
watch(geotaggedPhotos, (newPhotos, previousPhotos) => {
	if (newPhotos.length === 0 || (previousPhotos?.length ?? 0) > 0) {
		return
	}

	const sample = newPhotos.slice(0, CENTER_SAMPLE_SIZE).map((photo) => getCoordinates(photo))
	center.value = [
		sample.reduce((sum, [latitude]) => sum + latitude, 0) / sample.length,
		sample.reduce((sum, [, longitude]) => sum + longitude, 0) / sample.length,
	]
	zoom.value = 4
}, { immediate: true })

onMounted(() => {
	if (photos.value.length === 0) {
		loadPhotos()
	}
})

/**
 * @param photo - The photo to get the coordinates of
 * @return The latitude and longitude, `NaN` if the photo has no GPS metadata
 */
function getCoordinates(photo: PhotoFile): [number, number] {
	const gps = photo.attributes['metadata-photos-gps']
	return [Number(gps?.latitude), Number(gps?.longitude)]
}

/**
 * @param photo - The photo to open in the viewer
 */
function openPhoto(photo: PhotoFile): void {
	window.OCA.Viewer.open({
		fileInfo: toViewerFileInfo(photo),
		list: geotaggedPhotos.value.map((geotaggedPhoto) => toViewerFileInfo(geotaggedPhoto)),
	})
}
</script>

<style lang="scss" scoped>
.photos-map {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__empty-content,
	&__map {
		flex: 1;
		min-height: 0;
	}
}

// The illustration stands in for the icon, so it must not be held to the icon size.
.empty-content-with-illustration :deep(.empty-content__icon) {
	width: 220px;
	height: auto;
	opacity: 1;

	svg {
		width: 100% !important;
		height: auto !important;
		max-width: none !important;
		max-height: none !important;
	}
}
</style>
