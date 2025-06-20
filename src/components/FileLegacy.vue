<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<a
		:class="{
			'file--cropped': croppedLayout,
		}"
		class="file"
		:href="item.injected.source"
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

			<svg
				v-if="!loaded || error"
				:key="`${item.injected.basename}-svg`"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 32 32"
				fill="url(#placeholder__gradient)">
				<use v-if="isImage" href="#placeholder--img" />
				<use v-else href="#placeholder--video" />
			</svg>
		</transition-group>

		<!-- image name and cover -->
		<p :id="ariaUuid" class="hidden-visually">{{ item.injected.basename }}</p>
		<div class="cover" role="none" />
	</a>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { InjectedItem } from './FolderComponent.vue'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { legacyToViewerFileInfo } from '../utils/fileUtils.ts'

export default {
	name: 'FileLegacy',
	inheritAttrs: false,
	props: {
		item: {
			type: Object as PropType<InjectedItem>,
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
		ariaUuid() {
			return `image-${this.item.injected.fileid}`
		},

		ariaLabel() {
			return t('photos', 'Open the full size "{name}" image', { name: this.item.injected.basename })
		},

		isImage() {
			return this.item.injected.mime.startsWith('image')
		},

		decodedEtag() {
			return this.item.injected.etag.replace('&quot;', '').replace('&quot;', '')
		},

		src() {
			return generateUrl(`/core/preview?fileId=${this.item.injected.fileid}&c=${this.decodedEtag}&x=${250}&y=${250}&forceIcon=0&a=${this.croppedLayout ? '0' : '1'}`)
		},

		croppedLayout() {
			return this.$store.state.userConfig.croppedLayout
		},
	},

	beforeDestroy() {
		// cancel any pending load
		this.$refs.src = ''
	},

	methods: {
		openViewer() {
			window.OCA.Viewer.open({
				fileInfo: legacyToViewerFileInfo(this.item.injected),
				list: this.item.injected.list.map((file) => legacyToViewerFileInfo(file)),
			})
		},

		/** When the image is fully loaded by browser we remove the placeholder */
		onLoad() {
			this.loaded = true
		},

		onError() {
			this.error = true
		},

		t,
	},

}
</script>

<style lang="scss" scoped>
@use '../mixins/FileFolder';

.transition-group {
	display: contents;
}

.icon-video-white {
	position: absolute;
	top: 10px;
	inset-inline-end: 10px;
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
