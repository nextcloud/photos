<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- On the body, so the frame covers the header and the navigation of the page. -->
	<Teleport to="body">
		<div
			ref="root"
			class="photo-frame"
			:class="{ 'photo-frame--idle': idle }"
			tabindex="-1"
			@pointermove="wake"
			@pointerdown="wake">
			<img
				v-for="slide in slides"
				:key="slide.key"
				class="photo-frame__slide"
				:class="{ 'photo-frame__slide--active': slide.key === activeKey }"
				:style="slide.style"
				:src="slide.url"
				:alt="slide.alt">

			<NcEmptyContent
				v-if="slides.length === 0"
				class="photo-frame__empty"
				:name="loading ? t('photos', 'Loading photos…') : t('photos', 'No photos to show')"
				:description="loading ? '' : t('photos', 'Choose other photos for the frame in its settings.')">
				<template #icon>
					<NcLoadingIcon v-if="loading" />
					<ImageFrame v-else />
				</template>
			</NcEmptyContent>

			<div v-if="currentPhoto !== undefined" class="photo-frame__info">
				<span v-if="place !== ''" class="photo-frame__info__place">{{ place }}</span>
				<span>{{ currentDate }}</span>
			</div>

			<div
				ref="toolbar"
				class="photo-frame__toolbar"
				role="toolbar"
				:aria-label="t('photos', 'Photo frame')">
				<NcButton
					variant="tertiary"
					:aria-label="t('photos', 'Previous photo')"
					:disabled="photos.length < 2"
					@click="previous">
					<template #icon>
						<ChevronLeft :size="32" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:aria-label="playing ? t('photos', 'Pause') : t('photos', 'Play')"
					@click="togglePlaying">
					<template #icon>
						<Pause v-if="playing" :size="32" />
						<Play v-else :size="32" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:aria-label="t('photos', 'Next photo')"
					:disabled="photos.length < 2"
					@click="next">
					<template #icon>
						<ChevronRight :size="32" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:aria-label="t('photos', 'Settings')"
					@click="settingsOpen = true">
					<template #icon>
						<CogOutline :size="32" />
					</template>
				</NcButton>
				<NcButton
					v-if="fullscreenSupported"
					variant="tertiary"
					:aria-label="fullscreen ? t('photos', 'Exit full screen') : t('photos', 'Full screen')"
					@click="toggleFullscreen">
					<template #icon>
						<FullscreenExit v-if="fullscreen" :size="32" />
						<Fullscreen v-else :size="32" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:aria-label="t('photos', 'Close photo frame')"
					@click="close">
					<template #icon>
						<Close :size="32" />
					</template>
				</NcButton>
			</div>

			<PhotoFrameSettings
				v-if="settingsOpen"
				v-model="settings"
				@close="closeSettings" />
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { FrameSettings } from '../utils/photoFrame.ts'

import { t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
import Close from 'vue-material-design-icons/Close.vue'
import CogOutline from 'vue-material-design-icons/CogOutline.vue'
import Fullscreen from 'vue-material-design-icons/Fullscreen.vue'
import FullscreenExit from 'vue-material-design-icons/FullscreenExit.vue'
import ImageFrame from 'vue-material-design-icons/ImageFrame.vue'
import Pause from 'vue-material-design-icons/Pause.vue'
import Play from 'vue-material-design-icons/Play.vue'
import PhotoFrameSettings from '../components/PhotoFrameSettings.vue'
import { imageMimes } from '../services/AllowedMimes.ts'
import { fetchCollectionFiles } from '../services/collectionFetcher.ts'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { logger } from '../services/logger.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { albumFilesExtraProps, albumsPrefix } from '../store/albums.ts'
import { formatDate } from '../utils/dateUtils.ts'
import { getPreviewUrl, toPhotoTarget } from '../utils/fileUtils.ts'
import { createPlaylist, createPreloader, getPhotoFit, getPreviewSize, loadFrameSettings, loadImage, saveFrameSettings } from '../utils/photoFrame.ts'

type Slide = {
	key: number
	photo: PhotoFile
	url: string
	alt: string
	style: Record<string, string>
}

/** Most photos fetched for one round of the frame. */
const MAX_PHOTOS = 1000

/** Time the cross-fade between two photos takes, in milliseconds. */
const FADE_DURATION = 2000

/** Time without input after which the controls and the cursor are hidden, in milliseconds. */
const IDLE_DELAY = 3000

/** Start and end of the slow pan and zoom, varied from one photo to the next. */
const MOTIONS = [
	['scale(1)', 'scale(1.1) translate(2%, 1%)'],
	['scale(1.1) translate(-2%, 1%)', 'scale(1)'],
	['scale(1)', 'scale(1.1) translate(-2%, -1%)'],
	['scale(1.1) translate(2%, -1%)', 'scale(1)'],
]

const router = useRouter()

const root = ref<HTMLElement | null>(null)
const toolbar = ref<HTMLElement | null>(null)

const settings = ref<FrameSettings>(loadFrameSettings())
const settingsOpen = ref(false)

const photos = shallowRef<PhotoFile[]>([])
const position = ref(-1)
const loading = ref(false)
const playing = ref(true)
const idle = ref(false)

/** The photo on screen and the one fading out below it. */
const slides = shallowRef<Slide[]>([])
const activeKey = ref(0)

const place = ref('')

const fullscreenSupported = document.fullscreenEnabled === true
const fullscreen = ref(false)

const preload = createPreloader(loadImage)

let slideTimer: ReturnType<typeof setTimeout> | undefined
let idleTimer: ReturnType<typeof setTimeout> | undefined
let showRequest = 0
let failedInARow = 0
let wakeLock: WakeLockSentinel | null = null
let unmounted = false

const currentPhoto = computed(() => slides.value.find((slide) => slide.key === activeKey.value)?.photo)

const currentDate = computed(() => {
	const photo = currentPhoto.value
	if (photo === undefined) {
		return ''
	}

	const takenAt = photo.attributes['metadata-photos-original_date_time']
	const date = takenAt ? new Date(takenAt * 1000) : photo.mtime
	return date ? formatDate(date) : ''
})

watch(currentPhoto, async (photo) => {
	place.value = ''
	if (photo === undefined) {
		return
	}

	const { place: photoPlace } = await fetchPhotoExif(toPhotoTarget(photo))
	if (photo === currentPhoto.value) {
		place.value = photoPlace ?? ''
	}
})

watch(settings, (value, previousValue) => {
	saveFrameSettings(value)

	if (value.source !== previousValue.source || value.albumName !== previousValue.albumName || value.shuffle !== previousValue.shuffle) {
		start()
	} else {
		schedule()
	}
})

onMounted(() => {
	root.value?.focus()
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('visibilitychange', requestWakeLock)
	document.addEventListener('fullscreenchange', onFullscreenChange)
	requestWakeLock()
	wake()
	start()
})

onBeforeUnmount(() => {
	unmounted = true
	// Drops the photo being loaded, so no timer is planned after leaving.
	showRequest++
	clearTimeout(slideTimer)
	clearTimeout(idleTimer)
	document.removeEventListener('keydown', onKeyDown)
	document.removeEventListener('visibilitychange', requestWakeLock)
	document.removeEventListener('fullscreenchange', onFullscreenChange)
	wakeLock?.release()
	if (document.fullscreenElement) {
		document.exitFullscreen().catch(() => {})
	}
})

/**
 * @param frameSettings - Settings naming the photos to play
 * @return The photos the settings name, images only
 */
async function fetchPhotos(frameSettings: FrameSettings): Promise<PhotoFile[]> {
	const { source, albumName } = frameSettings
	if (source === 'album') {
		if (albumName === '') {
			return []
		}

		const files = await fetchCollectionFiles(`${albumsPrefix}/${albumName}`, {}, albumFilesExtraProps)
		return files.filter((file) => (imageMimes as string[]).includes(file.mime ?? '')) as PhotoFile[]
	}

	return await getPhotos({
		mimesType: imageMimes,
		onThisDay: source === 'onThisDay',
		onlyFavorites: source === 'favorites',
		nbResults: MAX_PHOTOS,
	}) as PhotoFile[]
}

/**
 * Fetch the photos for a new round of the frame.
 */
async function loadPhotos(): Promise<void> {
	loading.value = true
	try {
		const files = await fetchPhotos(settings.value)
		photos.value = createPlaylist(files, {
			shuffled: settings.value.shuffle,
			avoidFirst: currentPhoto.value?.fileid,
			key: (file) => file.fileid,
		})
	} catch (error) {
		logger.error('Could not fetch the photos of the photo frame', { error })
		photos.value = []
	} finally {
		loading.value = false
	}
}

/**
 * Start playing from the first photo of the current settings.
 */
async function start(): Promise<void> {
	clearTimeout(slideTimer)
	showRequest++
	await loadPhotos()
	if (photos.value.length === 0) {
		slides.value = []
		return
	}
	failedInARow = 0
	show(0)
}

/**
 * Cross-fade to a photo of the playlist once it is loaded at screen size.
 *
 * @param index - Index of the photo in the playlist
 */
async function show(index: number): Promise<void> {
	const photo = photos.value[index]
	if (photo === undefined || unmounted) {
		return
	}

	clearTimeout(slideTimer)
	const request = ++showRequest
	const size = getPreviewSize(window.innerWidth, window.innerHeight, window.devicePixelRatio)
	const url = getPreviewUrl(photo, size)

	try {
		await preload(url)
	} catch (error) {
		if (request !== showRequest) {
			return
		}
		// A photo without preview is skipped, unless none of them has one.
		logger.warn('Could not load a photo of the photo frame', { error, fileid: photo.fileid })
		position.value = index
		if (++failedInARow < photos.value.length) {
			next()
		}
		return
	}

	if (request !== showRequest) {
		return
	}

	failedInARow = 0
	position.value = index
	const [from, to] = MOTIONS[request % MOTIONS.length]
	const fit = getPhotoFit(photo.attributes['metadata-photos-size'], { width: window.innerWidth, height: window.innerHeight })
	slides.value = [
		...slides.value.filter((slide) => slide.key === activeKey.value),
		{
			key: request,
			photo,
			url,
			alt: toPhotoTarget(photo).basename,
			style: {
				'--photo-frame-fit': fit,
				'--photo-frame-motion-from': from,
				'--photo-frame-motion-to': to,
				'--photo-frame-motion-duration': `${settings.value.interval * 1000 + FADE_DURATION}ms`,
			},
		},
	]
	activeKey.value = request
	schedule()

	const following = photos.value[index + 1]
	if (following !== undefined) {
		preload(getPreviewUrl(following, size)).catch(() => {})
	}
}

/**
 * Show the next photo, starting a new round after the last one so photos
 * added since, or a new day of "On this day", are picked up.
 */
async function next(): Promise<void> {
	if (position.value + 1 < photos.value.length) {
		return show(position.value + 1)
	}

	if (!loading.value) {
		await start()
	}
}

function previous(): void {
	show((position.value - 1 + photos.value.length) % photos.value.length)
}

/**
 * Plan the next photo, when playing.
 */
function schedule(): void {
	clearTimeout(slideTimer)
	if (playing.value && photos.value.length > 0) {
		slideTimer = setTimeout(next, settings.value.interval * 1000)
	}
}

function togglePlaying(): void {
	playing.value = !playing.value
	schedule()
}

/**
 * Show the controls and the cursor, and hide them again after a while.
 */
function wake(): void {
	idle.value = false
	clearTimeout(idleTimer)
	idleTimer = setTimeout(() => {
		if (settingsOpen.value || slides.value.length === 0) {
			return
		}
		idle.value = true
		if (toolbar.value?.contains(document.activeElement)) {
			root.value?.focus()
		}
	}, IDLE_DELAY)
}

function closeSettings(): void {
	settingsOpen.value = false
	wake()
}

function close(): void {
	if (window.history.state?.back) {
		router.back()
	} else {
		router.push({ name: 'all_media' })
	}
}

function toggleFullscreen(): void {
	if (document.fullscreenElement) {
		document.exitFullscreen()
	} else {
		// The whole page goes full screen, so the settings dialog, which is not
		// rendered inside the frame, stays visible.
		document.documentElement.requestFullscreen().catch((error) => logger.warn('Could not enter full screen', { error }))
	}
}

function onFullscreenChange(): void {
	fullscreen.value = document.fullscreenElement !== null
}

/**
 * Keep the screen on while the frame is visible. The browser releases the
 * lock whenever the page is hidden, so it is requested again when it is back.
 */
async function requestWakeLock(): Promise<void> {
	if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') {
		return
	}

	try {
		const lock = await navigator.wakeLock.request('screen')
		if (unmounted) {
			lock.release()
		} else {
			wakeLock = lock
		}
	} catch (error) {
		logger.debug('Could not keep the screen awake', { error })
	}
}

/**
 * Keys of keyboards and TV remotes: left and right step through the photos,
 * or through the controls once up or down moved the focus to them; OK plays
 * and pauses; back leaves the controls, then the frame.
 *
 * @param event - The key press to handle
 */
function onKeyDown(event: KeyboardEvent): void {
	const target = event.target as Node | null
	// Presses in the settings dialog, which is rendered outside the frame, belong to it.
	if (settingsOpen.value || (target !== document.body && !root.value?.contains(target))
		|| event.ctrlKey || event.metaKey || event.altKey) {
		return
	}

	wake()
	const buttons = [...(toolbar.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])]
	const focused = buttons.indexOf(document.activeElement as HTMLButtonElement)

	switch (event.key) {
		case 'ArrowLeft':
		case 'ArrowRight': {
			event.preventDefault()
			const step = event.key === 'ArrowRight' ? 1 : -1
			if (focused === -1) {
				if (step === 1) {
					next()
				} else {
					previous()
				}
			} else {
				buttons[(focused + step + buttons.length) % buttons.length].focus()
			}
			break
		}
		case 'ArrowUp':
		case 'ArrowDown':
			event.preventDefault()
			if (focused === -1) {
				buttons[Math.min(1, buttons.length - 1)]?.focus()
			}
			break
		case 'Enter':
		case ' ':
			if (focused === -1) {
				event.preventDefault()
				togglePlaying()
			}
			break
		case 'Escape':
		case 'Backspace':
		case 'BrowserBack':
		case 'GoBack':
			event.preventDefault()
			if (focused === -1) {
				close()
			} else {
				root.value?.focus()
				idle.value = true
			}
			break
	}
}
</script>

<style lang="scss" scoped>
.photo-frame {
	// Light controls on the dark frame, whatever the theme.
	--color-main-text: #fff;
	--color-text-maxcontrast: rgba(255, 255, 255, 0.75);
	--color-background-hover: rgba(255, 255, 255, 0.2);
	--default-clickable-area: 64px;
	position: fixed;
	inset: 0;
	// Above the header of the server.
	z-index: 2100;
	overflow: hidden;
	background-color: #000;
	color: var(--color-main-text);
	outline: none;

	&--idle {
		cursor: none;
	}

	&__slide {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: var(--photo-frame-fit, contain);
		opacity: 0;
		transition: opacity 2s ease-in-out;
		animation: photo-frame-motion var(--photo-frame-motion-duration) linear forwards;

		&--active {
			opacity: 1;
		}
	}

	&__empty {
		height: 100%;
		margin: 0;
	}

	&__info {
		position: absolute;
		inset-block-end: calc(var(--default-grid-baseline) * 6);
		inset-inline-start: calc(var(--default-grid-baseline) * 8);
		display: flex;
		flex-direction: column;
		font-size: clamp(14px, 1.4vw, 32px);
		opacity: 0.85;
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
		pointer-events: none;

		&__place {
			font-size: 1.3em;
			font-weight: bold;
		}
	}

	&__toolbar {
		position: absolute;
		inset-block-end: calc(var(--default-grid-baseline) * 6);
		inset-inline: 0;
		display: flex;
		width: fit-content;
		margin-inline: auto;
		gap: calc(var(--default-grid-baseline) * 2);
		padding: calc(var(--default-grid-baseline) * 2);
		border-radius: var(--border-radius-pill);
		background-color: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(12px);
		transition: opacity 0.3s;
	}

	&--idle &__toolbar {
		opacity: 0;
		pointer-events: none;
	}

	// Phones: smaller controls, the date and place above them.
	@media (max-width: 600px) {
		--default-clickable-area: 48px;

		&__info {
			inset-block-end: calc(var(--default-clickable-area) + var(--default-grid-baseline) * 12);
			inset-inline-start: calc(var(--default-grid-baseline) * 4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		&__slide {
			animation: none;
		}
	}
}

@keyframes photo-frame-motion {
	from {
		transform: var(--photo-frame-motion-from);
	}

	to {
		transform: var(--photo-frame-motion-to);
	}
}
</style>
