<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<CollectionsList
		:collections="sharedAlbums"
		:loading="loadingCollections"
		:error="errorFetchingCollections"
		class="albums-list">
		<template #header>
			<HeaderNavigation
				key="navigation"

				:loading="loadingCollections"
				:title="t('photos', 'Collaborative albums')"
				:rootTitle="t('photos', 'Collaborative albums')"
				@refresh="fetchSharedAlbums" />
		</template>

		<template #default="{ collection }">
			<CollectionCover
				:key="collection.basename"
				parentRoute="/sharedalbums"
				:collectionName="collection.basename"
				:altImg="t('photos', 'Cover photo for shared album {albumName}', { albumName: collection.basename })"
				:data-test="collection.basename"
				:coverUrl="coverUrl(collection.attributes['last-photo'])">
				<span class="album__name">
					{{ albumOriginalName(collection) }}
				</span>

				<template #subtitle>
					<div class="album__details">
						{{ collection.attributes.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
						<br>
						{{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :displayName="collection.attributes.collaborators[0].label" :user="collection.attributes.collaborators[0].id" />
					</div>
				</template>
			</CollectionCover>
		</template>

		<template #emptyCollectionsList>
			<NcEmptyContent :name="t('photos', 'There is no album yet!')">
				<template #icon>
					<ImageMultipleOutline />
				</template>
			</NcEmptyContent>
		</template>
	</CollectionsList>
</template>

<script setup lang="ts">
import type { Album } from '../store/albums.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { n, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onBeforeMount } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcUserBubble from '@nextcloud/vue/components/NcUserBubble'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useFetchCollections } from '../composables/useFetchCollections.ts'
import { albumsExtraProps } from '../store/albums.ts'
import { useSharedAlbumsStore } from '../store/sharedAlbums.ts'

const sharedAlbumsStore = useSharedAlbumsStore()
const { fetchCollections, errorFetchingCollections, loadingCollections } = useFetchCollections()

const sharedAlbums = computed<Record<string, Album>>(() => sharedAlbumsStore.sharedAlbums)

function coverUrl(lastPhoto: number): string {
	if (lastPhoto === -1) {
		return ''
	}

	return generateUrl(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`)
}

function albumOriginalName(album: Album): string {
	return album.basename.replace(new RegExp(`\\(${album.attributes.collaborators[0].id}\\)$`), '')
}

function fetchSharedAlbums() {
	fetchCollections(
		`/photos/${getCurrentUser()?.uid}/sharedalbums`,
		albumsExtraProps,
	)
}

onBeforeMount(() => {
	fetchSharedAlbums()
})
</script>

<style lang="scss" scoped>
.albums-list {
	display: flex;
	flex-direction: column;

	.album__name {
		font-weight: normal;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 20px;
		margin-bottom: 12px;
		line-height: 30px;
		color: var(--color-main-text);
	}
}
</style>
