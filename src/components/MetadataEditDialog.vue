<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Per-photo EXIF editor. Two fields for the MVP — date taken and
	GPS coordinates — covering the two scenarios users actually edit
	EXIF for: cameras with the wrong clock, and photos missing
	location data.

	The edits don't touch the original file; they live in
	`oc_photos_metadata_edits` and overlay at read time. Each user's
	overrides are private — bob editing the date on a photo shared
	with him doesn't change what alice sees.

	The Reset link clears that one field's override (sends `null` for
	just that key), so the photo falls back to whatever the EXIF
	says. Save commits the diff against the values that were on
	screen when the dialog opened.
-->

<template>
	<NcDialog
		:name="t('photos', 'Edit photo metadata')"
		size="small"
		@closing="$emit('close')">
		<form class="metadata-edit" @submit.prevent="onSave">
			<section class="metadata-edit__section">
				<h4>{{ t('photos', 'Date taken') }}</h4>
				<NcDateTime
					v-if="initialTakenAt !== null && !dateOverrideTouched"
					class="metadata-edit__current"
					:timestamp="(currentEffectiveTakenAt ?? 0) * 1000" />
				<input
					v-model="dateInput"
					type="datetime-local"
					class="metadata-edit__date-input"
					@change="dateOverrideTouched = true">
				<div class="metadata-edit__actions-row">
					<NcButton
						v-if="dateOverrideStored"
						variant="tertiary"
						@click="onResetDate">
						{{ t('photos', 'Reset to original') }}
					</NcButton>
				</div>
			</section>

			<section class="metadata-edit__section">
				<h4>{{ t('photos', 'Location') }}</h4>
				<div class="metadata-edit__gps-row">
					<NcTextField
						v-model="latInput"
						:label="t('photos', 'Latitude')"
						placeholder="37.774900"
						type="text"
						inputmode="decimal" />
					<NcTextField
						v-model="lngInput"
						:label="t('photos', 'Longitude')"
						placeholder="-122.419400"
						type="text"
						inputmode="decimal" />
				</div>
				<p v-if="gpsValidationError !== null" class="metadata-edit__error">
					{{ gpsValidationError }}
				</p>
				<div class="metadata-edit__actions-row">
					<NcButton
						v-if="gpsOverrideStored"
						variant="tertiary"
						@click="onResetGps">
						{{ t('photos', 'Reset to original') }}
					</NcButton>
				</div>
			</section>
		</form>

		<template #actions>
			<NcButton variant="tertiary" :disabled="saving" @click="$emit('close')">
				{{ t('photos', 'Cancel') }}
			</NcButton>
			<NcButton
				variant="primary"
				:disabled="saving || gpsValidationError !== null"
				@click="onSave">
				<template v-if="saving" #icon>
					<NcLoadingIcon :size="16" />
				</template>
				{{ t('photos', 'Save') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts">
import type { PropType } from 'vue'

import { showError, showSuccess } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { defineComponent } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDateTime from '@nextcloud/vue/components/NcDateTime'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import logger from '../services/logger.ts'
import { getMetadataEdit, saveMetadataEdit } from '../services/PhotoMetadataEditService.ts'

export default defineComponent({
	name: 'MetadataEditDialog',

	components: {
		NcButton,
		NcDateTime,
		NcDialog,
		NcLoadingIcon,
		NcTextField,
	},

	props: {
		fileId: {
			type: Number,
			required: true,
		},

		// EXIF-derived defaults to seed the form when the user hasn't
		// stored an override yet. Comes from the open-the-dialog
		// caller, which already has the file's attributes loaded.
		initialTakenAt: {
			type: [Number, null] as PropType<number | null>,
			default: null,
		},

		initialGpsLat: {
			type: [Number, null] as PropType<number | null>,
			default: null,
		},

		initialGpsLng: {
			type: [Number, null] as PropType<number | null>,
			default: null,
		},
	},

	emits: ['close', 'saved'],

	data() {
		return {
			// Stored overrides (loaded from the API).
			storedTakenAt: null as number | null,
			storedLat: null as number | null,
			storedLng: null as number | null,

			// In-flight form values (strings to avoid number-input
			// quirks; parsed on save).
			dateInput: '',
			latInput: '',
			lngInput: '',

			dateOverrideTouched: false,
			saving: false,
		}
	},

	computed: {
		// What the photo would currently show as its date — the
		// override if set, else the EXIF value passed in. Drives the
		// preview line above the input.
		currentEffectiveTakenAt(): number | null {
			return this.storedTakenAt ?? this.initialTakenAt
		},

		dateOverrideStored(): boolean {
			return this.storedTakenAt !== null
		},

		gpsOverrideStored(): boolean {
			return this.storedLat !== null && this.storedLng !== null
		},

		// Validate as the user types so Save stays disabled while
		// the values are out of range. Empty inputs are allowed —
		// they mean "leave / clear the override".
		gpsValidationError(): string | null {
			const latTrim = this.latInput.trim()
			const lngTrim = this.lngInput.trim()
			if (latTrim === '' && lngTrim === '') {
				return null
			}
			if (latTrim === '' || lngTrim === '') {
				return t('photos', 'Enter both latitude and longitude, or leave both blank.')
			}
			const lat = Number.parseFloat(latTrim)
			const lng = Number.parseFloat(lngTrim)
			if (Number.isNaN(lat) || Number.isNaN(lng)) {
				return t('photos', 'Latitude and longitude must be numbers.')
			}
			if (lat < -90 || lat > 90) {
				return t('photos', 'Latitude must be between -90 and 90.')
			}
			if (lng < -180 || lng > 180) {
				return t('photos', 'Longitude must be between -180 and 180.')
			}
			return null
		},
	},

	async mounted() {
		try {
			const edit = await getMetadataEdit(this.fileId)
			this.storedTakenAt = edit.takenAt
			this.storedLat = edit.gpsLat
			this.storedLng = edit.gpsLng

			// Seed the inputs with whatever the photo currently
			// resolves to (override if set, else EXIF). Inputs are
			// strings; conversion happens on save.
			const seedTakenAt = edit.takenAt ?? this.initialTakenAt
			if (seedTakenAt !== null) {
				this.dateInput = this.unixToDatetimeLocal(seedTakenAt)
			}

			const seedLat = edit.gpsLat ?? this.initialGpsLat
			const seedLng = edit.gpsLng ?? this.initialGpsLng
			this.latInput = seedLat !== null ? String(seedLat) : ''
			this.lngInput = seedLng !== null ? String(seedLng) : ''
		} catch (e) {
			showError(t('photos', 'Failed to load metadata edits'))
			logger.error('photos: load metadata edits failed', { error: e })
		}
	},

	methods: {
		t,

		onResetDate() {
			this.dateInput = this.initialTakenAt !== null ? this.unixToDatetimeLocal(this.initialTakenAt) : ''
			this.dateOverrideTouched = true
			this.storedTakenAt = null
		},

		onResetGps() {
			this.latInput = this.initialGpsLat !== null ? String(this.initialGpsLat) : ''
			this.lngInput = this.initialGpsLng !== null ? String(this.initialGpsLng) : ''
			this.storedLat = null
			this.storedLng = null
		},

		async onSave() {
			if (this.gpsValidationError !== null) {
				return
			}

			// Compute the diff: only send fields that actually
			// changed. Fields untouched are omitted so the server
			// keeps its current value.
			const patch: Record<string, number | null> = {}

			if (this.dateOverrideTouched) {
				const trimmed = this.dateInput.trim()
				if (trimmed === '') {
					patch.takenAt = null
				} else {
					const parsed = this.datetimeLocalToUnix(trimmed)
					if (parsed === null) {
						showError(t('photos', 'Date is not valid.'))
						return
					}
					patch.takenAt = parsed
				}
			}

			const latTrim = this.latInput.trim()
			const lngTrim = this.lngInput.trim()
			const editedLat = latTrim === '' ? null : Number.parseFloat(latTrim)
			const editedLng = lngTrim === '' ? null : Number.parseFloat(lngTrim)
			const initialLat = this.initialGpsLat
			const initialLng = this.initialGpsLng
			const gpsChanged = editedLat !== (this.storedLat ?? initialLat)
				|| editedLng !== (this.storedLng ?? initialLng)
			if (gpsChanged) {
				patch.gpsLat = editedLat
				patch.gpsLng = editedLng
			}

			if (Object.keys(patch).length === 0) {
				this.$emit('close')
				return
			}

			this.saving = true
			try {
				const saved = await saveMetadataEdit(this.fileId, patch)
				showSuccess(t('photos', 'Metadata updated'))
				this.$emit('saved', saved)
				this.$emit('close')
			} catch (e) {
				showError(t('photos', 'Failed to save metadata'))
				logger.error('photos: save metadata edit failed', { error: e })
			} finally {
				this.saving = false
			}
		},

		// Unix epoch → "YYYY-MM-DDTHH:MM" (local time, the format
		// `<input type="datetime-local">` expects).
		unixToDatetimeLocal(unix: number): string {
			const d = new Date(unix * 1000)
			const pad = (n: number) => String(n).padStart(2, '0')
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
		},

		datetimeLocalToUnix(value: string): number | null {
			const parsed = new Date(value)
			if (Number.isNaN(parsed.getTime())) {
				return null
			}
			return Math.floor(parsed.getTime() / 1000)
		},
	},
})
</script>

<style lang="scss" scoped>
.metadata-edit {
	display: flex;
	flex-direction: column;
	gap: 18px;

	&__section {
		display: flex;
		flex-direction: column;
		gap: 8px;

		h4 {
			margin: 0;
			font-size: 0.9rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--color-text-maxcontrast);
		}
	}

	&__current {
		font-size: 0.85rem;
		color: var(--color-text-maxcontrast);
	}

	&__date-input {
		padding: 8px 12px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-main-background);
		color: var(--color-main-text);
		font-family: inherit;
		font-size: inherit;

		&:focus-visible {
			outline: 2px solid var(--color-primary-element);
			outline-offset: 1px;
		}
	}

	&__gps-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	&__error {
		margin: 0;
		color: var(--color-error);
		font-size: 0.85rem;
	}

	&__actions-row {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
