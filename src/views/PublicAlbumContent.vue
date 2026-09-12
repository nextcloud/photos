<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent
			:collection="album ?? undefined"
			:collectionFileIds="albumFileIds"
			:allowSelection="false"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<template #header="{ selectedFileIds }">
				<HeaderNavigation
					v-if="albumOriginalName !== ''"
					key="navigation"

					:loading="loadingCollection || loadingCollectionFiles"
					:params="{ token }"
					path="/"
					:rootTitle="albumOriginalName"
					:title="albumOriginalName"
					@refresh="fetchAlbumContent">
					<template #subtitle>
						<div v-if="album !== null && album.attributes.location !== ''" class="album__location">
							<MapMarkerOutline />{{ album.attributes.location }}
						</div>
					</template>

					<template v-if="album !== undefined" #right>
						<NcActions :forceMenu="true" :aria-label="t('photos', 'Open actions menu')">
							<!-- TODO: enable download on public albums -->
							<!-- <ActionDownload v-if="albumFileIds.length > 0"
							:selected-file-ids="albumFileIds"
							:title="t('photos', 'Download all files in album')">
							<DownloadMultiple slot="icon" />
						</ActionDownload> -->

							<template v-if="selectedFileIds.length > 0">
							<!-- TODO: enable download on public albums -->
							<!-- <NcActionSeparator />

							<ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload> -->

							<!-- </**  :close */-after-click="true"
								@click="handleRemoveFilesFromAlbum(selectedFileIds)">
								{{ t('photos', 'Remove selection from album') }}
								<Close slot="icon" />
							<//** > */ -->
							</template>
						</NcActions>
					</template>
				</HeaderNavigation>
			</template>

			<!-- No content -->
			<template #emptyContent>
				<NcEmptyContent

					:name="t('photos', 'This album does not have any photos or videos yet!')"
					class="album__empty">
					<template #icon>
						<ImageOffOutline />
					</template>

				<!-- Public upload is not implemented yet
				<NcButton slot="action"
					type="primary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
				-->
				</NcEmptyContent>
			</template>
		</CollectionContent>
	</div>
</template>

<script setup lang="ts">
import type { PublicAlbum } from '../store/publicAlbums.ts'

import { getClient } from '@nextcloud/files/dav'
// import Download from 'vue-material-design-icons/TrayArrowDown.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'
import { t } from '@nextcloud/l10n'
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { computed, onBeforeMount, ref } from 'vue'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
// import Plus from 'vue-material-design-icons/Plus.vue'
// import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import ImageOffOutline from 'vue-material-design-icons/ImageOffOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import { useFetchCollectionContent } from '../composables/useFetchCollectionContent.ts'
import { albumFilesExtraProps } from '../store/albums.ts'
import { publicAlbumsExtraProps, publicAlbumsPrefix, usePublicAlbumsStore } from '../store/publicAlbums.ts'

const props = defineProps<{
	token: string
}>()

const publicAlbumsStore = usePublicAlbumsStore()
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
