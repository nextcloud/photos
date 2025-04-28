<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent v-if="true"
			ref="collectionContent"
			:collection="album"
			:collection-file-ids="albumFileIds"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation key="navigation"
				slot="header"
				slot-scope="{selectedFileIds, resetSelection}"
				:loading="loadingCollectionFiles"
				:params="{ albumName }"
				:path="'/' + albumName"
				:title="albumOriginalName"
				@refresh="fetchAlbumContent">
				<div v-if="album !== undefined && album.attributes.location !== ''" slot="subtitle" class="album__location">
					<MapMarker />{{ album.attributes.location }} ⸱ {{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :display-name="album.attributes.collaborators[0].label" :user="album.attributes.collaborators[0].id" />
				</div>

				<template slot="default">
					<NcButton v-if="selectedFileIds.length > 0"
						:aria-label="t('photos', 'Unselect all')"
						@click="resetSelection">
						<template #icon>
							<Close />
						</template>
						{{ t('photos', 'Unselect all') }}
					</NcButton>
				</template>

				<template v-if="album !== undefined" slot="right">
					<NcButton v-if="album.attributes.nbItems !== 0"
						type="secondary"
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

						<NcActionButton v-if="album.attributes.collaborators[0].type === collaboratorTypes.User"
							:close-after-click="true"
							@click="handleDeleteAlbum">
							{{ t('photos', 'Delete album') }}
							<Delete slot="icon" />
						</NcActionButton>

						<template v-if="selectedFileIds.length > 0">
							<NcActionSeparator />

							<!-- TODO: enable download on shared albums -->
							<!-- <ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
								<Download slot="icon" />
							</ActionDownload> -->

							<NcActionButton :close-after-click="true"
								@click="handleRemoveFilesFromAlbum(selectedFileIds)">
								{{ t('photos', 'Remove selection from album') }}
								<Close slot="icon" />
							</NcActionButton>
						</template>
					</NcActions>
				</template>
			</HeaderNavigation>

			<!-- No content -->
			<NcEmptyContent v-if="album !== undefined && album.attributes.nbItems === 0 && !(loadingCollectionFiles || loadingCollection)"
				slot="empty-content"
				:name="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImagePlus slot="icon" />

				<NcButton slot="action"
					class="album__empty__button"
					type="primary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>

		<PhotosPicker v-if="album !== undefined"
			:open.sync="showAddPhotosModal"
			:name="t('photos', 'Add photos to {albumName}', {albumName: albumOriginalName})"
			:destination="album.basename"
			:blacklist-ids="albumFileIds"
			:loading="loadingAddFilesToAlbum"
			@files-picked="handleFilesPicked" />
	</div>
</template>

<script lang='ts'>
import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcActionSeparator from '@nextcloud/vue/dist/Components/NcActionSeparator.js'
import NcUserBubble from '@nextcloud/vue/dist/Components/NcUserBubble.js'
import isMobile from '@nextcloud/vue/dist/Mixins/isMobile.js'
import { ShareType } from '@nextcloud/sharing'
import { translate } from '@nextcloud/l10n'

import MapMarker from 'vue-material-design-icons/MapMarker.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import Close from 'vue-material-design-icons/Close.vue'
// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'

import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import PhotosPicker from '../components/PhotosPicker.vue'

export default {
	name: 'SharedAlbumContent',
	components: {
		MapMarker,
		Plus,
		Close,
		// Download,
		// DownloadMultiple,
		Delete,
		ImagePlus,
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
		isMobile,
	],

	props: {
		albumName: {
			type: String,
			default: '/',
		},
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
	},

	async mounted() {
		this.fetchAlbum()
		this.fetchAlbumContent()
	},

	methods: {
		async fetchAlbum() {
			await this.fetchCollection(
				this.albumFileName,
				['<nc:location />', '<nc:dateRange />', '<nc:collaborators />'],
			)
		},

		async fetchAlbumContent() {
			await this.fetchCollectionFiles(this.albumFileName)
		},

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: this.album.root + this.album.path, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.$store.dispatch('removeFilesFromCollection', { collectionFileName: this.album.root + this.album.path, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			await this.$store.dispatch('deleteCollection', { collectionFileName: this.album.root + this.album.path })
			this.$router.push('/sharedalbums')
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
		margin-left: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
