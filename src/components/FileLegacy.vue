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
			@error="error = true">

		<!-- image name and cover -->
		<p :id="ariaUuid" class="hidden-visually">{{ item.basename }}</p>
		<div class="cover" role="none" />
	</a>
</template>

<script setup lang='ts'>
import type { PropType } from 'vue'
import type { FoldersNode } from '../services/FolderContent.ts'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onBeforeUnmount, ref } from 'vue'
import store from '../store/index.ts'
import { legacyToViewerFileInfo } from '../utils/fileUtils.ts'

const props = defineProps({
	item: {
		type: Object as PropType<FoldersNode>,
		required: true,
	},

	/** Files of the same folder, used as the viewer's file list. */
	list: {
		type: Array as PropType<FoldersNode[]>,
		required: true,
	},
})

const img = ref<HTMLImageElement>()
const error = ref(false)

const croppedLayout = computed<boolean>(() => store.state.userConfig.croppedLayout)

const ariaUuid = computed(() => `image-${props.item.fileid}`)

const ariaLabel = computed(() => t('photos', 'Open the full size "{name}" image', { name: props.item.basename }))

const decodedEtag = computed(() => props.item.etag.replace('&quot;', '').replace('&quot;', ''))

const src = computed(() => generateUrl(`/core/preview?fileId=${props.item.fileid}&c=${decodedEtag.value}&x=${250}&y=${250}&forceIcon=0&a=${croppedLayout.value ? '0' : '1'}`))

// Cancel any pending load.
onBeforeUnmount(() => {
	if (img.value !== undefined) {
		img.value.src = ''
	}
})

/**
 * Open the file in the viewer, with all the files of the folder as a list.
 */
function openViewer() {
	window.OCA.Viewer.open({
		fileInfo: legacyToViewerFileInfo(props.item),
		list: props.list.map((file) => legacyToViewerFileInfo(file)),
		onClose: () => window.OCA?.Files?.Sidebar?.close?.(),
	})
}
</script>

<style lang="scss" scoped>
@use '../mixins/FileFolder';

.file {
	// The tile size is given by the layout, the preview fills it.
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border: 2px solid var(--color-main-background); // Use border to create a separation between images.
	background-color: var(--color-primary-element-light);
	// Hover lift, paired with the preview magnify below. Mirrors the tile of
	// FileComponent, so the folder view hovers like the timeline.
	transition: box-shadow 220ms ease-out;

	&:hover {
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
		z-index: 1;
	}

	.cover {
		position: absolute;
		top: 0;
		inset-inline-start: 0;
		width: 100%;
		height: 100%;
		padding-bottom: 0;
	}
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

	// The magnify is clipped by `.file`, which is `overflow: hidden` through the
	// FileFolder mixin, so the preview never spills onto the neighbouring tile.
	transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.file:hover img {
	transform: scale(1.07);
}

@media (prefers-reduced-motion: reduce) {
	.file:hover img {
		transform: none;
	}
}
</style>
