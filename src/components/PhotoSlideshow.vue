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
	</NcModal>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'

import { computed, onMounted, ref } from 'vue'
import NcModal from '@nextcloud/vue/components/NcModal'
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

// The slideshow is only mounted when the user asked for it, so it plays right
// away instead of waiting for the play button of the modal to be pressed.
onMounted(() => modal.value?.togglePlayPause())

function showNext(): void {
	index.value = (index.value + 1) % props.photos.length
}

function showPrevious(): void {
	index.value = (index.value - 1 + props.photos.length) % props.photos.length
}
</script>

<style lang="scss" scoped>
.slideshow__photo {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

:deep(.modal-container) {
	background-color: transparent;
	box-shadow: none;
}
</style>
