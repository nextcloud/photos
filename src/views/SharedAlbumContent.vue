<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent
			v-if="true"
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
					:title="albumOriginalName"
					@refresh="fetchAlbumContent">
					<template #subtitle>
						<div
							v-if="album !== undefined && album.attributes.location !== ''"

							class="album__location">
							<MapMarkerOutline />{{ album.attributes.location }} ⸱ {{ t('photos', 'Shared by') }}&nbsp;
							<NcUserBubble
								:displayName="album.attributes.collaborators[0].label"
								:user="album.attributes.collaborators[0].id" />
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
						<NcButton
							v-if="album.attributes.nbItems !== 0"
							variant="secondary"
							:aria-label="t('photos', 'Add photos to this album')"
							@click="showAddPhotosModal = true">
							<template #icon>
								<Plus />
							</template>
							{{ t('photos', "Add") }}
						</NcButton>

						<NcActions :forceMenu="true" :aria-label="t('photos', 'Open actions menu')">
							<!-- TODO: enable download on shared albums -->
							<!-- <ActionDownload v-if="albumFileIds.length > 0"
							:selected-file-ids="albumFileIds"
							:title="t('photos', 'Download all files in album')">
							<DownloadMultiple slot="icon" />
						</ActionDownload> -->

							<NcActionButton
								v-if="album.attributes.collaborators[0].type === collaboratorTypes.User"
								:closeAfterClick="true"
								@click="handleDeleteAlbum">
								{{ t('photos', 'Delete album') }}
								<template #icon>
									<DeleteOutline />
								</template>
							</NcActionButton>

							<template v-if="selectedFileIds.length > 0">
								<NcActionSeparator />

								<!-- TODO: enable download on shared albums -->
								<!-- <ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload> -->

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
			:name="t('photos', 'Add photos to {albumName}', { albumName: albumOriginalName })"
			:destination="album.basename"
			:blacklistIds="albumFileIds"
			:loading="loadingAddFilesToAlbum"
			@filesPicked="handleFilesPicked" />
	</div>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { ShareType } from '@nextcloud/sharing'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionSeparator from '@nextcloud/vue/components/NcActionSeparator'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcUserBubble from '@nextcloud/vue/components/NcUserBubble'
import Close from 'vue-material-design-icons/Close.vue'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
// import Download from 'vue-material-design-icons/TrayArrowDown.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import PhotosPicker from '../components/PhotosPicker.vue'
import { useFetchCollectionContent } from '../composables/useFetchCollectionContent.ts'
import { albumFilesExtraProps, albumsExtraProps } from '../store/albums.ts'
import { useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import { useSharedAlbumsStore } from '../store/sharedAlbums.ts'

const props = withDefaults(defineProps<{
	albumName?: string
}>(), {
	albumName: '/',
})

const router = useRouter()
const collectionsStore = useCollectionsStore()
const filesStore = useFilesStore()
const sharedAlbumsStore = useSharedAlbumsStore()
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
const loadingAddFilesToAlbum = ref(false)
const collaboratorTypes = ShareType

const album = computed(() => sharedAlbumsStore.getSharedAlbum(props.albumName))

const albumFileIds = computed(() => sharedAlbumsStore.getSharedAlbumFiles(props.albumName))

const albumOriginalName = computed(() => props.albumName.replace(new RegExp(`\\(${album.value?.attributes.collaborators[0].id}\\)$`), ''))

const albumFileName = computed(() => sharedAlbumsStore.getSharedAlbumName(props.albumName))

const removableSelectedFiles = computed(() => (collectionContent.value?.selectedFileIds ?? [])
	.map((fileId) => filesStore.files[fileId])
	.filter((file) => file.attributes['photos-album-file-origin'] !== 'filters')
	.map((file) => file.fileid.toString()))

async function fetchAlbum() {
	await fetchCollection(
		albumFileName.value,
		albumsExtraProps,
	)
}

async function fetchAlbumContent() {
	await fetchCollectionFiles(albumFileName.value, albumFilesExtraProps)
}

async function handleFilesPicked(fileIds: string[]) {
	showAddPhotosModal.value = false
	await collectionsStore.addFilesToCollection(album.value.root + album.value.path, fileIds)
	// Re-fetch album content to have the proper filenames.
	await fetchAlbumContent()
}

async function handleRemoveFilesFromAlbum(fileIds: string[]) {
	collectionContent.value?.onUncheckFiles(fileIds)
	await collectionsStore.removeFilesFromCollection(album.value.root + album.value.path, fileIds)
}

async function handleDeleteAlbum() {
	const isDeleted = await collectionsStore.deleteCollection(album.value.root + album.value.path)
	if (isDeleted) {
		router.push('/sharedalbums')
	}
}

onMounted(() => {
	fetchAlbum()
	fetchAlbumContent()
})
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
		margin-inline-start: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
