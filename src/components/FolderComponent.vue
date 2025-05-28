<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<FolderTagPreview
		:id="item.injected.fileid"
		:name="item.injected.basename.toString()"
		:path="item.injected.filename"
		:file-list="previewFiles" />
</template>

<script lang='ts'>
import type Vue from 'vue'

import { getCurrentUser } from '@nextcloud/auth'
import {
	type PropType,

	defineComponent,
} from 'vue'
import FolderTagPreview from './FolderTagPreview.vue'
import AbortControllerMixin from '../mixins/AbortControllerMixin.ts'
import getFolderContent, { type FoldersNode } from '../services/FolderContent.ts'
import logger from '../services/logger.ts'

export type InjectedItem = {
	id: string
	injected: FoldersNode & {
		showShared: true
		list: FoldersNode[]
	}
	width: number
	height: number
	columnSpan: number
	renderComponent: Vue
}

export default defineComponent({
	name: 'FolderComponent',

	components: {
		FolderTagPreview,
	},

	mixins: [AbortControllerMixin],

	inheritAttrs: false,

	props: {
		item: {
			type: Object as PropType<InjectedItem>,
			required: true,
		},
	},

	data() {
		return {
			previewFolder: this.item.injected.fileid,
		}
	},

	computed: {
		files() {
			return this.$store.state.folders.files
		},

		subFolders() {
			return this.$store.state.folders.subFolders
		},

		folders() {
			return this.$store.state.folders.folders
		},

		// files list of the current folder
		folderContent() {
			return this.folders[this.item.injected.fileid]
		},

		previewFiles() {
			const previewFolderContent = this.folders[this.previewFolder]

			const previewFiles = previewFolderContent
				? previewFolderContent
						.map((id) => this.files[id])
						.slice(0, 4) // only get the 4 first images
				: []

			// If we didn't found any previews in the folder we try the next subfolder
			// We limit to one subfolder for performance concerns
			if (previewFiles.length === 0
				&& this.subFolders[this.previewFolder]
				&& this.previewFolder === this.item.injected.fileid) {
				const firstChildFolder = this.subFolders[this.previewFolder][0]
				this.updatePreviewFolder(firstChildFolder)

				if (!this.folders[this.previewFolder]) {
					this.getFolderData(this.files[this.previewFolder].filename)
				}
			}

			return previewFiles
		},
	},

	async created() {
		if (!this.folderContent) {
			await this.getFolderData(this.item.injected.filename)
		}
	},

	methods: {
		async getFolderData(filename) {
			try {
				// Remove leading /file/{userId}
				const prefix = `/files/${getCurrentUser()?.uid}`
				const unPrefixedFileName = filename.replace(new RegExp(`^${prefix}`), '')

				// get data
				const { folder, folders, files } = await getFolderContent(unPrefixedFileName, {
					shared: this.item.injected.showShared,
					signal: this.abortController.signal,
				})
				this.$store.dispatch('updateFolders', { fileid: folder?.fileid, files, folders })
				this.$store.dispatch('updateFoldersFiles', { folder, files, folders })
			} catch (error) {
				logger.error('Failed to get folder content', { error, filename })
			}
		},

		updatePreviewFolder(path) {
			this.previewFolder = path
		},
	},
})
</script>

<style lang="scss" scoped>
@use '../mixins/FileFolder';

.folder-content {
	position: absolute;
	display: grid;
	width: 100%;
	height: 100%;
	// folder layout if less than 4 pictures
	&--grid-1 {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
	&--grid-2 {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
	}
	&--grid-3 {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		img:first-child {
			grid-column: span 2;
		}
	}
	&--grid-4 {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}
	img {
		width: 100%;
		height: 100%;

		object-fit: cover;
	}
}

$name-height: 1rem;

.folder-name {
	position: absolute;
	z-index: 3;
	display: flex;
	overflow: hidden;
	flex-direction: column;
	width: 100%;
	height: 100%;
	transition: opacity var(--animation-quick) ease-in-out;
	opacity: 1;
	&__icon {
		height: 40%;
		margin-top: calc(30% - #{$name-height} / 2); // center name+icon
		background-size: 40%;
	}
	&__name {
		overflow: hidden;
		height: $name-height;
		padding: 0 10px;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-main-background);
		text-shadow: 0 0 8px var(--color-main-text);
		font-size: $name-height;
		line-height: $name-height;
	}
}

// Cover management empty/full
.folder {
	// if no img, let's display the folder icon as default black
	&--clear {
		.folder-name__icon {
			opacity: .3;
		}
		.folder-name__name {
			color: var(--color-main-text);
			text-shadow: 0 0 8px var(--color-main-background);
		}
	}

	// show the cover as background
	// if  there are pictures in it
	// so we can sho the folder+name above it
	&:not(.folder--clear) {
		.cover {
			opacity: .3;
		}

		// hide everything but pictures
		// on hover/active/focus
		&.active,
		&:active,
		&:hover,
		&:focus {
			.folder-name,
			.cover {
				opacity: 0;
			}
		}
	}
}

</style>
