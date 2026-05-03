<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		class="file-container"
		data-test="media"
		:class="{ selected }">
		<a
			class="file"
			:href="file.source"
			:aria-label="ariaLabel"
			@click.stop.prevent="onTileClick"
			@pointerdown="onTilePointerDown"
			@pointerup="onTilePointerUp"
			@pointercancel="cancelLongPress"
			@pointerleave="cancelLongPress">

			<!-- image and loading placeholder -->
			<div class="file__images">
				<VideoOutline v-if="file.mime?.includes('video')" class="icon-overlay" :size="64" />
				<PlayCircleOutlineIcon v-else-if="file.attributes['metadata-files-live-photo'] !== undefined" class="icon-overlay" :size="64" />

				<!--
					Three layers stacked, each fading in when its source loads.
					blurhash sits at the bottom, small thumbnail above it, full
					preview on top. Crossfade happens naturally as the higher
					layer's opacity goes 0 → 1 while the layer beneath stays
					rendered.
				-->
				<template v-if="initialized">
					<canvas
						v-if="hasBlurhash"
						ref="canvas"
						class="file__layer file__layer--blurhash"
						aria-hidden="true" />

					<!--
						Shimmer placeholder. Overlays the blurhash (or
						the empty primary-element-light background when
						no blurhash exists) until the small or large
						preview lands. Pure CSS — a translating gradient
						sweep — so it's cheap to animate and doesn't
						need JS bookkeeping.
					-->
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
						:alt="file.basename"
						decoding="async"
						:fetchpriority="loadedSmall ? 'high' : 'low'"
						loading="lazy"
						@load="onLoadLarge"
						@error="onErrorLarge">
				</template>
			</div>
		</a>

		<NcCheckboxRadioSwitch
			v-if="allowSelection"
			class="selection-checkbox"
			:aria-label="t('photos', 'Select image {imageName}', { imageName: file.basename })"
			:modelValue="selected"
			@update:modelValue="onToggle" />

		<!--
			Per-photo overflow menu (3-dot). Forwards its action requests
			up so the parent (TimelineView etc.) can hook into the
			existing album-picker / sidebar / delete flows. Hidden when
			the parent is in a picking context (PhotosPicker).
		-->
		<PhotoActionsMenu
			v-if="showActionsMenu"
			:file="file"
			class="photo-actions-menu"
			@requestAddToAlbum="$emit('request-add-to-album', $event)"
			@requestShare="$emit('request-share', $event)"
			@requestDelete="$emit('request-delete', $event)" />

		<!--
			Favourite-star toggle animation: enter spawns a quick scale-up
			bounce; leave fades out. The original v-once was preventing
			the icon from ever re-rendering, which masked favorite-state
			changes coming from the bulk-action menu.
		-->
		<Transition name="favorite-pop">
			<FavoriteIcon
				v-if="file.attributes.favorite === 1"
				class="favorite-state" />
		</Transition>
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { PhotoFile } from '../store/files.js'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { decode } from 'blurhash'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import PlayCircleOutlineIcon from 'vue-material-design-icons/PlayCircleOutline.vue'
import VideoOutline from 'vue-material-design-icons/VideoOutline.vue'
import FavoriteIcon from './FavoriteIcon.vue'
import PhotoActionsMenu from './PhotoActionsMenu.vue'
import { isCachedPreview } from '../services/PreviewService.js'

export default {
	name: 'FileComponent',
	components: {
		FavoriteIcon,
		NcCheckboxRadioSwitch,
		PhotoActionsMenu,
		PlayCircleOutlineIcon,
		VideoOutline,
	},

	props: {
		file: {
			type: Object as PropType<PhotoFile>,
			required: true,
		},

		selected: {
			type: Boolean,
			default: false,
		},

		allowSelection: {
			type: Boolean,
			default: false,
		},

		// Whether to render the per-photo overflow menu (EXIF / add to
		// album / share / delete). Defaults to true; disable when the
		// component is rendered inside a picker / read-only context
		// where managing the photo doesn't make sense.
		showActionsMenu: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: true,
		},
	},

	emits: ['click', 'select-toggled', 'request-add-to-album', 'request-share', 'request-delete'],

	data() {
		return {
			initialized: false,
			loadedSmall: false,
			errorSmall: false,
			loadedLarge: false,
			errorLarge: false,
			isMobile: useIsMobile(),
			// Long-press detection: a press held for >500ms starts a
			// selection instead of opening the viewer. The handle is
			// kept on `this` (not in data so we don't bother with
			// reactivity) and cleared on cancel / release.
			longPressTimer: null as ReturnType<typeof setTimeout> | null,
			longPressFired: false,
		}
	},

	computed: {
		ariaLabel(): string {
			if (this.file.attributes.favorite) {
				return t('photos', 'Favorite image, open the full size "{name}" image', { name: this.file.basename })
			}
			return t('photos', 'Open the full size "{name}" image', { name: this.file.basename })
		},

		isImage(): boolean {
			return this.file.mime?.startsWith('image') ?? false
		},

		decodedEtag(): string {
			return this.file.attributes.etag.replace('&quot;', '').replace('&quot;', '')
		},

		srcLarge(): string {
			return this.isMobile ? this.getItemURL(256) : this.getItemURL(1024)
		},

		srcSmall(): string {
			return this.getItemURL(64)
		},

		hasBlurhash() {
			return this.file.attributes['metadata-blurhash'] !== undefined
		},
	},

	watch: {
		async file() {
			this.initialized = false
			this.loadedSmall = false
			this.errorSmall = false
			this.loadedLarge = false
			this.errorLarge = false

			await this.init()
		},
	},

	async mounted() {
		await this.init()
	},

	beforeUnmount() {
		// Cancel any pending image load by clearing the src on each layer.
		// The previous code had a typo (`srcLarge`) and never cancelled the
		// large preview; now both are addressed.
		if (this.$refs.imgSmall !== undefined) {
			(this.$refs.imgSmall as HTMLImageElement).src = ''
		}
		if (this.$refs.imgLarge !== undefined) {
			(this.$refs.imgLarge as HTMLImageElement).src = ''
		}
		this.cancelLongPress()
	},

	methods: {
		async init() {
			[this.loadedSmall, this.loadedLarge] = await Promise.all([
				await isCachedPreview(this.srcSmall),
				await isCachedPreview(this.srcLarge),
			])

			this.initialized = true

			await this.$nextTick() // Wait for next tick to have the canvas in the DOM

			this.drawBlurhash()
		},

		emitClick() {
			this.$emit('click', this.file.fileid)
		},

		// Tap = open viewer. Long-press (>500ms) = toggle selection.
		// We swallow the click that follows a long-press so a release
		// after the timeout doesn't also trigger the open.
		onTileClick() {
			if (this.longPressFired) {
				this.longPressFired = false
				return
			}
			this.emitClick()
		},

		onTilePointerDown() {
			if (!this.allowSelection) {
				return
			}
			this.cancelLongPress()
			this.longPressTimer = setTimeout(() => {
				this.longPressFired = true
				this.onToggle(!this.selected)
			}, 500)
		},

		onTilePointerUp() {
			this.cancelLongPress()
		},

		cancelLongPress() {
			if (this.longPressTimer !== null) {
				clearTimeout(this.longPressTimer)
				this.longPressTimer = null
			}
		},

		onLoadSmall() {
			this.loadedSmall = true
		},

		onLoadLarge() {
			this.loadedLarge = true
		},

		onErrorSmall() {
			this.errorSmall = true
		},

		onErrorLarge() {
			this.errorLarge = true
		},

		onToggle(value) {
			this.$emit('select-toggled', { id: this.file.fileid, value })
		},

		getItemURL(size) {
			const token = this.$route?.params.token
			if (token) {
				return generateUrl(`/apps/photos/api/v1/publicPreview/${this.file.fileid}?etag=${this.decodedEtag}&x=${size}&y=${size}&token=${token}`)
			} else {
				return generateUrl(`/apps/photos/api/v1/preview/${this.file.fileid}?etag=${this.decodedEtag}&x=${size}&y=${size}`)
			}
		},

		drawBlurhash() {
			if (!this.hasBlurhash || !this.$refs.canvas) {
				return
			}

			const width = (this.$refs.canvas as HTMLCanvasElement).width
			const height = (this.$refs.canvas as HTMLCanvasElement).height

			const pixels = decode(this.file.attributes['metadata-blurhash'], width, height)

			const ctx = (this.$refs.canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
			const imageData = ctx.createImageData(width, height) as ImageData
			imageData.data.set(pixels)
			ctx.putImageData(imageData, 0, 0)
		},

		t,
	},

}
</script>

<style lang="scss" scoped>
.file-container {
	contain: strict;
	background: var(--color-primary-element-light);
	position: relative;
	height: 100%;
	width: 100%;
	border: 2px solid var(--color-main-background); // Use border so create a separation between images.
	box-sizing: border-box;
	// Subtle lift + shadow when a tile is interacted with (focus or
	// selection). Replaces the previous hard outline ring with a softer
	// affordance that doesn't fight the photo for visual weight.
	transition: transform 160ms ease-out, box-shadow 160ms ease-out;

	// Selection state: softer ring + lift + shadow.
	&.selected {
		transform: scale(0.97);
		box-shadow:
			0 0 0 3px var(--color-primary-element),
			0 6px 18px rgba(0, 0, 0, 0.18);
		z-index: 2;

		.selection-checkbox {
			opacity: 1;
		}
	}

	// Keyboard focus state — keep the existing visible outline but
	// without the lift so focus and selection are visually distinct.
	&:focus-within,
	&:has(:focus) {
		&::after {
			position: absolute;
			top: 0;
			inset-inline-start: 0;
			z-index: 2;
			width: 100%;
			height: 100%;
			content: '';
			outline: var(--color-primary-element) solid 3px;
			outline-offset: -3px;
			pointer-events: none;
			border-radius: 4px;
		}

		.selection-checkbox,
		.photo-actions-menu {
			opacity: 1;
		}
	}

	// Reveal the per-photo overflow menu on hover (matches the
	// existing checkbox affordance). The menu component is always
	// in the DOM so its dialogs can stay mounted across hover-out.
	&:hover .photo-actions-menu,
	.photo-actions-menu:focus-within {
		opacity: 1;
	}

	.photo-actions-menu {
		opacity: 0;
		transition: opacity 160ms ease-out;
	}

	.file {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		outline: none; // Override global focus state.
		display: flex; // Fill parent size

		&__images {
			width: 100%;
			height: 100%;

			.icon-overlay {
				position: absolute;
				top: 0px;
				inset-inline-end: 0px;
				width: 100%;
				height: 100%;
				z-index: 4; // above all preview layers
				opacity: 0.8;

				:deep(.material-design-icon__svg) {
					fill: var(--color-main-background);
				}
			}

			// Three stacked preview layers: blurhash at the bottom, small
			// thumbnail above it, full preview on top. Each img layer starts
			// at opacity 0 and fades in once its `load` event fires; the
			// canvas blurhash is always visible, sitting beneath everything.
			.file__layer {
				position: absolute;
				top: 0;
				inset-inline-start: 0;
				width: 100%;
				height: 100%;
				object-fit: cover;
				color: transparent; // Hide alt='' text when loading.
			}

			.file__layer--blurhash {
				z-index: 1;
			}

			// Shimmer sweep — a translucent diagonal gradient travels
			// across the tile while we wait for the preview. The
			// `var(--color-…)` references read the user's NC theme so
			// the shimmer adapts to dark mode automatically.
			.file__layer--shimmer {
				z-index: 2;
				pointer-events: none;
				background: linear-gradient(
					115deg,
					rgba(255, 255, 255, 0) 30%,
					rgba(255, 255, 255, 0.18) 50%,
					rgba(255, 255, 255, 0) 70%
				);
				background-size: 220% 100%;
				background-repeat: no-repeat;
				animation: file-layer-shimmer 1500ms linear infinite;
				// Slight fade out as the small/large preview takes over;
				// this just trims the visual handover so the sweep
				// doesn't pop.
				transition: opacity 200ms ease-out;
			}

			@media (prefers-reduced-motion: reduce) {
				.file__layer--shimmer {
					animation: none;
				}
			}

			@keyframes file-layer-shimmer {
				0%   { background-position: 120% 0; }
				100% { background-position: -120% 0; }
			}

			.file__layer--small {
				z-index: 2;
				opacity: 0;
				transition: opacity 200ms ease-out;

				&.file__layer--visible {
					opacity: 1;
				}
			}

			.file__layer--large {
				z-index: 3;
				opacity: 0;
				transition: opacity 250ms ease-out;

				&.file__layer--visible {
					opacity: 1;
				}
			}
		}
	}

	// Reveal checkbox on hover.
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

	.selection-checkbox {
		opacity: 0;
		position: absolute;
		top: 8px;
		// Fancy calculation to render the checkbox in the middle of narrow images.
		inset-inline-end: min(22px, calc(50% - 7px));
		z-index: 1;
		width: fit-content;

		:deep(.checkbox-radio-switch__input:focus-visible+.checkbox-radio-switch__content),
		:deep(.checkbox-radio-switch__input:focus-visible) {
			outline: 2px solid var(--color-main-text);
			box-shadow: 0 0 0 3px var(--color-main-background);
			outline-offset: 0px;
		}

		:deep(.checkbox-radio-switch__content) {
			padding: 10px;
			box-sizing: border-box;
			background: var(--color-main-background);

			// Add a background to the checkbox so we do not see the image through it.
			&::after {
				content: '';
				width: 16px;
				height: 16px;
				position: absolute;
				inset-inline-start: 14px;
				z-index: -1;
			}

			.checkbox-radio-switch__icon {
				margin: 0;
			}
		}

		.input-label {
			position: fixed;
			z-index: -1;
			top: -5000px;
			inset-inline-start: -5000px;
		}
	}

	.favorite-state {
		position: absolute;
		top: 2px;
		// Fancy calculation to render the start in the middle of narrow images.
		inset-inline-end: min(2px, calc(50% - 7px));
	}

	// Pop-in animation when a file becomes a favourite. The bounce
	// timing function gives a satisfying overshoot. Keep durations short
	// (320ms in / 180ms out) so bulk-favourite still feels snappy.
	.favorite-pop-enter-active {
		animation: favorite-pop-keyframes 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
		transform-origin: center;
	}
	.favorite-pop-leave-active {
		transition: opacity 180ms ease-out, transform 180ms ease-out;
	}
	.favorite-pop-leave-to {
		opacity: 0;
		transform: scale(0.8);
	}

	@keyframes favorite-pop-keyframes {
		0%   { opacity: 0; transform: scale(0.5); }
		60%  { opacity: 1; transform: scale(1.25); }
		100% { opacity: 1; transform: scale(1); }
	}
}
</style>
