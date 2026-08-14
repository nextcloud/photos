<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcModal
		ref="modal"
		size="full"
		dark
		enable-slideshow
		:slideshow-delay="SLIDESHOW_DELAY"
		:name="currentPhoto?.basename ?? ''"
		:has-previous="photos.length > 1"
		:has-next="photos.length > 1"
		@previous="showPrevious"
		@next="showNext"
		@close="emit('close')">
		<img
			v-if="currentPhoto !== undefined"
			class="slideshow__photo"
			:src="getPreviewUrl(currentPhoto, PREVIEW_SIZE)"
			:alt="currentPhoto.basename">

		<!-- Nothing is shown for photos without EXIF metadata, rather than an empty panel. -->
		<aside
			v-if="exifEntries.length > 0"
			class="slideshow__exif"
			:aria-label="t('photos', 'Photo metadata')">
			<dl>
				<div v-for="entry in exifEntries" :key="entry.label" class="slideshow__exif__entry">
					<dt class="slideshow__exif__label">
						{{ entry.label }}
					</dt>
					<dd class="slideshow__exif__value">
						{{ entry.value }}
					</dd>
				</div>
			</dl>
		</aside>
	</NcModal>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { ExifEntry } from '../utils/exif.ts'

import { translate as t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NcModal from '@nextcloud/vue/components/NcModal'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { getExifSummary } from '../utils/exif.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'

const props = withDefaults(defineProps<{
	/** Photos to play through, in the order they are shown. */
	photos: PhotoFile[]
	/** Photo to start with. */
	startIndex?: number
}>(), {
	startIndex: 0,
})

const emit = defineEmits<{
	(event: 'close'): void
}>()

/** Time each photo stays on screen, in milliseconds. */
const SLIDESHOW_DELAY = 4000

/** Maximum width and height of the requested previews. */
const PREVIEW_SIZE = 2048

const modal = ref<{ togglePlayPause: () => void } | null>(null)
const index = ref(props.startIndex)

const currentPhoto = computed<PhotoFile | undefined>(() => props.photos[index.value])

/** Whether the metadata of the current photo is shown, toggled with the `i` key. */
const exifShown = ref(false)
const exifEntries = ref<ExifEntry[]>([])

/** Discards the metadata of a photo which is not on screen anymore. */
let pendingRequest = 0

// The slideshow is only mounted when the user asked for it, so it plays right
// away instead of waiting for the play button of the modal to be pressed.
onMounted(() => modal.value?.togglePlayPause())

// The modal takes the focus, so the shortcut is bound to the document rather
// than to an element of the slideshow.
onMounted(() => document.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown))

watch([currentPhoto, exifShown], async ([photo, shown]) => {
	const request = ++pendingRequest
	exifEntries.value = []

	if (!shown || photo === undefined) {
		return
	}

	const entries = getExifSummary(await fetchPhotoExif(photo))

	if (request === pendingRequest) {
		exifEntries.value = entries
	}
})

function showNext(): void {
	index.value = (index.value + 1) % props.photos.length
}

function showPrevious(): void {
	index.value = (index.value - 1 + props.photos.length) % props.photos.length
}

/**
 * @param event - The key press to handle
 */
function onKeyDown(event: KeyboardEvent): void {
	if (event.key === 'i' && !event.ctrlKey && !event.metaKey && !event.altKey) {
		exifShown.value = !exifShown.value
	}
}
</script>

<style lang="scss" scoped>
.slideshow__photo {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.slideshow__exif {
	position: absolute;
	inset-block-start: calc(var(--default-grid-baseline) * 6);
	inset-inline-end: calc(var(--default-grid-baseline) * 6);
	max-width: 280px;
	padding: calc(var(--default-grid-baseline) * 4);
	border-radius: var(--border-radius-large);
	background-color: rgba(0, 0, 0, 0.55);
	color: #fff;
	backdrop-filter: blur(12px);

	dl {
		margin: 0;
	}

	&__entry {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: calc(var(--default-grid-baseline) * 4);
	}

	&__label {
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.7rem;
		opacity: 0.7;
	}

	&__value {
		margin: 0;
		font-variant-numeric: tabular-nums;
	}
}

:deep(.modal-container) {
	background-color: transparent;
	box-shadow: none;
}
</style>
