<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Photo metadata')"
		@update:open="emit('close')">
		<NcLoadingIcon v-if="exifEntries === undefined" :size="32" class="photo-metadata__loading" />

		<template v-else>
			<div class="photo-metadata">
				<dl class="photo-metadata__section">
					<div class="photo-metadata__entry">
						<dt>{{ t('photos', 'File name') }}</dt>
						<dd>{{ photo.basename }}</dd>
					</div>
				</dl>
				<dl v-if="exifEntries.length > 0" class="photo-metadata__section">
					<div v-for="entry in exifEntries" :key="entry.label" class="photo-metadata__entry">
						<dt>{{ entry.label }}</dt>
						<dd>{{ entry.value }}</dd>
					</div>
				</dl>
				<dl v-if="metadata?.place || location !== null" class="photo-metadata__section">
					<div v-if="metadata?.place" class="photo-metadata__entry">
						<dt>{{ t('photos', 'Place') }}</dt>
						<dd>{{ metadata.place }}</dd>
					</div>
					<div v-if="location !== null" class="photo-metadata__entry">
						<dt>{{ t('photos', 'Location') }}</dt>
						<dd>{{ formatCoordinates(location) }}</dd>
					</div>
				</dl>
			</div>

			<div v-if="location !== null" class="photo-metadata__map">
				<LocationMap
					height="200px"
					:latitude="location.latitude"
					:longitude="location.longitude"
					:name="metadata?.place || photo.basename" />
			</div>

			<!-- EXIF is optional, so an empty summary is a normal outcome rather than an error. -->
			<p v-if="exifEntries.length === 0 && location === null" class="photo-metadata__empty">
				{{ t('photos', 'This photo carries no camera metadata.') }}
			</p>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoExif } from '../utils/exif.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { translate as t } from '@nextcloud/l10n'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { formatCoordinates, getExifSummary, getPhotoLocation } from '../utils/exif.ts'

const props = defineProps<{
	/** Photo to show the metadata of. */
	photo: PhotoTarget
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

// Leaflet is heavy and only ever needed once this dialog is open.
const LocationMap = defineAsyncComponent(() => import('./LocationMap.vue'))

/** Metadata of the photo, `undefined` while it is being fetched. */
const metadata = ref<PhotoExif | undefined>()

const exifEntries = computed(() => metadata.value === undefined ? undefined : getExifSummary(metadata.value))
const location = computed(() => metadata.value === undefined ? null : getPhotoLocation(metadata.value.gps))

// The EXIF properties are not part of the file listings, they are only fetched
// once the user asks for them.
onMounted(async () => {
	metadata.value = await fetchPhotoExif(props.photo)
})
</script>

<style lang="scss" scoped>
.photo-metadata {
	// One grid for all the sections, so their labels share a single column.
	display: grid;
	grid-template-columns: fit-content(40%) minmax(0, 1fr);
	column-gap: calc(var(--default-grid-baseline) * 4);

	&__loading {
		margin: calc(var(--default-grid-baseline) * 4) auto;
	}

	&__section,
	&__entry {
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: subgrid;
	}

	&__section {
		margin: 0;
		padding-block: calc(var(--default-grid-baseline) * 3);
		row-gap: calc(var(--default-grid-baseline) * 2);

		&:first-child {
			padding-block-start: 0;
		}

		& + & {
			border-block-start: 1px solid var(--color-border);
		}
	}

	&__entry {
		align-items: baseline;
	}

	// The server styles definition lists as a fixed width label column.
	dt,
	dd {
		width: auto;
		margin: 0;
		padding: 0;
		text-align: start;
	}

	dt {
		color: var(--color-text-maxcontrast);
		white-space: normal;
	}

	dd {
		font-variant-numeric: tabular-nums;
		overflow-wrap: anywhere;
	}

	// Sits next to the entries rather than inside them, so the map is not
	// squeezed into the value column.
	&__map {
		margin-block-start: calc(var(--default-grid-baseline) * 4);

		// The map is inset for the sidebar it was written for, here it fills
		// the width of the dialog.
		:deep(.location-map) {
			margin: 0;
		}
	}

	&__empty {
		color: var(--color-text-maxcontrast);
	}
}
</style>
