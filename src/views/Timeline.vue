<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 - @author Corentin Mors <medias@pixelswap.fr>
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
	<!-- Errors handlers -->
	<NcEmptyContent v-if="errorFetchingFiles">
		{{ t('photos', 'An error occurred') }}
	</NcEmptyContent>

	<div v-else class="timeline">
		<div class="timeline__header">
			<NcActions v-if="selectedFileIds.length === 0"
				:force-title="true"
				:force-menu="true"
				:menu-title="t('photos', 'Add')"
				:primary="true">
				<Plus slot="icon" />
				<NcActionButton :close-after-click="true" @click="openUploader">
					{{ t('photos', 'Upload media') }}
					<FileUpload slot="icon" />
				</NcActionButton>
				<NcActionButton :close-after-click="true"
					:aria-label="t('photos', 'Create a new album')"
					@click="showAlbumCreationForm = true">
					{{ t('photos', 'Create new album') }}
					<PlusBoxMultiple slot="icon" />
				</NcActionButton>
			</NcActions>

			<template v-else>
				<NcButton :close-after-click="true"
					type="primary"
					:aria-label="t('photos', 'Add selection to an album')"
					@click="showAlbumPicker = true">
					<template #icon>
						<Plus slot="icon" />
					</template>
					{{ t('photos', 'Add to album') }}
				</NcButton>
				<NcActions>
					<NcActionButton :close-after-click="true"
						:aria-label="t('photos', 'Download selection')"
						@click="downloadSelection">
						{{ t('photos', 'Download') }}
						<Download slot="icon" />
					</NcActionButton>
					<NcActionButton v-if="shouldFavorite"
						:close-after-click="true"
						:aria-label="t('photos', 'Mark selection as favorite')"
						@click="favoriteSelection">
						{{ t('photos', 'Favorite') }}
						<Star slot="icon" />
					</NcActionButton>
					<NcActionButton v-else
						:close-after-click="true"
						:aria-label="t('photos', 'Remove selection from favorites')"
						@click="unFavoriteSelection">
						{{ t('photos', 'Remove from favorites') }}
						<Star slot="icon" />
					</NcActionButton>
					<NcActionButton :close-after-click="true"
						:aria-label="t('photos', 'Delete selection')"
						@click="deleteSelection">
						{{ t('photos', 'Delete') }}
						<Delete slot="icon" />
					</NcActionButton>
				</NcActions>
				<!-- HACK: Needed to make the above Actions work, no idea why be it is like that in the documentation. -->
				<NcActions />
			</template>

			<NcLoadingIcon v-if="loadingCount > 0" key="loader" :size="32" />
		</div>

		<FilesListViewer ref="filesListViewer"
			class="timeline__file-list"
			:file-ids-by-section="fileIdsByMonth"
			:sections="monthsList"
			:loading="loadingFiles"
			:base-height="isMobile ? 120 : 200"
			:empty-message="t('photos', 'No photos in here')"
			@need-content="getContent">
			<template slot-scope="{file, visibility}">
				<h3 v-if="file.sectionHeader"
					:id="`file-picker-section-header-${file.id}`"
					class="section-header">
					<b>{{ file.id | dateMonth }}</b>
					{{ file.id | dateYear }}
				</h3>
				<File v-else
					:file="files[file.id]"
					:allow-selection="true"
					:selected="selection[file.id] === true"
					:visibility="visibility"
					:semaphore="semaphore"
					@click="openViewer"
					@select-toggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>

		<NcModal v-if="showAlbumCreationForm"
			key="albumCreationForm"
			:close-button-contained="false"
			:title="t('photos', 'New album')"
			@close="showAlbumCreationForm = false">
			<AlbumForm @done="showAlbumCreationForm = false" />
		</NcModal>

		<NcModal v-if="showAlbumPicker"
			key="albumPicker"
			:close-button-contained="false"
			:title="t('photos', 'Add to album')"
			@close="showAlbumPicker = false">
			<AlbumPicker @album-picked="addSelectionToAlbum" />
		</NcModal>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Plus from 'vue-material-design-icons/Plus'
import Delete from 'vue-material-design-icons/Delete'
import PlusBoxMultiple from 'vue-material-design-icons/PlusBoxMultiple'
import FileUpload from 'vue-material-design-icons/FileUpload'
import Star from 'vue-material-design-icons/Star'
import Download from 'vue-material-design-icons/Download'

import { NcModal, NcActions, NcActionButton, NcButton, NcLoadingIcon, NcEmptyContent, isMobile } from '@nextcloud/vue'
import moment from '@nextcloud/moment'

import logger from '../services/logger.js'
import { allMimes } from '../services/AllowedMimes.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesListViewer from '../components/FilesListViewer.vue'
import File from '../components/File.vue'
import AlbumForm from '../components/AlbumForm.vue'
import AlbumPicker from '../components/AlbumPicker.vue'

export default {
	name: 'Timeline',
	components: {
		Delete,
		FileUpload,
		PlusBoxMultiple,
		Star,
		Download,
		NcLoadingIcon,
		NcEmptyContent,
		NcModal,
		NcActions,
		NcActionButton,
		NcButton,
		Plus,
		AlbumForm,
		AlbumPicker,
		FilesListViewer,
		File,
	},

	filters: {
		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateMonth(date) {
			return moment(date, 'YYYYMM').format('MMMM')
		},
		/**
		 * @param {string} date - In the following format: YYYYMM
		 */
		dateYear(date) {
			return moment(date, 'YYYYMM').format('YYYY')
		},
	},

	mixins: [
		FetchFilesMixin,
		FilesSelectionMixin,
		FilesByMonthMixin,
		isMobile,
	],

	beforeRouteLeave(to, from, next) {
		window.scrollTo(0, 0)
		next()
	},

	props: {
		onlyFavorites: {
			type: Boolean,
			default: false,
		},
		mimesType: {
			type: Array,
			default: () => allMimes,
		},
		onThisDay: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			loadingCount: 0,
			showAlbumCreationForm: false,
			showAlbumPicker: false,
		}
	},

	computed: {
		...mapGetters([
			'files',
		]),

		/** @type {boolean} */
		shouldFavorite() {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].favorite === 0)
		},
	},

	methods: {
		...mapActions(['deleteFiles', 'toggleFavoriteForFiles', 'downloadFiles', 'addFilesToAlbum']),

		getContent() {
			this.fetchFiles('', {
				mimesType: this.mimesType,
				onThisDay: this.onThisDay,
				onlyFavorites: this.onlyFavorites,
			})
		},

		openViewer(fileId) {
			const file = this.files[fileId]
			OCA.Viewer.open({
				path: file.filename,
				list: Object.values(this.fileIdsByMonth).flat().map(fileId => this.files[fileId]),
				loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
				canLoop: file.canLoop,
			})
		},

		openUploader() {
			// TODO: finish when implementing upload
		},

		async addSelectionToAlbum(albumName) {
			try {
				this.showAlbumPicker = false
				this.loadingCount++
				await this.addFilesToAlbum({ albumName, fileIdsToAdd: this.selectedFileIds })
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

		async deleteSelection() {
			try {
				this.loadingCount++
				// Need to store the file ids so it is not changed before the deleteFiles call.
				const fileIds = this.selectedFileIds
				this.onUncheckFiles(fileIds)
				this.fetchedFileIds = this.fetchedFileIds.filter(fileid => !fileIds.includes(fileid))
				await this.deleteFiles(fileIds)
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
.timeline {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__header {
		display: flex;
		align-items: center;
		position: sticky;
		width: 100%;
		height: 60px;
		z-index: 3;
		background: var(--color-main-background);
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 48px;
		}

		& > * {
			margin-right: 8px;
		}

		.loader {
			margin-left: 16px;
		}
	}

	&__file-list {
		padding: 0 64px;
		height: calc(100% - 60px);

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}

		::v-deep .files-list-viewer__section-header {
			top: 0;
		}

		.section-header {
			padding: 24px 0 16px 0;
		}
	}
}
</style>
