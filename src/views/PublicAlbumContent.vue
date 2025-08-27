<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent
			ref="collectionContent"
			:collection="album"
			:collection-file-ids="albumFileIds"
			:allow-selection="false"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation
				v-if="albumOriginalName !== ''"
				key="navigation"
				slot="header"
				slot-scope="{ selectedFileIds }"
				:loading="loadingCollection || loadingCollectionFiles"
				:params="{ token }"
				path="/"
				:root-title="albumOriginalName"
				:title="albumOriginalName"
				@refresh="fetchAlbumContent">
				<div v-if="album.attributes.location !== ''" slot="subtitle" class="album__location">
					<MapMarkerOutline />{{ album.attributes.location }}
				</div>

				<template v-if="album !== undefined" slot="right">
					<NcActions :force-menu="true" :aria-label="t('photos', 'Open actions menu')">
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

			<!-- No content -->
			<NcEmptyContent
				slot="empty-content"
				:name="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImageOffOutline slot="icon" />

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
import { isMobile, /** NcButton, */ NcActions, /** NcActionSeparator, */ NcEmptyContent } from '@nextcloud/vue'
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
		isMobile,
	],

	props: {
		token: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			showAddPhotosModal: false,
			loadingCount: 0,
			loadingAddFilesToAlbum: false,
			albumOriginalName: '',
			publicClient: getClient(generateRemoteUrl('dav'), {
				Authorization: `Basic ${btoa(`${this.token}:`)}`,
			}),
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
					previewUrl: generateUrl(`/apps/photos/api/v1/publicPreview/${file.fileid}?x=2048&y=2048&token=${this.token}`),
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
