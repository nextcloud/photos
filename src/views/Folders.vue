<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error === 404" :name="t('photos', 'This folder does not exist')">
		<template #icon>
			<FolderIcon />
		</template>
	</NcEmptyContent>
	<NcEmptyContent v-else-if="error" :name="t('photos', 'An error occurred')" />
	<NcEmptyContent v-else-if="initializing" :name="t('photos', 'Loading folders …')">
		<template #icon>
			<NcLoadingIcon />
		</template>
	</NcEmptyContent>

	<!-- Folder content -->
	<div v-else-if="!initializing">
		<HeaderNavigation key="navigation"
			:class="{'photos-navigation--uploading': uploader.queue?.length > 0}"
			:loading="loading"
			:path="path"
			:title="folder?.basename?.toString?.() || rootTitle"
			:root-title="rootTitle"
			@refresh="onRefresh">
			<UploadPicker :accept="allowedMimes"
				:destination="folderAsFolder"
				:multiple="true"
				@uploaded="onUpload" />
		</HeaderNavigation>

		<!-- Empty folder, should only happen via direct link -->
		<NcEmptyContent v-if="isEmpty" key="emptycontent" :name="t('photos', 'No photos in here')">
			<template #icon>
				<FolderIcon />
			</template>
		</NcEmptyContent>

		<div v-else
			class="grid-container"
			:class="{
				'grid-container--folders': haveFolders,
			}">
			<VirtualGrid ref="virtualgrid"
				:items="contentList"
				:scroll-element="appContent"
				:get-column-count="() => haveFolders ? gridConfig.folderCount : gridConfig.count"
				:get-grid-gap="() => haveFolders ? 16 : 8" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NcEmptyContent, NcLoadingIcon } from '@nextcloud/vue'
import { Upload, UploadPicker, getUploader } from '@nextcloud/upload'
import { Folder as NcFolder, davRootPath, davParsePermissions } from '@nextcloud/files'
import FolderIcon from 'vue-material-design-icons/Folder.vue'
import VirtualGrid from 'vue-virtual-grid'

import FileLegacy from '../components/FileLegacy.vue'
import Folder from '../components/Folder.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'

import allowedMimes from '../services/AllowedMimes.js'
import getAlbumContent from '../services/AlbumContent.js'

import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import GridConfigMixin from '../mixins/GridConfig.js'
import { fetchFile } from '../services/fileFetcher'
import logger from '../services/logger'

export default {
	name: 'Folders',
	components: {
		FolderIcon,
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
			error: null,
			allowedMimes,

			initializing: true,
			loading: false,

			appContent: document.getElementById('app-content-vue'),

			uploader: getUploader(),
		}
	},

	computed: {
		// global lists
		...mapGetters([
			'files',
			'folders',
		]),

		// current folder id from current path
		folderId() {
			return this.$store.getters.folderId(this.path)
		},

		// files list of the current folder
		folder() {
			return this.files[this.folderId]
		},
		folderAsFolder() {
			if (!this.folder) {
				return null
			}

			return new NcFolder({
				...this.folder,
				source: decodeURI(this.folder.source),
				permissions: davParsePermissions(this.folder.permissions),
			})
		},
		folderContent() {
			return this.folders[this.folderId] || []
		},
		fileList() {
			const list = this.folderContent
				&& this.folderContent
					.map(id => this.files[id])
					.filter(file => !!file)
			return list
		},

		// subfolders of the current folder
		subFolders() {
			return this.folderId
				&& this.files[this.folderId]
				&& this.files[this.folderId].folders
		},
		folderList() {
			const list = this.subFolders
				&& this.subFolders
					.map(id => this.files[id])
					.filter(file => !!file)
			return list
		},
		contentList() {
			const folders = this.folderList?.map((folder) => {
				return {
					id: `folder-${folder.fileid}`,
					injected: {
						...folder,
						showShared: this.showShared,
					},
					width: 232,
					height: 280,
					columnSpan: 1,
					renderComponent: Folder,
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
			OCA?.Viewer?.close?.()
			OCA?.Files?.Sidebar?.close?.()

			// if we don't already have some cached data let's show a loader
			if (!this.files[this.folderId] || !this.folders[this.folderId]) {
				this.initializing = true
			}

			try {
				// get content and current folder info
				const { folder, folders, files } = await getAlbumContent(this.path, {
					shared: this.showShared,
					signal: this.abortController.signal,
				})
				this.$store.dispatch('addPath', { path: this.path, fileid: folder.fileid })
				this.$store.dispatch('updateFolders', { fileid: folder.fileid, files, folders })
				this.$store.dispatch('updateFiles', { folder, files, folders })
			} catch (error) {
				if (error.response && error.response.status) {
					if (error.response.status === 404) {
						this.error = 404
						setTimeout(() => {
							this.$router.push({ name: this.$route.name })
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
		 * @param {Upload} upload the newly uploaded files
		 */
		async onUpload(upload) {
			const relPath = upload.source.split(davRootPath).pop()
			const file = await fetchFile(relPath)
			this.$store.dispatch('appendFiles', [file])
			this.$store.dispatch('addFilesToFolder', { fileid: this.folderId, files: [file] })
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../mixins/GridSizes';

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
			left: 64px;
			margin: 0;
		}

		.upload-picker__cancel {
			position: absolute;
			bottom: -24px;
			right: 50px;
		}
	}
}
</style>
