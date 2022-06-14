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
		:class="{selected}">
		<a class="file"
			:href="davPath"
			:aria-label="ariaLabel"
			@click.prevent="emitClick">

			<div v-if="item.mime.includes('video') && item.hasPreview" class="icon-video-white" />

			<!-- image and loading placeholder -->
			<div class="images-container">
				<img v-if="visibility !== 'none' && canLoad && !error"
					ref="imgNear"
					:key="`${item.basename}-near`"
					:src="srcNear"
					:alt="item.basename"
					:aria-describedby="ariaDescription"
					@load="onLoad"
					@error="onError">

				<img v-if="visibility === 'visible' && canLoad && !error"
					ref="imgVisible"
					:key="`${item.basename}-visible`"
					:src="srcVisible"
					:alt="item.basename"
					:aria-describedby="ariaDescription"
					@load="onLoad"
					@error="onError">

				<div v-if="visibility === 'none' || !loaded || error"
					:key="`${item.basename}-placeholder`"
					class="loading-overlay">
					<svg xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 32 32"
						fill="url(#placeholder__gradient)">
						<use v-if="isImage" href="#placeholder--img" />
						<use v-else href="#placeholder--video" />
					</svg>
				</div>
			</div>

			<!-- image name -->
			<p :id="ariaDescription" class="hidden-visually">{{ item.basename }}</p>
		</a>

		<CheckboxRadioSwitch v-if="allowSelection"
			class="selection-checkbox"
			:checked="selected"
			@update:checked="onToggle">
			<span class="input-label">{{ t('photos', 'Select image {imageName}', {imageName: item.basename}) }}</span>
		</CheckboxRadioSwitch>
	</div>
</template>

<script>
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'
import { CheckboxRadioSwitch } from '@nextcloud/vue'

import UserConfig from '../mixins/UserConfig.js'
import SemaphoreWithPriority from '../utils/semaphoreWithPriority.js'

export default {
	name: 'File',
	components: {
		CheckboxRadioSwitch,
	},
	mixins: [UserConfig],
	inheritAttrs: false,
	props: {
		item: {
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
			type: SemaphoreWithPriority,
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
		davPath() {
			return generateRemoteUrl(`dav/files/${getCurrentUser().uid}`) + this.item.filename
		},
		/** @return {string} */
		ariaDescription() {
			return `image-description-${this.item.fileid}`
		},
		/** @return {string} */
		ariaLabel() {
			return t('photos', 'Open the full size "{name}" image', { name: this.item.basename })
		},
		/** @return {boolean} */
		isImage() {
			return this.item.mime.startsWith('image')
		},
		/** @return {string} */
		decodedEtag() {
			return this.item.etag.replace('&quot;', '').replace('&quot;', '')
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

	async mounted() {
		// Don't render the component right away as it is useless if the user is only scrolling
		await new Promise((resolve) => {
			setTimeout(async () => { resolve() }, 250)
		})

		this.semaphoreSymbol = await this.semaphore.acquire(() => {
			switch (this.visibility) {
			case 'visible':
				return 1
			case 'near':
				return 2
			default:
				return 3
			}
		}, this.item.fileid)

		this.canLoad = true
		if (this.visibility === 'none' || this.isDestroyed) {
			this.releaseSemaphore()
		}
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
			this.$emit('click', this.item.fileid)
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
			this.$emit('select-toggled', { id: this.item.fileid, value })
		},

		getItemURL(size) {
			return generateUrl(`/core/preview?fileId=${this.item.fileid}&c=${this.decodedEtag}&x=${size}&y=${size}&forceIcon=0&a=1`)

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
	background: lightgray;
	position: relative;
	border: 2px solid white; // Use border so create a separation between images.
	height: 100%;
	width: 100%;

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

	// Reveal checkbox on hover.
	&:hover, &.selected, &:focus-within {
		.selection-checkbox {
			display: flex;
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

			&::after {
				content: '';
				background: var(--color-primary-light);
				width: 16px;
				height: 16px;
				position: absolute;
				left: 1px;
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

	.file {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.images-container {
			display: contents;

			.icon-video-white {
				position: absolute;
				top: 10px;
				right: 10px;
				z-index: 20;
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				position: absolute;
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
	}
}
</style>
