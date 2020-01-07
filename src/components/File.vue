<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @license GNU AGPL version 3 or any later version
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
	<a :class="{'file--clear': !loaded}"
		class="file"
		:href="davPath"
		:aria-label="ariaLabel"
		@click.prevent="openViewer">
		<!-- image and loading placeholder -->
		<transition name="fade">
			<img v-show="loaded"
				ref="img"
				:src="src"
				:alt="basename"
				:aria-describedby="ariaUuid"
				@load="onLoad">
		</transition>
		<svg v-if="!loaded"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			fill="url(#placeholder__gradient)">
			<use v-if="isImage" xlink:href="#placeholder--img" />
			<use v-else xlink:href="#placeholder--video" />
		</svg>

		<!-- image name and cover -->
		<p :id="ariaUuid" class="hidden-visually">{{ basename }}</p>
		<div class="cover" role="none" />
	</a>
</template>

<script>
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'

export default {
	name: 'File',
	inheritAttrs: false,

	props: {
		basename: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		etag: {
			type: String,
			required: true,
		},
		fileid: {
			type: Number,
			required: true,
		},
		mime: {
			type: String,
			required: true,
		},
		list: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			loaded: false,
		}
	},

	computed: {
		davPath() {
			return generateRemoteUrl(`dav/files/${getCurrentUser().uid}`) + this.filename
		},
		ariaUuid() {
			return `image-${this.fileid}`
		},
		ariaLabel() {
			return t('photos', 'Open the full size "{name}" image', { name: this.basename })
		},
		isImage() {
			return this.mime.startsWith('image')
		},
		src() {
			return generateUrl(`/core/preview?fileId=${this.fileid}&x=${256}&y=${256}&a=false&v=${this.etag}`)
		},
	},

	beforeDestroy() {
		// cancel any pending load
		this.$refs.src = ''
	},

	methods: {
		openViewer() {
			OCA.Viewer.open(this.filename, this.list)
		},
		onLoad() {
			this.loaded = true
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../mixins/FileFolder.scss';

img {
	position: absolute;
	width: 100%;
	height: 100%;

	object-fit: cover;
}

svg {
	position: absolute;
	width: 70%;
	height: 70%;
}
</style>
