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
				:title="albumName"
				@refresh="fetchAlbumContent">
				<div v-if="album.location !== ''" slot="subtitle" class="album__location">
					<MapMarker />{{ album.location }}
				</div>
				<template v-if="album !== undefined"
					slot="right">
					<UploadPicker v-if="album.nbItems !== 0"
						:accept="allowedMimes"
						:context="uploadContext"
						:destination="album.basename"
						:root="uploadContext.root"
						:multiple="true"
						@uploaded="onUpload" />

					<NcButton v-if="sharingEnabled"
						type="tertiary"
						:aria-label="t('photos', 'Manage collaborators for this album')"
						@click="showManageCollaboratorView = true">
						<ShareVariant slot="icon" />
					</NcButton>

					<NcActions :aria-label="t('photos', 'Open actions menu')">
						<NcActionButton :close-after-click="true"
							:aria-label="t('photos', 'Edit album details')"
							@click="showEditAlbumForm = true">
							{{ t('photos', 'Edit album details') }}
							<Pencil slot="icon" />
						</NcActionButton>

						<!-- Support download from arbitrary origin
						<ActionDownload v-if="albumFileIds.length > 0"
							:selected-file-ids="albumFileIds"
							:title="t('photos', 'Download all files in album')">
							<DownloadMultiple slot="icon" />
						</ActionDownload>-->

						<NcActionButton :close-after-click="true"
							@click="handleDeleteAlbum">
							{{ t('photos', 'Delete album') }}
							<Delete slot="icon" />
						</NcActionButton>

						<template v-if="selectedFileIds.length > 0">
							<NcActionSeparator />

							<!-- Support download from arbitrary origin
							<ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload>-->

							<ActionFavorite :selected-file-ids="selectedFileIds" />

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
			<NcEmptyContent v-if="album !== undefined && album.nbItems === 0 && !(loadingFiles || loadingAlbums)"
				slot="empty-content"
				:title="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImagePlus slot="icon" />

				<NcButton slot="action"
					class="album__empty__button"
					type="primary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>

		<NcModal v-if="showAddPhotosModal"
			size="large"
			:title="t('photos', 'Add photos to the album')"
			@close="showAddPhotosModal = false">
			<FilesPicker :destination="album.basename"
				:blacklist-ids="albumFileIds"
				@files-picked="handleFilesPicked" />
		</NcModal>

		<NcModal v-if="showManageCollaboratorView"
			:title="t('photos', 'Manage collaborators')"
			@close="showManageCollaboratorView = false">
			<CollaboratorsSelectionForm :album-name="album.basename"
				:collaborators="album.collaborators"
				:public-link="album.publicLink">
				<template slot-scope="{collaborators}">
					<NcButton :aria-label="t('photos', 'Save collaborators for this album.')"
						type="primary"
						:disabled="loadingAddCollaborators"
						@click="handleSetCollaborators(collaborators)">
						<template #icon>
							<NcLoadingIcon v-if="loadingAddCollaborators" />
						</template>
						{{ t('photos', 'Save') }}
					</NcButton>
				</template>
			</CollaboratorsSelectionForm>
		</NcModal>

		<NcModal v-if="showEditAlbumForm"
			:title="t('photos', 'Edit album details')"
			@close="showEditAlbumForm = false">
			<AlbumForm :album="album" @done="redirectToNewName" />
		</NcModal>
	</div>
</template>

<script>
import { addNewFileMenuEntry, removeNewFileMenuEntry } from '@nextcloud/files'
import { getCurrentUser } from '@nextcloud/auth'
import { mapActions, mapGetters } from 'vuex'
import { NcActions, NcActionButton, NcButton, NcModal, NcEmptyContent, NcActionSeparator, NcLoadingIcon, isMobile } from '@nextcloud/vue'
import { UploadPicker } from '@nextcloud/upload'
import debounce from 'debounce'

import Close from 'vue-material-design-icons/Close.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import PlusSvg from '@mdi/svg/svg/plus.svg'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'

import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import FetchAlbumsMixin from '../mixins/FetchAlbumsMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import UserConfig from '../mixins/UserConfig.js'

// import ActionDownload from '../components/Actions/ActionDownload.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import CollaboratorsSelectionForm from '../components/Albums/CollaboratorsSelectionForm.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import FilesPicker from '../components/FilesPicker.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'

import { genFileInfo } from '../utils/fileUtils.js'
import allowedMimes from '../services/AllowedMimes.js'
import client from '../services/DavClient.js'
import DavRequest from '../services/DavRequest.js'
import logger from '../services/logger.js'

export default {
	name: 'AlbumContent',
	components: {
		// ActionDownload,
		ActionFavorite,
		AlbumForm,
		Close,
		CollaboratorsSelectionForm,
		CollectionContent,
		Delete,
		// Download,
		// DownloadMultiple,
		FilesPicker,
		HeaderNavigation,
		ImagePlus,
		MapMarker,
		NcActionButton,
		NcActions,
		NcActionSeparator,
		NcButton,
		NcEmptyContent,
		NcLoadingIcon,
		NcModal,
		Pencil,
		Plus,
		ShareVariant,
		UploadPicker,
	},

	mixins: [
		AbortControllerMixin,
		FetchAlbumsMixin,
		FetchFilesMixin,
		isMobile,
		UserConfig,
	],

	props: {
		albumName: {
			type: String,
			default: '/',
		},
	},

	data() {
		return {
			allowedMimes,

			showAddPhotosModal: false,
			showManageCollaboratorView: false,
			showEditAlbumForm: false,

			loadingAddCollaborators: false,
			newFileMenuEntry: {
				id: 'album-add',
				displayName: t('photos', 'Add photos to this album'),
				templateName: '',
				if: (context) => context.route === this.$route.name,
				/** Existing icon css class */
				iconSvgInline: PlusSvg,
				/** Function to be run after creation */
				handler: () => { this.showAddPhotosModal = true },
			},
		}
	},

	computed: {
		...mapGetters([
			'albumsFiles',
		]),

		/**
		 * @return {object} The album information for the current albumName.
		 */
		album() {
			return this.albums[this.albumName] || {}
		},

		/**
		 * @return {string[]} The list of files for the current albumName.
		 */
		albumFileIds() {
			return this.albumsFiles[this.albumName] || []
		},

		/**
		 * @return {boolean} Whether sharing is enabled.
		 */
		sharingEnabled() {
			return OC.Share !== undefined
		},

		/**
		 * The upload picker context
		 * We're uploading to the album folder, and the backend handle
		 * the writing to the default location as well as the album update.
		 * The context is also used for the NewFileMenu.
		 */
		uploadContext() {
			return {
				...this.album,
				route: this.$route.name,
				root: `dav/photos/${getCurrentUser()?.uid}/albums`,
			}
		},
	},

	watch: {
		album(newAlbum, oldAlbum) {
			if (newAlbum.filename !== oldAlbum.filename) {
				this.fetchAlbumContent()
			}
		},
	},

	mounted() {
		this.fetchAlbumContent()
		addNewFileMenuEntry(this.newFileMenuEntry)
	},

	destroyed() {
		removeNewFileMenuEntry(this.newFileMenuEntry)
	},

	methods: {
		...mapActions([
			'appendFiles',
			'deleteAlbum',
			'addFilesToAlbum',
			'removeFilesFromAlbum',
			'updateAlbum',
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
					`/photos/${getCurrentUser()?.uid}/albums/${this.albumName}`,
					{
						data: DavRequest,
						details: true,
						signal: this.abortController.signal,
					}
				)

				// Gen files info and filtering invalid files
				const fetchedFiles = response.data
					.map(file => genFileInfo(file))
					.filter(file => file.fileid)

				const fileIds = fetchedFiles
					.map(file => file.fileid.toString())

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('setAlbumFiles', { albumName: this.albumName, fileIds })
				}

				logger.debug(`[AlbumContent] Fetched ${fileIds.length} new files: `, fileIds)
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFiles = 404
				} else if (error.code === 'ERR_CANCELED') {
					return
				} else {
					this.errorFetchingFiles = error
				}

				logger.error('[AlbumContent] Error fetching album files', { error })
			} finally {
				this.loadingFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},

		redirectToNewName({ album }) {
			this.showEditAlbumForm = false

			if (this.album.basename !== album.basename) {
				this.$router.push(`/albums/${album.basename}`)
			}
		},

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.addFilesToAlbum({ albumName: this.albumName, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.removeFilesFromAlbum({ albumName: this.albumName, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			await this.deleteAlbum({ albumName: this.albumName })
			this.$router.push('/albums')
		},

		async handleSetCollaborators(collaborators) {
			try {
				this.loadingAddCollaborators = true
				this.showManageCollaboratorView = false
				await this.updateAlbum({ albumName: this.albumName, properties: { collaborators } })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingAddCollaborators = false
			}
		},

		/**
		 * A new File has been uploaded, let's add it
		 *
		 * @param {Upload[]} uploads
		 */
		onUpload: debounce(function() {
			this.fetchAlbumContent()
		}, 500),
	},
}
</script>
<style lang="scss" scoped>
.album {
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
