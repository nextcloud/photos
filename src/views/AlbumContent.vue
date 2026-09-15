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

<script setup lang="ts">
import type { Collection } from '../services/collectionFetcher.ts'
import type { Collaborator } from '../store/albums.ts'
import type { PhotoFile } from '../store/files.ts'

import { n, t } from '@nextcloud/l10n'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
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
import { useFetchCollectionContent } from '../composables/useFetchCollectionContent.ts'
import { logger } from '../services/logger.ts'
import { albumFilesExtraProps, albumsExtraProps, useAlbumsStore } from '../store/albums.ts'
import { useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import { pickAlbumCover } from '../utils/albumCover.ts'

const props = withDefaults(defineProps<{
	albumName?: string
}>(), {
	albumName: '/',
})

const router = useRouter()
const albumsStore = useAlbumsStore()
const collectionsStore = useCollectionsStore()
const filesStore = useFilesStore()
const {
	fetchCollection,
	fetchCollectionFiles,
	loadingCollection,
	loadingCollectionFiles,
	errorFetchingCollection,
	errorFetchingCollectionFiles,
} = useFetchCollectionContent()

const collectionContent = useTemplateRef<InstanceType<typeof CollectionContent>>('collectionContent')

const showAddPhotosModal = ref(false)
const showManageCollaboratorView = ref(false)
const showEditAlbumForm = ref(false)

const loadingAddCollaborators = ref(false)

const album = computed(() => albumsStore.getAlbum(props.albumName))

const albumFileIds = computed(() => albumsStore.getAlbumFiles(props.albumName))

const sharingEnabled = computed(() => OC.Share !== undefined)

const albumFileName = computed(() => albumsStore.getAlbumName(props.albumName))

const albumPhotos = computed<PhotoFile[]>(() => albumFileIds.value
	.map((fileId) => filesStore.files[fileId])
	.filter((file) => file !== undefined))

// The photo shown by the hero, which is only known once the album
// content is there - until then the album cover is used as is.
const coverPhoto = computed(() => pickAlbumCover(albumPhotos.value, album.value?.attributes['last-photo'] ?? -1))

const coverFileId = computed(() => coverPhoto.value?.fileid ?? album.value?.attributes['last-photo'] ?? -1)

const coverBlurhash = computed(() => coverPhoto.value?.attributes['metadata-blurhash'])

// Line shown under the album name in the hero, both parts of it are
// optional so that it degrades to an empty string.
const albumSubtitle = computed(() => {
	if (album.value === undefined) {
		return ''
	}

	return [
		album.value.attributes.location,
		n('photos', '%n photo', '%n photos', album.value.attributes.nbItems),
	].filter((part) => part !== '').join(' · ')
})

const removableSelectedFiles = computed(() => (collectionContent.value?.selectedFileIds ?? [])
	.map((fileId) => filesStore.files[fileId])
	.filter((file) => file.attributes['photos-album-file-origin'] !== 'filters')
	.map((file) => file.fileid.toString()))

// Favorite the whole selection if at least one of its photos is not a favorite yet.
function shouldFavoriteSelection(selectedFileIds: string[]): boolean {
	return selectedFileIds.some((fileId) => filesStore.files[fileId].attributes.favorite === 0)
}

async function favoriteSelection(selectedFileIds: string[]): Promise<void> {
	await filesStore.toggleFavoriteForFiles(selectedFileIds, 1)
}

async function unFavoriteSelection(selectedFileIds: string[]): Promise<void> {
	await filesStore.toggleFavoriteForFiles(selectedFileIds, 0)
}

async function fetchAlbum() {
	await fetchCollection(
		albumFileName.value,
		albumsExtraProps,
	)
}

async function fetchAlbumContent() {
	await fetchCollectionFiles(albumFileName.value, albumFilesExtraProps)
}

async function handleAlbumUpdate({ album, changes = [] }: { album: Collection, changes?: string[] }) {
	showEditAlbumForm.value = false

	if (changes.includes('name')) {
		await router.push(`/albums/${album.basename}`)
	}

	if (changes.includes('filters')) {
		fetchAlbumContent()
	}
}

async function handleFilesPicked(fileIds: string[]) {
	showAddPhotosModal.value = false
	await collectionsStore.addFilesToCollection(album.value?.root + album.value?.path, fileIds)
	// Re-fetch album content to have the proper filenames.
	await fetchAlbumContent()
}

async function handleRemoveFilesFromAlbum(fileIds: string[]) {
	collectionContent.value?.onUncheckFiles(fileIds)
	await collectionsStore.removeFilesFromCollection(album.value?.root + album.value?.path, fileIds)
}

async function handleDeleteAlbum() {
	const isDeleted = await collectionsStore.deleteCollection(album.value?.root + album.value?.path)
	if (isDeleted) {
		router.push('/albums')
	}
}

async function handleSetCollaborators(collaborators: Collaborator[]) {
	try {
		loadingAddCollaborators.value = true
		showManageCollaboratorView.value = false
		await collectionsStore.updateCollection(album.value?.root + album.value?.path, { collaborators })
	} catch (error) {
		logger.error('Error while setting album collaborators', { error })
	} finally {
		loadingAddCollaborators.value = false
	}
}

onMounted(() => {
	fetchAlbum()
	fetchAlbumContent()
})
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
