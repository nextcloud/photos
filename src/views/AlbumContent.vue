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
	<!-- Errors handlers-->
	<EmptyContent v-if="album === undefined && !loadingAlbums" class="empty-content-with-illustration">
		<template #icon>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<span class="empty-content-illustration" v-html="FolderIllustration" />
		</template>
		{{ t('photos', 'This album does not exist') }}
	</EmptyContent>
	<EmptyContent v-else-if="errorFetchingFiles || errorFetchingAlbums">
		<template #icon>
			<AlertCircle />
		</template>
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<div v-else class="album">
		<div class="album__header">
			<div class="album__header__left">
				<div class="album__header__title">
					<h2 v-if="album !== undefined" class="album__name">
						{{ album.basename }}
					</h2>
					<div v-if="album !== undefined && album.location !== ''" class="album__location">
						<MapMarker />{{ album.location }}
					</div>
				</div>

				<Loader v-if="loadingCount > 0" class="album__header__loader" />
			</div>
			<div v-if="album !== undefined" class="album__header__actions">
				<Button v-if="album.nbItems !== 0"
					type="tertiary"
					:aria-label="t('photos', 'Add photos to this album')"
					@click="showAddPhotosModal = true">
					<template #icon>
						<Plus />
					</template>
				</Button>
				<!-- <Button type="tertiary" :aria-label="t('photos', 'Share this album')" @click="showShareModal = true">
					<template #icon>
						<ShareVariant />
					</template>
				</Button> -->
				<Actions :force-menu="true">
					<ActionButton :close-after-click="true"
						:aria-label="t('photos', 'Edit album details')"
						@click="showEditAlbumForm = true">
						{{ t('photos', 'Edit album details') }}
						<Pencil slot="icon" />
					</ActionButton>
					<ActionButton v-if="albumFileIds.length > 0"
						:close-after-click="true"
						:aria-label="t('photos', 'Download all files in album')"
						@click="downloadAllFiles">
						{{ t('photos', 'Download all files in album') }}
						<DownloadMultiple slot="icon" />
					</ActionButton>
					<template v-if="selectedFileIds.length > 0">
						<ActionButton :close-after-click="true"
							:aria-label="t('photos', 'Download selection')"
							@click="downloadSelection">
							{{ t('photos', 'Download selected files') }}
							<Download slot="icon" />
						</ActionButton>
						<ActionButton v-if="shouldFavoriteSelection"
							:close-after-click="true"
							:aria-label="t('photos', 'Mark selection as favorite')"
							@click="favoriteSelection">
							{{ t('photos', 'Favorite') }}
							<Star slot="icon" />
						</ActionButton>
						<ActionButton v-else
							:close-after-click="true"
							:aria-label="t('photos', 'Remove selection from favorites')"
							@click="unFavoriteSelection">
							{{ t('photos', 'Remove from favorites') }}
							<Star slot="icon" />
						</ActionButton>
						<ActionButton :close-after-click="true"
							@click="handleRemoveFilesFromAlbum(selectedFileIds)">
							{{ n('photos', 'Remove item from album', 'Remove selection from album', selection.length) }}
							<template #icon>
								<Close />
							</template>
						</ActionButton>
					</template>
					<ActionButton :close-after-click="true"
						@click="handleDeleteAlbum">
						{{ t('photos', 'Delete album') }}
						<Delete slot="icon" />
					</ActionButton>
				</Actions>
			</div>
		</div>

		<div v-if="album !== undefined && album.nbItems === 0 && !(loadingFiles || loadingAlbums)" class="album__empty">
			<EmptyContent>
				<template #icon>
					<ImagePlus />
				</template>
				<template #desc>
					{{ t('photos', "This album doesn't have any photos or videos yet!") }}
				</template>
			</EmptyContent>

			<Button class="album__empty__button"
				type="primary"
				:aria-label="t('photos', 'Add photos to this album')"
				@click="showAddPhotosModal = true">
				<template #icon>
					<Plus />
				</template>
				{{ t('photos', "Add") }}
			</Button>
		</div>

		<FilesListViewer v-if="album !== undefined"
			class="album__photos"
			:file-ids="albumFileIds"
			:base-height="isMobile ? 120 : 200"
			:loading="loadingFiles || loadingAlbums">
			<File slot-scope="{file, visibility}"
				:file="files[file.id]"
				:allow-selection="true"
				:selected="selection[file.id] === true"
				:visibility="visibility"
				:semaphore="semaphore"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>

		<Modal v-if="showAddPhotosModal"
			size="large"
			:title="t('photos', 'Add photos to the album')"
			@close="showAddPhotosModal = false">
			<FilesPicker :destination="album.basename"
				:blacklist-ids="albumFileIds"
				:loading="loadingAddFilesToAlbum"
				@files-picked="handleFilesPicked" />
		</Modal>

		<Modal v-else-if="showShareModal"
			:title="t('photos', 'Share the album')"
			@close="showShareModal = false">
			<ShareAlbumForm @albumShared="showShareModal = false" />
		</Modal>

		<Modal v-if="showEditAlbumForm"
			:title="t('photos', 'Edit album details')"
			@close="showEditAlbumForm = false">
			<AlbumForm :album="album" @done="redirectToNewName" />
		</Modal>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MapMarker from 'vue-material-design-icons/MapMarker'
// import ShareVariant from 'vue-material-design-icons/ShareVariant'
import Plus from 'vue-material-design-icons/Plus'
import Pencil from 'vue-material-design-icons/Pencil'
import Delete from 'vue-material-design-icons/Delete'
import ImagePlus from 'vue-material-design-icons/ImagePlus'
import AlertCircle from 'vue-material-design-icons/AlertCircle'
import Star from 'vue-material-design-icons/Star'
import Close from 'vue-material-design-icons/Close'
import Download from 'vue-material-design-icons/Download'
import DownloadMultiple from 'vue-material-design-icons/DownloadMultiple'

import { Actions, ActionButton, Button, Modal, EmptyContent, isMobile } from '@nextcloud/vue'
import { getCurrentUser } from '@nextcloud/auth'

import FetchAlbumsMixin from '../mixins/FetchAlbumsMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesListViewer from '../components/FilesListViewer.vue'
import File from '../components/File.vue'
import Loader from '../components/Loader.vue'
import FilesPicker from '../components/FilesPicker.vue'
import ShareAlbumForm from '../components/ShareAlbumForm.vue'
import AlbumForm from '../components/AlbumForm.vue'
import FolderIllustration from '../assets/Illustrations/folder.svg'
import logger from '../services/logger.js'
import client from '../services/DavClient.js'
import DavRequest from '../services/DavRequest.js'
import { genFileInfo } from '../utils/fileUtils.js'
import AbortControllerMixin from '../mixins/AbortControllerMixin'

export default {
	name: 'AlbumContent',
	components: {
		MapMarker,
		// ShareVariant,
		Plus,
		Pencil,
		Star,
		Close,
		Download,
		DownloadMultiple,
		Delete,
		ImagePlus,
		AlertCircle,
		FilesListViewer,
		File,
		AlbumForm,
		EmptyContent,
		Loader,
		Actions,
		ActionButton,
		Button,
		Modal,
		FilesPicker,
		ShareAlbumForm,
	},

	mixins: [
		FetchAlbumsMixin,
		FetchFilesMixin,
		FilesSelectionMixin,
		AbortControllerMixin,
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
			showShareModal: false,
			showEditAlbumForm: false,
			FolderIllustration,
			loadingCount: 0,
			loadingAddFilesToAlbum: false,
		}
	},

	computed: {
		...mapGetters([
			'files',
			'albumsFiles',
		]),

		/**
		 * @return {string[]} The album information for the current albumName.
		 */
		album() {
			return this.albums[this.albumName]
		},

		/**
		 * @return {string[]} The list of files for the current albumName.
		 */
		albumFileIds() {
			return this.albumsFiles[this.albumName] || []
		},

		/** @type {boolean} */
		shouldFavoriteSelection() {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].favorite === 0)
		},
	},

	watch: {
		album() {
			this.fetchAlbumContent()
		},
	},

	methods: {
		...mapActions([
			'appendFiles',
			'deleteAlbum',
			'addFilesToAlbum',
			'removeFilesFromAlbum',
			'toggleFavoriteForFiles',
			'downloadFiles',
		]),

		async fetchAlbumContent() {
			if (this.loadingFiles || this.showEditAlbumForm) {
				return []
			}

			const semaphoreSymbol = await this.semaphore.acquire(() => 0, 'fetchFiles')
			const fetchSemaphoreSymbol = await this.fetchSemaphore.acquire()

			try {
				this.errorFetchingFiles = null
				this.loadingFiles = true
				this.semaphoreSymbol = semaphoreSymbol

				const response = await client.getDirectoryContents(
					`/photos/${getCurrentUser()?.uid}/albums/${this.albumName}`,
					{
						data: DavRequest,
						details: true,
						signal: this.abortController.signal,
					}
				)

				const fetchedFiles = response.data
					.map(file => genFileInfo(file))
					.map(file => ({ ...file, filename: file.realpath.replace(`/${getCurrentUser().uid}/files`, '') }))

				const fileIds = fetchedFiles
					.map(file => file.fileid)
					.map((fileId) => fileId.toString())

				this.appendFiles(fetchedFiles)

				if (fetchedFiles.length > 0) {
					await this.$store.commit('addFilesToAlbum', { albumName: this.albumName, fileIdsToAdd: fileIds })
				}

				logger.debug(`[AlbumContent] Fetched ${fileIds.length} new files: `, fileIds)
			} catch (error) {
				if (error.response?.status === 404) {
					this.errorFetchingFiles = 404
				} else if (error.code === 'ERR_CANCELED') {
					return
				} else {
					this.errorFetchingFiles = error
				}

				// cancelled request, moving on...
				logger.error('Error fetching album files', error)
			} finally {
				this.loadingFiles = false
				this.semaphore.release(semaphoreSymbol)
				this.fetchSemaphore.release(fetchSemaphoreSymbol)
			}

			return []
		},

		openViewer(fileId) {
			const file = this.files[fileId]
			OCA.Viewer.open({
				path: file.filename,
				list: this.albumFileIds.map(fileId => this.files[fileId]).filter(file => !file.sectionHeader),
				loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
				canLoop: file.canLoop,
			})
		},

		redirectToNewName({ album }) {
			this.showEditAlbumForm = false

			if (this.album.basename !== album.basename) {
				this.$router.push(`/albums/${album.basename}`)
			}
		},

		async handleFilesPicked(fileIds) {
			try {
				this.loadingAddFilesToAlbum = true
				await this.addFilesToAlbum({ albumName: this.albumName, fileIdsToAdd: fileIds })
				this.showAddPhotosModal = false
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingAddFilesToAlbum = false
			}
		},

		async handleRemoveFilesFromAlbum(fileIds) {
			try {
				this.loadingCount++
				await this.removeFilesFromAlbum({ albumName: this.albumName, fileIdsToRemove: fileIds })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async handleDeleteAlbum() {
			try {
				this.loadingCount++
				await this.deleteAlbum({ albumName: this.albumName })
				this.$router.push('/albums')
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async favoriteSelection() {
			try {
				this.loadingCount++
				await this.toggleFavoriteForFiles({ fileIds: this.selectedFileIds, favoriteState: true })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async unFavoriteSelection() {
			try {
				this.loadingCount++
				await this.toggleFavoriteForFiles({ fileIds: this.selectedFileIds, favoriteState: false })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async downloadAllFiles() {
			try {
				this.loadingCount++
				await this.downloadFiles(this.albumFileIds)
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async downloadSelection() {
			try {
				this.loadingCount++
				await this.downloadFiles(this.selectedFileIds)
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.album {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__empty {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__button {
			margin-top: 32px;
		}

	}

	&__location {
		margin-left: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}

	&__name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__header {
		display: flex;
		height: 60px;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: var(--header-height);
		z-index: 3;
		background: var(--color-main-background);
		padding: 8px 64px 32px 64px;
		box-sizing: content-box;

		@media only screen and (max-width: 1200px) {
			padding: 8px 48px 32px 48px;
		}

		&__left {
			height: 100%;
			display: flex;
			align-items: center;
			min-width: 0;
		}

		&__title {
			min-width: 0;
		}

		&__loader {
			margin-left: 32px;
		}

		&__actions {
			display: flex;
			align-items: center;

			button {
				margin-left: 16px;
			}
		}
	}

	&__photos {
		height: calc(100% - 60px);
		min-height: 0; // Prevent it from overflowing in a flex context.
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}
	}
}

.empty-content-with-illustration ::v-deep .empty-content__icon {
	width: 200px;
	height: 200px;

	svg {
		width: 200px;
		height: 200px;
	}
}
</style>
