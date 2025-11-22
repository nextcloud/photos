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
			:collection-file-ids="albumFileIds"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation
				key="navigation"
				slot="header"
				slot-scope="{ selectedFileIds, resetSelection }"
				:loading="loadingCollectionFiles"
				:params="{ albumName }"
				:path="'/' + albumName"
				:title="albumOriginalName"
				@refresh="fetchAlbumContent">
				<div
					v-if="album !== undefined && album.attributes.location !== ''"
					slot="subtitle"
					class="album__location">
					<MapMarkerOutline />{{ album.attributes.location }} ⸱ {{ t('photos', 'Shared by') }}&nbsp;
					<NcUserBubble
						:display-name="album.attributes.collaborators[0].label"
						:user="album.attributes.collaborators[0].id" />
				</div>

				<template slot="default">
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

				<template v-if="album !== undefined" slot="right">
					<NcButton
						v-if="album.attributes.nbItems !== 0"
						variant="secondary"
						:aria-label="t('photos', 'Add photos to this album')"
						@click="showAddPhotosModal = true">
						<Plus slot="icon" />
						{{ t('photos', "Add") }}
					</NcButton>

					<NcActions :force-menu="true" :aria-label="t('photos', 'Open actions menu')">
						<!-- TODO: enable download on shared albums -->
						<!-- <ActionDownload v-if="albumFileIds.length > 0"
							:selected-file-ids="albumFileIds"
							:title="t('photos', 'Download all files in album')">
							<DownloadMultiple slot="icon" />
						</ActionDownload> -->

						<NcActionButton
							v-if="album.attributes.collaborators[0].type === collaboratorTypes.User"
							:close-after-click="true"
							@click="handleDeleteAlbum">
							{{ t('photos', 'Delete album') }}
							<DeleteOutline slot="icon" />
						</NcActionButton>

						<template v-if="selectedFileIds.length > 0">
							<NcActionSeparator />

							<!-- TODO: enable download on shared albums -->
							<!-- <ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload> -->

							<NcActionButton
								v-if="removableSelectedFiles.length !== 0"
								:close-after-click="true"
								@click="handleRemoveFilesFromAlbum(removableSelectedFiles)">
								{{ t('photos', 'Remove selection from album') }}
								<Close slot="icon" />
							</NcActionButton>
						</template>
					</NcActions>
				</template>
			</HeaderNavigation>

			<!-- No content -->
			<NcEmptyContent
				v-if="album !== undefined && album.attributes.nbItems === 0 && !(loadingCollectionFiles || loadingCollection)"
				slot="empty-content"
				:name="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImagePlusOutline slot="icon" />

				<NcButton
					slot="action"
					class="album__empty__button"
					variant="primary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>

		<PhotosPicker
			v-if="album !== undefined"
			:open.sync="showAddPhotosModal"
			:name="t('photos', 'Add photos to {albumName}', { albumName: albumOriginalName })"
			:destination="album.basename"
			:blacklist-ids="albumFileIds"
			:loading="loadingAddFilesToAlbum"
			@files-picked="handleFilesPicked" />
	</div>
</template>

<script lang='ts'>
import { translate } from '@nextcloud/l10n'
import { ShareType } from '@nextcloud/sharing'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
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
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import { albumFilesExtraProps, albumsExtraProps } from '../store/albums.ts'

export default {
	name: 'SharedAlbumContent',
	components: {
		MapMarkerOutline,
		Plus,
		Close,
		// Download,
		// DownloadMultiple,
		DeleteOutline,
		ImagePlusOutline,
		NcEmptyContent,
		NcActions,
		NcActionButton,
		NcActionSeparator,
		NcButton,
		NcUserBubble,
		CollectionContent,
		// ActionDownload,
		PhotosPicker,
		HeaderNavigation,
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
			loadingCount: 0,
			loadingAddFilesToAlbum: false,
			collaboratorTypes: ShareType,
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		album() {
			return this.$store.getters.getSharedAlbum(this.albumName)
		},

		albumFileIds() {
			return this.$store.getters.getSharedAlbumFiles(this.albumName)
		},

		albumOriginalName(): string {
			return this.albumName.replace(new RegExp(`\\(${this.album?.attributes.collaborators[0].id}\\)$`), '')
		},

		albumFileName(): string {
			return this.$store.getters.getSharedAlbumName(this.albumName)
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

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: this.album.root + this.album.path, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds: string[]) {
			this.$refs.collectionContent?.onUncheckFiles(fileIds)
			await this.$store.dispatch('removeFilesFromCollection', { collectionFileName: this.album.root + this.album.path, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			const isDeleted = await this.$store.dispatch('deleteCollection', { collectionFileName: this.album.root + this.album.path })
			if (isDeleted) {
				this.$router.push('/sharedalbums')
			}
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
