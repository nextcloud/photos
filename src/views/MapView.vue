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
			:rootTitle="rootTitle"
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
			v-model:zoom="zoom"
			:useGlobalLeaflet="true"
			class="photos-map__map"
			:center="center"
			:options="{ attributionControl: false }"
			@ready="onMapReady"
			@update:bounds="bounds = $event">
			<LTileLayer :url="tileServerUrl" :options="TILE_LAYER_OPTIONS" />
			<LControlAttribution position="bottomright" :prefix="attribution" />
			<LMarker
				v-for="marker in visibleMarkers"
				:key="marker.cluster.items[0].fileid"
				:latLng="marker.cluster.latLng"
				:icon="marker.icon"
				:options="{ riseOnHover: true }"
				@click="onMarkerClick(marker.cluster.items[0].fileid)" />
		</LMap>
	</div>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { MapCluster } from '../utils/mapClusters.ts'

import { n, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { getViewer } from '@nextcloud/viewer'
import {
	LControlAttribution,
	LMap,
	LMarker,
	LTileLayer,
} from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import MapIcon from 'vue-material-design-icons/Map.vue'
import EmptyIllustration from '../components/EmptyIllustration.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import { isMapsInstalled } from '../services/IsMapsInstalled.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'
import { clusterMarkers } from '../utils/mapClusters.ts'

import 'leaflet/dist/leaflet.css'

defineProps<{
	rootTitle: string
}>()

/** Number of photos used to compute the initial center of the map. */
const CENTER_SAMPLE_SIZE = 200

/** Size of a marker in pixels. */
const MARKER_SIZE = 48

/** Distance in pixels below which photos share a marker. */
const CLUSTER_RADIUS = 56

/** Size of the thumbnails, the one the timeline loads first so it is usually cached. */
const THUMBNAIL_SIZE = 64

/** Share of the visible area added around it in which markers are rendered. */
const VIEWPORT_PADDING = 0.25

const tileServerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const mapsAppUrl = generateUrl('/apps/maps')

/**
 * Nextcloud answers every request with `Referrer-Policy: no-referrer`, and the
 * tile server turns a request that carries no referrer down. Setting the policy
 * on the tiles themselves overrides that for them alone, and the origin is all
 * it hands out — the instance identifies itself without telling the tile server
 * which page of it the photos are being looked at from.
 */
const TILE_LAYER_OPTIONS = { referrerPolicy: 'strict-origin-when-cross-origin' }

const { photos, loading, loadPhotos } = useLoadedPhotos()

const geotaggedPhotos = computed<PhotoFile[]>(() => photos.value.filter((photo) => {
	const [latitude, longitude] = getCoordinates(photo)
	return Number.isFinite(latitude) && Number.isFinite(longitude)
		// Photos without GPS metadata sometimes carry a null island position.
		&& !(latitude === 0 && longitude === 0)
}))

const center = ref<[number, number]>([20, 0])
const zoom = ref(2)
const map = shallowRef<L.Map>()
const bounds = shallowRef<L.LatLngBounds>()

const clusters = computed(() => clusterMarkers(geotaggedPhotos.value, getCoordinates, zoom.value, CLUSTER_RADIUS))
const icons = new WeakMap<MapCluster<PhotoFile>, L.DivIcon>()

// Only the markers around the visible area are rendered, and their thumbnails
// loaded, so that the map stays responsive however many places the photos
// were taken at.
const visibleMarkers = computed(() => {
	const area = bounds.value?.pad(VIEWPORT_PADDING)
	if (!area) {
		return []
	}

	return clusters.value
		.filter((cluster) => area.contains(cluster.latLng))
		.map((cluster) => {
			const icon = icons.get(cluster) ?? createIcon(cluster)
			icons.set(cluster, icon)
			return { cluster, icon }
		})
})

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
 * @param leafletMap - The map, once it is created
 */
function onMapReady(leafletMap: L.Map): void {
	map.value = leafletMap
	bounds.value = leafletMap.getBounds()
}

/**
 * A rounded thumbnail of the first photo of the cluster, with the number of
 * photos it holds when there is more than one.
 *
 * @param cluster - The cluster to create the icon of
 */
function createIcon(cluster: MapCluster<PhotoFile>): L.DivIcon {
	const [photo] = cluster.items
	const label = cluster.items.length > 1
		? n('photos', '%n photo', '%n photos', cluster.items.length)
		: photo.basename

	const thumbnail = document.createElement('img')
	thumbnail.className = 'photos-map-marker__thumbnail'
	thumbnail.src = getPreviewUrl(photo, THUMBNAIL_SIZE)
	thumbnail.alt = label
	thumbnail.title = label
	thumbnail.decoding = 'async'

	const content = document.createElement('div')
	content.append(thumbnail)

	if (cluster.items.length > 1) {
		const count = document.createElement('span')
		count.className = 'photos-map-marker__count'
		count.textContent = String(cluster.items.length)
		count.setAttribute('aria-hidden', 'true')
		content.append(count)
	}

	return L.divIcon({
		html: content,
		className: 'photos-map-marker',
		iconSize: [MARKER_SIZE, MARKER_SIZE],
	})
}

/**
 * Open a single photo in the viewer. Zoom in on a cluster until its photos
 * are told apart, or open them in the viewer when zooming in would not split it.
 *
 * The cluster is looked up from its first photo because Leaflet keeps calling
 * the listener a marker was created with, while the marker is reused for the
 * cluster starting from the same photo at every zoom level.
 *
 * @param fileid - The first photo of the cluster of the clicked marker
 */
function onMarkerClick(fileid: number): void {
	const cluster = clusters.value.find(({ items }) => items[0].fileid === fileid)
	if (!cluster) {
		return
	}

	const [photo] = cluster.items
	if (cluster.items.length === 1) {
		getViewer().open(geotaggedPhotos.value, photo)
		return
	}

	const clusterBounds = L.latLngBounds(cluster.items.map(getCoordinates))
	const padding = L.point(MARKER_SIZE, MARKER_SIZE)
	if (map.value && map.value.getBoundsZoom(clusterBounds, false, padding.multiplyBy(2)) > map.value.getZoom()) {
		map.value.fitBounds(clusterBounds, { padding })
		return
	}

	getViewer().open(cluster.items, photo)
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

	:deep(.photos-map-marker > div) {
		height: 100%;
	}

	:deep(.photos-map-marker__thumbnail) {
		display: block;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		object-fit: cover;
		color: transparent; // hides the alt text of a thumbnail that fails to load
		border: 2px solid var(--color-main-background);
		border-radius: var(--border-radius-large);
		background-color: var(--color-background-dark);
		box-shadow: 0 0 6px var(--color-box-shadow);
	}

	:deep(.photos-map-marker__count) {
		position: absolute;
		top: -8px;
		inset-inline-end: -8px;
		box-sizing: border-box;
		min-width: 22px;
		height: 22px;
		padding: 0 6px;
		border-radius: var(--border-radius-pill);
		background-color: var(--color-primary-element);
		color: var(--color-primary-element-text);
		font-size: var(--font-size-small, 13px);
		font-weight: bold;
		line-height: 22px;
		text-align: center;
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
