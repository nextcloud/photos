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
	<!-- Errors handlers-->
	<EmptyContent v-if="error === 404" illustration-name="folder">
		{{ t('photos', 'This folder does not exist') }}
	</EmptyContent>
	<EmptyContent v-else-if="error">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<!-- Folder content -->
	<div v-else-if="!loading">
		<Navigation v-if="folder"
			key="navigation"
			v-bind="folder"
			:root-title="rootTitle"
			:show-actions="true" />
		<!-- Empty folder, should only happen via direct link -->
		<EmptyContent v-if="isEmpty" key="emptycontent" illustration-name="empty">
			{{ t('photos', 'No photos in here') }}
		</EmptyContent>

		<div v-else class="grid-container">
			<VirtualGrid
				ref="virtualgrid"
				:items="contentList"
				:get-column-count="() => gridConfig.count"
				:get-grid-gap="() => gridConfig.gap" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import getAlbumContent from '../services/AlbumContent'

import VirtualGrid from 'vue-virtual-grid'
import EmptyContent from '../components/EmptyContent'
import Folder from '../components/Folder'
import File from '../components/File'
import Navigation from '../components/Navigation'

import GridConfigMixin from '../mixins/GridConfig'

import cancelableRequest from '../utils/CancelableRequest'

export default {
	name: 'Albums',
	components: {
		VirtualGrid,
		EmptyContent,
		Navigation,
	},
	mixins: [GridConfigMixin],
	props: {
		rootTitle: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			default: '/',
		},
		loading: {
			type: Boolean,
			required: true,
		},
		showShared: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			error: null,
			cancelRequest: () => {},
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
		folderContent() {
			return this.folders[this.folderId]
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
					width: 256,
					height: 256,
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
					renderComponent: File,
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

	async beforeMount() {
		this.fetchFolderContent()
	},

	beforeDestroy() {
		this.cancelRequest('Changed view')
	},

	methods: {
		async fetchFolderContent() {
			// cancel any pending requests
			this.cancelRequest('Changed folder')

			// close any potential opened viewer & sidebar
			OCA.Viewer && OCA.Viewer.close && OCA.Viewer.close()
			OCA.Files && OCA.Files.Sidebar.close && OCA.Files.Sidebar.close()

			// if we don't already have some cached data let's show a loader
			if (!this.files[this.folderId] || !this.folders[this.folderId]) {
				this.$emit('update:loading', true)
			}
			this.error = null

			// init cancellable request
			const { request, cancel } = cancelableRequest(getAlbumContent)
			this.cancelRequest = cancel

			try {
				// get content and current folder info
				const { folder, folders, files } = await request(this.path, { shared: this.showShared })
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
				console.error('Error fetching album data', error)
			} finally {
				// done loading even with errors
				this.$emit('update:loading', false)
			}
		},
	},

}
</script>

<style lang="scss" scoped>
@import '../mixins/GridSizes.scss';

.grid-container {
	@include grid-sizes using ($marginTop, $marginW) {
		padding: 0px #{$marginW}px 256px #{$marginW}px;
	}
}
</style>
