<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers -->
	<div v-if="errorFetchingFiles" class="timeline__empty-content">
		<NcEmptyContent
			v-if="errorFetchingFiles === 404"
			:name="t('photos', 'One of the source folders does not exist')">
			<FolderAlertOutline slot="icon" />
			<PhotosSourceLocationsSettings
				slot="action"
				class="timeline__update_source_directory" />
		</NcEmptyContent>
		<NcEmptyContent v-else :name="t('photos', 'An error occurred')">
			<AlertCircleOutline slot="icon" />
		</NcEmptyContent>
	</div>

	<div v-else class="timeline">
		<!-- Header -->
		<HeaderNavigation
			key="navigation"
			:loading="loadingCount > 0"
			path="/"
			:title="rootTitle"
			:root-title="rootTitle"
			@refresh="resetFetchFilesState">
			<div class="timeline__header__left">
				<!-- TODO: UploadPicker -->
				<NcActions
					v-if="selectedFileIds.length === 0"
					:aria-label="t('photos', 'Change tile density')"
					:menu-name="t('photos', 'Density')"
					data-cy-header-action="density">
					<template #icon>
						<ViewGridOutline :size="20" />
					</template>
					<NcActionRadio
						name="photos-density"
						value="small"
						:model-value="gridDensity"
						@update:model-value="setGridDensity">
						{{ t('photos', 'Small tiles') }}
					</NcActionRadio>
					<NcActionRadio
						name="photos-density"
						value="medium"
						:model-value="gridDensity"
						@update:model-value="setGridDensity">
						{{ t('photos', 'Default') }}
					</NcActionRadio>
					<NcActionRadio
						name="photos-density"
						value="large"
						:model-value="gridDensity"
						@update:model-value="setGridDensity">
						{{ t('photos', 'Large tiles') }}
					</NcActionRadio>
				</NcActions>

				<NcButton
					v-if="selectedFileIds.length === 0 && fetchedFileIds.length > 0"
					:aria-label="t('photos', 'Start slideshow')"
					data-cy-header-action="slideshow"
					@click="showSlideshow = true">
					<template #icon>
						<Play :size="20" />
					</template>
					<template v-if="!isMobile" #default>
						{{ t('photos', 'Slideshow') }}
					</template>
				</NcButton>

				<NcButton
					v-if="selectedFileIds.length === 0"
					ref="newAlbumButton"
					:aria-label="createAlbumButtonLabel"
					data-cy-header-action="create-album"
					@click="showAlbumCreationForm = true">
					{{ createAlbumButtonLabel }}
					<template #icon>
						<PlusBoxMultipleOutline />
					</template>
				</NcButton>

				<template v-else>
					<NcButton
						:close-after-click="true"
						variant="primary"
						:aria-label="t('photos', 'Add to album')"
						data-cy-header-action="add-to-album"
						@click="showAlbumPicker = true">
						<template #icon>
							<Plus />
						</template>
						<template v-if="!isMobile" #default>
							{{ t('photos', 'Add to album') }}
						</template>
					</NcButton>

					<NcButton
						v-if="selectedFileIds.length > 0"
						:aria-label="t('photos', 'Unselect all')"
						data-cy-header-action="unselect-all"
						@click="resetSelection">
						<template #icon>
							<Close />
						</template>
						<template v-if="!isMobile" #default>
							{{ t('photos', 'Unselect all') }}
						</template>
					</NcButton>

					<NcActions :aria-label="t('photos', 'Open actions menu')">
						<NcActionButton
							data-cy-header-action="download-selection"
							:close-after-click="true"
							:aria-label="t('photos', 'Download selected files')"
							@click="downloadSelectedFiles">
							{{ t('photos', 'Download selected files') }}

							<template #icon>
								<DownloadOutline />
							</template>
						</NcActionButton>

						<ActionFavorite :selected-file-ids="selectedFileIds" />

						<NcActionButton
							:close-after-click="true"
							:aria-label="t('photos', 'Delete selection')"
							data-cy-header-action="delete-selection"
							@click="deleteSelection">
							{{ t('photos', 'Delete selection') }}
							<template #icon>
								<DeleteOutline />
							</template>
						</NcActionButton>
					</NcActions>
				</template>
			</div>
		</HeaderNavigation>

		<FilesListViewer
			ref="filesListViewer"
			:container-element="appContent"
			class="timeline__file-list"
			:file-ids-by-section="fileIdsByMonth"
			:sections="monthsList"
			:loading="loadingFiles"
			:base-height="tileBaseHeight"
			:empty-message="t('photos', 'No photos or videos in here')"
			:scroll-to-section="scrubberTarget"
			@need-content="getContent">
			<template slot-scope="{ file, isHeader }">
				<h2
					v-if="isHeader"
					:id="`file-picker-section-header-${file.id}`"
					class="section-header">
					<b>{{ file.id | dateMonth }}</b>
					{{ file.id | dateYear }}
				</h2>
				<FileComponent
					v-else
					:file="files[file.id]"
					:allow-selection="true"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@select-toggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>

		<!-- Drag-to-jump date navigation, hidden when there is only one
			month - there is nothing to scrub then. -->
		<DateScrubber
			:months="monthsList"
			:month-counts="monthCounts"
			:current-month="scrubberTarget || monthsList[0]"
			@jump="onScrubberJump" />

		<NcModal
			v-if="showAlbumCreationForm"
			key="albumCreationForm"
			label-id="new-album-form"
			:set-return-focus="$refs.newAlbumButton?.$el"
			@close="showAlbumCreationForm = false">
			<h2 class="timeline__heading">
				{{ t('photos', 'New album') }}
			</h2>
			<AlbumForm :filters-value="selectedFilters" @done="handleFormCreationDone" />
		</NcModal>

		<NcModal
			v-if="showAlbumPicker"
			key="albumPicker"
			label-id="album-picker"
			@close="showAlbumPicker = false">
			<AlbumPicker @album-picked="addSelectionToAlbum" />
		</NcModal>

		<PhotoSlideshow
			v-if="showSlideshow"
			:photos="timelinePhotos"
			@close="showSlideshow = false" />
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { Album } from '../store/albums.ts'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { storeToRefs } from 'pinia'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActionRadio from '@nextcloud/vue/components/NcActionRadio'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcModal from '@nextcloud/vue/components/NcModal'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import Close from 'vue-material-design-icons/Close.vue'
import FolderAlertOutline from 'vue-material-design-icons/FolderAlertOutline.vue'
import Play from 'vue-material-design-icons/Play.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import PlusBoxMultipleOutline from 'vue-material-design-icons/PlusBoxMultipleOutline.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import DownloadOutline from 'vue-material-design-icons/TrayArrowDown.vue'
import ViewGridOutline from 'vue-material-design-icons/ViewGridOutline.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import AlbumPicker from '../components/Albums/AlbumPicker.vue'
import DateScrubber from '../components/DateScrubber.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotoSlideshow from '../components/PhotoSlideshow.vue'
import PhotosSourceLocationsSettings from '../components/Settings/PhotosSourceLocationsSettings.vue'
import { useGridDensity } from '../composables/useGridDensity.ts'
import FetchFilesMixin from '../mixins/FetchFilesMixin.ts'
import FilesByMonthMixin from '../mixins/FilesByMonthMixin.ts'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.ts'
import { allMimes } from '../services/AllowedMimes.ts'
import { downloadFiles } from '../services/downloadFiles.ts'
import useFilterStore from '../store/filters.ts'
import { configChangedEvent } from '../store/userConfig.ts'
import { toViewerFileInfo } from '../utils/fileUtils.ts'

export default {
	name: 'TimelineView',
	components: {
		DeleteOutline,
		PlusBoxMultipleOutline,
		DownloadOutline,
		Close,
		Play,
		Plus,
		FolderAlertOutline,
		NcEmptyContent,
		NcModal,
		NcActions,
		NcActionButton,
		NcActionRadio,
		NcButton,
		AlbumForm,
		AlbumPicker,
		DateScrubber,
		FilesListViewer,
		FileComponent,
		ActionFavorite,
		HeaderNavigation,
		PhotosSourceLocationsSettings,
		AlertCircleOutline,
		PhotoSlideshow,
		ViewGridOutline,
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
	],

	beforeRouteLeave(to, from, next) {
		this.appContent?.scrollTo(0, 0)
		next()
		Object.keys(this.selectedFilters).forEach((key) => {
			this.selectedFilters[key] = []
		})
	},

	props: {
		onlyFavorites: {
			type: Boolean,
			default: false,
		},

		mimesType: {
			type: Array as PropType<string[]>,
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

	setup() {
		const isMobile = useIsMobile()

		const filtersStore = useFilterStore()
		const { selectedFilters, filtersQuery } = storeToRefs(filtersStore)

		const { gridDensity, tileBaseHeight, setGridDensity } = useGridDensity()

		return {
			isMobile,
			selectedFilters,
			filtersQuery,
			gridDensity,
			tileBaseHeight,
			setGridDensity,
		}
	},

	data() {
		return {
			loadingCount: 0,
			showAlbumCreationForm: false,
			showAlbumPicker: false,
			appContent: document.getElementById('app-content-vue'),
			showFilters: false,
			showSlideshow: false,
			// Month section the user picked in the DateScrubber, forwarded to
			// FilesListViewer's `scrollToSection`. Empty means no override.
			scrubberTarget: '',
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		// Photos of the timeline that are loaded, in the order they are shown.
		timelinePhotos() {
			return this.fetchedFileIds
				.map((fileId: number) => this.files[fileId])
				.filter((file) => file !== undefined)
		},

		// Photo count per month, drives the density ticks of the scrubber.
		monthCounts(): Record<string, number> {
			const entries = Object.entries(this.fileIdsByMonth as Record<string, string[]>)
			return Object.fromEntries(entries.map(([month, fileIds]) => [month, fileIds.length]))
		},

		createAlbumButtonLabel() {
			if (Object.keys(this.selectedFilters).length > 0) {
				return this.t('photos', 'Create new album from filters')
			} else {
				return this.t('photos', 'Create new album')
			}
		},
	},

	watch: {
		filtersQuery() {
			this.resetFetchFilesState()
			this.getContent()
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
				extraFilters: this.filtersQuery,
			})
		},

		// FilesListViewer scrolls on its `scrollToSection` prop, so stashing
		// the month is all there is to do.
		onScrubberJump(month: string) {
			this.scrubberTarget = month
		},

		openViewer(fileId: string) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: Object.values(this.fileIdsByMonth).flat().map((fileId) => toViewerFileInfo(this.files[fileId])),
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
			this.fetchedFileIds = this.fetchedFileIds.filter((fileid) => !fileIds.includes(fileid))
			await this.$store.dispatch('deleteFiles', fileIds)
		},

		handleUserConfigChange({ key }) {
			if (key === 'photosSourceFolders') {
				this.resetFetchFilesState()
			}
		},

		handleFormCreationDone({ album }: { album: Album }) {
			this.showAlbumCreationForm = false
			this.$router.push(`/albums/${album.basename}`)
		},

		downloadSelectedFiles() {
			const fileIds = this.selectedFileIds
			this.onUncheckFiles(fileIds)
			downloadFiles(fileIds.map((fileId) => this.files[fileId]))
		},

		t,
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
