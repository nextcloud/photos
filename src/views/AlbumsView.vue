<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionsList
			:collections="albums"
			:loading="loadingCollections"
			:error="errorFetchingCollections"
			class="albums-list">
			<template #header>
				<HeaderNavigation
					key="navigation"
					:loading="loadingCollections"
					:title="t('photos', 'Albums')"
					:rootTitle="t('photos', 'Albums')"
					@refresh="fetchAlbums">
					<NcButton
						:aria-label="isMobile ? t('photos', 'New album') : undefined"
						@click="showAlbumCreationForm = true">
						<template #icon>
							<Plus :size="20" />
						</template>
						<template v-if="!isMobile" #default>
							{{ t('photos', 'New album') }}
						</template>
					</NcButton>
				</HeaderNavigation>
			</template>

			<template #default="{ collection }">
				<CollectionCover
					:key="collection.basename"
					parentRoute="/albums"
					:collectionName="collection.basename"
					:altImg="t('photos', 'Cover photo for album {albumName}', { albumName: collection.basename })"
					:coverUrl="coverUrl(collection.attributes['last-photo'])">
					<template #default>
						<span class="album__name">
							{{ collection.basename }}
						</span>
					</template>

					<template #subtitle>
						<div class="album__details">
							{{ collection.attributes.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
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

		<NcModal
			v-if="showAlbumCreationForm"
			labelId="new-album-form"
			@close="showAlbumCreationForm = false">
			<h2 class="album-creation__heading">
				{{ t('photos', 'New album') }}
			</h2>
			<AlbumForm @done="handleAlbumCreated" />
		</NcModal>
	</div>
</template>

<script setup lang="ts">
import type { Collection } from '../services/collectionFetcher.ts'

import { n, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { useIsSmallMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcModal from '@nextcloud/vue/components/NcModal'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useFetchCollections } from '../composables/useFetchCollections.ts'
import { albumsExtraProps, albumsPrefix, useAlbumsStore } from '../store/albums.ts'

const router = useRouter()
const isMobile = useIsSmallMobile()
const albumsStore = useAlbumsStore()
const { fetchCollections, errorFetchingCollections, loadingCollections } = useFetchCollections()

const showAlbumCreationForm = ref(false)

const albums = computed(() => albumsStore.albums)

function coverUrl(lastPhoto: number): string {
	if (lastPhoto === -1) {
		return ''
	}

	return generateUrl(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`)
}

function fetchAlbums() {
	fetchCollections(
		albumsPrefix,
		albumsExtraProps,
	)
}

function handleAlbumCreated({ album }: { album: Collection }) {
	showAlbumCreationForm.value = false
	router.push(`/albums/${album.basename}`)
}

onBeforeMount(() => {
	fetchAlbums()
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
		color: var(--color-main-text);
	}
}

.album-creation__heading {
	padding: calc(var(--default-grid-baseline) * 4);
	margin-bottom: 0px;
	padding-bottom: 0px;
}
</style>
