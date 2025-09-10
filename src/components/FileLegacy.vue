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
		:href="item.source"
		:aria-label="ariaLabel"
		@click.prevent="openViewer">
		<div v-if="item.mime.includes('video') && item.hasPreview" class="icon-video-white" />

		<img
			v-if="!error"
			ref="img"
			:key="`${item.basename}-img`"
			:src="src"
			:alt="item.basename"
			:aria-describedby="ariaUuid"
			@load="onLoad"
			@error="onError">

		<!-- image name and cover -->
		<p :id="ariaUuid" class="hidden-visually">{{ item.basename }}</p>
		<div class="cover" role="none" />
	</a>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { FoldersNode } from '../services/FolderContent.ts'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { legacyToViewerFileInfo } from '../utils/fileUtils.ts'

export default {
	name: 'FileLegacy',
	inheritAttrs: false,
	props: {
		item: {
			type: Object as PropType<FoldersNode>,
			required: true,
		},

		list: {
			type: Object as PropType<FoldersNode[]>,
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
			return `image-${this.item.fileid}`
		},

		ariaLabel() {
			return t('photos', 'Open the full size "{name}" image', { name: this.item.basename })
		},

		isImage() {
			return this.item.mime.startsWith('image')
		},

		decodedEtag() {
			return this.item.etag.replace('&quot;', '').replace('&quot;', '')
		},

		src() {
			return generateUrl(`/core/preview?fileId=${this.item.fileid}&c=${this.decodedEtag}&x=${250}&y=${250}&forceIcon=0&a=${this.croppedLayout ? '0' : '1'}`)
		},

		croppedLayout() {
			return this.$store.state.userConfig.croppedLayout
		},
	},

	beforeUnmount() {
		// cancel any pending load
		if (this.$refs.img !== undefined) {
			(this.$refs.img as HTMLImageElement).src = ''
		}
	},

	methods: {
		openViewer() {
			window.OCA.Viewer.open({
				fileInfo: legacyToViewerFileInfo(this.item),
				list: this.list.map((file) => legacyToViewerFileInfo(file)),
				onClose() { window.OCA.Files.Sidebar.close() },
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
