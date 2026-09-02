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
		@next="onNext"
		@close="emit('close')">
		<!--
			A video is played rather than shown as the still its preview is, and it
			keeps its controls so it can be paused, seeked and unmuted. The preview
			stands in as the poster while the file is still loading. Whether the
			browser can play the format is left to the browser: what it cannot play
			falls back to the still below.
		-->
		<video
			v-if="videoShown"
			:key="currentPhoto?.fileid"
			ref="video"
			class="slideshow__photo"
			:src="currentPhoto?.source"
			:poster="previewUrl"
			:aria-label="currentPhoto?.basename"
			controls
			playsinline
			preload="metadata"
			@play="videoBlocked = false"
			@ended="onVideoEnded"
			@error="videoFailed = true" />

		<img
			v-else-if="currentPhoto !== undefined"
			class="slideshow__photo"
			:src="previewUrl"
			:alt="currentPhoto.basename">

		<!-- How far into the set the slideshow is, as the header only names the photo. -->
		<p class="slideshow__position">
			{{ positionLabel }}
		</p>

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

import { t } from '@nextcloud/l10n'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NcModal from '@nextcloud/vue/components/NcModal'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { getExifSummary } from '../utils/exif.ts'
import { getPreviewUrl, toPhotoTarget } from '../utils/fileUtils.ts'

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

const modal = ref<{
	togglePlayPause: () => void
	resetSlideshow: () => void
	playing: boolean
} | null>(null)
const index = ref(props.startIndex)

const currentPhoto = computed<PhotoFile | undefined>(() => props.photos[index.value])

const previewUrl = computed<string>(() => currentPhoto.value === undefined
	? ''
	: getPreviewUrl(currentPhoto.value, PREVIEW_SIZE))

const positionLabel = computed<string>(() => t('photos', '{position} of {count}', {
	position: index.value + 1,
	count: props.photos.length,
}))

/** Elements a key press belongs to rather than to the slideshow around them. */
const CONTROL_SELECTOR = 'button, a[href], input, select, textarea, [contenteditable]'

/** Whether the reader asked for the shortcuts of the app to be left alone. */
const shortcutsDisabled = window.OCP?.Accessibility?.disableKeyboardShortcuts?.() ?? false

/** Whether the metadata of the current photo is shown, toggled with the `i` key. */
const exifShown = ref(false)
const exifEntries = ref<ExifEntry[]>([])

/** Discards the metadata of a photo which is not on screen anymore. */
let pendingRequest = 0

const video = ref<HTMLVideoElement | null>(null)

/** Whether the browser could not play the video of the current photo at all. */
const videoFailed = ref(false)

/** Whether the video of the current photo ran to its end. */
const videoEnded = ref(false)

/** Whether the browser refused to start the video on its own. */
const videoBlocked = ref(false)

// Sound only plays on its own once the browser trusts the page with it, and a
// slideshow the reader opened themselves usually is trusted. What was refused
// once is refused for the rest of the session, so it is only tried again for
// the first video.
const startsMuted = ref(false)

/** Whether the current photo is a video the browser is asked to play. */
const videoShown = computed<boolean>(() => !videoFailed.value
	&& (currentPhoto.value?.mime?.startsWith('video/') ?? false))

/**
 * Whether the slideshow waits for the video on screen instead of moving on
 * after the delay a still photo gets. A video the browser will not start is
 * not waited for, or the slideshow would never continue.
 *
 * The delay of the modal keeps running underneath: pausing it would leave a
 * timer of no time left behind, which fires the moment it is resumed.
 */
const waitsForVideo = computed<boolean>(() => videoShown.value && !videoEnded.value && !videoBlocked.value)

// The slideshow is only mounted when the user asked for it, so it plays right
// away instead of waiting for the play button of the modal to be pressed.
onMounted(() => modal.value?.togglePlayPause())
onMounted(playVideo)

// The modal takes the focus, so the shortcuts are bound to the document rather
// than to an element of the slideshow. `useHotKey` cannot carry them: it drops
// every press made while a modal is open, which the slideshow always is.
// Stepping through the photos and closing them are the modal's own shortcuts.
onMounted(() => document.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown))

watch([currentPhoto, exifShown], async ([photo, shown]) => {
	const request = ++pendingRequest
	exifEntries.value = []

	if (!shown || photo === undefined) {
		return
	}

	// The metadata is read from the file itself, which a photo of a collection is
	// only a reference to — `toPhotoTarget` resolves the one to the other.
	const entries = getExifSummary(await fetchPhotoExif(toPhotoTarget(photo)))

	if (request === pendingRequest) {
		exifEntries.value = entries
	}
})

// A video is loaded from scratch for every photo it is shown for, so what was
// found about the previous one says nothing about this one.
watch(currentPhoto, async () => {
	videoFailed.value = false
	videoEnded.value = false
	videoBlocked.value = false

	await nextTick()
	await playVideo()
})

function showNext(): void {
	index.value = (index.value + 1) % props.photos.length
}

function showPrevious(): void {
	index.value = (index.value - 1 + props.photos.length) % props.photos.length
}

/**
 * @param event - Set when the reader asked for the next photo themselves
 */
function onNext(event?: Event): void {
	// The modal asks for the next photo without an event when its delay ran out,
	// which a video is not cut off after: it is watched to its end, and the
	// slideshow moves on from there. Asking for the next photo by hand still
	// takes it away, the same as it does with a photo.
	if (event === undefined && waitsForVideo.value) {
		return
	}

	showNext()
}

/**
 * Plays the video of the current photo, if it is one.
 */
async function playVideo(): Promise<void> {
	const element = video.value

	if (element === null) {
		return
	}

	element.muted = startsMuted.value

	if (!await refusedToStart(element)) {
		return
	}

	// The photo may well have been moved on from while the browser was making up
	// its mind, and what it made of this video says nothing about the next one.
	if (element !== video.value) {
		return
	}

	// Browsers refuse to start a video with sound before the reader has shown
	// enough interest in the page. A muted one is always allowed, and the controls
	// of the video let the sound be turned back on.
	startsMuted.value = true
	element.muted = true

	if (await refusedToStart(element) && element === video.value) {
		// Nothing plays until the reader presses play, so the slideshow treats the
		// video as the still photo it shows the poster of.
		videoBlocked.value = true
	}
}

/**
 * Asks the browser to play a video.
 *
 * @param element - The video to play
 * @return Whether the browser turned the request down over its autoplay policy.
 * Every other outcome is one that trying again cannot get past: a file which
 * cannot be played errors out on its own, and playback the reader stopped in
 * the meantime is left stopped.
 */
async function refusedToStart(element: HTMLVideoElement): Promise<boolean> {
	try {
		await element.play()
		return false
	} catch (error) {
		return error instanceof DOMException && error.name === 'NotAllowedError'
	}
}

/**
 * Moves on once the video of the current photo has been watched.
 */
function onVideoEnded(): void {
	videoEnded.value = true

	if (modal.value?.playing !== true) {
		return
	}

	showNext()
	// The delay of the modal ran through the video, so the photo after it would
	// only be given whatever happens to be left of it.
	modal.value.resetSlideshow()
}

/**
 * @param event - The key press to handle
 */
function onKeyDown(event: KeyboardEvent): void {
	// The shortcuts are opt-out, the same as the ones of the server around them.
	if (shortcutsDisabled || event.ctrlKey || event.metaKey || event.altKey) {
		return
	}

	if (event.key === 'i') {
		exifShown.value = !exifShown.value
		return
	}

	// Space plays and pauses, unless a control has the focus: the press activates
	// that control on its own, and toggling on top of it would take it back.
	if (event.key === ' ' && !isControl(event.target)) {
		// Without this the page behind the slideshow scrolls as well, and the video
		// on screen would be toggled a second time by the browser itself.
		event.preventDefault()

		// The slideshow already waits for the video on screen, so space holds it
		// where the reader stopped it rather than starting the delay on top.
		if (videoShown.value && video.value !== null) {
			if (video.value.paused) {
				void video.value.play()
			} else {
				video.value.pause()
			}
			return
		}

		modal.value?.togglePlayPause()
	}
}

/**
 * @param target - Element a key press was aimed at
 * @return Whether the press belongs to that element rather than to the slideshow
 */
function isControl(target: EventTarget | null): boolean {
	return target instanceof Element && target.closest(CONTROL_SELECTOR) !== null
}
</script>

<style lang="scss" scoped>
.slideshow__photo {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.slideshow__position {
	position: absolute;
	inset-block-end: calc(var(--default-grid-baseline) * 4);
	inset-inline: 0;
	margin: 0;
	text-align: center;
	color: #fff;
	font-variant-numeric: tabular-nums;
	text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	pointer-events: none;
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
