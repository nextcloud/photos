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
				<VideoOutline v-if="file.mime?.includes('video')" class="icon-overlay" :size="64" />
				<PlayCircleOutlineIcon v-else-if="file.attributes['metadata-files-live-photo'] !== undefined" class="icon-overlay" :size="64" />

				<!-- We have two img elements to load the small and large preview -->
				<!-- Do not show the small preview if the larger one is loaded -->
				<!-- Prioritize visible files -->
				<!-- Load small preview first, then the larger one -->
				<!-- Preload large preview for near visible files -->
				<!-- Preload small preview for further away files -->
				<template v-if="initialized">
					<canvas
						v-if="hasBlurhash && !loadedSmall && !loadedLarge"
						ref="canvas"
						class="file__blurhash"
						aria-hidden="true" />

					<img
						v-if="!loadedLarge && (loadedSmall || (distance < 5 && !errorSmall))"
						ref="imgSmall"
						:key="`${file.basename}-small`"
						:src="srcSmall"
						:alt="file.basename"
						:decoding="loadedSmall || isVisible ? 'sync' : 'async'"
						:fetchpriority="loadedSmall || isVisible ? 'high' : 'low'"
						:loading="loadedSmall || isVisible ? 'eager' : distance < 2 ? 'auto' : 'lazy'"
						@load="onLoadSmall"
						@error="onErrorSmall">

					<img
						v-if="loadedLarge || ((isVisible || (distance < 2 && (loadedSmall || errorSmall))) && !errorLarge)"
						ref="imgLarge"
						:key="`${file.basename}-large`"
						:src="srcLarge"
						:alt="file.basename"
						:decoding="loadedLarge || isVisible ? 'sync' : 'async'"
						:fetchpriority="loadedLarge || isVisible ? 'high' : 'low'"
						:loading="loadedLarge || isVisible ? 'auto' : 'lazy'"
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
import { decode } from 'blurhash'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import PlayCircleOutlineIcon from 'vue-material-design-icons/PlayCircleOutline.vue'
import VideoOutline from 'vue-material-design-icons/VideoOutline.vue'
import FavoriteIcon from './FavoriteIcon.vue'
import { isCachedPreview } from '../services/PreviewService.js'

export default {
	name: 'FileComponent',
	components: {
		FavoriteIcon,
		NcCheckboxRadioSwitch,
		VideoOutline,
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

		distance: {
			type: Number,
			default: 0,
		},
	},

	data() {
		return {
			initialized: false,
			loadedSmall: false,
			errorSmall: false,
			loadedLarge: false,
			errorLarge: false,
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
			return this.getItemURL(512)
		},

		srcSmall(): string {
			return this.getItemURL(64)
		},

		isVisible(): boolean {
			return this.distance === 0
		},

		hasBlurhash() {
			return this.file.attributes.metadataBlurhash !== undefined
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

			const pixels = decode(this.file.attributes.metadataBlurhash, width, height)

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

			.icon-overlay {
				position: absolute;
				top: 0px;
				inset-inline-end: 0px;
				width: 100%;
				height: 100%;
				z-index: 1;
				opacity: 0.8;

				:deep(.material-design-icon__svg) {
					fill: var(--color-main-background);
				}
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				position: absolute;
				color: transparent; /// Hide alt='' text when loading.
			}
		}
	}

	// Reveal checkbox on hover.
	&:hover, &.selected, &:focus-within {
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

		:deep .checkbox-radio-switch__input:focus-visible + .checkbox-radio-switch__content,
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
