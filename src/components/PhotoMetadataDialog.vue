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
				<div v-if="people.length > 0" class="photo-metadata__entry">
					<dt>{{ t('photos', 'People') }}</dt>
					<dd>
						<ul class="photo-metadata__people">
							<li v-for="person in people" :key="person.name">
								<RouterLink
									class="photo-metadata__person"
									:to="{ name: 'facecontent', params: { faceName: person.name } }"
									@click="emit('close')">
									<span class="photo-metadata__person-face">
										<img :src="previewUrl" alt="" :style="getFaceCropStyle(person.box)">
									</span>
									{{ person.name }}
								</RouterLink>
							</li>
						</ul>
					</dd>
				</div>
			</dl>

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
import type { PersonInPhoto } from '../utils/faceDetections.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { fetchFaceDetections } from '../services/faceDetectionsFetcher.ts'
import { isRecognizeInstalled } from '../services/IsRecognizeInstalled.ts'
import { formatCoordinates, getExifSummary, getPhotoLocation } from '../utils/exif.ts'
import { getFaceCropStyle, getPeopleInPhoto } from '../utils/faceDetections.ts'

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

/** Named people recognized in the photo. */
const people = ref<PersonInPhoto[]>([])

// Large enough for a small face to stay sharp once the photo is cropped onto it.
const previewUrl = computed(() => generateUrl(`/apps/photos/api/v1/preview/${props.photo.fileid}?x=512&y=512`))

// The EXIF properties are not part of the file listings, they are only fetched
// once the user asks for them.
onMounted(async () => {
	const [exif, detections] = await Promise.all([
		fetchPhotoExif(props.photo),
		isRecognizeInstalled ? fetchFaceDetections(props.photo) : [],
	])
	people.value = getPeopleInPhoto(detections)
	metadata.value = exif
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
		}
	}

	&__empty {
		color: var(--color-text-maxcontrast);
	}

	&__people {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 3);
	}

	&__person {
		display: flex;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		border-radius: var(--border-radius-element);
		word-break: normal;

		&:hover,
		&:focus-visible {
			text-decoration: underline;
		}
	}

	&__person-face {
		position: relative;
		flex-shrink: 0;
		width: var(--default-clickable-area);
		height: var(--default-clickable-area);
		overflow: hidden;
		border-radius: 50%;
		background-color: var(--color-background-dark);
	}
}
</style>
