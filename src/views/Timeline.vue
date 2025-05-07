<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers -->
	<div v-if="errorFetchingFiles" class="timeline__empty-content">
		<NcEmptyContent v-if="errorFetchingFiles === 404" :name="t('photos', 'One of the source folders does not exist')">
			<FolderAlertOutline slot="icon" />
			<PhotosSourceLocationsSettings slot="action" class="timeline__update_source_directory" />
		</NcEmptyContent>
		<NcEmptyContent v-else :name="t('photos', 'An error occurred')">
			<AlertCircle slot="icon" />
		</NcEmptyContent>
	</div>

	<div v-else class="timeline">
		<!-- Header -->
		<HeaderNavigation key="navigation"
			:loading="loadingCount > 0"
			:path="'/'"
			:title="rootTitle"
			:root-title="rootTitle"
			@refresh="resetFetchFilesState">
			<div class="timeline__header__left">
				<!-- TODO: UploadPicker -->
				<NcButton v-if="selectedFileIds.length === 0"
					ref="newAlbumButton"
					:aria-label="createAlbumButtonLabel"
					@click="showAlbumCreationForm = true">
					{{ createAlbumButtonLabel }}
					<template #icon>
						<PlusBoxMultiple />
					</template>
				</NcButton>

				<template v-else>
					<NcButton :close-after-click="true"
						type="primary"
						:aria-label="t('photos', 'Add to album')"
						@click="showAlbumPicker = true">
						<template #icon>
							<Plus />
						</template>
						<template v-if="!isMobile" #default>
							{{ t('photos', 'Add to album') }}
						</template>
					</NcButton>

					<NcButton v-if="selectedFileIds.length > 0"
						:aria-label="t('photos', 'Unselect all')"
						@click="resetSelection">
						<template #icon>
							<Close />
						</template>
						<template v-if="!isMobile" #default>
							{{ t('photos', 'Unselect all') }}
						</template>
					</NcButton>

					<NcActions :aria-label="t('photos', 'Open actions menu')">
						<ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
							<Download slot="icon" />
						</ActionDownload>

						<ActionFavorite :selected-file-ids="selectedFileIds" />

						<NcActionButton :close-after-click="true"
							:aria-label="t('photos', 'Delete selection')"
							@click="deleteSelection">
							{{ t('photos', 'Delete selection') }}
							<template #icon>
								<Delete />
							</template>
						</NcActionButton>
					</NcActions>
				</template>

				<NcButton :title="t('photos', 'Toggle filter')"
					:aria-label="t('photos', 'Toggle filter')"
					data-cy-timeline-action="toggle-filters"
					type="tertiary"
					@click="toggleFilters">
					<template #icon>
						<FilterOff v-if="showFilters" />
						<FilterIcon v-else />
					</template>
				</NcButton>
			</div>
		</HeaderNavigation>

		<TimelineFilters v-if="showFilters"
			v-model="extraFilters"
			class="timeline__filters"
			@input="handleFiltersChange" />

		<FilesListViewer ref="filesListViewer"
			:container-element="appContent"
			class="timeline__file-list"
			:file-ids-by-section="fileIdsByMonth"
			:sections="monthsList"
			:loading="loadingFiles"
			:base-height="isMobile ? 120 : 200"
			:empty-message="t('photos', 'No photos or videos in here')"
			@need-content="getContent">
			<template slot-scope="{file, isHeader, distance}">
				<h2 v-if="isHeader"
					:id="`file-picker-section-header-${file.id}`"
					class="section-header">
					<b>{{ file.id | dateMonth }}</b>
					{{ file.id | dateYear }}
				</h2>
				<File v-else
					:file="files[file.id]"
					:allow-selection="true"
					:selected="selection[file.id] === true"
					:distance="distance"
					@click="openViewer"
					@select-toggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>

		<NcModal v-if="showAlbumCreationForm"
			key="albumCreationForm"
			label-id="new-album-form"
			:set-return-focus="$refs.newAlbumButton?.$el"
			@close="showAlbumCreationForm = false">
			<h2 class="timeline__heading">
				{{ t('photos', 'New album') }}
			</h2>
			<AlbumForm :filters="extraFilters" @done="showAlbumCreationForm = false" />
		</NcModal>

		<NcModal v-if="showAlbumPicker"
			key="albumPicker"
			:label-id="t('photos', 'album-picker')"
			@close="showAlbumPicker = false">
			<AlbumPicker @album-picked="addSelectionToAlbum" />
		</NcModal>
	</div>
</template>

<script lang='ts'>
import FolderAlertOutline from 'vue-material-design-icons/FolderAlertOutline.vue'
import Filter from 'vue-material-design-icons/Filter.vue'
import FilterOff from 'vue-material-design-icons/FilterOff.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import PlusBoxMultiple from 'vue-material-design-icons/PlusBoxMultiple.vue'
import Download from 'vue-material-design-icons/Download.vue'
import Close from 'vue-material-design-icons/Close.vue'
import AlertCircle from 'vue-material-design-icons/AlertCircle.vue'

import { NcModal, NcActions, NcActionButton, NcButton, NcEmptyContent, isMobile } from '@nextcloud/vue'
import moment from '@nextcloud/moment'
import { translate } from '@nextcloud/l10n'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'

import { allMimes } from '../services/AllowedMimes.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesListViewer from '../components/FilesListViewer.vue'
import File from '../components/File.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import AlbumPicker from '../components/Albums/AlbumPicker.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
import ActionDownload from '../components/Actions/ActionDownload.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotosSourceLocationsSettings from '../components/Settings/PhotosSourceLocationsSettings.vue'
import TimelineFilters from '../components/TimelineFilters/TimelineFilters.vue'
import { configChangedEvent } from '../store/userConfig.js'
import type { Album } from '../store/albums.js'
import { toViewerFileInfo } from '../utils/fileUtils.js'
import timelineFilters from '../services/TimelineFilters'

export default {
	name: 'Timeline',
	components: {
		Delete,
		PlusBoxMultiple,
		Download,
		Close,
		Plus,
		FolderAlertOutline,
		NcEmptyContent,
		NcModal,
		NcActions,
		NcActionButton,
		NcButton,
		AlbumForm,
		AlbumPicker,
		FilesListViewer,
		File,
		ActionFavorite,
		ActionDownload,
		HeaderNavigation,
		PhotosSourceLocationsSettings,
		AlertCircle,
		TimelineFilters,
		FilterIcon: Filter,
		FilterOff,
	},

	filters: {
		dateMonth(date: string): string {
			return moment(date, 'YYYYMM').format('MMMM')
		},
		dateYear(date: string): string {
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
		rootTitle: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			loadingCount: 0,
			showAlbumCreationForm: false,
			showAlbumPicker: false,
			appContent: document.getElementById('app-content-vue'),
			showFilters: false,
			extraFilters: {} as Record<string, unknown>,
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		createAlbumButtonLabel() {
			if (Object.keys(this.extraFilters).length > 0) {
				return this.t('photos', 'Create album from filters')
			} else {
				return this.t('photos', 'Create album')
			}
		},
	},

	watch: {
		'$route.path'() {
			this.extraFilters = {}
		},
	},

	mounted() {
		subscribe(configChangedEvent, this.handleUserConfigChange)
	},

	destroyed() {
		unsubscribe(configChangedEvent, this.handleUserConfigChange)
	},

	methods: {
		getContent() {
			this.fetchFiles({
				mimesType: this.mimesType,
				onThisDay: this.onThisDay,
				onlyFavorites: this.onlyFavorites,
				extraFilters: Object.entries(this.extraFilters)
					.map(([key, value]) => timelineFilters.find(filter => filter.id === key)?.getQuery(value))
					.join('\n'),
			})
		},

		openViewer(fileId: string) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: Object.values(this.fileIdsByMonth).flat().map(fileId => toViewerFileInfo(this.files[fileId])),
			})
		},

		openUploader() {
			// TODO: finish when implementing upload
		},

		async addSelectionToAlbum(album: Album) {
			this.showAlbumPicker = false
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: album.root + album.path, fileIdsToAdd: this.selectedFileIds })
		},

		async deleteSelection() {
			// Need to store the file ids so it is not changed before the deleteFiles call.
			const fileIds = this.selectedFileIds
			this.onUncheckFiles(fileIds)
			this.fetchedFileIds = this.fetchedFileIds.filter(fileid => !fileIds.includes(fileid))
			await this.$store.dispatch('deleteFiles', fileIds)
		},

		handleUserConfigChange({ key }) {
			if (key === 'photosSourceFolders') {
				this.resetFetchFilesState()
			}
		},

		toggleFilters() {
			this.showFilters = !this.showFilters
			if (!this.showFilters) {
				this.extraFilters = {}
				this.resetFetchFilesState()
			}
		},

		handleFiltersChange() {
			this.resetFetchFilesState()
			this.getContent()
		},

		t: translate,
	},
}
</script>
<style lang="scss" scoped>
.timeline {
	display: flex;
	flex-direction: column;

	&__empty-content {
		height: 100%;

		.empty-content {
			height: 100%;
		}

		.timeline__update_source_directory {
			align-items: center;

			:deep(.folder) {
				min-width: unset;
			}
		}
	}

	&__header {
		&__left {
			display: flex;
			gap: 4px;
		}
	}

	&__filters {
		padding: 16px 64px;
	}

	&__heading {
		padding: calc(var(--default-grid-baseline) * 4);
		margin-bottom: 0px;
		padding-bottom: 0px;
	}

	&__file-list {
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}

		:deep(.files-list-viewer__section-header) {
			top: var(--photos-navigation-height);
		}
	}
}
</style>
