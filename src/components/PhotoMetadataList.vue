<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photo-metadata">
		<dl class="photo-metadata__list">
			<div v-if="basename" class="photo-metadata__entry">
				<dt>{{ t('photos', 'Filename') }}</dt>
				<dd>{{ basename }}</dd>
			</div>
			<div v-if="takenAt" class="photo-metadata__entry">
				<dt>{{ t('photos', 'Taken') }}</dt>
				<dd>{{ takenAt }}</dd>
			</div>
			<div v-for="entry in exifEntries" :key="entry.label" class="photo-metadata__entry">
				<dt>{{ entry.label }}</dt>
				<dd>{{ entry.value }}</dd>
			</div>
			<div v-if="metadata.place" class="photo-metadata__entry">
				<dt>{{ t('photos', 'Place') }}</dt>
				<dd>{{ metadata.place }}</dd>
			</div>
			<div v-if="location !== null" class="photo-metadata__entry">
				<dt>{{ t('photos', 'Location') }}</dt>
				<dd>{{ formatCoordinates(location) }}</dd>
			</div>
		</dl>

		<div v-if="location !== null" class="photo-metadata__map">
			<LocationMap
				height="200px"
				:latitude="location.latitude"
				:longitude="location.longitude"
				:name="metadata.place || basename" />
		</div>

		<!-- EXIF is optional, so an empty summary is a normal outcome rather than an error. -->
		<p v-if="exifEntries.length === 0 && location === null" class="photo-metadata__empty">
			{{ t('photos', 'This photo carries no camera metadata.') }}
		</p>
	</div>
</template>

<script lang="ts" setup>
import type { PhotoExif } from '../utils/exif.ts'

import { translate as t } from '@nextcloud/l10n'
import { computed, defineAsyncComponent } from 'vue'
import { formatCoordinates, formatTakenAt, getExifSummary, getPhotoLocation } from '../utils/exif.ts'

const props = defineProps<{
	/** Metadata of the photo, as returned by `fetchPhotoExif`. */
	metadata: PhotoExif
	/** Name of the photo file, left out when the surrounding view already shows it. */
	basename?: string
}>()

// Leaflet is heavy and only ever needed for photos which carry a position.
const LocationMap = defineAsyncComponent(() => import('./LocationMap.vue'))

const takenAt = computed(() => formatTakenAt(props.metadata.takenAt))
const exifEntries = computed(() => getExifSummary(props.metadata))
const location = computed(() => getPhotoLocation(props.metadata.gps))
</script>

<style lang="scss" scoped>
.photo-metadata {
	&__list {
		margin: 0;
		padding: 0;
	}

	&__entry {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: calc(var(--default-grid-baseline) * 4);
	}

	// The server styles definition lists as fixed width, right aligned columns.
	dt,
	dd {
		padding: var(--default-grid-baseline) 0;
	}

	dt {
		flex-shrink: 0;
		width: auto;
		color: var(--color-text-maxcontrast);
		text-align: start;
	}

	dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		text-align: end;
		word-break: break-all;
	}

	// Sits next to the entries rather than inside them, so the map is not
	// squeezed into the value column.
	&__map {
		margin-block: calc(var(--default-grid-baseline) * 4) calc(var(--default-grid-baseline) * 2);

		:deep(.location-map) {
			margin: 0;
		}
	}

	&__empty {
		color: var(--color-text-maxcontrast);
	}
}
</style>
