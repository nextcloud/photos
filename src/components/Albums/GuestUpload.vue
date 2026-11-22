<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcButton variant="primary" @click="open = true">
		<template #icon>
			<ImagePlusOutline :size="20" />
		</template>
		{{ t('photos', 'Add photos') }}
	</NcButton>

	<NcDialog
		v-if="open"
		:name="t('photos', 'Add photos to this album')"
		size="normal"
		:noClose="uploading"
		@update:open="close">
		<div class="guest-upload">
			<p class="guest-upload__hint">
				{{ t('photos', 'Photos and videos up to {size} each. Everyone with the link can see them.', { size: formatFileSize(maxSize) }) }}
			</p>

			<NcTextField
				v-model="guestName"
				:label="t('photos', 'Your name (optional)')"
				:maxlength="64"
				:disabled="uploading" />

			<input
				ref="fileInput"
				class="hidden-visually"
				type="file"
				accept="image/*,video/*"
				multiple
				tabindex="-1"
				aria-hidden="true"
				@change="onFilesPicked">

			<div v-if="uploading" class="guest-upload__progress">
				<NcProgressBar :value="Math.round(progress * 100)" size="medium" />
				<span>{{ t('photos', 'Uploading …') }}</span>
			</div>

			<NcNoteCard v-if="summary !== null && summary.uploaded > 0" type="success">
				{{ n('photos', '%n file added to the album.', '%n files added to the album.', summary.uploaded) }}
			</NcNoteCard>
			<NcNoteCard v-if="summary !== null && summary.errors.length > 0" type="error">
				<ul>
					<li v-for="error in summary.errors" :key="error">
						{{ error }}
					</li>
				</ul>
			</NcNoteCard>
		</div>

		<template #actions>
			<NcButton variant="primary" :disabled="uploading" @click="fileInput?.click()">
				<template #icon>
					<NcLoadingIcon v-if="uploading" :size="20" />
					<ImagePlusOutline v-else :size="20" />
				</template>
				{{ t('photos', 'Choose photos and videos') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script setup lang="ts">
import type { GuestUploadSummary } from '../../services/guestUpload.ts'

import { formatFileSize } from '@nextcloud/files'
import { loadState } from '@nextcloud/initial-state'
import { n, t } from '@nextcloud/l10n'
import { ref, useTemplateRef, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import { allMimes } from '../../services/AllowedMimes.ts'
import { uploadGuestFiles } from '../../services/guestUpload.ts'

const props = defineProps<{
	token: string
}>()

const emit = defineEmits<{
	uploaded: []
}>()

const GUEST_NAME_KEY = 'photos:guest-upload-name'

const maxSize = loadState<number>('photos', 'guest-upload-max-size', 50 * 1024 * 1024)
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const open = ref(false)
const uploading = ref(false)
const progress = ref(0)
const summary = ref<GuestUploadSummary | null>(null)
const guestName = ref(readGuestName())

watch(guestName, (name) => {
	try {
		window.localStorage.setItem(GUEST_NAME_KEY, name)
	} catch {
		// Storage can be unavailable, the name is then asked again next time.
	}
})

/**
 * The name the visitor entered last time on this device.
 */
function readGuestName(): string {
	try {
		return window.localStorage.getItem(GUEST_NAME_KEY) ?? ''
	} catch {
		return ''
	}
}

/**
 * Upload the picked files and let the album refresh once some were added.
 *
 * @param event - Change event of the file input
 */
async function onFilesPicked(event: Event) {
	const input = event.target as HTMLInputElement
	const files = [...(input.files ?? [])]
	input.value = ''
	if (files.length === 0) {
		return
	}

	uploading.value = true
	progress.value = 0
	summary.value = null
	try {
		summary.value = await uploadGuestFiles(props.token, files, guestName.value, maxSize, allMimes, (value) => {
			progress.value = value
		})
	} finally {
		uploading.value = false
	}

	if (summary.value.uploaded > 0) {
		emit('uploaded')
	}
}

/**
 * @param isOpen - New open state of the dialog
 */
function close(isOpen: boolean) {
	if (!isOpen && !uploading.value) {
		open.value = false
		summary.value = null
	}
}
</script>

<style lang="scss" scoped>
.guest-upload {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 3);
	padding-bottom: calc(var(--default-grid-baseline) * 2);

	&__hint {
		color: var(--color-text-maxcontrast);
	}

	&__progress {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);
	}

	ul {
		list-style: disc;
		padding-inline-start: calc(var(--default-grid-baseline) * 4);
	}
}
</style>
