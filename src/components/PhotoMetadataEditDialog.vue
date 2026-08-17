<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Edit metadata')"
		size="normal"
		@update:open="emit('close')">
		<NcLoadingIcon v-if="loading" :size="32" class="metadata-editor__loading" />

		<form v-else class="metadata-editor" @submit.prevent="save">
			<NcDateTimePickerNative
				v-model="takenAt"
				type="datetime-local"
				:label="t('photos', 'Date and time the photo was taken')" />

			<fieldset class="metadata-editor__location">
				<legend>{{ t('photos', 'Location') }}</legend>

				<div class="metadata-editor__location__coordinates">
					<NcTextField
						v-model="latitude"
						inputmode="decimal"
						:error="latitudeError !== undefined"
						:helper-text="latitudeError ?? ''"
						:label="t('photos', 'Latitude')" />
					<NcTextField
						v-model="longitude"
						inputmode="decimal"
						:error="longitudeError !== undefined"
						:helper-text="longitudeError ?? ''"
						:label="t('photos', 'Longitude')" />
				</div>

				<NcButton
					variant="tertiary"
					:disabled="latitude === '' && longitude === ''"
					@click="clearLocation">
					<template #icon>
						<MapMarkerOffOutline :size="20" />
					</template>
					{{ t('photos', 'Remove location') }}
				</NcButton>

				<div v-if="location !== null" class="metadata-editor__location__map">
					<LocationMap
						:latitude="location.latitude"
						:longitude="location.longitude"
						:name="photo.basename" />
				</div>
			</fieldset>
		</form>

		<template #actions>
			<NcButton variant="tertiary" :disabled="saving" @click="emit('close')">
				{{ t('photos', 'Cancel') }}
			</NcButton>
			<NcButton variant="primary" :disabled="!canSave" @click="save">
				<template v-if="saving" #icon>
					<NcLoadingIcon :size="20" />
				</template>
				{{ t('photos', 'Save') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoLocation } from '../utils/exif.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDateTimePickerNative from '@nextcloud/vue/components/NcDateTimePickerNative'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import MapMarkerOffOutline from 'vue-material-design-icons/MapMarkerOffOutline.vue'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import logger from '../services/logger.ts'
import store from '../store/index.ts'
import { COORDINATE_LIMITS, getPhotoLocation, parseCoordinate } from '../utils/exif.ts'

const props = defineProps<{
	/** Photo to edit the metadata of. */
	photo: PhotoTarget
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

// Leaflet is heavy and only ever needed once this dialog is open.
const LocationMap = defineAsyncComponent(() => import('./LocationMap.vue'))

const loading = ref(true)
const saving = ref(false)

const takenAt = ref<Date | null>(null)
const latitude = ref('')
const longitude = ref('')

// Neither the coordinates nor the taken date the server holds are part of the
// file listings, so they are fetched before they can be edited.
onMounted(async () => {
	const metadata = await fetchPhotoExif(props.photo)
	const location = getPhotoLocation(metadata.gps)

	if (location !== null) {
		latitude.value = String(location.latitude)
		longitude.value = String(location.longitude)
	}

	// Photos always carry a taken date, at worst the one of their upload, but
	// a photo whose metadata was never extracted has none to show.
	takenAt.value = metadata.takenAt === undefined ? new Date() : new Date(metadata.takenAt * 1000)

	loading.value = false
})

/**
 * A coordinate has to be reported as invalid while its counterpart is being
 * typed, otherwise saving silently drops the position.
 *
 * @param value - Coordinate as typed by the user
 * @param limit - Absolute maximum of the coordinate, in degrees
 * @param counterpart - The other coordinate of the pair
 */
function validateCoordinate(value: string, limit: number, counterpart: string): string | undefined {
	if (value.trim() === '') {
		return counterpart.trim() === '' ? undefined : t('photos', 'Both coordinates are required')
	}

	if (parseCoordinate(value, limit) === null) {
		return t('photos', 'Enter decimal degrees between -{limit} and {limit}', { limit })
	}

	return undefined
}

const latitudeError = computed(() => validateCoordinate(latitude.value, COORDINATE_LIMITS.latitude, longitude.value))
const longitudeError = computed(() => validateCoordinate(longitude.value, COORDINATE_LIMITS.longitude, latitude.value))

/** Position entered by the user, `null` when the location is being cleared. */
const location = computed<PhotoLocation | null>(() => {
	const parsedLatitude = parseCoordinate(latitude.value, COORDINATE_LIMITS.latitude)
	const parsedLongitude = parseCoordinate(longitude.value, COORDINATE_LIMITS.longitude)

	if (parsedLatitude === null || parsedLongitude === null) {
		return null
	}

	return { latitude: parsedLatitude, longitude: parsedLongitude }
})

const canSave = computed(() => !loading.value
	&& !saving.value
	&& takenAt.value !== null
	&& latitudeError.value === undefined
	&& longitudeError.value === undefined)

function clearLocation(): void {
	latitude.value = ''
	longitude.value = ''
}

async function save(): Promise<void> {
	const date = takenAt.value
	if (!canSave.value || date === null) {
		return
	}

	saving.value = true

	try {
		await store.dispatch('updatePhotoMetadata', {
			photo: props.photo,
			takenAt: Math.floor(date.getTime() / 1000),
			location: location.value,
		})
		emit('close')
	} catch (error) {
		logger.error('Error saving the metadata of a photo', { error, filename: props.photo.basename })
		showError(t('photos', 'Failed to save the metadata of {fileName}', { fileName: props.photo.basename }))
	} finally {
		saving.value = false
	}
}
</script>

<style lang="scss" scoped>
.metadata-editor {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 4);

	&__loading {
		margin: calc(var(--default-grid-baseline) * 4) auto;
	}

	&__location {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 2);
		border: none;

		legend {
			color: var(--color-text-maxcontrast);
		}

		&__coordinates {
			display: flex;
			gap: calc(var(--default-grid-baseline) * 2);
		}

		&__map {
			// The map is inset for the sidebar it was written for, here it
			// fills the width of the dialog.
			:deep(.location-map) {
				margin: 0;
				width: 100%;
				height: 200px;
			}
		}
	}
}
</style>
