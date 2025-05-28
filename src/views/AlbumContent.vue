<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="album-container">
		<CollectionContent
			ref="collectionContent"
			:collection="album"
			:collection-file-ids="albumFileIds"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation
				key="navigation"
				slot="header"
				slot-scope="{ selectedFileIds, resetSelection }"
				:loading="loadingCollectionFiles"
				:params="{ albumName }"
				:path="'/' + albumName"
				:title="albumName"
				@refresh="fetchAlbumContent">
				<div
					v-if="album !== undefined && album.attributes.location !== ''"
					slot="subtitle"
					class="album__location">
					<MapMarker />{{ album.attributes.location }}
				</div>

				<template slot="default">
					<NcButton
						v-if="selectedFileIds.length > 0"
						:aria-label="t('photos', 'Unselect all')"
						@click="resetSelection">
						<template #icon>
							<Close />
						</template>
						{{ t('photos', 'Unselect all') }}
					</NcButton>

					<span v-if="album !== undefined" class="album-container__filters">
						<PhotosFiltersInput
							v-if="editFilters"
							:value="album.attributes.filters"
							class="timeline__filters"
							@update:value="handleFiltersChange" />
						<PhotosFiltersDisplay v-else :filters-value="album.attributes.filters" />

						<NcButton
							:title="t('photos', 'Toggle filter')"
							:aria-label="t('photos', 'Toggle filter')"
							data-cy-header-action="toggle-filters"
							type="tertiary"
							@click="toggleFilters">
							<template #icon>
								<FilterCheck v-if="editFilters" />
								<FilterPlus v-else />
							</template>
						</NcButton>
					</span>
				</template>

				<template v-if="album !== undefined" slot="right">
					<NcButton @click="showAddPhotosModal = true">
						<template #icon>
							<Plus :size="20" />
						</template>
						{{ t('photos', 'Add photos to this album') }}
					</NcButton>

					<NcButton
						v-if="sharingEnabled"
						type="tertiary"
						:aria-label="t('photos', 'Manage collaborators for this album')"
						@click="showManageCollaboratorView = true">
						<ShareVariant slot="icon" />
					</NcButton>

					<NcActions :aria-label="t('photos', 'Open actions menu')">
						<NcActionButton
							:close-after-click="true"
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

						<NcActionButton
							:close-after-click="true"
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

							<NcActionButton
								v-if="removableSelectedFiles.length !== 0"
								:close-after-click="true"
								@click="handleRemoveFilesFromAlbum(removableSelectedFiles)">
								{{ t('photos', 'Remove selection from album') }}
								<Close slot="icon" />
							</NcActionButton>
						</template>
					</NcActions>
				</template>
			</HeaderNavigation>

			<!-- No content -->
			<NcEmptyContent
				v-if="album !== undefined && album.attributes.nbItems === 0 && !(loadingCollectionFiles || loadingCollection)"
				slot="empty-content"
				:name="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImagePlus slot="icon" />

				<NcButton
					slot="action"
					class="album__empty__button"
					type="primary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>

		<PhotosPicker
			v-if="album !== undefined"
			:open.sync="showAddPhotosModal"
			:blacklist-ids="albumFileIds"
			:destination="album.basename"
			:name="t('photos', 'Add photos to {albumName}', { albumName: albumName })"
			@files-picked="handleFilesPicked" />

		<NcModal
			v-if="showManageCollaboratorView && album !== undefined"
			:name="t('photos', 'Manage collaborators')"
			@close="showManageCollaboratorView = false">
			<CollaboratorsSelectionForm
				:album-name="album.basename"
				:collaborators="album.attributes.collaborators">
				<template slot-scope="{ collaborators }">
					<NcButton
						:aria-label="t('photos', 'Save collaborators for this album.')"
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

		<NcDialog
			v-if="showEditAlbumForm"
			:name="t('photos', 'Edit album details')"
			close-on-click-outside
			size="normal"
			@closing="showEditAlbumForm = false">
			<AlbumForm :album="album" @done="redirectToNewName" />
		</NcDialog>
	</div>
</template>

<script lang='ts'>
import type { Album } from '../store/albums.js'

import { translate } from '@nextcloud/l10n'
import { isMobile, NcActionButton, NcActions, NcActionSeparator, NcButton, NcDialog, NcEmptyContent, NcLoadingIcon, NcModal } from '@nextcloud/vue'
import Close from 'vue-material-design-icons/Close.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import FilterCheck from 'vue-material-design-icons/FilterCheck.vue'
import FilterPlus from 'vue-material-design-icons/FilterPlus.vue'
// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import ShareVariant from 'vue-material-design-icons/ShareVariant.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import CollaboratorsSelectionForm from '../components/Albums/CollaboratorsSelectionForm.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotosFiltersDisplay from '../components/PhotosFilters/PhotosFiltersDisplay.vue'
import PhotosFiltersInput from '../components/PhotosFilters/PhotosFiltersInput.vue'
import PhotosPicker from '../components/PhotosPicker.vue'
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import logger from '../services/logger.js'
import { albumFilesExtraProps, albumsExtraProps } from '../store/albums.ts'

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
		PhotosPicker,
		HeaderNavigation,
		ImagePlus,
		MapMarker,
		NcActionButton,
		NcActions,
		NcActionSeparator,
		NcButton,
		NcDialog,
		NcEmptyContent,
		NcLoadingIcon,
		NcModal,
		Pencil,
		Plus,
		ShareVariant,
		FilterPlus,
		FilterCheck,
		PhotosFiltersInput,
		PhotosFiltersDisplay,
	},

	mixins: [
		FetchCollectionContentMixin,
		FetchFilesMixin,
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
			showManageCollaboratorView: false,
			showEditAlbumForm: false,
			editFilters: false,

			loadingAddCollaborators: false,
		}
	},

	computed: {
		album(): Album {
			return this.$store.getters.getAlbum(this.albumName)
		},

		albumFileIds(): string[] {
			return this.$store.getters.getAlbumFiles(this.albumName)
		},

		sharingEnabled(): boolean {
			return OC.Share !== undefined
		},

		albumFileName(): string {
			return this.$store.getters.getAlbumName(this.albumName)
		},

		removableSelectedFiles() {
			return (this.$refs.collectionContent?.selectedFileIds as string[])
				.map((fileId) => this.$store.state.files.files[fileId])
				.filter((file) => file.attributes['photos-album-file-origin'] !== 'filters')
				.map((file) => file.fileid.toString())
		},
	},

	async mounted() {
		this.fetchAlbum()
		this.fetchAlbumContent()
	},

	methods: {
		async fetchAlbum() {
			await this.fetchCollection(
				this.albumFileName,
				albumsExtraProps,
			)
		},

		async fetchAlbumContent() {
			await this.fetchCollectionFiles(this.albumFileName, albumFilesExtraProps)
		},

		redirectToNewName({ album }) {
			this.showEditAlbumForm = false

			if (this.album?.basename !== album.basename) {
				this.$router.push(`/albums/${album.basename}`)
			}
		},

		async handleFilesPicked(fileIds: string[]) {
			this.showAddPhotosModal = false
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: this.album?.root + this.album?.path, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds: string[]) {
			this.$refs.collectionContent?.onUncheckFiles(fileIds)
			await this.$store.dispatch('removeFilesFromCollection', { collectionFileName: this.album?.root + this.album?.path, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			await this.$store.dispatch('deleteCollection', { collectionFileName: this.album?.root + this.album?.path })
			this.$router.push('/albums')
		},

		async handleSetCollaborators(collaborators) {
			try {
				this.loadingAddCollaborators = true
				this.showManageCollaboratorView = false
				await this.$store.dispatch('updateCollection', { collectionFileName: this.album?.root + this.album?.path, properties: { collaborators } })
			} catch (error) {
				logger.error('Error while setting album collaborators', { error })
			} finally {
				this.loadingAddCollaborators = false
			}
		},

		toggleFilters() {
			this.editFilters = !this.editFilters
			if (!this.editFilters) {
				this.extraFilters = {}
				this.resetFetchFilesState()
			}
		},

		async handleFiltersChange(filters) {
			await this.$store.dispatch('updateCollection', { collectionFileName: this.album?.root + this.album?.path, properties: { filters } })
			this.fetchAlbumContent()
		},

		t: translate,
	},
}
</script>

<style lang="scss" scoped>
.album-container {
	height: 100%;

	:deep(.collection) {
		height: 100%;
	}

	&__filters {
		display: flex;
		gap: 8px;
	}
}

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
