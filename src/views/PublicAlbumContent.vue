<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="public-album">
		<CollectionContent
			:collection="album ?? undefined"
			:collectionFileIds="albumFileIds"
			:allowSelection="false"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<template #header>
				<AlbumHero
					v-if="album !== null"
					:coverFileId="coverFileId"
					:coverUrl="coverUrl"
					:blurhash="coverPhoto?.attributes['metadata-blurhash']"
					:title="albumOriginalName"
					:subtitle="formatAlbumSummary(album)"
					standalone />
			</template>

			<!-- No content -->
			<template #emptyContent>
				<NcEmptyContent
					:name="t('photos', 'This album does not have any photos or videos yet!')"
					class="album__empty">
					<template #icon>
						<ImageOffOutline />
					</template>
				</NcEmptyContent>
			</template>
		</CollectionContent>

		<p v-if="album !== null" class="public-album__footer">
			{{ t('photos', 'Shared with Nextcloud Photos') }}
		</p>
	</div>
</template>

<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'
import type { PhotoFile } from '../store/files.ts'
import type { PublicAlbum } from '../store/publicAlbums.ts'

import { getClient } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ImageOffOutline from 'vue-material-design-icons/ImageOffOutline.vue'
import AlbumHero from '../components/AlbumHero.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import { useFetchCollectionContent } from '../composables/useFetchCollectionContent.ts'
import { albumFilesExtraProps } from '../store/albums.ts'
import { useFilesStore } from '../store/files.ts'
import { publicAlbumsExtraProps, publicAlbumsPrefix, usePublicAlbumsStore } from '../store/publicAlbums.ts'
import { pickAlbumCover } from '../utils/albumCover.ts'
import { formatAlbumDocumentTitle, formatAlbumSummary } from '../utils/albumSummary.ts'

const props = defineProps<{
	token: string
}>()

const publicAlbumsStore = usePublicAlbumsStore()
const filesStore = useFilesStore()
const route = useRoute()
const {
	fetchCollection,
	fetchCollectionFiles,
	loadingCollection,
	loadingCollectionFiles,
	errorFetchingCollection,
	errorFetchingCollectionFiles,
} = useFetchCollectionContent()

const albumOriginalName = ref('')
const publicClient = getClient(generateRemoteUrl('dav'), {
	Authorization: `Basic ${btoa(`${props.token}:`)}`,
})

const albumName = computed(() => props.token)

const album = computed(() => publicAlbumsStore.getPublicAlbum(albumName.value))

const albumFileIds = computed(() => publicAlbumsStore.getPublicAlbumFiles(albumName.value))

const albumPhotos = computed<PhotoFile[]>(() => albumFileIds.value
	.map((fileId) => filesStore.files[fileId])
	.filter((file) => file !== undefined))

const coverPhoto = computed(() => pickAlbumCover(albumPhotos.value, album.value?.attributes['last-photo'] ?? -1))

// The photo shown by the hero, which is only known once the album
// content is there - until then the album cover is used as is.
const coverFileId = computed(() => coverPhoto.value?.fileid ?? album.value?.attributes['last-photo'] ?? -1)

/** Width and height of the requested cover preview. */
const COVER_PREVIEW_SIZE = 1024

// Visitors have no session, the cover has to come from the preview endpoint
// that takes the token of the link.
const coverUrl = computed(() => generateUrl(`/apps/photos/api/v1/publicPreview/${coverFileId.value}?x=${COVER_PREVIEW_SIZE}&y=${COVER_PREVIEW_SIZE}&token=${props.token}`))

// The route names the page after the token of the link, which says nothing
// to the people it is shared with.
watch(albumOriginalName, (name) => {
	const routeTitle = (route.meta.rootTitle as (to: RouteLocationNormalized) => string)(route)
	document.title = formatAlbumDocumentTitle(document.title, routeTitle, name)
})

async function fetchAlbumInfo() {
	const album = await fetchCollection(
		`${publicAlbumsPrefix}/${props.token}`,
		publicAlbumsExtraProps,
		publicClient,
	) as PublicAlbum

	if (album !== null) { // Could be null in case of 404.
		albumOriginalName.value = album.attributes['original-name']
	}
}

async function fetchAlbumContent() {
	const files = await fetchCollectionFiles(
		`${publicAlbumsPrefix}/${props.token}`,
		[...albumFilesExtraProps, ...publicAlbumsExtraProps],
		publicClient,
	)

	files.forEach((file) => {
		const decodedEtag = String(file.attributes.etag).replace(/(&quot;|")/g, '')

		file.update({
			// Use custom preview URL to avoid authentication prompt
			previewUrl: generateUrl(`/apps/photos/api/v1/publicPreview/${file.fileid}?etag=${decodedEtag}&x=4096&y=4096&token=${props.token}`),
			// Disable use of generic file previews for public albums - for older versions of the Viewer app
			hasPreview: false,
		})
	})
}

onBeforeMount(async () => {
	await fetchAlbumInfo()
	await fetchAlbumContent()
})
</script>

<style lang="scss" scoped>
.public-album {
	&__footer {
		// Leaves room for the footer of the instance, which floats above the page.
		padding-block: calc(var(--default-grid-baseline) * 8) calc(var(--default-grid-baseline) * 20);
		padding-inline: calc(var(--default-grid-baseline) * 4);
		color: var(--color-text-maxcontrast);
		text-align: center;
	}
}
</style>
