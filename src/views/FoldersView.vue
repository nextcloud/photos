<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error === 404" :name="t('photos', 'This folder does not exist')">
		<template #icon>
			<FolderOutline />
		</template>
	</NcEmptyContent>
	<NcEmptyContent v-else-if="error" :name="t('photos', 'An error occurred')" />
	<NcEmptyContent v-else-if="initializing" :name="t('photos', 'Loading folders…')">
		<template #icon>
			<NcLoadingIcon />
		</template>
	</NcEmptyContent>

	<!-- Folder content -->
	<div v-else-if="!initializing">
		<HeaderNavigation
			key="navigation"
			:class="{ 'photos-navigation--uploading': uploader.queue?.length > 0 }"
			:loading="loading"
			:path="path"
			:title="folder?.basename?.toString?.() || rootTitle"
			:root-title="rootTitle"
			@refresh="onRefresh">
			<UploadPicker
				:accept="allowedMimes"
				:destination="folderAsFolder"
				:multiple="true"
				@uploaded="onUpload" />
		</HeaderNavigation>

		<!-- Empty folder, should only happen via direct link -->
		<NcEmptyContent v-if="isEmpty" key="emptycontent" :name="t('photos', 'No photos in here')">
			<template #icon>
				<FolderOutline />
			</template>
		</NcEmptyContent>

		<div
			v-else
			class="grid-container"
			:class="{
				'grid-container--folders': haveFolders,
			}">
			<VirtualGrid
				ref="virtualgrid"
				:items="contentList"
				:scroll-element="appContent"
				:get-column-count="() => haveFolders ? gridConfig.folderCount : gridConfig.count"
				:get-grid-gap="() => haveFolders ? 16 : 8" />
		</div>
	</div>
</template>

<script lang='ts'>
import type { Upload } from '@nextcloud/upload'

import { Folder } from '@nextcloud/files'
import { defaultRootPath, parsePermissions } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { getUploader, UploadPicker } from '@nextcloud/upload'
import VirtualGrid from 'vue-virtual-grid'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'
import FileLegacy from '../components/FileLegacy.vue'
import FolderComponent from '../components/FolderComponent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import GridConfigMixin from '../mixins/GridConfig.js'
import allowedMimes from '../services/AllowedMimes.js'
import { fetchFile } from '../services/fileFetcher.ts'
import getFolderContent, { type FoldersNode } from '../services/FolderContent.ts'
import logger from '../services/logger.ts'

export default {
	name: 'FoldersView',
	components: {
		FolderOutline,
		HeaderNavigation,
		NcEmptyContent,
		NcLoadingIcon,
		UploadPicker,
		VirtualGrid,
	},

	mixins: [
		AbortControllerMixin,
		GridConfigMixin,
	],

	props: {
		rootTitle: {
			type: String,
			required: true,
		},

		path: {
			type: String,
			default: '/',
		},

		showShared: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			error: null as null | 404 | Error,
			allowedMimes,

			initializing: true,
			loading: false,

			appContent: document.getElementById('app-content-vue'),

			uploader: getUploader(),
		}
	},

	computed: {
		files() {
			return this.$store.state.folders.files
		},

		folders() {
			return this.$store.state.folders.folders
		},

		// current folder id from current path
		folderId() {
			return this.$store.state.folders.paths[this.path]
		},

		// files list of the current folder
		folder() {
			return this.files[this.folderId] as unknown as FoldersNode
		},

		folderAsFolder() {
			if (!this.folder) {
				return undefined
			}

			return new Folder({
				...this.folder,
				permissions: parsePermissions(this.folder.permissions),
				owner: null,
			})
		},

		folderContent() {
			return this.folders[this.folderId] || []
		},

		fileList() {
			const list = this.folderContent
				&& this.folderContent
					.map((id) => this.files[id])
					.filter((file) => !!file)
			return list
		},

		// subfolders of the current folder
		subFolders() {
			return this.folderId
				&& this.files[this.folderId]
				&& this.$store.state.folders.subFolders[this.folderId]
		},

		folderList() {
			const list = this.subFolders
				&& this.subFolders
					.map((id) => this.files[id])
					.filter((file) => !!file)
			return list
		},

		contentList() {
			const folders = this.folderList && this.folderList.map((folder) => {
				return {
					id: `folder-${folder.fileid}`,
					injected: {
						...folder,
						showShared: this.showShared,
					},
					width: 232,
					height: 280,
					columnSpan: 1,
					renderComponent: FolderComponent,
				}
			})

			const files = this.fileList?.map((file) => {
				return {
					id: `file-${file.fileid}`,
					injected: {
						...file,
						list: this.fileList,
					},
					width: 256,
					height: 256,
					columnSpan: 1,
					renderComponent: FileLegacy,
				}
			})

			return [...(folders || []), ...(files || [])]
		},

		// is current folder empty?
		isEmpty() {
			return !this.haveFiles && !this.haveFolders
		},

		haveFiles() {
			return !!this.fileList && this.fileList.length !== 0
		},

		haveFolders() {
			return !!this.folderList && this.folderList.length !== 0
		},
	},

	watch: {
		path() {
			this.fetchFolderContent()
		},

		showShared() {
			this.fetchFolderContent()
		},
	},

	beforeMount() {
		this.fetchFolderContent()
	},

	methods: {
		onRefresh() {
			this.fetchFolderContent()
		},

		async fetchFolderContent() {
			this.error = null
			this.loading = true

			// close any potential opened viewer & sidebar
			window.OCA?.Viewer?.close?.()
			window.OCA?.Files?.Sidebar?.close?.()

			// if we don't already have some cached data let's show a loader
			if (!this.files[this.folderId] || !this.folders[this.folderId]) {
				this.initializing = true
			}

			try {
				// get content and current folder info
				const { folder, folders, files } = await getFolderContent(this.path, {
					shared: this.showShared,
					signal: this.abortController.signal,
				})
				this.$store.dispatch('addPath', { path: this.path, fileid: folder?.fileid })
				this.$store.dispatch('updateFolders', { fileid: folder?.fileid, files, folders })
				this.$store.dispatch('updateFoldersFiles', { folder, files, folders })
			} catch (error) {
				if (error?.response && error.response.status) {
					if (error.response.status === 404) {
						this.error = 404
						setTimeout(() => {
							this.$router.push({ name: this.$route.name ?? undefined })
						}, 3000)
					} else {
						this.error = error
					}
				}
				// cancelled request, moving on...
				logger.error('Error fetching album data', { error })
			} finally {
				// done loading even with errors
				this.loading = false
				this.initializing = false
			}
		},

		/**
		 * Fetch file Info and add them into the store
		 *
		 * @param upload
		 */
		async onUpload(upload: Upload) {
			const relPath = upload.source.split(defaultRootPath).pop()
			const node = await fetchFile(defaultRootPath + relPath)
			if (node === null) {
				logger.error('Failed to fetch file', { relPath })
				return
			}

			const file: FoldersNode = {
				fileid: node.fileid as number,
				basename: node.basename,
				etag: node.attributes.etag,
				filename: node.root + node.path,
				source: node.source,
				lastmod: node.mtime?.getTime() as number,
				mime: node.mime as string,
				size: node.size as number,
				type: 'file',
				permissions: '', // HACK: we don't need it but the format is not the expected one
				hasPreview: node.attributes.hasPreview,
			}

			this.$store.dispatch('appendFoldersFiles', [file])
			this.$store.dispatch('addFilesToFolder', { fileid: this.folderId, files: [file] })
		},

		t,
	},

}
</script>

<style lang="scss" scoped>
@use 'sass:map';

@mixin grid-sizes() {
	$previous: 0;

	@each $size, $config in $sizes {
		$count: map.get($config, 'count');
		$marginTop: map.get($config, 'marginTop');
		$marginW: map.get($config, 'marginW');

		@if $size == 'max' {
			@media (min-width: #{$previous}px) {
				@content($marginTop, $marginW);
			}
		}

		@else {
			@media (min-width: #{$previous}px) and (max-width: #{$size}px) {
				@content($marginTop, $marginW);
			}
		}

		$previous: $size;
	}
}

.grid-container {
	@include grid-sizes using ($marginTop, $marginW) {
		padding: 0px #{$marginW}px 256px #{$marginW}px;
	}

	&--folders {
		padding: 32px 48px;

		@media only screen and (max-width: 400px) {
			display: flex;
			justify-content: center;
			width: 100%;
		}

		@media only screen and (min-width: 400px) {
			width: fit-content;
		}
	}
}

.photos-navigation {
	position: relative;

	// Add space at the bottom for the progress bar.
	&--uploading {
		margin-bottom: 30px;
	}

	:deep(.upload-picker) {
		.upload-picker__progress {
			position: absolute;
			bottom: -30px;
			inset-inline-start: 64px;
			margin: 0;
		}

		.upload-picker__cancel {
			position: absolute;
			bottom: -24px;
			inset-inline-end: 50px;
		}
	}
}
</style>
