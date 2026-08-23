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
		<!-- Zoom/pan surface: pinch or wheel to zoom, drag to pan, double-tap to toggle. -->
		<div
			v-if="currentPhoto !== undefined"
			ref="viewport"
			class="slideshow__viewport"
			:class="{
				'slideshow__viewport--zoomed': scale > MIN_SCALE,
				'slideshow__viewport--interacting': interacting,
			}"
			@pointerdown="onPointerDown"
			@pointermove="onPointerMove"
			@pointerup="onPointerUp"
			@pointercancel="onPointerUp"
			@wheel.prevent="onWheel"
			@dblclick="onDoubleClick">
			<img
				class="slideshow__photo"
				:style="imageStyle"
				:src="getPreviewUrl(currentPhoto, PREVIEW_SIZE)"
				:alt="currentPhoto.basename"
				draggable="false">
		</div>

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

import { translate as t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NcModal from '@nextcloud/vue/components/NcModal'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { getExifSummary } from '../utils/exif.ts'
import { getPreviewUrl, toPhotoTarget } from '../utils/fileUtils.ts'
import { clampOffset, clampScale, distance, MIN_SCALE, toggledScale } from '../utils/panZoom.ts'

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

// --- Zoom & pan state ---------------------------------------------------------
const viewport = ref<HTMLElement | null>(null)
const scale = ref(MIN_SCALE)
const offsetX = ref(0)
const offsetY = ref(0)
/** True while a pointer gesture is in progress, to drop the zoom transition. */
const interacting = ref(false)

/** Live pointers by id, so one is a pan and two are a pinch. */
const pointers = new Map<number, { x: number, y: number }>()
let pinchStartDistance = 0
let pinchStartScale = MIN_SCALE
let lastPanX = 0
let lastPanY = 0

const imageStyle = computed(() => ({
	transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
}))

/** Reset to the fitted, centred photo — on open, on zoom-out and on photo change. */
function resetZoom(): void {
	scale.value = MIN_SCALE
	offsetX.value = 0
	offsetY.value = 0
}

function clampPan(x: number, y: number): void {
	const width = viewport.value?.clientWidth ?? 0
	const height = viewport.value?.clientHeight ?? 0
	offsetX.value = clampOffset(x, scale.value, width)
	offsetY.value = clampOffset(y, scale.value, height)
}

/**
 * Apply a new zoom (clamped), pausing the slideshow so it does not advance past it.
 *
 * @param next - Desired zoom before clamping
 */
function setScale(next: number): void {
	const clamped = clampScale(next)
	if (clamped > MIN_SCALE) {
		pauseAutoplay()
		scale.value = clamped
		clampPan(offsetX.value, offsetY.value)
	} else {
		resetZoom()
	}
}

function onPointerDown(event: PointerEvent): void {
	pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
	interacting.value = true

	if (pointers.size === 2) {
		const [a, b] = [...pointers.values()]
		pinchStartDistance = distance(a, b)
		pinchStartScale = scale.value
		pointers.forEach((_, id) => (event.target as Element).setPointerCapture?.(id))
		// Don't let the pinch reach the modal's swipe navigation.
		event.stopPropagation()
	} else if (scale.value > MIN_SCALE) {
		// A single drag pans only once zoomed; otherwise it stays a modal swipe.
		lastPanX = event.clientX
		lastPanY = event.clientY;
		(event.target as Element).setPointerCapture?.(event.pointerId)
		event.stopPropagation()
	}
}

function onPointerMove(event: PointerEvent): void {
	if (!pointers.has(event.pointerId)) {
		return
	}
	pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

	if (pointers.size >= 2) {
		const [a, b] = [...pointers.values()]
		if (pinchStartDistance > 0) {
			setScale(pinchStartScale * (distance(a, b) / pinchStartDistance))
		}
		event.stopPropagation()
	} else if (scale.value > MIN_SCALE) {
		clampPan(offsetX.value + event.clientX - lastPanX, offsetY.value + event.clientY - lastPanY)
		lastPanX = event.clientX
		lastPanY = event.clientY
		event.stopPropagation()
	}
}

function onPointerUp(event: PointerEvent): void {
	pointers.delete(event.pointerId)
	if (pointers.size < 2) {
		pinchStartDistance = 0
	}
	// If one finger is left after a pinch, keep panning from where it is.
	if (pointers.size === 1) {
		const [remaining] = [...pointers.values()]
		lastPanX = remaining.x
		lastPanY = remaining.y
	}
	if (pointers.size === 0) {
		interacting.value = false
	}
}

/**
 * Zoom with the mouse wheel. Typed structurally rather than as `WheelEvent`,
 * which collides with the React JSX event types in the type environment and
 * vue-tsc then rejects on a native element.
 *
 * @param event - The wheel event, of which only the scroll amount is used
 * @param event.deltaY - Vertical scroll amount; its sign gives the zoom direction
 */
function onWheel(event: { deltaY: number }): void {
	setScale(scale.value - Math.sign(event.deltaY) * 0.3)
}

function onDoubleClick(): void {
	setScale(toggledScale(scale.value))
}

// A photo change (manual, or the slideshow advancing) starts fresh at fit.
watch(index, resetZoom)

const positionLabel = computed<string>(() => t('photos', '{position} of {count}', {
	position: index.value + 1,
	count: props.photos.length,
}))

/** Elements a key press belongs to rather than to the slideshow around them. */
const CONTROL_SELECTOR = 'button, a[href], input, select, textarea, [contenteditable]'

/** Whether the metadata of the current photo is shown, toggled with the `i` key. */
const exifShown = ref(false)
const exifEntries = ref<ExifEntry[]>([])

/** Discards the metadata of a photo which is not on screen anymore. */
let pendingRequest = 0

/** Best-effort mirror of the modal's slideshow play state (see pauseAutoplay). */
const isPlaying = ref(false)

// The slideshow is only mounted when the user asked for it, so it plays right
// away instead of waiting for the play button of the modal to be pressed.
onMounted(() => {
	modal.value?.togglePlayPause()
	isPlaying.value = true
})

/**
 * Pause the slideshow so it stops advancing while the user inspects a zoomed
 * photo. The modal only exposes a toggle, so we track our own play flag; if the
 * user also uses the modal's own play button the two can desync, which at worst
 * costs one extra tap to resume — never a broken state.
 */
function pauseAutoplay(): void {
	if (isPlaying.value) {
		modal.value?.togglePlayPause()
		isPlaying.value = false
	}
}

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

	// The metadata is read from the file itself, which a photo of a collection is
	// only a reference to — `toPhotoTarget` resolves the one to the other.
	const entries = getExifSummary(await fetchPhotoExif(toPhotoTarget(photo)))

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
	if (event.ctrlKey || event.metaKey || event.altKey) {
		return
	}

	if (event.key === 'i') {
		exifShown.value = !exifShown.value
		return
	}

	// Zoom from the keyboard, so pointer gestures are not the only way in.
	if (event.key === '+' || event.key === '=') {
		event.preventDefault()
		setScale(scale.value + 0.5)
		return
	}
	if (event.key === '-') {
		event.preventDefault()
		setScale(scale.value - 0.5)
		return
	}
	if (event.key === '0') {
		event.preventDefault()
		resetZoom()
		return
	}

	// Space plays and pauses, unless a control has the focus: the press activates
	// that control on its own, and toggling on top of it would take it back.
	if (event.key === ' ' && !isControl(event.target)) {
		// Without this the page behind the slideshow scrolls as well.
		event.preventDefault()
		modal.value?.togglePlayPause()
		isPlaying.value = !isPlaying.value
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
.slideshow__viewport {
	display: flex;
	width: 100%;
	height: 100%;
	overflow: hidden;
	// We drive zoom and pan ourselves, so suppress the browser's own touch gestures.
	touch-action: none;

	&--zoomed {
		cursor: grab;
	}

	&--zoomed.slideshow__viewport--interacting {
		cursor: grabbing;
	}
}

.slideshow__photo {
	width: 100%;
	height: 100%;
	object-fit: contain;
	transform-origin: center center;
	transition: transform var(--animation-quick) ease-out;
	// Drag pans the photo; it should never start a native image drag or selection.
	user-select: none;
	-webkit-user-drag: none;
}

// No transition mid-gesture, so a pinch or drag tracks the fingers exactly.
.slideshow__viewport--interacting .slideshow__photo {
	transition: none;
}

@media (prefers-reduced-motion: reduce) {
	.slideshow__photo {
		transition: none;
	}
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
