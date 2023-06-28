<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
 - @author Richard Steinmetz <richard@steinmetz.cloud>
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
		<CollectionContent ref="collectionContent"
			:collection="album"
			:collection-file-ids="albumFileIds"
			:loading="loadingAlbum || loadingFiles"
			:error="errorFetchingAlbum || errorFetchingFiles">
			<!-- Header -->
			<HeaderNavigation v-if="albumOriginalName !== ''"
				key="navigation"
				slot="header"
				slot-scope="{selectedFileIds}"
				:loading="loadingAlbum || loadingFiles"
				:params="{ token }"
				path="/"
				:root-title="albumOriginalName"
				:title="albumOriginalName"
				@refresh="fetchAlbumContent">
				<div v-if="album.location !== ''" slot="subtitle" class="album__location">
					<MapMarker />{{ album.location }}
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

							<!-- <NcActionButton :close-after-click="true"
								@click="handleRemoveFilesFromAlbum(selectedFileIds)">
								{{ t('photos', 'Remove selection from album') }}
								<Close slot="icon" />
							</NcActionButton> -->
						</template>
					</NcActions>
				</template>
			</HeaderNavigation>

			<!-- No content -->
			<NcEmptyContent slot="empty-content"
				:title="t('photos', 'This album does not have any photos or videos yet!')"
				class="album__empty">
				<ImageOff slot="icon" />

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

<script>
import { mapActions, mapGetters } from 'vuex'
import { createClient, getPatcher } from 'webdav'

import MapMarker from 'vue-material-design-icons/MapMarker.vue'
// import Plus from 'vue-material-design-icons/Plus.vue'
// import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import ImageOff from 'vue-material-design-icons/ImageOff.vue'
// import Download from 'vue-material-design-icons/Download.vue'
// import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple.vue'

import { NcActions, /** NcButton, */ NcEmptyContent, /** NcActionSeparator, */ isMobile } from '@nextcloud/vue'
import { showError } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'
import { generateUrl, generateRemoteUrl } from '@nextcloud/router'

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import AbortControllerMixin from '../mixins/AbortControllerMixin.js'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
// import ActionDownload from '../components/Actions/ActionDownload.vue'
import { fetchAlbum, fetchAlbumContent } from '../services/Albums.js'
import logger from '../services/logger.js'

const publicRootPath = 'dav'

// force our axios
const patcher = getPatcher()
patcher.patch('request', axios)

// init webdav client on default dav endpoint
const remote = generateRemoteUrl(publicRootPath)
const publicRemote = remote

export default {
	name: 'PublicAlbumContent',
	components: {
		MapMarker,
		// Plus,
		// Download,
		// DownloadMultiple,
		// ImagePlus,
		ImageOff,
		NcEmptyContent,
		NcActions,
		// NcActionSeparator,
		// NcButton,
		CollectionContent,
		// ActionDownload,
		HeaderNavigation,
	},

	mixins: [
		FetchFilesMixin,
		AbortControllerMixin,
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
			loadingAlbum: false,
			errorFetchingAlbum: null,
			loadingCount: 0,
			loadingAddFilesToAlbum: false,
			albumOriginalName: '',
			publicClient: createClient(publicRemote, {
				username: this.token,
				password: null,
			}),
		}
	},

	computed: {
		...mapGetters([
			'files',
			'publicAlbums',
			'publicAlbumsFiles',
		]),

		/**
		 * @return {object} The album information for the current albumName.
		 */
		album() {
			return this.publicAlbums[this.albumName] || {}
		},

		/**
		 * @return {string} The album's name is the token.
		 */
		albumName() {
			return this.token
		},

		/**
		 * @return {string[]} The list of files for the current albumName.
		 */
		albumFileIds() {
			return this.publicAlbumsFiles[this.albumName] || []
		},
	},

	async beforeMount() {
		await this.fetchAlbumInfo()
		await this.fetchAlbumContent()
	},

	methods: {
		...mapActions([
			'appendFiles',
			'addPublicAlbums',
			'addFilesToPublicAlbum',
			'removeFilesFromPublicAlbum',
		]),

		async fetchAlbumInfo() {
			if (this.loadingAlbum) {
				return
			}

			try {
				this.loadingAlbum = true
				this.errorFetchingAlbum = null

				const album = await fetchAlbum(
					`/photospublic/${this.token}`,
					this.abortController.signal,
					'<nc:original-name />',
					this.publicClient,
				)
				this.addPublicAlbums({ collections: [album] })
				this.albumOriginalName = album.originalName
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingAlbum = 404
					return
				}

				this.errorFetchingAlbum = error
				logger.error('[PublicAlbumContent] Error fetching album', { error })
				showError(this.t('photos', 'Failed to fetch album.'))
			} finally {
				this.loadingAlbum = false
			}
		},

		async fetchAlbumContent() {
			if (this.loadingFiles || this.showEditAlbumForm) {
				return []
			}

			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true

				const fetchedFiles = await fetchAlbumContent(
					`/photospublic/${this.token}`,
					this.abortController.signal,
					this.publicClient,
				)

				const fileIds = fetchedFiles
					.map(file => file.fileid.toString())

				fetchedFiles.forEach(file => {
					// Use custom preview URL to avoid authentication prompt
					file.previewUrl = generateUrl(`/apps/photos/api/v1/publicPreview/${file.fileid}?x=2048&y=2048&token=${this.token}`)
					// Disable use of generic file previews for public albums - for older versions of the Viewer app
					file.hasPreview = false
				})

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addFilesToPublicAlbum', { collectionId: this.albumName, fileIdsToAdd: fileIds })
				}

				return fetchedFiles
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFiles = 404
					return []
				}

				this.errorFetchingFiles = error

				showError(this.t('photos', 'Failed to fetch albums list.'))
				logger.error('[PublicAlbumContent] Error fetching album files', { error })
			} finally {
				this.loadingFiles = false
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},

		async handleFilesPicked(fileIds) {
			this.showAddPhotosModal = false
			await this.addFilesToPublicAlbum({ collectionId: this.albumName, fileIdsToAdd: fileIds })
			// Re-fetch album content to have the proper filenames.
			await this.fetchAlbumContent()
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			this.$refs.collectionContent.onUncheckFiles(fileIds)
			await this.removeFilesFromPublicAlbum({ collectionId: this.albumName, fileIdsToRemove: fileIds })
		},
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
