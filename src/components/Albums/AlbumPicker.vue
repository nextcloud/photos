<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div v-if="!showAlbumCreationForm" class="album-picker">
		<h2>
			{{ t('photos', 'Add to Album') }}
			<NcLoadingIcon v-if="loadingCollections" class="loading-icon" />
		</h2>

		<ul class="albums-container">
			<NcListItem
				v-for="album in allAlbums"
				:key="album.attributes.filename"
				class="album"
				:name="originalName(album)"
				:aria-label="t('photos', 'Add selection to album {albumName}', { albumName: album.basename })"
				@click="pickAlbum(album)">
				<template #icon>
					<img v-if="album.attributes['last-photo'] !== -1" class="album__image" :src="toCoverUrl(album.attributes['last-photo'])">
					<div v-else class="album__image album__image--placeholder">
						<ImageMultipleOutline :size="32" />
					</div>
				</template>

				<template #subname>
					{{ n('photos', '%n item', '%n photos and videos', album.attributes.nbItems) }}
					<template v-if="isSharedAlbum(album)">
						⸱ {{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :displayName="album.attributes.collaborators[0].label" :user="album.attributes.collaborators[0].id" />
					</template>
				</template>
			</NcListItem>
		</ul>

		<NcButton
			:aria-label="t('photos', 'Create a new album.')"
			class="new-album-button"
			variant="tertiary"
			@click="showAlbumCreationForm = true">
			<template #icon>
				<Plus />
			</template>
			{{ t('photos', 'Create new album') }}
		</NcButton>
	</div>

	<AlbumForm
		v-else
		:displayBackButton="true"
		:title="t('photos', 'New album')"
		@back="showAlbumCreationForm = false"
		@done="albumCreatedHandler" />
</template>

<script setup lang="ts">
import type { Album } from '../../store/albums.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { n, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcListItem from '@nextcloud/vue/components/NcListItem'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcUserBubble from '@nextcloud/vue/components/NcUserBubble'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import AlbumForm from './AlbumForm.vue'
import { useFetchCollections } from '../../composables/useFetchCollections.ts'
import { albumsExtraProps } from '../../store/albums.ts'
import { useAlbumsStore } from '../../store/albums.ts'
import { useSharedAlbumsStore } from '../../store/sharedAlbums.ts'

const emit = defineEmits<{
	albumPicked: [album: Album]
}>()

const albumsStore = useAlbumsStore()
const sharedAlbumsStore = useSharedAlbumsStore()
const { fetchCollections, loadingCollections } = useFetchCollections()

const showAlbumCreationForm = ref(false)

const albums = computed(() => albumsStore.albums)

const sharedAlbums = computed(() => sharedAlbumsStore.sharedAlbums)

const allAlbums = computed(() => [...Object.values(albums.value), ...Object.values(sharedAlbums.value)] as Album[])

function toCoverUrl(fileId: number): string {
	return generateUrl(`/apps/photos/api/v1/preview/${fileId}?x=${64}&y=${64}`)
}

async function fetchAlbumList() {
	await fetchCollections(`/photos/${getCurrentUser()?.uid}/albums`, albumsExtraProps)
	await fetchCollections(`/photos/${getCurrentUser()?.uid}/sharedalbums`, albumsExtraProps)
}

function albumCreatedHandler() {
	showAlbumCreationForm.value = false
	fetchAlbumList()
}

function pickAlbum(album: Album) {
	emit('albumPicked', album)
}

function isSharedAlbum(album: Album) {
	return album.path.match(/^\/photos\/.+\/sharedalbums\//) !== null
}

function originalName(album: Album) {
	if (isSharedAlbum(album)) {
		return album.basename.replace(new RegExp(`\\(${album.attributes.collaborators[0].id}\\)$`), '')
	} else {
		return album.basename
	}
}

onMounted(() => {
	fetchAlbumList()
})
</script>

<style lang="scss" scoped>
.album-picker {
	padding: 32px;
	padding-top: 16px;

	h2 {
		display: flex;
		align-items: center;
		height: 60px;

		.loading-icon {
			margin-inline-start: 32px;
		}
	}

	.albums-container {
		min-height: 150px;
		max-height: 350px;
		overflow-x: scroll;
		padding: 2px;

		.album {

			:deep(.list-item) {
				padding: 8px 16px;
				box-sizing: border-box;
			}

			&:not(:last-child) {
				margin-bottom: 16px;
			}

			&__image {
				width: 40px;
				height: 40px;
				object-fit: none;
				border-radius: var(--border-radius);

				&--placeholder {
					background: var(--color-primary-element-light);

					:deep(.material-design-icon) {
						width: 100%;
						height: 100%;

						.material-design-icon__svg {
							fill: var(--color-primary-element);
						}
					}
				}
			}
		}
	}

	.new-album-button {
		margin-top: 32px;
	}
}
</style>
