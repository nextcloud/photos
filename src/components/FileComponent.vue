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
			@click.stop.prevent="onClick"
			@pointerdown="startLongPress"
			@pointerup="cancelLongPress"
			@pointercancel="cancelLongPress"
			@pointerleave="cancelLongPress">

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
			:model-value="selected"
			@update:checked="onToggle" />

		<PhotoActionsMenu
			v-if="showActionsMenu"
			class="photo-actions-menu"
			:photo="photoTarget"
			@deleted="$emit('deleted', $event)" />

		<Transition name="favorite-pop">
			<FavoriteIcon v-if="file.attributes.favorite === 1" class="favorite-state" />
		</Transition>
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { PhotoFile } from '../store/files.js'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import NcBlurHash from '@nextcloud/vue/components/NcBlurHash'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import PlayCircleOutlineIcon from 'vue-material-design-icons/PlayCircleOutline.vue'
import FavoriteIcon from './FavoriteIcon.vue'
import PhotoActionsMenu from './PhotoActionsMenu.vue'
import logger from '../services/logger.ts'
import { isCachedPreview } from '../services/PreviewService.js'
import { getVideoDurationFromUrl, toPhotoTarget } from '../utils/fileUtils.ts'

export default {
	name: 'FileComponent',
	components: {
		FavoriteIcon,
		NcBlurHash,
		NcCheckboxRadioSwitch,
		PhotoActionsMenu,
		PlayCircleOutlineIcon,
	},

	inheritAttrs: false,
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
			default: true,
		},

		// Opt-out: the menu manages the photo it belongs to, which only gets in
		// the way where photos are being picked rather than managed.
		showActionsMenu: {
			type: Boolean,
			// eslint-disable-next-line vue/no-boolean-default
			default: true,
		},
	},

	emits: ['click', 'select-toggled', 'deleted'],

	data() {
		return {
			initialized: false,
			loadedSmall: false,
			errorSmall: false,
			loadedLarge: false,
			errorLarge: false,
			isMobile: useIsMobile(),
			videoDuration: '',
			longPressTimeout: null as null | ReturnType<typeof setTimeout>,
			longPressed: false,
		}
	},

	computed: {
		photoTarget(): PhotoTarget {
			return toPhotoTarget(this.file)
		},

		ariaLabel(): string {
			if (this.file.attributes.favorite) {
				return t('photos', 'Favorite image, open the full size "{name}" image', { name: this.file.basename })
			}
			return t('photos', 'Open the full size "{name}" image', { name: this.file.basename })
		},

		isImage(): boolean {
			return this.file.mime?.startsWith('image') ?? false
		},

		isVideo(): boolean {
			return this.file.mime?.includes('video') ?? false
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

		blurhash(): string | undefined {
			return this.file.attributes['metadata-blurhash']
		},
	},

	watch: {
		async file() {
			this.initialized = false
			this.loadedSmall = false
			this.errorSmall = false
			this.loadedLarge = false
			this.errorLarge = false
			this.videoDuration = ''

			await this.init()
		},
	},

	async mounted() {
		await this.init()
	},

	beforeDestroy() {
		// cancel any pending load
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

			await this.getVideoDuration()
		},

		onClick() {
			// A long press toggles the selection, the click it ends with must
			// not open the file on top of it.
			if (this.longPressed) {
				this.longPressed = false
				return
			}

			this.$emit('click', this.file.fileid)
		},

		// Long pressing a file selects it, which is easier to hit on a touch
		// device than the checkbox.
		startLongPress() {
			if (!this.allowSelection) {
				return
			}

			this.cancelLongPress()
			this.longPressed = false
			this.longPressTimeout = setTimeout(() => {
				this.longPressed = true
				this.onToggle(!this.selected)
			}, 500)
		},

		cancelLongPress() {
			if (this.longPressTimeout !== null) {
				clearTimeout(this.longPressTimeout)
				this.longPressTimeout = null
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

		async getVideoDuration() {
			if (!this.isVideo) {
				return
			}

			try {
				const totalSeconds = await getVideoDurationFromUrl(this.file.source)
				const hours = Math.floor(totalSeconds / 3600)
				const minutes = Math.floor((totalSeconds % 3600) / 60)
				const seconds = totalSeconds % 60

				if (hours > 0) {
					this.videoDuration = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
				}

				this.videoDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
			} catch (error) {
				logger.error('Failed to get video duration for file', { error, filename: this.file.basename })
			}
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
	transition: transform var(--animation-quick) ease-out, box-shadow var(--animation-quick) ease-out;

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

		.selection-checkbox,
		.photo-actions-menu {
			opacity: 1;
		}
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
				transition: opacity var(--animation-quick) ease-out;
			}

			.file__layer--large {
				z-index: 3;
				opacity: 0;
				transition: opacity var(--animation-slow) ease-out;
			}

			.file__layer--visible {
				opacity: 1;
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
			z-index: 4; // above the preview layers

			&__label {
				font-weight: 600;
			}
		}
	}

	// Reveal checkbox and actions menu on hover.
	&:hover,
	&.selected,
	&:focus-within {
		.selection-checkbox,
		.photo-actions-menu {
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
		z-index: 5; // above the preview layers
		width: fit-content;

		:deep .checkbox-radio-switch__input:focus-visible+.checkbox-radio-switch__content,
		.checkbox-radio-switch__input:focus-visible {
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
		z-index: 5; // above the preview layers
		top: 2px;
		// Fancy calculation to render the start in the middle of narrow images.
		inset-inline-end: min(2px, calc(50% - 7px));
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
