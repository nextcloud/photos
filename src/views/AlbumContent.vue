<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="album-container">
		<AlbumHero
			v-if="album !== undefined"
			:coverFileId="coverFileId"
			:blurhash="coverBlurhash"
			:title="albumName"
			:subtitle="albumSubtitle" />

		<CollectionContent
			ref="collectionContent"
			:collection="album"
			:collectionFileIds="albumFileIds"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<template #header="{ selectedFileIds, resetSelection }">
				<HeaderNavigation
					key="navigation"

					:loading="loadingCollectionFiles"
					:params="{ albumName }"
					:path="'/' + albumName"
					:title="albumName"
					@refresh="fetchAlbumContent">
					<template #subtitle>
						<div
							v-if="album !== undefined && album.attributes.location !== ''"

							class="album__location">
							<MapMarkerOutline />{{ album.attributes.location }}
						</div>
					</template>

					<template #default>
						<NcButton
							v-if="selectedFileIds.length > 0"
							:aria-label="t('photos', 'Unselect all')"
							@click="resetSelection">
							<template #icon>
								<Close />
							</template>
							{{ t('photos', 'Unselect all') }}
						</NcButton>
					</template>

					<template v-if="album !== undefined" #right>
						<NcButton @click="showAddPhotosModal = true">
							<template #icon>
								<Plus :size="20" />
							</template>
							{{ t('photos', 'Add photos to this album') }}
						</NcButton>

						<NcButton
							v-if="sharingEnabled"
							variant="tertiary"
							:aria-label="t('photos', 'Manage collaborators for this album')"
							@click="showManageCollaboratorView = true">
							<template #icon>
								<ShareVariantOutline />
							</template>
						</NcButton>

						<NcActions :aria-label="t('photos', 'Open actions menu')">
							<NcActionButton
								:closeAfterClick="true"
								:aria-label="t('photos', 'Edit album details')"
								@click="showEditAlbumForm = true">
								{{ t('photos', 'Edit album details') }}
								<template #icon>
									<PencilOutline />
								</template>
							</NcActionButton>

							<!-- Support download from arbitrary origin
						<ActionDownload v-if="albumFileIds.length > 0"
							:selected-file-ids="albumFileIds"
							:title="t('photos', 'Download all files in album')">
							<DownloadMultiple slot="icon" />
						</ActionDownload>-->

							<NcActionButton
								:closeAfterClick="true"
								@click="handleDeleteAlbum">
								{{ t('photos', 'Delete album') }}
								<template #icon>
									<DeleteOutline />
								</template>
							</NcActionButton>

							<template v-if="selectedFileIds.length > 0">
								<NcActionSeparator />

								<!-- Support download from arbitrary origin
							<ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload>-->

								<NcActionButton
									v-if="shouldFavoriteSelection(selectedFileIds)"
									:closeAfterClick="true"
									:aria-label="t('photos', 'Mark selection as favorite')"
									@click="favoriteSelection(selectedFileIds)">
									{{ t('photos', 'Add selection to favorites') }}
									<template #icon>
										<StarOutline />
									</template>
								</NcActionButton>
								<NcActionButton
									v-else
									:closeAfterClick="true"
									:aria-label="t('photos', 'Remove selection from favorites')"
									@click="unFavoriteSelection(selectedFileIds)">
									{{ t('photos', 'Remove selection from favorites') }}
									<template #icon>
										<Star />
									</template>
								</NcActionButton>

								<NcActionButton
									v-if="removableSelectedFiles.length !== 0"
									:closeAfterClick="true"
									@click="handleRemoveFilesFromAlbum(removableSelectedFiles)">
									{{ t('photos', 'Remove selection from album') }}
									<template #icon>
										<Close />
									</template>
								</NcActionButton>
							</template>
						</NcActions>
					</template>
				</HeaderNavigation>
			</template>

			<!-- No content -->
			<template #emptyContent>
				<NcEmptyContent
					v-if="album !== undefined && album.attributes.nbItems === 0 && !(loadingCollectionFiles || loadingCollection)"

					:name="t('photos', 'This album does not have any photos or videos yet!')"
					class="album__empty">
					<template #icon>
						<ImagePlusOutline />
					</template>

					<template #action>
						<NcButton

							class="album__empty__button"
							variant="primary"
							:aria-label="t('photos', 'Add photos to this album')"
							@click="showAddPhotosModal = true">
							<template #icon>
								<Plus />
							</template>
							{{ t('photos', "Add") }}
						</NcButton>
					</template>
				</NcEmptyContent>
			</template>
		</CollectionContent>

		<PhotosPicker
			v-if="album !== undefined"
			v-model:open="showAddPhotosModal"
			:blacklistIds="albumFileIds"
			:destination="album.basename"
			:name="t('photos', 'Add photos to {albumName}', { albumName: albumName }, undefined, { escape: false, sanitize: false })"
			@filesPicked="handleFilesPicked" />

		<NcModal
			v-if="showManageCollaboratorView && album !== undefined"
			:name="t('photos', 'Manage collaborators')"
			@close="showManageCollaboratorView = false">
			<CollaboratorsSelectionForm
				:albumName="album.basename"
				:collaborators="album.attributes.collaborators">
				<template #default="{ collaborators }">
					<NcButton
						:aria-label="t('photos', 'Save collaborators for this album.')"
						variant="primary"
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
			closeOnClickOutside
			size="normal"
			@closing="showEditAlbumForm = false">
			<AlbumForm :album="album" @done="(event) => handleAlbumUpdate(event)" />
		</NcDialog>
	</div>
</template>

<script lang='ts'>
import type { Album } from '../store/albums.js'
import type { PhotoFile } from '../store/files.ts'

import { translate, translatePlural } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcModal from '@nextcloud/vue/components/NcModal'
import Close from 'vue-material-design-icons/Close.vue'
// import Download from 'vue-material-design-icons/TrayArrowDown.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import PencilOutline from 'vue-material-design-icons/PencilOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import AlbumHero from '../components/AlbumHero.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import CollaboratorsSelectionForm from '../components/Albums/CollaboratorsSelectionForm.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotosPicker from '../components/PhotosPicker.vue'
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import logger from '../services/logger.js'
import { albumFilesExtraProps, albumsExtraProps } from '../store/albums.ts'
import { useAlbumsStore } from '../store/albums.ts'
import { useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import { pickAlbumCover } from '../utils/albumCover.ts'

export default {
	name: 'AlbumContent',
	components: {
		StarOutline,
		Star,
		// ActionDownload,
		AlbumForm,
		AlbumHero,
		Close,
		CollaboratorsSelectionForm,
		CollectionContent,
		DeleteOutline,
		// Download,
		// DownloadMultiple,
		PhotosPicker,
		HeaderNavigation,
		ImagePlusOutline,
		MapMarkerOutline,
		NcActionButton,
		NcActions,
		NcActionSeparator,
		NcButton,
		NcDialog,
		NcEmptyContent,
		NcLoadingIcon,
		NcModal,
		PencilOutline,
		Plus,
		ShareVariantOutline,
	},

	mixins: [
		FetchCollectionContentMixin,
		FetchFilesMixin,
	],

	props: {
		albumName: {
			type: String,
			default: '/',
		},
	},

	setup() {
		const isMobile = useIsMobile()
		return {
			isMobile,
			albumsStore: useAlbumsStore(),
			collectionsStore: useCollectionsStore(),
			filesStore: useFilesStore(),
		}
	},

	data() {
		return {
			showAddPhotosModal: false,
			showManageCollaboratorView: false,
			showEditAlbumForm: false,

			loadingAddCollaborators: false,
		}
	},

	computed: {
		album(): Album {
			return this.albumsStore.getAlbum(this.albumName)
		},

		albumFileIds(): string[] {
			return this.albumsStore.getAlbumFiles(this.albumName)
		},

		sharingEnabled(): boolean {
			return OC.Share !== undefined
		},

		albumFileName(): string {
			return this.albumsStore.getAlbumName(this.albumName)
		},

		albumPhotos(): PhotoFile[] {
			return this.albumFileIds
				.map((fileId) => this.filesStore.files[fileId])
				.filter((file) => file !== undefined)
		},

		// The photo shown by the hero, which is only known once the album
		// content is there - until then the album cover is used as is.
		coverPhoto(): PhotoFile | undefined {
			return pickAlbumCover(this.albumPhotos, this.album?.attributes['last-photo'] ?? -1)
		},

		coverFileId(): number {
			return this.coverPhoto?.fileid ?? this.album?.attributes['last-photo'] ?? -1
		},

		coverBlurhash(): string | undefined {
			return this.coverPhoto?.attributes['metadata-blurhash']
		},

		// Line shown under the album name in the hero, both parts of it are
		// optional so that it degrades to an empty string.
		albumSubtitle(): string {
			if (this.album === undefined) {
				return ''
			}

			return [
				this.album.attributes.location,
				translatePlural('photos', '%n photo', '%n photos', this.album.attributes.nbItems),
			].filter((part) => part !== '').join(' · ')
		},

		removableSelectedFiles() {
			return ((this.$refs.collectionContent?.selectedFileIds ?? []) as string[])
				.map((fileId) => this.filesStore.files[fileId])
				.filter((file) => file.attributes['photos-album-file-origin'] !== 'filters')
				.map((file) => file.fileid.toString())
		},
	},

	async mounted() {
		this.fetchAlbum()
		this.fetchAlbumContent()
	},

	methods: {
		// Favorite the whole selection if at least one of its photos is not a favorite yet.
		shouldFavoriteSelection(selectedFileIds: string[]): boolean {
			return selectedFileIds.some((fileId) => this.filesStore.files[fileId].attributes.favorite === 0)
		},

		async favoriteSelection(selectedFileIds: string[]): Promise<void> {
			await this.filesStore.toggleFavoriteForFiles(selectedFileIds, 1)
		},

		async unFavoriteSelection(selectedFileIds: string[]): Promise<void> {
			await this.filesStore.toggleFavoriteForFiles(selectedFileIds, 0)
		},

		async fetchAlbum() {
			await this.fetchCollection(
				this.albumFileName,
				albumsExtraProps,
			)
		},

		async fetchAlbumContent() {
			await this.fetchCollectionFiles(this.albumFileName, albumFilesExtraProps)
		},

		async handleAlbumUpdate({ album, changes }) {
			this.showEditAlbumForm = false

			if (changes.includes('name')) {
				await this.$router.push(`/albums/${album.basename}`)
			}

			if (changes.includes('filters')) {
				this.fetchAlbumContent()
			}
		},

		async handleFilesPicked(fileIds: string[]) {
			this.showAddPhotosModal = false
			await this.collectionsStore.addFilesToCollection(this.album?.root + this.album?.path, fileIds)
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds: string[]) {
			this.$refs.collectionContent?.onUncheckFiles(fileIds)
			await this.collectionsStore.removeFilesFromCollection(this.album?.root + this.album?.path, fileIds)
		},

		async handleDeleteAlbum() {
			const isDeleted = await this.collectionsStore.deleteCollection(this.album?.root + this.album?.path)
			if (isDeleted) {
				this.$router.push('/albums')
			}
		},

		async handleSetCollaborators(collaborators) {
			try {
				this.loadingAddCollaborators = true
				this.showManageCollaboratorView = false
				await this.collectionsStore.updateCollection(this.album?.root + this.album?.path, { collaborators })
			} catch (error) {
				logger.error('Error while setting album collaborators', { error })
			} finally {
				this.loadingAddCollaborators = false
			}
		},

		async handleFiltersChange(filters) {
			await this.collectionsStore.updateCollection(this.album?.root + this.album?.path, { filters })
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
		margin-inline-start: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
