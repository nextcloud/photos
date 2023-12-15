<!--
 - @copyright Copyright (c) 2020 Corentin Mors
 -
 - @license AGPL-3.0-or-later
 -
 - @author Corentin Mors <medias@pixelswap.fr>
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<div class="file-container"
		data-test="media"
		:class="{selected}">
		<a class="file"
			:href="file.source"
			:aria-label="ariaLabel"
			@click.stop.prevent="emitClick">

			<!-- image and loading placeholder -->
			<div class="file__images">
				<VideoIcon v-if="file.mime.includes('video')" class="icon-overlay" :size="64" />
				<PlayCircleIcon v-else-if="file.metadataFilesLivePhoto !== undefined" class="icon-overlay" :size="64" />

				<!-- We have two img elements to load the small and large preview -->
				<!-- Do not show the small preview if the larger one is loaded -->
				<!-- Prioritize visible files -->
				<!-- Load small preview first, then the larger one -->
				<!-- Preload large preview for near visible files -->
				<!-- Preload small preview for further away files -->
				<template v-if="initialized">
					<img v-if="!loadedLarge && (loadedSmall || (distance < 5 && !errorSmall))"
						ref="imgSmall"
						:key="`${file.basename}-small`"
						:src="srcSmall"
						:alt="file.basename"
						:aria-describedby="ariaDescription"
						:decoding="loadedSmall || isVisible ? 'sync' : 'async'"
						:fetchpriority="loadedSmall || isVisible ? 'high' : 'low'"
						:loading="loadedSmall || isVisible ? 'eager' : distance < 2 ? 'auto' : 'lazy'"
						@load="onLoadSmall"
						@error="onErrorSmall">

					<img v-if="loadedLarge || ((isVisible || (distance < 2 && (loadedSmall || errorSmall))) && !errorLarge)"
						ref="imgLarge"
						:key="`${file.basename}-large`"
						:src="srcLarge"
						:alt="file.basename"
						:decoding="loadedLarge || isVisible ? 'sync' : 'async'"
						:fetchpriority="loadedLarge || isVisible ? 'high' : 'low'"
						:loading="loadedLarge || isVisible ? 'auto' : 'lazy'"
						:aria-describedby="ariaDescription"
						@load="onLoadLarge"
						@error="onErrorLarge">
				</template>
			</div>

			<!-- image description -->
			<p :id="ariaDescription" class="file__hidden-description" :class="{show: errorSmall && errorLarge}">{{ file.basename }}</p>
		</a>

		<NcCheckboxRadioSwitch v-if="allowSelection"
			class="selection-checkbox"
			:aria-label="t('photos', 'Select image {imageName}', {imageName: file.basename})"
			:checked="selected"
			@update:checked="onToggle" />

		<FavoriteIcon v-if="file.favorite === 1"
			v-once
			class="favorite-state" />
	</div>
</template>

<script>
import VideoIcon from 'vue-material-design-icons/Video.vue'
import PlayCircleIcon from 'vue-material-design-icons/PlayCircle.vue'
import FavoriteIcon from './FavoriteIcon.vue'

import { generateUrl } from '@nextcloud/router'
import { NcCheckboxRadioSwitch } from '@nextcloud/vue'

import { isCachedPreview } from '../services/PreviewService.js'

export default {
	name: 'File',
	components: {
		FavoriteIcon,
		NcCheckboxRadioSwitch,
		VideoIcon,
		PlayCircleIcon,
	},
	inheritAttrs: false,
	props: {
		file: {
			type: Object,
			required: true,
		},
		selected: {
			type: Boolean,
			required: true,
		},
		allowSelection: {
			type: Boolean,
			default: true,
		},
		distance: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			initialized: false,
			isDestroyed: false,
			loadedSmall: false,
			errorSmall: false,
			loadedLarge: false,
			errorLarge: false,
		}
	},

	computed: {
		/** @return {string} */
		ariaDescription() {
			return `image-description-${this.file.fileid}`
		},
		/** @return {string} */
		ariaLabel() {
			return t('photos', 'Open the full size "{name}" image', { name: this.file.basename })
		},
		/** @return {boolean} */
		isImage() {
			return this.file.mime.startsWith('image')
		},
		/** @return {string} */
		decodedEtag() {
			return this.file.etag.replace('&quot;', '').replace('&quot;', '')
		},
		/** @return {string} */
		srcLarge() {
			return this.getItemURL(512)
		},
		/** @return {string} */
		srcSmall() {
			return this.getItemURL(64)
		},
		/** @return {boolean} */
		isVisible() {
			return this.distance === 0
		},
	},

	async mounted() {
		[this.loadedSmall, this.loadedLarge] = await Promise.all([
			await isCachedPreview(this.srcSmall),
			await isCachedPreview(this.srcLarge),
		])

		this.initialized = true
	},

	beforeDestroy() {
		this.isDestroyed = true

		// cancel any pending load
		if (this.$refs.imgSmall !== undefined) {
			this.$refs.imgSmall.src = ''
		}
		if (this.$refs.srcLarge !== undefined) {
			this.$refs.srcLarge.src = ''
		}
	},

	methods: {
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
			const token = this.$route.params.token
			if (token) {
				return generateUrl(`/apps/photos/api/v1/publicPreview/${this.file.fileid}?etag=${this.decodedEtag}&x=${size}&y=${size}&token=${token}`)
			} else {
				return generateUrl(`/apps/photos/api/v1/preview/${this.file.fileid}?etag=${this.decodedEtag}&x=${size}&y=${size}`)
			}
		},
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
	&.selected, &:focus-within {
		&::after {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			width: 100%;
			height: 100%;
			content: '';
			outline: var(--color-primary-element) solid 4px;
			outline-offset: -4px;
			pointer-events: none;
		}
	}

	.file {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		outline: none; // Override global focus state.
		display: flex; // Fill parent size

		&__images {
			display: contents;

			.icon-overlay {
				position: absolute;
				top: 0px;
				right: 0px;
				width: 100%;
				height: 100%;
				z-index: 1;
				opacity: 0.8;

				:deep .material-design-icon__svg {
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

			.loading-overlay {
				position: absolute;
				height: 100%;
				width: 100%;
				display: flex;
				align-content: center;
				align-items: center;
				justify-content: center;

				svg {
					width: 70%;
					height: 70%;
				}
			}
		}

		&__hidden-description {
			position: absolute;
			left: -10000px;
			top: -10000px;
			width: 1px;
			height: 1px;
			overflow: hidden;

			&.show {
				position: initial;
				width: fit-content;
				height: fit-content;
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
		right: min(22px, calc(50% - 7px));
		z-index: 1;
		width: fit-content;

		:deep .checkbox-radio-switch__input:focus-visible + .checkbox-radio-switch__content,
		.checkbox-radio-switch__input:focus-visible {
			outline: 2px solid var(--color-main-text);
			box-shadow: 0 0 0 3px var(--color-main-background);
			outline-offset: 0px;
		}

		:deep .checkbox-radio-switch__content {
			padding: 10px;
			box-sizing: border-box;
			background: var(--color-main-background);

			// Add a background to the checkbox so we do not see the image through it.
			&::after {
				content: '';
				width: 16px;
				height: 16px;
				position: absolute;
				left: 14px;
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
			left: -5000px;
		}
	}

	.favorite-state {
		position: absolute;
		top: 2px;
		// Fancy calculation to render the start in the middle of narrow images.
		right: min(2px, calc(50% - 7px));
	}
}
</style>
