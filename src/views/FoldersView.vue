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

		<GridLayout v-else class="nodes-container" :sections="contentList">
			<template #default="{ gridSections }">
				<VirtualScrolling
					:container-element="appContent"
					:sections="gridSections">
					<template #default="{ visibleSections }">
						<ul v-if="visibleSections.length === 1">
							<template v-for="row of visibleSections[0].rows">
								<li
									v-for="item of row.items"
									:key="item.key"
									:style="{ 'flex-basis': `${item.width}px`, height: `${item.height}px` }">
									<FileLegacy
										v-if="item.type === 'file'"
										:item="item"
										:list="fileList" />
									<FolderComponent
										v-if="item.type === 'dir'"
										:item="item"
										:show-shared="showShared" />
								</li>
							</template>
						</ul>
					</template>
					<template #loader>
						<NcLoadingIcon
							v-if="loading"
							class="files-list-viewer__loader" />
					</template>
				</VirtualScrolling>
			</template>
		</GridLayout>
	</div>
</template>

<script lang='ts'>
import type { Upload } from '@nextcloud/upload'

import { isAxiosError } from '@nextcloud/axios'
import { Folder } from '@nextcloud/files'
import { defaultRootPath, parsePermissions } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { getUploader, UploadPicker } from '@nextcloud/upload'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'
import FileLegacy from '../components/FileLegacy.vue'
import FolderComponent from '../components/FolderComponent.vue'
import GridLayout from '../components/GridLayout/GridLayout.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
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
		FolderComponent,
		FileLegacy,
		GridLayout,
		VirtualScrolling,
	},

	mixins: [
		AbortControllerMixin,
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
			return [
				{
					id: '',
					items: [...this.folderList, ...this.fileList],
				},
			]
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
				if (isAxiosError(error) && error?.response && error.response.status) {
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

.nodes-container {
	padding: 0 16px;

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 50px;
	}
}
</style>
