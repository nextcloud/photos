<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Edit date & location')"
		size="normal"
		:noClose="saving"
		@update:open="close">
		<form class="bulk-metadata-editor" @submit.prevent="apply">
			<p class="bulk-metadata-editor__hint">
				{{ n('photos', 'Changes apply to %n photo.', 'Changes apply to %n photos.', editablePhotos.length) }}
			</p>
			<NcNoteCard v-if="readOnlyCount > 0" type="warning">
				{{ n('photos', '%n selected photo cannot be edited and is skipped.', '%n selected photos cannot be edited and are skipped.', readOnlyCount) }}
			</NcNoteCard>

			<fieldset v-if="!saving && !applied" class="bulk-metadata-editor__section">
				<NcRadioGroup v-model="dateMode" :label="t('photos', 'Date and time')">
					<NcRadioGroupButton value="keep" :label="t('photos', 'Keep')" />
					<NcRadioGroupButton value="shift" :label="t('photos', 'Shift by')" />
					<NcRadioGroupButton value="set" :label="t('photos', 'Set to')" />
				</NcRadioGroup>

				<template v-if="dateMode === 'shift'">
					<div class="bulk-metadata-editor__row">
						<NcInputField v-model="shift.days" type="number" :label="t('photos', 'Days')" />
						<NcInputField v-model="shift.hours" type="number" :label="t('photos', 'Hours')" />
						<NcInputField v-model="shift.minutes" type="number" :label="t('photos', 'Minutes')" />
					</div>
					<p class="bulk-metadata-editor__hint">
						{{ t('photos', 'Use negative values to move the dates earlier. The time between the photos is kept.') }}
					</p>
				</template>

				<NcDateTimePickerNative
					v-else-if="dateMode === 'set'"
					v-model="fixedDate"
					type="datetime-local"
					:label="t('photos', 'Date and time of all photos')" />

				<dl v-if="dateMode === 'shift' && preview !== null" class="bulk-metadata-editor__preview">
					<dt>{{ t('photos', 'Earliest photo') }}</dt>
					<dd>{{ preview.first }}</dd>
					<dt>{{ t('photos', 'Latest photo') }}</dt>
					<dd>{{ preview.last }}</dd>
				</dl>
			</fieldset>

			<fieldset v-if="!saving && !applied" class="bulk-metadata-editor__section">
				<NcRadioGroup v-model="locationMode" :label="t('photos', 'Location')">
					<NcRadioGroupButton value="keep" :label="t('photos', 'Keep')" />
					<NcRadioGroupButton value="set" :label="t('photos', 'Set')" />
					<NcRadioGroupButton value="remove" :label="t('photos', 'Remove')" />
				</NcRadioGroup>

				<template v-if="locationMode === 'set'">
					<div class="bulk-metadata-editor__row">
						<NcTextField
							v-model="latitude"
							inputmode="decimal"
							:error="latitudeError !== undefined"
							:helperText="latitudeError ?? ''"
							:label="t('photos', 'Latitude')" />
						<NcTextField
							v-model="longitude"
							inputmode="decimal"
							:error="longitudeError !== undefined"
							:helperText="longitudeError ?? ''"
							:label="t('photos', 'Longitude')" />
					</div>
					<p class="bulk-metadata-editor__hint">
						{{ t('photos', 'Click on the map to place the photos there.') }}
					</p>
					<LocationMap
						height="240px"
						pickable
						:latitude="mapCenter.latitude"
						:longitude="mapCenter.longitude"
						:zoom="mapZoom"
						:hideMarker="location === null"
						:name="n('photos', '%n photo', '%n photos', editablePhotos.length)"
						@pick="placeOnMap" />
				</template>
			</fieldset>

			<div v-else class="bulk-metadata-editor__progress">
				<NcProgressBar :value="Math.round(done / Math.max(updates.length, 1) * 100)" :error="failures.length > 0" />
				<p>{{ t('photos', '{done} of {total} photos updated', { done: done - failures.length, total: updates.length }) }}</p>
			</div>

			<NcNoteCard
				v-if="failures.length > 0"
				type="error"
				:heading="n('photos', '%n photo could not be updated', '%n photos could not be updated', failures.length)">
				<ul class="bulk-metadata-editor__failures">
					<li v-for="failure in failures" :key="failure.photo.fileid">
						{{ t('photos', '{fileName}: {reason}', { fileName: failure.photo.basename, reason: describeError(failure.error) }) }}
					</li>
				</ul>
			</NcNoteCard>
		</form>

		<template #actions>
			<NcButton variant="tertiary" :disabled="saving" @click="close">
				{{ applied ? t('photos', 'Close') : t('photos', 'Cancel') }}
			</NcButton>
			<NcButton
				v-if="!applied"
				variant="primary"
				:disabled="!canApply"
				@click="apply">
				<template v-if="saving" #icon>
					<NcLoadingIcon :size="20" />
				</template>
				{{ t('photos', 'Apply') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { DateChange } from '../utils/dateShift.ts'
import type { PhotoLocation } from '../utils/exif.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { Permission } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDateTimePickerNative from '@nextcloud/vue/components/NcDateTimePickerNative'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcInputField from '@nextcloud/vue/components/NcInputField'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import NcRadioGroup from '@nextcloud/vue/components/NcRadioGroup'
import NcRadioGroupButton from '@nextcloud/vue/components/NcRadioGroupButton'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { useFilesStore } from '../store/files.ts'
import { applyDateChange, getTimestampRange, parseDateShift } from '../utils/dateShift.ts'
import { formatDate, formatTime } from '../utils/dateUtils.ts'
import { COORDINATE_LIMITS, getPhotoLocation, validateCoordinate } from '../utils/exif.ts'
import { toPhotoTarget } from '../utils/fileUtils.ts'

const props = defineProps<{
	/** Ids of the photos to edit, as indexed by the files store. */
	fileIds: string[]
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

// Leaflet is heavy and only ever needed once a location is being set.
const LocationMap = defineAsyncComponent(() => import('./LocationMap.vue'))

const filesStore = useFilesStore()

const selectedPhotos = computed(() => props.fileIds
	.map((fileId) => filesStore.files[fileId])
	.filter((file): file is PhotoFile => file !== undefined))

// The server checks the permissions of every photo again, this only spares the
// requests that are bound to be refused.
const editablePhotos = computed(() => selectedPhotos.value
	.filter((file) => (file.permissions & Permission.WRITE) !== 0))
const readOnlyCount = computed(() => selectedPhotos.value.length - editablePhotos.value.length)

const dateMode = ref<'keep' | 'shift' | 'set'>('keep')
const shift = reactive({ days: '0', hours: '0', minutes: '0' })
const fixedDate = ref<Date | null>(new Date())

const locationMode = ref<'keep' | 'set' | 'remove'>('keep')
const latitude = ref('')
const longitude = ref('')

const saving = ref(false)
const applied = ref(false)
const done = ref(0)
const failures = ref<{ photo: PhotoTarget, error: unknown }[]>([])

const dateChange = computed<DateChange | null>(() => {
	if (dateMode.value === 'shift') {
		const offset = parseDateShift(shift)
		if (offset === null) {
			return null
		}

		return offset === 0 ? { mode: 'keep' } : { mode: 'shift', offset }
	}

	if (dateMode.value === 'set') {
		const date = fixedDate.value
		return date === null || Number.isNaN(date.getTime())
			? null
			: { mode: 'set', takenAt: Math.floor(date.getTime() / 1000) }
	}

	return { mode: 'keep' }
})

/**
 * @param timestamp - Unix timestamp in seconds
 */
function formatTimestamp(timestamp: number): string {
	const date = new Date(timestamp * 1000)
	return `${formatDate(date)} ${formatTime(date)}`
}

// A shift keeps the order of the photos, so the earliest one stays the earliest.
const preview = computed(() => {
	const change = dateChange.value
	const range = getTimestampRange(editablePhotos.value.map((file) => file.attributes.timestamp))
	if (change === null || range === null) {
		return null
	}

	return {
		first: `${formatTimestamp(range.first)} → ${formatTimestamp(applyDateChange(range.first, change) ?? range.first)}`,
		last: `${formatTimestamp(range.last)} → ${formatTimestamp(applyDateChange(range.last, change) ?? range.last)}`,
	}
})

const latitudeError = computed(() => validateCoordinate(latitude.value, COORDINATE_LIMITS.latitude, longitude.value))
const longitudeError = computed(() => validateCoordinate(longitude.value, COORDINATE_LIMITS.longitude, latitude.value))
const location = computed(() => getPhotoLocation({ latitude: latitude.value, longitude: longitude.value }))

/** New position of the photos, `undefined` when it is kept. */
const locationChange = computed<PhotoLocation | null | undefined>(() => {
	if (locationMode.value === 'remove') {
		return null
	}

	return locationMode.value === 'set' ? location.value ?? undefined : undefined
})

// Before a position is picked, the map shows where the selected photos already
// are, or the whole world when none of them carries a position.
const knownLocation = editablePhotos.value
	.map((file) => getPhotoLocation(file.attributes['metadata-photos-gps']))
	.find((photoLocation) => photoLocation !== null)
const mapZoom = knownLocation === undefined ? 1 : 10
const mapCenter = computed(() => location.value ?? knownLocation ?? { latitude: 20, longitude: 0 })

/**
 * @param picked - Position clicked on the map
 */
function placeOnMap(picked: PhotoLocation): void {
	latitude.value = String(Number(picked.latitude.toFixed(6)))
	longitude.value = String(Number(picked.longitude.toFixed(6)))
}

const updates = computed(() => {
	const change = dateChange.value
	if (change === null) {
		return []
	}

	return editablePhotos.value
		.map((file) => ({
			photo: toPhotoTarget(file),
			update: {
				takenAt: applyDateChange(file.attributes.timestamp, change),
				location: locationChange.value,
			},
		}))
		.filter(({ update }) => update.takenAt !== undefined || update.location !== undefined)
})

const canApply = computed(() => !saving.value
	&& updates.value.length > 0
	&& (locationMode.value !== 'set' || location.value !== null))

/**
 * @param error - Error raised while saving a photo
 */
function describeError(error: unknown): string {
	const status = (error as { status?: number } | null)?.status ?? (error as { response?: { status?: number } } | null)?.response?.status
	if (status === 403) {
		return t('photos', 'You are not allowed to edit this photo')
	}

	return t('photos', 'The server refused the change')
}

async function apply(): Promise<void> {
	if (!canApply.value) {
		return
	}

	// The list is computed from the photos being updated, so it is frozen
	// before their dates start changing.
	const pendingUpdates = updates.value
	saving.value = true
	done.value = 0

	failures.value = await filesStore.updatePhotosMetadata(pendingUpdates, (count) => {
		done.value = count
	})

	saving.value = false
	applied.value = true

	if (failures.value.length === 0) {
		close()
	}
}

function close(): void {
	if (!saving.value) {
		emit('close')
	}
}
</script>

<style lang="scss" scoped>
.bulk-metadata-editor {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 4);

	&__section {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 2);
		margin: 0;
		padding: 0;
		border: none;
	}

	&__row {
		display: flex;
		gap: calc(var(--default-grid-baseline) * 2);
	}

	&__hint {
		color: var(--color-text-maxcontrast);
	}

	&__preview {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 3);
		margin: 0;
		padding: 0;

		// Overrides the sized, padded columns the server styles give lists.
		dt,
		dd {
			width: auto;
			margin: 0;
			padding: 0;
			text-align: start;
		}

		dt {
			color: var(--color-text-maxcontrast);
		}
	}

	// The map is inset for the sidebar it was written for, here it fills the
	// width of the dialog.
	:deep(.location-map) {
		margin: 0;
	}

	&__failures {
		max-height: 160px;
		overflow-y: auto;
	}
}
</style>
