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
				<VideoIcon v-if="file.mime.includes('video')" class="video-icon" :size="64" />

				<img v-if="visibility !== 'none' && canLoad && !error"
					ref="imgNear"
					:key="`${file.basename}-near`"
					:src="srcNear"
					:alt="file.basename"
					:aria-describedby="ariaDescription"
					@load="onLoad"
					@error="onError">

				<img v-if="visibility === 'visible' && canLoad && !error"
					ref="imgVisible"
					:key="`${file.basename}-visible`"
					:src="srcVisible"
					:alt="file.basename"
					:aria-describedby="ariaDescription"
					@load="onLoad"
					@error="onError">
			</div>

			<!-- image description -->
			<p :id="ariaDescription" class="file__hidden-description" :class="{show: error}">{{ file.basename }}</p>
		</a>

		<NcCheckboxRadioSwitch v-if="allowSelection"
			class="selection-checkbox"
			:checked="selected"
			@update:checked="onToggle">
			<span class="input-label">{{ t('photos', 'Select image {imageName}', {imageName: file.basename}) }}</span>
		</NcCheckboxRadioSwitch>

		<Star v-if="file.favorite === 1" class="favorite-state" :aria-label="t('photos', 'The file is in the favorites')" />
	</div>
</template>

<script>
import Star from 'vue-material-design-icons/Star'
import VideoIcon from 'vue-material-design-icons/Video.vue'

import { generateUrl } from '@nextcloud/router'
import { NcCheckboxRadioSwitch } from '@nextcloud/vue'

import UserConfig from '../mixins/UserConfig.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

export default {
	name: 'File',
	components: {
		NcCheckboxRadioSwitch,
		Star,
		VideoIcon,
	},
	mixins: [UserConfig],
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
		visibility: {
			type: String,
			required: true,
		},
		semaphore: {
			type: Semaphore,
			required: true,
		},
	},

	data() {
		return {
			loaded: false,
			error: false,
			canLoad: false,
			semaphoreSymbol: null,
			isDestroyed: false,
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
		srcVisible() {
			return this.getItemURL(512)
		},
		/** @return {string} */
		srcNear() {
			return this.getItemURL(64)
		},
	},

	mounted() {
		// Don't render the component right away as it is useless if the user is only scrolling
		setTimeout(async () => {
			this.semaphoreSymbol = await this.semaphore.acquire(() => {
				switch (this.visibility) {
				case 'visible':
					return 1
				case 'near':
					return 2
				default:
					return 3
				}
			}, this.file.fileid)

			this.canLoad = true
			if (this.visibility === 'none' || this.isDestroyed) {
				this.releaseSemaphore()
			}
		}, 250)
	},

	beforeDestroy() {
		this.isDestroyed = true
		this.releaseSemaphore()

		// cancel any pending load
		if (this.$refs.imgNear !== undefined) {
			this.$refs.imgNear.src = ''
		}
		if (this.$refs.srcVisible !== undefined) {
			this.$refs.srcVisible.src = ''
		}
	},

	methods: {
		emitClick() {
			this.$emit('click', this.file.fileid)
		},

		/** When the image is fully loaded by browser we remove the placeholder */
		onLoad() {
			this.loaded = true
			this.releaseSemaphore()
		},

		onError() {
			this.error = true
			this.releaseSemaphore()
		},

		onToggle(value) {
			this.$emit('select-toggled', { id: this.file.fileid, value })
		},

		getItemURL(size) {
			const token = this.$route.params.token
			if (token) {
				return generateUrl(`/apps/photos/api/v1/publicPreview/${this.file.fileid}?x=${size}&y=${size}&token=${token}`)
			} else {
				return generateUrl(`/apps/photos/api/v1/preview/${this.file.fileid}?x=${size}&y=${size}`)
			}

		},

		releaseSemaphore() {
			if (this.semaphoreSymbol === null) {
				return
			}
			this.semaphore.release(this.semaphoreSymbol)
			this.semaphoreSymbol = null
		},
	},

}
</script>

<style lang="scss" scoped>
.file-container {
	background: var(--color-primary-light);
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
			outline: var(--color-primary) solid 4px;
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

			.video-icon {
				position: absolute;
				top: 0px;
				right: 0px;
				width: 100%;
				height: 100%;
				z-index: 1;
				opacity: 0.8;

				::v-deep .material-design-icon__svg {
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
			display: flex;
		}

		.favorite-state {
			display: none;
		}
	}

	.selection-checkbox {
		display: none;
		position: absolute;
		top: 8px;
		// Fancy calculation to render the checkbox in the middle of narrow images.
		right: min(22px, calc(50% - 7px));
		z-index: 1;
		width: fit-content;

		// Make the checkbox background round on hover.
		::v-deep .checkbox-radio-switch__label {
			padding: 10px;
			box-sizing: border-box;

			// Add a background to the checkbox so we do not see the image through it.
			&::after {
				content: '';
				background: var(--color-primary-light);
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

		::v-deep .material-design-icon__svg {
			fill: #FC0;

			path {
				stroke: var(--color-primary-light);
				stroke-width: 1px;
			}
		}
	}
}
</style>
