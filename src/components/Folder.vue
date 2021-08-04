<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Corentin Mors <medias@pixelswap.fr>
 -
 - @license AGPL-3.0-or-later
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
	<FolderTagPreview :id="item.injected.fileid"
		:name="item.injected.basename"
		:path="item.injected.filename"
		:file-list="previewFiles" />
</template>

<script>
import { mapGetters } from 'vuex'

import getAlbumContent from '../services/AlbumContent'
import cancelableRequest from '../utils/CancelableRequest'
import FolderTagPreview from './FolderTagPreview'

export default {
	name: 'Folder',

	components: {
		FolderTagPreview,
	},
	inheritAttrs: false,

	props: {
		item: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			cancelRequest: null,
			previewFolder: this.item.injected.fileid,
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'folders',
		]),

		// files list of the current folder
		folderContent() {
			return this.folders[this.item.injected.fileid]
		},
		previewFiles() {
			const previewFolderContent = this.folders[this.previewFolder]

			const previewFiles = previewFolderContent
				? previewFolderContent
					.map(id => this.files[id])
					.slice(0, 4) // only get the 4 first images
				: []

			// If we didn't found any previews in the folder we try the next subfolder
			// We limit to one subfolder for performance concerns
			if (previewFiles.length === 0
				&& this.files[this.previewFolder].folders
				&& this.previewFolder === this.item.injected.fileid) {

				const firstChildFolder = this.files[this.previewFolder].folders[0]
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

	beforeDestroy() {
		// cancel any pending requests
		if (this.cancelRequest) {
			this.cancelRequest('Navigated away')
		}
	},

	methods: {
		async getFolderData(filename) {
			// init cancellable request
			const { request, cancel } = cancelableRequest(getAlbumContent)
			this.cancelRequest = cancel

			try {
				// get data
				const { folder, folders, files } = await request(filename, { shared: this.item.injected.showShared })
				this.$store.dispatch('updateFolders', { fileid: folder.fileid, files, folders })
				this.$store.dispatch('updateFiles', { folder, files, folders })
			} catch (error) {
				if (error.response && error.response.status) {
					console.error('Failed to get folder content', filename, error.response)
				}
				// else we just cancelled the request
			} finally {
				this.cancelRequest = null
			}
		},

		updatePreviewFolder(path) {
			this.previewFolder = path
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../mixins/FileFolder.scss';

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
