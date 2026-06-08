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
			@click.stop.prevent="emitClick">

			<!-- image and loading placeholder -->
			<div class="file__images">
				<div v-if="isVideo" class="file__duration">
					<span class="file__duration__label">{{ videoDuration }}</span>
					<PlayCircleOutlineIcon class="file__duration__icon" :size="16" />
				</div>
				<PlayCircleOutlineIcon v-else-if="file.attributes['metadata-files-live-photo'] !== undefined" :size="64" />

				<!-- We have two img elements to load the small and large preview -->
				<!-- Do not show the small preview if the larger one is loaded -->
				<!-- Prioritize visible files -->
				<!-- Load small preview first, then the larger one -->
				<!-- Preload large preview for near visible files -->
				<!-- Preload small preview for further away files -->
				<template v-if="initialized">
					<canvas
						v-if="hasBlurhash && !loadedLarge"
						ref="canvas"
						class="file__blurhash"
						aria-hidden="true" />

					<img
						v-if="!hasBlurhash && !loadedLarge && (loadedSmall || !errorSmall)"
						ref="imgSmall"
						:key="`${file.basename}-small`"
						:src="srcSmall"
						:alt="file.basename"
						:decoding="loadedSmall ? 'sync' : 'async'"
						:fetchpriority="loadedSmall ? 'high' : 'low'"
						:loading="loadedSmall ? 'eager' : undefined"
						@load="onLoadSmall"
						@error="onErrorSmall">

					<img
						v-if="loadedLarge || ((hasBlurhash || loadedSmall || errorSmall) && !errorLarge)"
						ref="imgLarge"
						:key="`${file.basename}-large`"
						:src="srcLarge"
						:alt="file.basename"
						:decoding="loadedLarge ? 'sync' : 'async'"
						:fetchpriority="loadedLarge ? 'high' : 'low'"
						:loading="loadedLarge ? undefined : 'lazy'"
						@load="onLoadLarge"
						@error="onErrorLarge">
				</template>
			</div>
		</a>

		<NcCheckboxRadioSwitch
			v-if="allowSelection"
			class="selection-checkbox"
			:aria-label="t('photos', 'Select image {imageName}', { imageName: file.basename })"
			:checked="selected"
			@update:checked="onToggle" />

		<FavoriteIcon
			v-if="file.attributes.favorite === 1"
			v-once
			class="favorite-state" />
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
import FavoriteIcon from './FavoriteIcon.vue'
import logger from '../services/logger.ts'
import { isCachedPreview } from '../services/PreviewService.js'
import { getVideoDurationFromUrl } from '../utils/fileUtils.ts'

export default {
	name: 'FileComponent',
	components: {
		FavoriteIcon,
		NcCheckboxRadioSwitch,
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
	},

	data() {
		return {
			initialized: false,
			loadedSmall: false,
			errorSmall: false,
			loadedLarge: false,
			errorLarge: false,
			isMobile: useIsMobile(),
			videoDuration: '',
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
		if (this.$refs.srcLarge !== undefined) {
			(this.$refs.srcLarge as HTMLImageElement).src = ''
		}
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
			await this.getVideoDuration()
		},

		emitClick() {
			this.$emit('click', this.file.fileid)
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

	// Selection border.
	&.selected,
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
			outline: var(--color-primary-element) solid 4px;
			outline-offset: -4px;
			pointer-events: none;
		}

		.selection-checkbox {
			opacity: 1;
		}
	}

	.file {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		outline: none; // Override global focus state.
		display: flex; // Fill parent size

		&__blurhash {
			position: absolute;
			top: 0;
			height: 100%;
			width: 100%;
			object-fit: cover;
		}

		&__images {
			width: 100%;
			height: 100%;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				position: absolute;
				color: transparent; /// Hide alt='' text when loading.
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
			z-index: 2;

			&__label {
				font-weight: 600;
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
		top: 2px;
		// Fancy calculation to render the start in the middle of narrow images.
		inset-inline-end: min(2px, calc(50% - 7px));
	}
}
</style>
