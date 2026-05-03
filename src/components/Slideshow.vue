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
			@keydown.esc.prevent="close"
			@keydown.left.prevent="prev"
			@keydown.right.prevent="next"
			@keydown.space.prevent="togglePlay">
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

export default defineComponent({
	name: 'PhotoSlideshow',

	components: {
		ChevronLeftIcon,
		ChevronRightIcon,
		CloseIcon,
		NcButton,
		PauseIcon,
		PlayIcon,
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
		}
	},

	computed: {
		currentPhoto(): PhotoFile | undefined {
			return this.photos[this.index]
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
	background: #000;
	outline: none;

	&__photo {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		// Subtle fade as photos swap.
		animation: slideshow-fade-in 350ms ease-out;
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
