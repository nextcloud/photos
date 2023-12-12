<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
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
				<div v-if="album !== undefined && album.location !== ''" slot="subtitle" class="album__location">
					<MapMarker />{{ album.location }} ⸱ {{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :display-name="album.collaborators[0].label" :user="album.collaborators[0].id" />
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
					<NcButton v-if="album.nbItems !== 0"
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

						<NcActionButton v-if="album.collaborators[0].type === collaboratorTypes.SHARE_TYPE_USER"
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
			<NcEmptyContent v-if="album !== undefined && album.nbItems === 0 && !(loadingCollectionFiles || loadingCollection)"
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

		<NcModal v-if="showAddPhotosModal"
			size="large"
			:name="t('photos', 'Add photos to {albumName}', {albumName: albumOriginalName})"
			@close="showAddPhotosModal = false">
			<FilesPicker v-if="album !== undefined"
				:album="album"
				:destination="album.basename"
				:blacklist-ids="albumFileIds"
				:loading="loadingAddFilesToAlbum"
				@files-picked="handleFilesPicked" />
		</NcModal>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { NcActions, NcActionButton, NcButton, NcModal, NcEmptyContent, NcActionSeparator, NcUserBubble, isMobile } from '@nextcloud/vue'
import { Type } from '@nextcloud/sharing'
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
import FilesPicker from '../components/FilesPicker.vue'

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
		NcModal,
		NcUserBubble,
		CollectionContent,
		// ActionDownload,
		FilesPicker,
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
			collaboratorTypes: Type,
		}
	},

	computed: {
		...mapGetters([
			'files',
			'sharedAlbumsFiles',
		]),

		/**
		 * @return {import('../store/sharedAlbums.js').SharedAlbum|undefined} The album information for the current albumName.
		 */
		album() {
			return this.$store.getters.getSharedAlbum(this.albumName)
		},

		/**
		 * @return {string[]} The list of files for the current albumName.
		 */
		albumFileIds() {
			return this.$store.getters.getSharedAlbumFiles(this.albumName)
		},

		/**
		 * @return {string} The album name without the userId between parentheses.
		 */
		albumOriginalName() {
			return this.albumName.replace(new RegExp(`\\(${this.album.collaborators[0].id}\\)$`), '')
		},

		/**
		 * @return {string} The album's filename based on its name. Useful to fetch the location information and content.
		 */
		albumFileName() {
			return this.$store.getters.getSharedAlbumName(this.albumName)
		},
	},

	async mounted() {
		this.fetchAlbum()
		this.fetchAlbumContent()
	},

	methods: {
		...mapActions([
			'addFilesToCollection',
			'removeFilesFromCollection',
			'deleteCollection',
		]),

		async fetchAlbum() {
			await this.fetchCollection(
				this.albumFileName,
				['<nc:location />', '<nc:dateRange />', '<nc:collaborators />']
			)
		},

		async fetchAlbumContent() {
			await this.fetchCollectionFiles(this.albumFileName)
		},

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.addFilesToCollection({ collectionFileName: this.album.filename, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.removeFilesFromCollection({ collectionFileName: this.album.filename, fileIdsToRemove: fileIds })
		},

		async handleDeleteAlbum() {
			await this.deleteCollection({ collectionFileName: this.album.filename })
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
