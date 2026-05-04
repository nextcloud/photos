<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Minimal photo slideshow. Renders one photo at a time, auto-advances
	on a timer, with prev / next / play-pause / close controls.

	Triggered programmatically from views that have a list of photos to
	play through (timeline, album, selection). Doesn't depend on the NC
	Viewer app — that would require cross-app changes — but emits the
	same `<photo>` shape so callers can map straight from the store.
-->

<template>
	<Teleport to="body">
		<div
			class="slideshow"
			role="dialog"
			aria-modal="true"
			:aria-label="t('photos', 'Slideshow')"
			tabindex="-1"
			:style="chromeStyle"
			@keydown.esc.prevent="close"
			@keydown.left.prevent="prev"
			@keydown.right.prevent="next"
			@keydown.space.prevent="togglePlay"
			@keydown.i.exact="toggleExif">
			<img
				v-if="currentPhoto"
				:key="currentPhoto.fileid"
				:src="largeUrl(currentPhoto)"
				:alt="currentPhoto.basename"
				class="slideshow__photo">

			<div class="slideshow__caption">
				<div class="slideshow__caption__name">
					{{ currentPhoto?.basename ?? '' }}
				</div>
				<div class="slideshow__caption__counter">
					{{ index + 1 }} / {{ photos.length }}
				</div>
			</div>

			<!-- Reaction bar — only shown when this slideshow was
				opened from inside an album (caller passes
				`albumId`). Reactions are an album-scoped feature so
				they have a recipient list. -->
			<div
				v-if="albumId > 0 && currentPhoto"
				class="slideshow__reactions">
				<ReactionBar
					:key="`react-${currentPhoto.fileid}`"
					:albumId="albumId"
					:fileId="Number(currentPhoto.fileid)" />
			</div>

			<!--
				EXIF overlay. Toggled with the `i` key; renders nothing
				when the current photo has no EXIF data (so we don't
				show an empty grey panel).
			-->
			<aside
				v-if="exifVisible && exifLines.length > 0"
				class="slideshow__exif"
				:aria-label="t('photos', 'Photo metadata')">
				<dl>
					<template v-for="line in exifLines" :key="line.label">
						<dt>{{ line.label }}</dt>
						<dd>{{ line.value }}</dd>
					</template>
				</dl>
			</aside>

			<div class="slideshow__controls">
				<NcButton
					variant="tertiary"
					:aria-label="t('photos', 'Previous photo')"
					@click="prev">
					<template #icon>
						<ChevronLeftIcon :size="28" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:aria-label="playing ? t('photos', 'Pause slideshow') : t('photos', 'Resume slideshow')"
					@click="togglePlay">
					<template #icon>
						<PauseIcon v-if="playing" :size="28" />
						<PlayIcon v-else :size="28" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:aria-label="t('photos', 'Next photo')"
					@click="next">
					<template #icon>
						<ChevronRightIcon :size="28" />
					</template>
				</NcButton>
				<NcButton
					class="slideshow__controls__close"
					variant="tertiary"
					:aria-label="t('photos', 'Close slideshow')"
					@click="close">
					<template #icon>
						<CloseIcon :size="28" />
					</template>
				</NcButton>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { PhotoFile } from '../store/files.ts'

import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { defineComponent, markRaw } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'
import PauseIcon from 'vue-material-design-icons/Pause.vue'
import PlayIcon from 'vue-material-design-icons/Play.vue'
import ReactionBar from './ReactionBar.vue'

export default defineComponent({
	name: 'PhotoSlideshow',

	components: {
		ChevronLeftIcon,
		ChevronRightIcon,
		CloseIcon,
		NcButton,
		PauseIcon,
		PlayIcon,
		ReactionBar,
	},

	props: {
		photos: {
			type: Array as PropType<PhotoFile[]>,
			required: true,
		},

		// Time each photo stays on screen, in seconds. 4s is a comfortable
		// default — long enough to register, short enough to feel like
		// motion.
		intervalSeconds: {
			type: Number,
			default: 4,
		},

		// Index of the photo to start with.
		initialIndex: {
			type: Number,
			default: 0,
		},

		// Optional: when the slideshow is opened from inside a
		// shared / collaborative album, pass the albumId so the
		// reaction bar surfaces. Empty / 0 → no reactions UI
		// (album-only feature).
		albumId: {
			type: Number,
			default: 0,
		},
	},

	emits: ['close'],

	data() {
		return {
			index: Math.max(0, Math.min(this.initialIndex, this.photos.length - 1)),
			playing: true,
			// markRaw: setInterval handle is a primitive number on browsers
			// but defensive markRaw guards against any platform that returns
			// a class instance (Node typings carry over to some bundlers).
			timer: null as ReturnType<typeof setInterval> | null,
			exifVisible: false,
			// Dominant-colour cache, keyed by fileid. Decoded once per
			// blurhash and reused on every re-show — sampling the
			// 32×32 decoded canvas is ~1 ms but pre-allocating a Map
			// keeps the slide transition hitch-free.
			dominantColourCache: new Map<string, string>() as Map<string, string>,
			// Currently-applied chrome colour (CSS rgb string). Updated
			// from the cache when the photo changes; transitions via
			// the CSS `--slideshow-chrome` variable.
			chromeColour: '#000',
		}
	},

	computed: {
		currentPhoto(): PhotoFile | undefined {
			return this.photos[this.index]
		},

		// Pull a small set of human-friendly EXIF lines from the
		// current photo's metadata. The fields we display come back
		// from the server when `nc:metadata-photos-exif` /
		// `nc:metadata-photos-ifd0` are registered in main.ts —
		// otherwise this gracefully returns [] and the overlay hides.
		// CSS custom properties drive the chrome's colour theme;
		// transitioning the variable is much smoother than swapping
		// inline style strings (no layout pass, the renderer just
		// tweens the gradient stops).
		chromeStyle(): Record<string, string> {
			return {
				'--slideshow-chrome': this.chromeColour,
			}
		},

		exifLines(): { label: string, value: string }[] {
			if (this.currentPhoto === undefined) {
				return []
			}
			const attrs = this.currentPhoto.attributes as Record<string, unknown>
			const exif = (attrs['metadata-photos-exif'] ?? {}) as Record<string, string | number>
			const ifd0 = (attrs['metadata-photos-ifd0'] ?? {}) as Record<string, string | number>

			const lines: { label: string, value: string }[] = []

			if (ifd0.Make || ifd0.Model) {
				const make = (ifd0.Make ?? '').toString().trim()
				const model = (ifd0.Model ?? '').toString().trim()
				const camera = [make, model].filter(Boolean).join(' ')
				if (camera.length > 0) {
					lines.push({ label: t('photos', 'Camera'), value: camera })
				}
			}

			if (exif.FNumber) {
				lines.push({ label: t('photos', 'Aperture'), value: `ƒ/${exif.FNumber}` })
			}

			if (exif.FocalLength) {
				lines.push({ label: t('photos', 'Focal length'), value: `${exif.FocalLength} mm` })
			}

			if (exif.ExposureTime) {
				lines.push({ label: t('photos', 'Exposure'), value: `${exif.ExposureTime} s` })
			}

			if (exif.ISOSpeedRatings) {
				lines.push({ label: t('photos', 'ISO'), value: String(exif.ISOSpeedRatings) })
			}

			return lines
		},
	},

	watch: {
		// Refresh the chrome colour as the user moves through photos.
		// The decode is async so we don't block the slide transition.
		currentPhoto: {
			immediate: true,
			handler(photo: PhotoFile | undefined) {
				if (photo === undefined) {
					return
				}
				this.refreshChromeColour(photo).catch(() => {
					// Decoding the blurhash can fail for malformed
					// data; we just stay on whatever colour we had.
				})
			},
		},
	},

	mounted() {
		this.startTimer()
		// Focus the dialog so keyboard shortcuts work without first
		// clicking the slideshow.
		this.$nextTick(() => {
			(this.$el as HTMLElement | undefined)?.focus?.()
		})
	},

	beforeUnmount() {
		this.stopTimer()
	},

	methods: {
		t,

		largeUrl(photo: PhotoFile): string {
			const etag = photo.attributes.etag.replace(/&quot;/g, '')
			return generateUrl(`/apps/photos/api/v1/preview/${photo.fileid}?etag=${etag}&x=2048&y=2048`)
		},

		// Decode the blurhash to a 32×32 canvas, average the centre
		// pixels, and store the result as the chrome colour. Blurhash
		// is already on disk for every indexed photo and decoding it
		// is ~1 ms, so this is a cheap way to get a representative
		// dominant tone without round-tripping the full preview.
		// Falls back silently when the photo has no blurhash (the
		// chrome stays whatever colour it was).
		async refreshChromeColour(photo: PhotoFile): Promise<void> {
			const id = photo.fileid?.toString()
			if (id !== undefined) {
				const cached = this.dominantColourCache.get(id)
				if (cached !== undefined) {
					this.chromeColour = cached
					return
				}
			}

			const blurhash = (photo.attributes['metadata-blurhash'] ?? '') as string
			if (blurhash === '') {
				return
			}

			// `decode()` is the same import FileComponent uses for the
			// tile-level blurhash render; reusing it here keeps the
			// dependency footprint small.
			const { decode } = await import('blurhash')
			const size = 32
			const pixels = decode(blurhash, size, size)

			// Sample the centre 16×16 region so frame edges (often
			// dark vignetting) don't bias the colour. Average RGB,
			// drop alpha.
			let r = 0
			let g = 0
			let b = 0
			let count = 0
			for (let y = 8; y < 24; y++) {
				for (let x = 8; x < 24; x++) {
					const idx = (y * size + x) * 4
					r += pixels[idx]
					g += pixels[idx + 1]
					b += pixels[idx + 2]
					count++
				}
			}
			r = Math.round(r / count)
			g = Math.round(g / count)
			b = Math.round(b / count)

			// Pull the brightness down a notch so the chrome doesn't
			// fight the photo for visual weight — we want a
			// background that *whispers* the colour, not shouts it.
			const dim = (c: number) => Math.round(c * 0.55)
			const colour = `rgb(${dim(r)}, ${dim(g)}, ${dim(b)})`

			if (id !== undefined) {
				this.dominantColourCache.set(id, colour)
			}
			this.chromeColour = colour
		},

		next() {
			this.index = (this.index + 1) % this.photos.length
			this.restartTimer()
		},

		prev() {
			this.index = (this.index - 1 + this.photos.length) % this.photos.length
			this.restartTimer()
		},

		togglePlay() {
			this.playing = !this.playing
			if (this.playing) {
				this.startTimer()
			} else {
				this.stopTimer()
			}
		},

		toggleExif() {
			this.exifVisible = !this.exifVisible
		},

		close() {
			this.stopTimer()
			this.$emit('close')
		},

		startTimer() {
			this.stopTimer()
			if (!this.playing || this.photos.length <= 1) {
				return
			}
			this.timer = markRaw(setInterval(() => this.next(), this.intervalSeconds * 1000))
		},

		stopTimer() {
			if (this.timer !== null) {
				clearInterval(this.timer)
				this.timer = null
			}
		},

		// Restart the auto-advance timer after manual navigation so the
		// next photo gets the full interval, not the leftover from the
		// previous one.
		restartTimer() {
			if (this.playing) {
				this.startTimer()
			}
		},
	},
})
</script>

<style lang="scss" scoped>
.slideshow {
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	// Colour-themed chrome: the background fades to the dominant
	// colour of the current photo (see `refreshChromeColour`).
	// Linear gradient anchors the dominant tone in the middle and
	// fades to black at the corners so the photo always reads
	// against deep contrast at its edges. The CSS variable is
	// updated by the watcher; the 800ms transition makes the swap
	// feel like a slow exhale rather than a flicker.
	background:
		radial-gradient(
			ellipse at center,
			var(--slideshow-chrome, #000) 0%,
			#000 90%
		);
	transition: background 800ms ease-out;
	outline: none;

	&__photo {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		// Subtle fade as photos swap.
		animation: slideshow-fade-in 350ms ease-out;
	}

	&__reactions {
		position: absolute;
		bottom: 96px; // sit above the prev/play/next bar
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
	}

	&__caption {
		position: absolute;
		top: 24px;
		inset-inline-start: 24px;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.95rem;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
		pointer-events: none;

		&__name {
			font-weight: 500;
			margin-bottom: 2px;
		}

		&__counter {
			opacity: 0.7;
			font-variant-numeric: tabular-nums;
		}
	}

	&__exif {
		position: absolute;
		top: 24px;
		inset-inline-end: 24px;
		max-width: 280px;
		padding: 16px 20px;
		background: rgba(0, 0, 0, 0.55);
		color: rgba(255, 255, 255, 0.95);
		border-radius: 12px;
		font-size: 0.9rem;
		backdrop-filter: blur(12px);

		dl {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 6px 16px;
			margin: 0;
		}

		dt {
			opacity: 0.7;
			font-weight: 500;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			font-size: 0.7rem;
			align-self: center;
		}

		dd {
			margin: 0;
			font-variant-numeric: tabular-nums;
		}
	}

	&__controls {
		position: absolute;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 8px;
		padding: 8px 12px;
		background: rgba(0, 0, 0, 0.55);
		border-radius: 999px;

		// White buttons + icons over the dim background.
		:deep(.button-vue) {
			color: #fff;

			&:hover, &:focus-visible {
				background: rgba(255, 255, 255, 0.12);
			}
		}

		&__close {
			margin-inline-start: 16px;
		}
	}
}

@keyframes slideshow-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}
</style>
