<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Cinematic recap. Plays a sequence of photos full-screen with a
	Ken-Burns pan/zoom on each frame, cross-dissolves between
	frames, and fades the surrounding chrome to the dominant
	colour of the current photo (same dominant-colour extraction
	the slideshow uses, plus a slow zoom on the photo itself —
	iOS Memories' signature look).

	UX notes
	- Auto-plays with a 5s slot per photo (4s "linger" + 1s
	  cross-dissolve into the next); user can play / pause / skip.
	- The Ken-Burns transform alternates between zoom-in / pan-left
	  / pan-right / zoom-out so the result doesn't look mechanical.
	- Title appears on the first frame for 3s, then fades. Pulled
	  from the caller (e.g. "May 2023" or a trip name) — generic
	  enough that the same component drives "month recap", "trip
	  recap", and "year-in-review".
	- Esc closes; arrow keys step manually (which also pauses).

	Why it's its own component, not a Slideshow flag: the cinematic
	pacing fights the slideshow's "step at a fixed rate" model —
	transitions are coupled to a transform animation that has to
	end on a clean frame, so the timing has to be owned by *this*
	component, not driven by a setInterval.
-->

<template>
	<Teleport to="body">
		<div
			class="cinematic"
			role="dialog"
			aria-modal="true"
			:aria-label="title"
			tabindex="-1"
			:style="chromeStyle"
			@keydown.esc.prevent="close"
			@keydown.left.prevent="prev"
			@keydown.right.prevent="next"
			@keydown.space.prevent="togglePlay">
			<!--
				Two stacked frames so the dissolve has something to
				cross-fade against. The "back" frame holds the
				outgoing photo at full opacity; the "front" frame
				transitions in. We swap which DOM element is which
				on each step so the transform animation always
				starts fresh (replaying a `transform: scale(1.05)`
				on the same element doesn't restart the keyframes).
			-->
			<div class="cinematic__stage">
				<img
					v-if="prevPhoto"
					:key="`out-${prevPhoto.fileid}`"
					class="cinematic__frame cinematic__frame--out"
					:class="kenBurnsClass(prevTransformIndex)"
					:src="largeUrl(prevPhoto)"
					alt=""
					aria-hidden="true">
				<img
					v-if="currentPhoto"
					:key="`in-${currentPhoto.fileid}`"
					class="cinematic__frame cinematic__frame--in"
					:class="kenBurnsClass(transformIndex)"
					:src="largeUrl(currentPhoto)"
					:alt="currentPhoto.basename">
			</div>

			<!-- Title overlay. Visible only on the first photo,
				fades after 3s. -->
			<Transition name="cinematic-title">
				<h1 v-if="titleVisible" class="cinematic__title">
					{{ title }}
				</h1>
			</Transition>

			<!-- Controls; auto-hide after 2s of mouse idle. -->
			<div
				class="cinematic__controls"
				:class="{ 'cinematic__controls--hidden': !controlsVisible }"
				@click.stop>
				<NcButton variant="tertiary-on-primary" :aria-label="t('photos', 'Previous')" @click="prev">
					<template #icon>
						<SkipPrevious :size="22" />
					</template>
				</NcButton>
				<NcButton variant="tertiary-on-primary" :aria-label="playing ? t('photos', 'Pause') : t('photos', 'Play')" @click="togglePlay">
					<template #icon>
						<Pause v-if="playing" :size="22" />
						<Play v-else :size="22" />
					</template>
				</NcButton>
				<NcButton variant="tertiary-on-primary" :aria-label="t('photos', 'Next')" @click="next">
					<template #icon>
						<SkipNext :size="22" />
					</template>
				</NcButton>
				<NcButton variant="tertiary-on-primary" :aria-label="t('photos', 'Close')" @click="close">
					<template #icon>
						<Close :size="22" />
					</template>
				</NcButton>
			</div>

			<!-- Counter, bottom-right, also controls-tied. -->
			<span
				class="cinematic__counter"
				:class="{ 'cinematic__counter--hidden': !controlsVisible }">
				{{ index + 1 }} / {{ photos.length }}
			</span>
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
import Close from 'vue-material-design-icons/Close.vue'
import Pause from 'vue-material-design-icons/Pause.vue'
import Play from 'vue-material-design-icons/Play.vue'
import SkipNext from 'vue-material-design-icons/SkipNext.vue'
import SkipPrevious from 'vue-material-design-icons/SkipPrevious.vue'

const SLOT_MS = 5000 // 4s linger + 1s cross-dissolve = total per photo
const TITLE_VISIBLE_MS = 3000
const CONTROLS_IDLE_MS = 2000
const KEN_BURNS_VARIANTS = 4

export default defineComponent({
	name: 'CinematicRecap',

	components: {
		Close,
		NcButton,
		Pause,
		Play,
		SkipNext,
		SkipPrevious,
	},

	props: {
		// Photos to play through, in display order. Caller
		// (MemoriesView) typically passes the year/trip/month
		// subset.
		photos: {
			type: Array as PropType<PhotoFile[]>,
			required: true,
		},

		// Title to overlay on the first frame ("May 2023", "Beach
		// trip", "Year in review · 2024"). Generic so the same
		// component drives every recap surface.
		title: {
			type: String,
			required: true,
		},
	},

	emits: ['close'],

	data() {
		return {
			index: 0,
			prevIndex: -1, // -1 = no outgoing frame yet (first slot)
			playing: true,
			titleVisible: true,
			controlsVisible: true,
			chromeColour: '#000',
			// Cycles 0..3 to vary the Ken-Burns transform per slot.
			transformIndex: 0,
			prevTransformIndex: 0,
			slotTimer: null as ReturnType<typeof setTimeout> | null,
			titleTimer: null as ReturnType<typeof setTimeout> | null,
			controlsTimer: null as ReturnType<typeof setTimeout> | null,
			dominantColourCache: new Map<string, string>(),
		}
	},

	computed: {
		currentPhoto(): PhotoFile | undefined {
			return this.photos[this.index]
		},

		prevPhoto(): PhotoFile | undefined {
			return this.prevIndex >= 0 ? this.photos[this.prevIndex] : undefined
		},

		chromeStyle(): Record<string, string> {
			return { '--cinematic-chrome': this.chromeColour }
		},
	},

	watch: {
		currentPhoto: {
			immediate: true,
			handler(photo: PhotoFile | undefined) {
				if (photo === undefined) {
					return
				}
				this.refreshChromeColour(photo).catch(() => {})
			},
		},
	},

	mounted() {
		this.startSlot()
		this.scheduleTitleHide()
		this.bumpControlsTimer()
		document.addEventListener('mousemove', this.bumpControlsTimer)
		;(this.$el as HTMLElement | undefined)?.focus?.()
	},

	beforeUnmount() {
		this.cancelTimers()
		document.removeEventListener('mousemove', this.bumpControlsTimer)
	},

	methods: {
		t,

		largeUrl(photo: PhotoFile): string {
			const etag = (photo.attributes.etag ?? '').toString().replace(/&quot;/g, '')
			return generateUrl(`/apps/photos/api/v1/preview/${photo.fileid}?etag=${etag}&x=2048&y=2048`)
		},

		// Vary the Ken-Burns transform per slot. The CSS classes
		// are zoom-in / zoom-out / pan-left / pan-right, cycled
		// modulo 4 so consecutive slots get visibly different
		// motions.
		kenBurnsClass(idx: number): string {
			return `cinematic__frame--kb${idx % KEN_BURNS_VARIANTS}`
		},

		startSlot() {
			this.cancelSlotTimer()
			if (!this.playing || this.photos.length === 0) {
				return
			}
			this.slotTimer = markRaw(setTimeout(() => this.advance(), SLOT_MS))
		},

		cancelSlotTimer() {
			if (this.slotTimer !== null) {
				clearTimeout(this.slotTimer)
				this.slotTimer = null
			}
		},

		advance() {
			if (this.index >= this.photos.length - 1) {
				// End of recap — pause and let the user re-trigger.
				this.playing = false
				return
			}
			this.stepTo(this.index + 1)
			this.startSlot()
		},

		next() {
			if (this.index < this.photos.length - 1) {
				this.stepTo(this.index + 1)
				if (this.playing) {
					this.startSlot()
				}
			}
		},

		prev() {
			if (this.index > 0) {
				this.stepTo(this.index - 1)
				if (this.playing) {
					this.startSlot()
				}
			}
		},

		stepTo(next: number) {
			this.prevIndex = this.index
			this.prevTransformIndex = this.transformIndex
			this.index = next
			this.transformIndex = (this.transformIndex + 1) % KEN_BURNS_VARIANTS
		},

		togglePlay() {
			this.playing = !this.playing
			if (this.playing) {
				this.startSlot()
			} else {
				this.cancelSlotTimer()
			}
		},

		scheduleTitleHide() {
			if (this.titleTimer !== null) {
				clearTimeout(this.titleTimer)
			}
			this.titleVisible = true
			this.titleTimer = markRaw(setTimeout(() => {
				this.titleVisible = false
			}, TITLE_VISIBLE_MS))
		},

		bumpControlsTimer() {
			this.controlsVisible = true
			if (this.controlsTimer !== null) {
				clearTimeout(this.controlsTimer)
			}
			this.controlsTimer = markRaw(setTimeout(() => {
				this.controlsVisible = false
			}, CONTROLS_IDLE_MS))
		},

		cancelTimers() {
			this.cancelSlotTimer()
			if (this.titleTimer !== null) {
				clearTimeout(this.titleTimer)
				this.titleTimer = null
			}
			if (this.controlsTimer !== null) {
				clearTimeout(this.controlsTimer)
				this.controlsTimer = null
			}
		},

		close() {
			this.cancelTimers()
			this.$emit('close')
		},

		// Same dominant-colour extraction as Slideshow — sample the
		// blurhash centre and dim it so the chrome whispers the
		// colour rather than shouts it. Decoded once per fileid.
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
			const { decode } = await import('blurhash')
			const size = 32
			const pixels = decode(blurhash, size, size)
			let r = 0
			let g = 0
			let b = 0
			let count = 0
			for (let y = 8; y < 24; y++) {
				for (let x = 8; x < 24; x++) {
					const i = (y * size + x) * 4
					r += pixels[i]
					g += pixels[i + 1]
					b += pixels[i + 2]
					count++
				}
			}
			const dim = (c: number) => Math.round((c / count) * 0.55)
			const colour = `rgb(${dim(r)}, ${dim(g)}, ${dim(b)})`
			if (id !== undefined) {
				this.dominantColourCache.set(id, colour)
			}
			this.chromeColour = colour
		},
	},
})
</script>

<style lang="scss" scoped>
.cinematic {
	position: fixed;
	inset: 0;
	z-index: 9999;
	background:
		radial-gradient(
			ellipse at center,
			var(--cinematic-chrome, #000) 0%,
			#000 95%
		);
	transition: background 1200ms ease-out;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	cursor: default;
	outline: none;

	&__stage {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__frame {
		position: absolute;
		max-width: 92%;
		max-height: 92%;
		object-fit: contain;
		// The cross-dissolve: outgoing fades to 0 over 1.2s,
		// incoming fades from 0 to 1 over 1.2s. The `--out` and
		// `--in` modifiers drive these via separate animations so
		// they overlap cleanly.
		will-change: transform, opacity;
	}

	&__frame--out {
		animation: cinematic-fade-out 1200ms ease-out forwards;
	}

	&__frame--in {
		animation: cinematic-fade-in 1200ms ease-out forwards;
	}

	// Ken-Burns variants. Each frame independently runs one of
	// these for the full slot duration so motion never "stops" —
	// scale/translate keeps moving from start to end.
	&__frame--kb0 {
		animation: cinematic-fade-in 1200ms ease-out forwards, cinematic-kb-zoom-in 5000ms linear forwards;
	}
	&__frame--kb1 {
		animation: cinematic-fade-in 1200ms ease-out forwards, cinematic-kb-pan-right 5000ms linear forwards;
	}
	&__frame--kb2 {
		animation: cinematic-fade-in 1200ms ease-out forwards, cinematic-kb-zoom-out 5000ms linear forwards;
	}
	&__frame--kb3 {
		animation: cinematic-fade-in 1200ms ease-out forwards, cinematic-kb-pan-left 5000ms linear forwards;
	}

	&__title {
		position: absolute;
		top: 16%;
		left: 0;
		right: 0;
		text-align: center;
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 200;
		color: #fff;
		text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
		letter-spacing: 0.02em;
		pointer-events: none;
	}

	&__controls {
		position: absolute;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 12px;
		padding: 8px 12px;
		border-radius: 32px;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(12px);
		transition: opacity 320ms ease-out;

		&--hidden {
			opacity: 0;
			pointer-events: none;
		}
	}

	&__counter {
		position: absolute;
		bottom: 32px;
		right: 32px;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
		transition: opacity 320ms ease-out;

		&--hidden {
			opacity: 0;
		}
	}
}

@keyframes cinematic-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes cinematic-fade-out {
	from { opacity: 1; }
	to { opacity: 0; }
}

@keyframes cinematic-kb-zoom-in {
	from { transform: scale(1) translate(0, 0); }
	to   { transform: scale(1.08) translate(0, 0); }
}

@keyframes cinematic-kb-zoom-out {
	from { transform: scale(1.08) translate(0, 0); }
	to   { transform: scale(1) translate(0, 0); }
}

@keyframes cinematic-kb-pan-right {
	from { transform: scale(1.05) translate(-2%, 0); }
	to   { transform: scale(1.05) translate(2%, 0); }
}

@keyframes cinematic-kb-pan-left {
	from { transform: scale(1.05) translate(2%, 0); }
	to   { transform: scale(1.05) translate(-2%, 0); }
}

// Title transition (the toggle into / out of the DOM).
.cinematic-title-enter-active,
.cinematic-title-leave-active {
	transition: opacity 600ms ease-out, transform 600ms ease-out;
}

.cinematic-title-enter-from,
.cinematic-title-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
</style>
