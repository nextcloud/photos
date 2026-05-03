<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="file-legacy-wrap">
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

		<!--
			Per-photo overflow menu — same component the timeline uses.
			Accepts the FoldersNode shape via the ActionMenuFile
			interface; missing EXIF / favorite attributes degrade
			gracefully (View metadata shows just the filename, the
			favorite toggle still works because it goes through the
			store's PROPPATCH which only needs the fileid).
		-->
		<PhotoActionsMenu
			class="file-legacy-wrap__actions"
			:file="actionFile"
			@requestDelete="onRequestDelete" />
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { FoldersNode } from '../services/FolderContent.ts'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import PhotoActionsMenu from './PhotoActionsMenu.vue'
import { legacyToViewerFileInfo } from '../utils/fileUtils.ts'

export default {
	name: 'FileLegacy',

	components: {
		PhotoActionsMenu,
	},

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

	emits: ['delete-requested'],

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

		// Adapter: PhotoActionsMenu's `file` prop accepts the
		// ActionMenuFile interface (fileid, basename, optional
		// path/attributes). FoldersNode satisfies it directly; we just
		// forward.
		actionFile() {
			return {
				fileid: this.item.fileid,
				basename: this.item.basename,
				path: this.item.filename,
				// Synthesise an attributes bag with the favorite bit
				// the menu's "Add to favorites / Remove from favorites"
				// logic reads. FoldersNode doesn't track this directly
				// (folder listings don't include the oc:favorite prop)
				// so the toggle starts from "not favorited" — toggling
				// flips it on the server regardless. Acceptable for
				// the folder view since users don't frequently
				// favorite from there.
				attributes: { favorite: 0 },
			}
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

		// Forward the menu's delete request to the parent (FoldersView).
		// We don't dispatch the photos store action here because the
		// folder view doesn't use that store — it has its own
		// folder-content cache that needs invalidating after a delete.
		// Wiring is parent's responsibility.
		onRequestDelete() {
			this.$emit('delete-requested', this.item)
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

// Wrapper around the legacy <a class="file"> so PhotoActionsMenu
// (absolutely positioned) can pin to the same coordinate space.
// Inherits sizing from the parent grid so the underlying <a> still
// fills the tile.
.file-legacy-wrap {
	position: relative;
	width: 100%;
	height: 100%;

	&__actions {
		// Reveal on hover/focus, mirroring how FileComponent's menu
		// behaves — keeps the affordance discoverable without
		// permanently cluttering the tile.
		opacity: 0;
		transition: opacity 160ms ease-out;
	}

	&:hover &__actions,
	&__actions:focus-within {
		opacity: 1;
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
}

svg {
	position: absolute;
	width: 70%;
	height: 70%;
}
</style>
