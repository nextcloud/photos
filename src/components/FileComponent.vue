<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		class="file-container"
		data-test="media"
		:class="{ selected, 'file-container--stack': isStack, 'file-container--uncropped': !cropped }">
		<!--
			A tile standing for a run of photos taken in one go is drawn as a deck of
			cards: two backs peeking out behind the preview, which costs no further
			image to load, and a badge counting what is folded into it.
		-->
		<template v-if="isStack">
			<span class="stack-back stack-back--second" aria-hidden="true" />
			<span class="stack-back stack-back--first" aria-hidden="true" />
			<span
				class="stack-count"
				role="img"
				:aria-label="t('photos', '{count} photos taken in one go', { count: burstCount })">
				{{ burstCount }}
			</span>
		</template>

		<a
			ref="fileLink"
			class="file"
			:href="file.source"
			:aria-label="ariaLabel"
			@click.stop.prevent="onClick"
			@pointerdown="startLongPress"
			@pointerup="cancelLongPress"
			@pointercancel="cancelLongPress"
			@pointerleave="cancelLongPress"
			@mouseenter="schedulePreview"
			@mouseleave="cancelPreview">

			<!-- image and loading placeholder -->
			<div class="file__images">
				<div v-if="isVideo" class="file__duration">
					<span class="file__duration__label">{{ videoDuration }}</span>
					<PlayCircleOutlineIcon class="file__duration__icon" :size="16" />
				</div>
				<PlayCircleOutlineIcon v-else-if="file.attributes['metadata-files-live-photo'] !== undefined" :size="64" />

				<!--
					Three layers stacked on top of each other, each one fading in
					once its source is loaded: blurhash at the bottom, small
					thumbnail above it and the full preview on top.
					The layer beneath stays rendered while the one above fades in,
					which gives a blurred → pixelated → sharp progression.
				-->
				<template v-if="initialized">
					<NcBlurHash
						v-if="blurhash !== undefined"
						class="file__layer file__layer--blurhash"
						:hash="blurhash" />

					<!-- Sweeps over the blurhash, or over the empty tile when there is none, until a preview lands. -->
					<div
						v-if="!loadedSmall && !loadedLarge"
						class="file__layer file__layer--shimmer"
						aria-hidden="true" />

					<img
						v-if="!errorSmall"
						ref="imgSmall"
						:key="`${file.basename}-small`"
						class="file__layer file__layer--small"
						:class="{ 'file__layer--visible': loadedSmall }"
						:src="srcSmall"
						:alt="file.basename"
						decoding="async"
						fetchpriority="low"
						@load="onLoadSmall"
						@error="onErrorSmall">

					<img
						v-if="!errorLarge"
						ref="imgLarge"
						:key="`${file.basename}-large`"
						class="file__layer file__layer--large"
						:class="{ 'file__layer--visible': loadedLarge }"
						:src="srcLarge"
						:srcset="srcsetLarge"
						:alt="file.basename"
						decoding="async"
						:fetchpriority="loadedSmall ? 'high' : 'low'"
						loading="lazy"
						@load="onLoadLarge"
						@error="onErrorLarge">

					<!--
						The video of a tile, played on top of its preview while the
						pointer rests on it. It shows the same picture the layers below
						already do, so it is left out of the accessibility tree and
						carries no controls of its own.
					-->
					<video
						v-if="videoPreviewPlaying"
						ref="videoPreview"
						class="file__layer file__layer--video"
						:src="file.source"
						muted
						loop
						autoplay
						playsinline
						disablepictureinpicture
						disableremoteplayback
						preload="metadata"
						aria-hidden="true"
						tabindex="-1"
						@error="onVideoPreviewError" />
				</template>
			</div>
		</a>

		<NcCheckboxRadioSwitch
			v-if="allowSelection"
			class="selection-checkbox"
			:aria-label="t('photos', 'Select image {imageName}', { imageName: file.basename })"
			:modelValue="selected"
			@update:modelValue="onToggle" />

		<PhotoActionsMenu
			v-if="showActionsMenu"
			class="photo-actions-menu"
			:photo="photoTarget"
			@deleted="emit('deleted', $event)" />

		<Transition name="favorite-pop">
			<FavoriteIcon v-if="file.attributes.favorite === 1" class="favorite-state" />
		</Transition>
	</div>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { PhotoFile } from '../store/files.js'
import type { PhotoTarget } from '../utils/fileUtils.ts'
import type { Size } from '../utils/previewSize.ts'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import NcBlurHash from '@nextcloud/vue/components/NcBlurHash'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import PlayCircleOutlineIcon from 'vue-material-design-icons/PlayCircleOutline.vue'
import FavoriteIcon from './FavoriteIcon.vue'
import PhotoActionsMenu from './PhotoActionsMenu.vue'
import { logger } from '../services/logger.ts'
import { isCachedPreview } from '../services/PreviewService.js'
import { getVideoDurationFromUrl, toPhotoTarget } from '../utils/fileUtils.ts'
import { MAX_PIXEL_RATIO, observeSize, previewBox } from '../utils/previewSize.ts'
import { isPreviewableVideoMime, playsVideoPreviews, VIDEO_PREVIEW_DELAY } from '../utils/videoPreview.ts'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
	file: PhotoFile
	selected?: boolean
	allowSelection?: boolean
	// How many photos this tile stands for, one being itself. A tile standing for
	// several of them was folded out of a run of photos taken in one go, and is
	// drawn as a deck of cards carrying their count.
	burstCount?: number
	// Opt-out: the menu manages the photo it belongs to, which only gets in
	// the way where photos are being picked rather than managed.
	showActionsMenu?: boolean
	/**
	 * Whether the preview fills the tile, cropped to it, or is fit whole
	 * inside it. A grid laying its tiles out in the shape of the photos they
	 * hold has nothing to crop away, one laying them out as squares does.
	 */
	cropped?: boolean
}>(), {
	selected: false,
	allowSelection: true,
	burstCount: 1,
	// eslint-disable-next-line vue/no-boolean-default
	showActionsMenu: true,
	// eslint-disable-next-line vue/no-boolean-default
	cropped: true,
})

const emit = defineEmits<{
	click: [fileid: number]
	selectToggled: [toggle: { id: number, value: boolean }]
	deleted: [photo: PhotoTarget]
}>()

// The dashboard widget mounts this component without a router.
const route: RouteLocationNormalizedLoaded | undefined = useRoute()
const isMobile = useIsMobile()

const fileLink = useTemplateRef<HTMLAnchorElement>('fileLink')
const imgSmall = useTemplateRef<HTMLImageElement>('imgSmall')
const imgLarge = useTemplateRef<HTMLImageElement>('imgLarge')
const videoPreview = useTemplateRef<HTMLVideoElement>('videoPreview')

const initialized = ref(false)
const loadedSmall = ref(false)
const errorSmall = ref(false)
const loadedLarge = ref(false)
const errorLarge = ref(false)
const videoDuration = ref('')
let longPressTimeout: null | ReturnType<typeof setTimeout> = null
const longPressed = ref(false)
const videoPreviewPlaying = ref(false)
let videoPreviewTimeout: null | ReturnType<typeof setTimeout> = null
// A video that could not be played once is not tried again, or a broken
// file would fire a load on every pass of the pointer.
const videoPreviewFailed = ref(false)
// The largest size the tile was laid out at for the current file. A tile that
// shrinks keeps the preview it has rather than loading a smaller one.
const tileSize = ref<Size>({ width: 0, height: 0 })
let stopObservingSize = () => {}

const photoTarget = computed<PhotoTarget>(() => toPhotoTarget(props.file))

const ariaLabel = computed<string>(() => {
	if (props.file.attributes.favorite) {
		return t('photos', 'Favorite image, open the full size "{name}" image', { name: props.file.basename })
	}
	return t('photos', 'Open the full size "{name}" image', { name: props.file.basename })
})

const isStack = computed<boolean>(() => props.burstCount > 1)

const isVideo = computed<boolean>(() => props.file.mime?.includes('video') ?? false)

const decodedEtag = computed<string>(() => props.file.attributes.etag.replace('&quot;', '').replace('&quot;', ''))

const photoSize = computed<Size | undefined>(() => props.file.attributes['metadata-photos-size'])

// Until the tile is laid out, a size large enough for any tile of the form factor.
const srcLarge = computed<string>(() => {
	const box = previewBox(tileSize.value, photoSize.value, props.cropped, 1)
	if (box === undefined) {
		const size = isMobile.value ? 256 : 1024
		return getItemURL(size, size)
	}
	return getItemURL(box.width, box.height)
})

const srcLarge2x = computed<string>(() => {
	const box = previewBox(tileSize.value, photoSize.value, props.cropped, MAX_PIXEL_RATIO)
	return box === undefined ? srcLarge.value : getItemURL(box.width, box.height)
})

// Lets the browser pick the preview matching the pixel ratio of the screen.
const srcsetLarge = computed<string | undefined>(() => srcLarge2x.value === srcLarge.value ? undefined : `${srcLarge.value} 1x, ${srcLarge2x.value} 2x`)

const srcSmall = computed<string>(() => getItemURL(64, 64))

const blurhash = computed<string | undefined>(() => props.file.attributes['metadata-blurhash'])

const isPreviewableVideo = computed<boolean>(() => isPreviewableVideoMime(props.file.mime))

watch(() => props.file, async () => {
	initialized.value = false
	loadedSmall.value = false
	errorSmall.value = false
	loadedLarge.value = false
	errorLarge.value = false
	videoDuration.value = ''

	// The grid recycles a tile for the next photo as it scrolls, so what was
	// found about the previous one says nothing about this one.
	cancelPreview()
	videoPreviewFailed.value = false
	tileSize.value = { width: 0, height: 0 }

	// Measured once the tile is laid out for the new file.
	await nextTick()
	await init()
})

async function init() {
	if (fileLink.value !== null) {
		growTileSize({ width: fileLink.value.clientWidth, height: fileLink.value.clientHeight })
	}

	[loadedSmall.value, loadedLarge.value] = await Promise.all([
		await isCachedPreview(srcSmall.value),
		await isCachedPreview(window.devicePixelRatio > 1 ? srcLarge2x.value : srcLarge.value),
	])

	initialized.value = true

	await getVideoDuration()
}

function onClick() {
	// A long press toggles the selection, the click it ends with must
	// not open the file on top of it.
	if (longPressed.value) {
		longPressed.value = false
		return
	}

	emit('click', props.file.fileid)
}

// Long pressing a file selects it, which is easier to hit on a touch
// device than the checkbox.
function startLongPress() {
	if (!props.allowSelection) {
		return
	}

	cancelLongPress()
	longPressed.value = false
	longPressTimeout = setTimeout(() => {
		longPressed.value = true
		onToggle(!props.selected)
	}, 500)
}

function cancelLongPress() {
	if (longPressTimeout !== null) {
		clearTimeout(longPressTimeout)
		longPressTimeout = null
	}
}

/**
 * @param size - Size the tile is laid out at
 */
function growTileSize(size: Size) {
	if (size.width > tileSize.value.width || size.height > tileSize.value.height) {
		tileSize.value = {
			width: Math.max(size.width, tileSize.value.width),
			height: Math.max(size.height, tileSize.value.height),
		}
	}
}

function onLoadSmall() {
	loadedSmall.value = true
}

function onLoadLarge() {
	loadedLarge.value = true
}

function onErrorSmall() {
	errorSmall.value = true
}

function onErrorLarge() {
	errorLarge.value = true
}

// Start playing the video of a tile once the pointer has rested on it, which
// is what keeps a sweep across the grid from loading every video it passes.
function schedulePreview() {
	if (!isPreviewableVideo.value || videoPreviewFailed.value || !playsVideoPreviews()) {
		return
	}

	cancelPreview()
	videoPreviewTimeout = setTimeout(() => {
		videoPreviewTimeout = null
		videoPreviewPlaying.value = true
	}, VIDEO_PREVIEW_DELAY)
}

function cancelPreview() {
	if (videoPreviewTimeout !== null) {
		clearTimeout(videoPreviewTimeout)
		videoPreviewTimeout = null
	}

	if (!videoPreviewPlaying.value) {
		return
	}

	// Emptying the source before the element goes away is what makes the
	// browser let go of the buffered video instead of holding on to it.
	const video = videoPreview.value
	if (video !== null) {
		video.pause()
		video.removeAttribute('src')
		video.load()
	}

	videoPreviewPlaying.value = false
}

function onVideoPreviewError() {
	videoPreviewFailed.value = true
	videoPreviewPlaying.value = false
}

function onToggle(value: boolean) {
	emit('selectToggled', { id: props.file.fileid, value })
}

function getItemURL(width: number, height: number): string {
	const token = route?.params.token
	if (token) {
		return generateUrl(`/apps/photos/api/v1/publicPreview/${props.file.fileid}?etag=${decodedEtag.value}&x=${width}&y=${height}&token=${token}`)
	} else {
		return generateUrl(`/apps/photos/api/v1/preview/${props.file.fileid}?etag=${decodedEtag.value}&x=${width}&y=${height}`)
	}
}

async function getVideoDuration() {
	if (!isVideo.value) {
		return
	}

	try {
		const totalSeconds = await getVideoDurationFromUrl(props.file.source)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		if (hours > 0) {
			videoDuration.value = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
		}

		videoDuration.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	} catch (error) {
		logger.error('Failed to get video duration for file', { error, filename: props.file.basename })
	}
}

onMounted(async () => {
	if (fileLink.value !== null) {
		stopObservingSize = observeSize(fileLink.value, growTileSize)
	}
	await init()
})

onBeforeUnmount(() => {
	// cancel any pending load
	if (imgSmall.value !== null) {
		imgSmall.value.src = ''
	}
	if (imgLarge.value !== null) {
		imgLarge.value.srcset = ''
		imgLarge.value.src = ''
	}

	cancelLongPress()
	cancelPreview()
	stopObservingSize()
})
</script>

<style lang="scss" scoped>
// The magnify a tile answers a hover with. Carried by every preview layer, so
// that blurhash, small and large stay in lockstep and do not slide against each
// other. The curve is ease-out-quint: quick to answer the pointer, then settling
// slowly into the final scale. Layers that transition something of their own
// have to list this alongside it, as the shorthand would otherwise drop it.
$magnify-transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);

.file-container {
	// How much of the tile is left to the card backs of a folded run of photos.
	// Zero for a tile standing for a single photo, so its preview and everything
	// overlaid on it keep filling the whole tile.
	--stack-peek: 0px;
	// How the preview meets its tile: filling it, or fit whole inside it.
	--preview-fit: cover;
	contain: strict;
	background: var(--color-primary-element-light);
	position: relative;
	height: 100%;
	width: 100%;
	border: 2px solid var(--color-main-background); // Use border so create a separation between images.
	box-sizing: border-box;
	transition: transform var(--animation-quick) ease-out, box-shadow var(--animation-quick) ease-out;

	// A tile standing for a run of photos taken in one go pads the corner the deck
	// peeks out of, so that the cards stay inside the tile instead of covering the
	// photo next to it.
	&--stack {
		--stack-peek: 6px;
		padding-inline-end: var(--stack-peek);
		padding-block-end: var(--stack-peek);
	}

	&--uncropped {
		--preview-fit: contain;
	}

	// The two card backs, each one further out of the corner than the one before.
	// Drawn rather than loaded, so a deck costs no further preview.
	.stack-back {
		position: absolute;
		inset-block-start: calc(var(--stack-peek) / 2);
		inset-inline-start: calc(var(--stack-peek) / 2);
		z-index: 0; // below the preview layers
		width: calc(100% - var(--stack-peek));
		height: calc(100% - var(--stack-peek));
		box-sizing: border-box;
		border: 2px solid var(--color-main-background); // The separation the tile itself uses.
		background: var(--color-background-dark);
		pointer-events: none;

		&--second {
			inset-block-start: var(--stack-peek);
			inset-inline-start: var(--stack-peek);
			opacity: 0.6;
		}
	}

	// How many photos the deck holds. In the corner the checkbox, the actions and
	// the favorite star leave free, so it never has to hide for one of them.
	.stack-count {
		position: absolute;
		inset-block-end: calc(8px + var(--stack-peek));
		inset-inline-start: 8px;
		z-index: 6; // above the preview layers and the overlays
		height: 24px;
		min-width: 24px;
		padding-inline: 8px;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--border-radius-pill);
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		font-weight: 600;
		// Tabular figures, so the badge does not jitter as the count grows.
		font-variant-numeric: tabular-nums;
		pointer-events: none;
	}

	// Hovering lifts the tile with a soft shadow and magnifies the preview inside
	// it, clipped by the tile's paint containment. Gated on `:not(.selected)` so
	// the selection visual above stays the dominant state.
	&:hover:not(.selected) {
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
		z-index: 1;

		.file__layer--small,
		.file__layer--large,
		.file__layer--blurhash,
		.file__layer--video {
			transform: scale(1.07);
		}
	}

	// Reduced motion keeps the shadow, which does not move, and drops the magnify.
	@media (prefers-reduced-motion: reduce) {
		&:hover:not(.selected) {
			.file__layer--small,
			.file__layer--large,
			.file__layer--blurhash {
				transform: none;
			}
		}
	}

	// Selected images shrink into a glowing frame, which is softer than an
	// outline and does not fight the photo for attention.
	&.selected {
		transform: scale(0.97);
		box-shadow:
			0 0 0 3px var(--color-primary-element),
			0 6px 18px rgba(0, 0, 0, 0.18);
		z-index: 2;
	}

	// Keyboard focus keeps an outline, so that it stays distinct from selection.
	&:focus-within,
	&:has(:focus) {
		&::after {
			position: absolute;
			top: 0;
			inset-inline-start: 0;
			z-index: 5; // above the preview layers
			width: 100%;
			height: 100%;
			content: '';
			outline: var(--color-primary-element) solid 4px;
			outline-offset: -4px;
			pointer-events: none;
		}

		.selection-checkbox {
			opacity: 1;
		}
	}

	.file {
		// The preview layers and the duration belong to the picture rather than to
		// the tile, so they are positioned against the link holding them: it is the
		// same box, until a deck of cards leaves it the tile minus `--stack-peek`.
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		outline: none; // Override global focus state.
		display: flex; // Fill parent size

		&__images {
			width: 100%;
			height: 100%;

			.file__layer {
				position: absolute;
				top: 0;
				inset-inline-start: 0;
				width: 100%;
				height: 100%;
				object-fit: var(--preview-fit);
				color: transparent; // Hide alt='' text when loading.
				transition: $magnify-transition;
			}

			.file__layer--blurhash {
				z-index: 1;
			}

			.file__layer--shimmer {
				z-index: 2;
				pointer-events: none;
				background-image: linear-gradient(115deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0) 70%);
				background-size: 220% 100%;
				background-repeat: no-repeat;
				animation: file-layer-shimmer 1500ms linear infinite;

				@media (prefers-reduced-motion: reduce) {
					animation: none;
				}
			}

			.file__layer--small {
				z-index: 2;
				opacity: 0;
				transition: $magnify-transition, opacity var(--animation-quick) ease-out;
			}

			.file__layer--large {
				z-index: 3;
				opacity: 0;
				transition: $magnify-transition, opacity var(--animation-slow) ease-out;
			}

			.file__layer--visible {
				opacity: 1;
			}

			// The video is the freshest picture of the file, so it covers the still
			// layers. It fades in over them rather than replacing them at once, and
			// crops the same way, so that the swap reads as the picture coming alive
			// instead of as a second one being put on top.
			.file__layer--video {
				z-index: 4;
				animation: file-layer-video-fade-in var(--animation-quick) ease-out;

				@media (prefers-reduced-motion: reduce) {
					animation: none;
				}
			}
		}

		&__duration {
			position: absolute;
			bottom: 8px;
			inset-inline-end: 8px;
			height: 24px;
			display: inline-flex;
			align-items: center;
			gap: 4px;
			padding: 0 8px;
			border-radius: var(--border-radius);
			background: rgba(0, 0, 0, 0.4);
			color: #fff;
			z-index: 5; // above the preview layers, the playing video among them

			&__label {
				font-weight: 600;
			}
		}
	}

	// Reveal checkbox and actions menu on hover. A selected tile keeps its
	// checkbox only, so that a selection is not cluttered with actions buttons.
	&:hover,
	&:has(:focus-visible) {
		.photo-actions-menu {
			opacity: 1;
		}
	}

	&:hover,
	&.selected,
	&:focus-within {
		.selection-checkbox {
			opacity: 1;
		}

		.favorite-state {
			display: none;
		}
	}

	// A small translucent ring, as in other photo apps, rather than a boxed
	// checkbox: it shows that the tile can be selected without covering the photo.
	.selection-checkbox {
		opacity: 0;
		transition: opacity var(--animation-quick) ease-out;
		position: absolute;
		top: 8px;
		// Keep the ring inside narrow images.
		inset-inline-end: calc(min(8px, calc(50% - 11px)) + var(--stack-peek));
		z-index: 5; // above the preview layers
		width: fit-content;

		:deep(.checkbox-radio-switch__content) {
			flex: 0 0 22px;
			width: 22px;
			min-width: 22px;
			max-width: none;
			height: 22px;
			min-height: 0;
			padding: 0;
			gap: 0;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px solid rgba(255, 255, 255, 0.9);
			border-radius: 50%;
			// The component paints its own hover and focus backgrounds with more
			// specific selectors, which would replace the ring's colours.
			background-color: rgba(0, 0, 0, 0.15) !important;
			box-shadow: 0 0 3px rgba(0, 0, 0, 0.45);
			transition: background-color var(--animation-quick) ease-out;

			&:hover {
				background-color: rgba(0, 0, 0, 0.35) !important;
			}
		}

		:deep(.checkbox-radio-switch__icon) {
			display: none;
		}

		:deep(.checkbox-radio-switch__input:focus-visible + .checkbox-radio-switch__content) {
			outline: 2px solid var(--color-main-background);
			box-shadow: 0 0 0 4px var(--color-primary-element);
		}

		&.checkbox-radio-switch--checked :deep(.checkbox-radio-switch__content) {
			border-color: var(--color-primary-element-text);
			background-color: var(--color-primary-element) !important;

			// Check mark
			&::before {
				content: '';
				width: 5px;
				height: 9px;
				margin-top: -2px;
				border: solid var(--color-primary-element-text);
				border-width: 0 2px 2px 0;
				transform: rotate(45deg);
			}
		}

		.input-label {
			position: fixed;
			z-index: -1;
			top: -5000px;
			inset-inline-start: -5000px;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.favorite-state {
		position: absolute;
		z-index: 5; // above the preview layers
		top: 2px;
		// Fancy calculation to render the start in the middle of narrow images.
		inset-inline-end: calc(min(2px, calc(50% - 7px)) + var(--stack-peek));
	}

	// The star pops in when an image is marked as favorite, and fades out when
	// it is not one anymore. Both stay short so that marking a whole selection
	// still feels snappy.
	.favorite-pop-enter-active {
		transform-origin: center;
		animation: favorite-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.favorite-pop-leave-active {
		transition: opacity var(--animation-quick) ease-out, transform var(--animation-quick) ease-out;
	}

	.favorite-pop-leave-to {
		opacity: 0;
		transform: scale(0.8);
	}

	@media (prefers-reduced-motion: reduce) {
		.favorite-pop-enter-active,
		.favorite-pop-leave-active {
			animation: none;
			transition: none;
		}
	}
}

@keyframes file-layer-video-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes file-layer-shimmer {
	0% { background-position: 120% 0; }
	100% { background-position: -120% 0; }
}

@keyframes favorite-pop {
	0% { opacity: 0; transform: scale(0.5); }
	60% { opacity: 1; transform: scale(1.25); }
	100% { opacity: 1; transform: scale(1); }
}
</style>
