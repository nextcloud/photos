<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="album-container">
		<AlbumHero
			v-if="album !== undefined"
			:coverFileId="album.attributes['last-photo']"
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

							<!-- TODO: support album-wide download from arbitrary origin -->

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

								<!-- TODO: support selection download from arbitrary origin -->

								<ActionFavorite :selectedFileIds="selectedFileIds" />

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
			<template #empty-content>
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
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
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

export default {
	name: 'AlbumContent',
	components: {
		// ActionDownload,
		ActionFavorite,
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

		// Subtitle shown in the magazine-style hero header. Combines
		// the album's location (if present) with the photo count;
		// either piece is optional so the hero gracefully degrades.
		albumSubtitle(): string {
			if (this.album === undefined) {
				return ''
			}
			const parts: string[] = []
			if (this.album.attributes.location !== '') {
				parts.push(this.album.attributes.location)
			}
			const count = this.album.attributes.nbItems
			if (typeof count === 'number') {
				parts.push(translatePlural('photos', '%n photo', '%n photos', count))
			}
			return parts.join(' · ')
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
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: this.album?.root + this.album?.path, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds: string[]) {
			this.$refs.collectionContent?.onUncheckFiles(fileIds)
			await this.$store.dispatch('removeFilesFromCollection', { collectionFileName: this.album?.root + this.album?.path, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			const isDeleted = await this.$store.dispatch('deleteCollection', { collectionFileName: this.album?.root + this.album?.path })
			if (isDeleted) {
				this.$router.push('/albums')
			}
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
		margin-inline-start: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
