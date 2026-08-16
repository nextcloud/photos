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
			<dl class="photo-metadata">
				<div class="photo-metadata__entry">
					<dt>{{ t('photos', 'Filename') }}</dt>
					<dd>{{ photo.basename }}</dd>
				</div>
				<div v-for="entry in exifEntries" :key="entry.label" class="photo-metadata__entry">
					<dt>{{ entry.label }}</dt>
					<dd>{{ entry.value }}</dd>
				</div>
				<div v-if="metadata?.place" class="photo-metadata__entry">
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
	margin: 0;

	&__loading {
		margin: calc(var(--default-grid-baseline) * 4) auto;
	}

	&__entry {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: calc(var(--default-grid-baseline) * 4);
	}

	dt {
		color: var(--color-text-maxcontrast);
	}

	dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		word-break: break-all;
	}

	// Sits next to the entries rather than inside them, so the map is not
	// squeezed into the value column.
	&__map {
		margin-block-start: calc(var(--default-grid-baseline) * 4);

		// The map is inset for the sidebar it was written for, here it fills
		// the width of the dialog.
		:deep(.location-map) {
			margin: 0;
			width: 100%;
			height: 200px;
		}
	}

	&__empty {
		color: var(--color-text-maxcontrast);
	}
}
</style>
