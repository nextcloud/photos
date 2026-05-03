<!--
 - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div
		class="file-legacy-wrap"
		@mouseenter="schedulePreview"
		@mouseleave="cancelPreview">
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

			<!--
				Hover video preview — same affordance as the timeline
				tile. Mounted only after a 250ms hover delay and only
				for codecs the browser can play (mp4/webm/ogg). HEVC
				and friends stay on the still thumbnail until we add
				transcoding.
			-->
			<video
				v-if="videoPreviewActive"
				ref="videoPreview"
				class="video-preview"
				:src="item.source"
				muted
				loop
				autoplay
				playsinline
				preload="metadata"
				aria-hidden="true"
				@error="onVideoPreviewError" />

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
			// Hover video preview state — mirrors FileComponent.
			videoPreviewActive: false,
			videoPreviewTimer: null as ReturnType<typeof setTimeout> | null,
			videoPreviewError: false,
		}
	},

	computed: {
		ariaUuid() {
			return `image-${this.item.fileid}`
		},

		// Same codec gating as FileComponent — only formats the
		// browser can play inline. HEVC / ProRes etc. need the
		// transcoding pipeline that's a separate change.
		isPreviewableVideo(): boolean {
			const mime = this.item.mime ?? ''
			if (!mime.startsWith('video/')) {
				return false
			}
			return mime === 'video/mp4'
				|| mime === 'video/webm'
				|| mime === 'video/ogg'
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
		this.cancelPreview()
	},

	methods: {
		// --- Hover video preview (mirrors FileComponent) ---
		schedulePreview() {
			if (!this.isPreviewableVideo || this.videoPreviewError) {
				return
			}
			if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				return
			}
			this.cancelPreview()
			this.videoPreviewTimer = setTimeout(() => {
				this.videoPreviewActive = true
				this.videoPreviewTimer = null
			}, 250)
		},

		cancelPreview() {
			if (this.videoPreviewTimer !== null) {
				clearTimeout(this.videoPreviewTimer)
				this.videoPreviewTimer = null
			}
			if (this.videoPreviewActive) {
				const video = this.$refs.videoPreview as HTMLVideoElement | undefined
				if (video !== undefined) {
					video.pause()
					video.removeAttribute('src')
					video.load()
				}
				this.videoPreviewActive = false
			}
		},

		onVideoPreviewError() {
			this.videoPreviewError = true
			this.videoPreviewActive = false
		},

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
	// Lift + soft shadow on hover. Pairs with the image-magnify
	// effect below; same 220ms ease-out so the two animations land
	// together. Mirrors the FileComponent timeline tile so the
	// folder view feels like the same product.
	transition: box-shadow 220ms ease-out;

	&:hover {
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
		z-index: 1;
	}

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

	// FileLegacy's existing `img { z-index: 10 }` rule sits in front
	// of PhotoActionsMenu's default `z-index: 3`, so clicks aimed at
	// the menu button land on the image (which is inside the `<a>`
	// tag) and open the viewer instead. Lift the menu's root above
	// the image. `:deep()` reaches the scoped class inside the menu
	// component; the `.file-legacy-wrap`-rooted selector is the
	// containment-aware version of the previous attempt that didn't
	// match because `.photo-actions` and `.file-legacy-wrap__actions`
	// resolve to the same element, not a parent/child pair.
	:deep(.photo-actions) {
		z-index: 11;
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

	// Subtle magnify on hover. The `<a class="file">` clips overflow
	// (it has overflow: hidden via FileFolder mixin), so the image
	// scales without spilling onto neighbouring tiles. Reduced-motion
	// users opt out via the media query below.
	// 520ms with an "ease-out-quint" curve — see FileComponent for
	// the same pairing on the timeline tile.
	transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.file-legacy-wrap:hover img {
	transform: scale(1.07);
}

@media (prefers-reduced-motion: reduce) {
	.file-legacy-wrap:hover img {
		transform: none;
	}
}

// Hover video preview sits above the image (img is z-index 10, so
// 11) and crops to the same square via object-fit. Brief fade-in
// so the still→motion swap doesn't pop.
.video-preview {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 11;
	object-fit: cover;
	animation: file-legacy-video-fade-in 240ms ease-out;
}

@keyframes file-legacy-video-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

svg {
	position: absolute;
	width: 70%;
	height: 70%;
}
</style>
