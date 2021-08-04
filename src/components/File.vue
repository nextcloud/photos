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
	<a :class="{
			'file--cropped': croppedLayout,
		}"
		class="file"
		:href="davPath"
		:aria-label="ariaLabel"
		@click.prevent="openViewer">
		<div v-if="item.injected.mime.includes('video') && item.injected.hasPreview" class="icon-video-white" />
		<!-- image and loading placeholder -->
		<transition-group name="fade" class="transition-group">
			<img
				v-if="!error"
				ref="img"
				:key="`${item.injected.basename}-img`"
				:src="src"
				:alt="item.injected.basename"
				:aria-describedby="ariaUuid"
				@load="onLoad"
				@error="onError">

			<svg v-if="!loaded || error"
				:key="`${item.injected.basename}-svg`"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 32 32"
				fill="url(#placeholder__gradient)">
				<use v-if="isImage" xlink:href="#placeholder--img" />
				<use v-else xlink:href="#placeholder--video" />
			</svg>
		</transition-group>

		<!-- image name and cover -->
		<p :id="ariaUuid" class="hidden-visually">{{ item.injected.basename }}</p>
		<div class="cover" role="none" />
	</a>
</template>

<script>
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'

import UserConfig from '../mixins/UserConfig'

export default {
	name: 'File',
	mixins: [UserConfig],
	inheritAttrs: false,
	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			loaded: false,
			error: false,
		}
	},

	computed: {
		davPath() {
			return generateRemoteUrl(`dav/files/${getCurrentUser().uid}`) + this.item.injected.filename
		},
		ariaUuid() {
			return `image-${this.item.injected.fileid}`
		},
		ariaLabel() {
			return t('photos', 'Open the full size "{name}" image', { name: this.item.injected.basename })
		},
		isImage() {
			return this.item.injected.mime.startsWith('image')
		},
		src() {
			return generateUrl(`/core/preview?fileId=${this.item.injected.fileid}&x=${256}&y=${256}&a=${!this.croppedLayout}&v=${this.item.injected.etag}`)
		},
	},

	beforeDestroy() {
		// cancel any pending load
		this.$refs.src = ''
	},

	methods: {
		openViewer() {
			OCA.Viewer.open({
				path: this.item.injected.filename,
				list: this.item.injected.list,
				loadMore: this.item.injected.loadMore ? async () => await this.item.injected.loadMore(true) : () => [],
				canLoop: this.item.injected.canLoop,
			})
		},

		/** When the image is fully loaded by browser we remove the placeholder */
		onLoad() {
			this.loaded = true
		},

		onError() {
			this.error = true
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../mixins/FileFolder.scss';

.transition-group {
	display: contents;
}

.icon-video-white {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 20;
}

img {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 10;

	color: transparent; // should be diplayed on error

	object-fit: contain;

	.file--cropped & {
		object-fit: cover;
	}
}

svg {
	position: absolute;
	width: 70%;
	height: 70%;
}
</style>
