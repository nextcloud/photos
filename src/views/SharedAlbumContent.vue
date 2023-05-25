<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
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
	<div>
		<CollectionContent v-if="true"
			ref="collectionContent"
			:collection="album"
			:collection-file-ids="albumFileIds"
			:loading="loadingAlbums || loadingFiles"
			:error="errorFetchingAlbums || errorFetchingFiles">
			<!-- Header -->
			<HeaderNavigation key="navigation"
				slot="header"
				slot-scope="{selectedFileIds}"
				:loading="loadingFiles"
				:params="{ albumName }"
				:path="'/' + albumName"
				:title="albumOriginalName"
				@refresh="fetchAlbumContent">
				<!-- <UploadPicker :accept="allowedMimes"
				:destination="folder.filename"
				:multiple="true"
				@uploaded="onUpload" /> -->

				<div v-if="album.location !== ''" slot="subtitle" class="album__location">
					<MapMarker />{{ album.location }} ⸱ {{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :display-name="album.collaborators[0].label" :user="album.collaborators[0].id" />
				</div>
				<template v-if="album !== undefined" slot="right">
					<NcButton v-if="album.nbItems !== 0"
						type="tertiary"
						:aria-label="t('photos', 'Add photos to this album')"
						@click="showAddPhotosModal = true">
						<Plus slot="icon" />
					</NcButton>

					<NcActions :force-menu="true" :aria-label="t('photos', 'Open actions menu')">
						<!-- TODO: enable download on shared albums -->
						<!-- <ActionDownload v-if="albumFileIds.length > 0"
							:selected-file-ids="albumFileIds"
							:title="t('photos', 'Download all files in album')">
							<DownloadMultiple slot="icon" />
						</ActionDownload> -->

						<NcActionButton :close-after-click="true"
							@click="handleDeleteAlbum">
							{{ t('photos', 'Delete album') }}
							<Delete slot="icon" />
						</NcActionButton>

						<template v-if="selectedFileIds.length > 0">
							<NcActionSeparator />

							<!-- TODO: enable download on shared albums -->
							<!-- <ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload> -->

							<NcActionButton :close-after-click="true"
								@click="handleRemoveFilesFromAlbum(selectedFileIds)">
								{{ t('photos', 'Remove selection from album') }}
								<Close slot="icon" />
							</NcActionButton>
						</template>
					</NcActions>
				</template>
			</HeaderNavigation>

			<!-- No content -->
			<NcEmptyContent slot="empty-content"
				:title="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImagePlus slot="icon" />

				<NcButton slot="action"
					type="primary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>

		<!-- Modals -->
		<NcModal v-if="showAddPhotosModal"
			size="large"
			:title="t('photos', 'Add photos to the album')"
			@close="showAddPhotosModal = false">
			<FilesPicker :destination="album.basename"
				:blacklist-ids="albumFileIds"
				:loading="loadingAddFilesToAlbum"
				@files-picked="handleFilesPicked" />
		</NcModal>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import Close from 'vue-material-design-icons/Close.vue'
// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'

import { NcActions, NcActionButton, NcButton, NcModal, NcEmptyContent, NcActionSeparator, NcUserBubble, isMobile } from '@nextcloud/vue'
import { getCurrentUser } from '@nextcloud/auth'

import FetchSharedAlbumsMixin from '../mixins/FetchSharedAlbumsMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import FilesPicker from '../components/FilesPicker.vue'
import logger from '../services/logger.js'
import client from '../services/DavClient.js'
import DavRequest from '../services/DavRequest.js'
import { genFileInfo } from '../utils/fileUtils.js'
import { translate } from '@nextcloud/l10n'

export default {
	name: 'SharedAlbumContent',
	components: {
		MapMarker,
		Plus,
		Close,
		// Download,
		// DownloadMultiple,
		Delete,
		ImagePlus,
		NcEmptyContent,
		NcActions,
		NcActionButton,
		NcActionSeparator,
		NcButton,
		NcModal,
		NcUserBubble,
		CollectionContent,
		// ActionDownload,
		FilesPicker,
		HeaderNavigation,
	},

	mixins: [
		FetchSharedAlbumsMixin,
		FetchFilesMixin,
		AbortControllerMixin,
		isMobile,
	],

	props: {
		albumName: {
			type: String,
			default: '/',
		},
	},

	data() {
		return {
			showAddPhotosModal: false,
			loadingCount: 0,
			loadingAddFilesToAlbum: false,
		}
	},

	computed: {
		...mapGetters([
			'files',
			'sharedAlbumsFiles',
		]),

		/**
		 * @return {object} The album information for the current albumName.
		 */
		album() {
			return this.sharedAlbums[this.albumName] || {}
		},

		/**
		 * @return {string[]} The list of files for the current albumName.
		 */
		albumFileIds() {
			return this.sharedAlbumsFiles[this.albumName] || []
		},

		/**
		 * @return {string} The album name without the userId between parentheses.
		 */
		albumOriginalName() {
			return this.albumName.replace(new RegExp(`\\(${this.album.collaborators[0].id}\\)$`), '')
		},
	},

	watch: {
		album() {
			this.fetchAlbumContent()
		},
	},

	methods: {
		...mapActions([
			'appendFiles',
			'deleteSharedAlbum',
			'addFilesToSharedAlbum',
			'removeFilesFromSharedAlbum',
		]),

		async fetchAlbumContent() {
			if (this.loadingFiles || this.showEditAlbumForm) {
				return []
			}

			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true

				const response = await client.getDirectoryContents(
					`/photos/${getCurrentUser()?.uid}/sharedalbums/${this.albumName}`,
					{
						data: DavRequest,
						details: true,
						signal: this.abortController.signal,
					}
				)

				const fetchedFiles = response.data
					.map(file => genFileInfo(file))

				const fileIds = fetchedFiles
					.map(file => file.fileid)
					.map((fileId) => fileId.toString())

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addFilesToSharedAlbum', { albumName: this.albumName, fileIdsToAdd: fileIds })
				}

				logger.debug(`[SharedAlbumContent] Fetched ${fileIds.length} new files: `, fileIds)
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFiles = 404
				} else if (error.code === 'ERR_CANCELED') {
					return
				} else {
					this.errorFetchingFiles = error
				}

				// cancelled request, moving on...
				logger.error('[SharedAlbumContent] Error fetching album files', { error })
			} finally {
				this.loadingFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.addFilesToSharedAlbum({ albumName: this.albumName, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.removeFilesFromSharedAlbum({ albumName: this.albumName, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			await this.deleteSharedAlbum({ albumName: this.albumName })
			this.$router.push('/sharedalbums')
		},

		t: translate,
	},
}
</script>
<style lang="scss" scoped>
.album {
	display: flex;
	flex-direction: column;

	&__title {
		width: 100%;
	}

	&__name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__location {
		margin-left: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
