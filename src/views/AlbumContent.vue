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
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation key="navigation"
				slot="header"
				slot-scope="{selectedFileIds, resetSelection}"
				:class="{'photos-navigation--uploading': uploader.queue?.length > 0}"
				:loading="loadingCollectionFiles"
				:params="{ albumName }"
				:path="'/' + albumName"
				:title="albumName"
				@refresh="fetchAlbumContent">
				<div v-if="album !== undefined && album.location !== ''" slot="subtitle" class="album__location">
					<MapMarker />{{ album.location }}
				</div>

				<template slot="default">
					<NcButton v-if="selectedFileIds.length > 0"
						:aria-label="t('photos', 'Unselect all')"
						@click="resetSelection">
						<template #icon>
							<Close />
						</template>
						{{ t('photos', 'Unselect all') }}
					</NcButton>
				</template>

				<template v-if="album !== undefined" slot="right">
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
			<NcEmptyContent v-if="album !== undefined && album.nbItems === 0 && !(loadingCollectionFiles || loadingCollection)"
				slot="empty-content"
				:name="t('photos', 'This album does not have any photos or videos yet!')"
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
			:name="t('photos', 'Add photos to {albumName}', {albumName: albumName})"
			@close="showAddPhotosModal = false">
			<FilesPicker v-if="album !== undefined"
				:destination="album.basename"
				:blacklist-ids="albumFileIds"
				@files-picked="handleFilesPicked" />
		</NcModal>

		<NcModal v-if="showManageCollaboratorView && album !== undefined"
			:name="t('photos', 'Manage collaborators')"
			@close="showManageCollaboratorView = false">
			<CollaboratorsSelectionForm :album-name="album.basename"
				:collaborators="album.collaborators">
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
			:name="t('photos', 'Edit album details')"
			@close="showEditAlbumForm = false">
			<AlbumForm :album="album" @done="redirectToNewName" />
		</NcModal>
	</div>
</template>

<script>
import { mapActions } from 'vuex'

import { addNewFileMenuEntry, removeNewFileMenuEntry } from '@nextcloud/files'
import { getCurrentUser } from '@nextcloud/auth'
import { NcActions, NcActionButton, NcButton, NcModal, NcEmptyContent, NcActionSeparator, NcLoadingIcon, isMobile } from '@nextcloud/vue'
import { UploadPicker, getUploader } from '@nextcloud/upload'
import { translate } from '@nextcloud/l10n'
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

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'
import UserConfig from '../mixins/UserConfig.js'

// import ActionDownload from '../components/Actions/ActionDownload.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import CollaboratorsSelectionForm from '../components/Albums/CollaboratorsSelectionForm.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import FilesPicker from '../components/FilesPicker.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'

import allowedMimes from '../services/AllowedMimes.js'
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
		FetchCollectionContentMixin,
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

			uploader: getUploader(),

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
		/**
		 * @return {import('../store/albums.js').Album|undefined} The album information for the current albumName.
		 */
		album() {
			return this.$store.getters.getAlbum(this.albumName)
		},

		/**
		 * @return {string[]} The list of files for the current albumName.
		 */
		albumFileIds() {
			return this.$store.getters.getAlbumFiles(this.albumName)
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
		 *
		 * @return {Album&{route: string, root: string}}
		 */
		uploadContext() {
			return {
				...this.album,
				route: this.$route.name,
				root: `dav/photos/${getCurrentUser()?.uid}/albums`,
			}
		},

		/**
		 * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
		 */
		albumFileName() {
			return this.$store.getters.getAlbumName(this.albumName)
		},
	},

	async mounted() {
		this.fetchAlbum()
		this.fetchAlbumContent()
		addNewFileMenuEntry(this.newFileMenuEntry)
	},

	destroyed() {
		removeNewFileMenuEntry(this.newFileMenuEntry)
	},

	methods: {
		...mapActions([
			'addFilesToCollection',
			'removeFilesFromCollection',
			'deleteCollection',
			'updateCollection',
		]),

		async fetchAlbum() {
			await this.fetchCollection(
				this.albumFileName,
				['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']
			)
		},

		async fetchAlbumContent() {
			await this.fetchCollectionFiles(this.albumFileName)
		},

		redirectToNewName({ album }) {
			this.showEditAlbumForm = false

			if (this.album.basename !== album.basename) {
				this.$router.push(`/albums/${album.basename}`)
			}
		},

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.addFilesToCollection({ collectionFileName: this.album.filename, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.removeFilesFromCollection({ collectionFileName: this.album.filename, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			await this.deleteCollection({ collectionFileName: this.album.filename })
			this.$router.push('/albums')
		},

		async handleSetCollaborators(collaborators) {
			try {
				this.loadingAddCollaborators = true
				this.showManageCollaboratorView = false
				await this.updateCollection({ collectionFileName: this.album.filename, properties: { collaborators } })
			} catch (error) {
				logger.error('Error while setting album collaborators', { error })
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

		t: translate,
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

.photos-navigation {
	position: relative;
	// Add space at the bottom for the progress bar.
	&--uploading {
		margin-bottom: 30px;
	}
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
</style>
