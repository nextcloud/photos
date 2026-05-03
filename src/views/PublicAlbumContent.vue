<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent
			ref="collectionContent"
			:collection="album"
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
						<div v-if="album.attributes.location !== ''" class="album__location">
							<MapMarkerOutline />{{ album.attributes.location }}
						</div>
					</template>

					<template v-if="album !== undefined" #right>
						<NcActions :forceMenu="true" :aria-label="t('photos', 'Open actions menu')">
							<!-- TODO: enable downloading album content for public visitors -->
							<template v-if="selectedFileIds.length > 0">
								<!-- TODO: enable downloading the current selection for public visitors -->
								<!-- TODO: enable removing files from a public album when the visitor is the owner -->
							</template>
						</NcActions>
					</template>
				</HeaderNavigation>
			</template>

			<!-- No content -->
			<template #empty-content>
				<NcEmptyContent
					:name="t('photos', 'This album does not have any photos or videos yet!')"
					class="album__empty">
					<template #icon>
						<ImageOffOutline />
					</template>
					<!-- TODO: enable public upload (#empty-content's #action slot) -->
				</NcEmptyContent>
			</template>
		</CollectionContent>
	</div>
</template>

<script lang='ts'>
import type { PublicAlbum } from '../store/publicAlbums.ts'

import { getClient } from '@nextcloud/files/dav'
// import Download from 'vue-material-design-icons/TrayArrowDown.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'
import { translate } from '@nextcloud/l10n'
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { markRaw } from 'vue'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
// import Plus from 'vue-material-design-icons/Plus.vue'
// import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import ImageOffOutline from 'vue-material-design-icons/ImageOffOutline.vue'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.ts'
import { albumFilesExtraProps } from '../store/albums.ts'
import { publicAlbumsExtraProps, publicAlbumsPrefix } from '../store/publicAlbums.ts'

export default {
	name: 'PublicAlbumContent',
	components: {
		MapMarkerOutline,
		// Plus,
		// Download,
		// DownloadMultiple,
		// ImagePlus,
		ImageOffOutline,
		NcEmptyContent,
		NcActions,
		// NcActionSeparator,
		// NcButton,
		CollectionContent,
		// ActionDownload,
		HeaderNavigation,
	},

	mixins: [
		FetchCollectionContentMixin,
	],

	props: {
		token: {
			type: String,
			required: true,
		},
	},

	setup() {
		const isMobile = useIsMobile()
		return { isMobile }
	},

	data() {
		return {
			showAddPhotosModal: false,
			loadingCount: 0,
			loadingAddFilesToAlbum: false,
			albumOriginalName: '',
			// markRaw: the webdav client uses private class fields that throw
			// under Vue 3's reactive Proxy.
			publicClient: markRaw(getClient(generateRemoteUrl('dav'), {
				Authorization: `Basic ${btoa(`${this.token}:`)}`,
			})),
		}
	},

	computed: {
		album(): PublicAlbum {
			return this.$store.getters.getPublicAlbum(this.albumName)
		},

		albumName(): string {
			return this.token
		},

		albumFileIds(): string[] {
			return this.$store.getters.getPublicAlbumFiles(this.albumName)
		},

		publicAlbumFileName(): string {
			return this.$store.getters.getPublicAlbumName(this.albumName)
		},
	},

	async beforeMount() {
		await this.fetchAlbumInfo()
		await this.fetchAlbumContent()
	},

	methods: {
		async fetchAlbumInfo() {
			const album = await this.fetchCollection(
				`${publicAlbumsPrefix}/${this.token}`,
				publicAlbumsExtraProps,
				this.publicClient,
			) as PublicAlbum

			if (album !== null) { // Could be null in case of 404.
				this.albumOriginalName = album.attributes['original-name']
			}
		},

		async fetchAlbumContent() {
			const files = await this.fetchCollectionFiles(
				`${publicAlbumsPrefix}/${this.token}`,
				[...albumFilesExtraProps, ...publicAlbumsExtraProps],
				this.publicClient,
			)

			files.forEach((file) => {
				file.update({
					// Use custom preview URL to avoid authentication prompt
					previewUrl: generateUrl(`/apps/photos/api/v1/publicPreview/${file.fileid}?x=4096&y=4096&token=${this.token}`),
					// Disable use of generic file previews for public albums - for older versions of the Viewer app
					hasPreview: false,
				})
			})
		},

		async handleFilesPicked(fileIds: string[]) {
			this.showAddPhotosModal = false
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: this.album.root + this.albumName, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds: string[]) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.$store.dispatch('removeFilesFromCollection', { collectionFileName: this.album.root + this.albumName, fileIdsToRemove: fileIds })
		},

		t: translate,
	},
}
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
