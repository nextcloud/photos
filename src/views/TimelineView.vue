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
			<template #icon>
				<FolderAlertOutline />
			</template>
			<template #action>
				<PhotosSourceLocationsSettings
					class="timeline__update_source_directory" />
			</template>
		</NcEmptyContent>
		<NcEmptyContent v-else :name="t('photos', 'An error occurred')">
			<template #icon>
				<AlertCircleOutline />
			</template>
		</NcEmptyContent>
	</div>

	<div v-else class="timeline">
		<!-- Header -->
		<HeaderNavigation
			key="navigation"
			:loading="loadingCount > 0"
			path="/"
			:title="rootTitle"
			:rootTitle="rootTitle"
			@refresh="resetFetchFilesState">
			<div class="timeline__header__left">
				<!-- TODO: UploadPicker -->
				<NcActions
					v-if="selectedFileIds.length === 0"
					:aria-label="t('photos', 'Change tile density')"
					:menuName="t('photos', 'Density')"
					data-cy-header-action="density">
					<template #icon>
						<ViewGridIcon :size="20" />
					</template>
					<!-- NcActionRadio is a radio group: modelValue is the active
						selection (string), and the radio whose `value` matches
						modelValue renders checked. We pass the same modelValue
						to all three so they form one group. -->
					<NcActionRadio
						name="photos-density"
						value="small"
						:modelValue="gridDensity"
						@update:modelValue="setDensity">
						{{ t('photos', 'Small tiles') }}
					</NcActionRadio>
					<NcActionRadio
						name="photos-density"
						value="medium"
						:modelValue="gridDensity"
						@update:modelValue="setDensity">
						{{ t('photos', 'Default') }}
					</NcActionRadio>
					<NcActionRadio
						name="photos-density"
						value="large"
						:modelValue="gridDensity"
						@update:modelValue="setDensity">
						{{ t('photos', 'Large tiles') }}
					</NcActionRadio>
				</NcActions>
				<NcButton
					v-if="selectedFileIds.length === 0 && fetchedFileIds.length > 0"
					:aria-label="t('photos', 'Start slideshow')"
					data-cy-header-action="slideshow"
					@click="startSlideshow">
					<template #icon>
						<PlayIcon :size="20" />
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
						:closeAfterClick="true"
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
							:closeAfterClick="true"
							:aria-label="t('photos', 'Download selected files')"
							@click="downloadSelectedFiles">
							{{ t('photos', 'Download selected files') }}

							<template #icon>
								<DownloadOutline />
							</template>
						</NcActionButton>

						<ActionFavorite :selectedFileIds="selectedFileIds" />

						<NcActionButton
							:closeAfterClick="true"
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
			:containerElement="appContent"
			class="timeline__file-list"
			:fileIdsBySection="fileIdsByMonth"
			:sections="monthsList"
			:loading="loadingFiles"
			:baseHeight="tileBaseHeight"
			:emptyMessage="t('photos', 'No photos or videos in here')"
			@needContent="getContent">
			<template #default="{ file, isHeader }">
				<h2
					v-if="isHeader"
					:id="`file-picker-section-header-${file.id}`"
					class="section-header">
					<b>{{ dateMonth(file.id) }}</b>
					{{ dateYear(file.id) }}
				</h2>
				<FileComponent
					v-else
					:file="files[file.id]"
					:allowSelection="true"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@selectToggled="onFileSelectToggle"
					@requestAddToAlbum="onRequestAddToAlbum"
					@requestShare="onRequestShare"
					@requestDelete="onRequestDelete" />
			</template>
		</FilesListViewer>

		<NcModal
			v-if="showAlbumCreationForm"
			key="albumCreationForm"
			labelId="new-album-form"
			:setReturnFocus="$refs.newAlbumButton?.$el"
			@close="showAlbumCreationForm = false">
			<h2 class="timeline__heading">
				{{ t('photos', 'New album') }}
			</h2>
			<AlbumForm :filtersValue="selectedFilters" @done="handleFormCreationDone" />
		</NcModal>

		<NcModal
			v-if="showAlbumPicker"
			key="albumPicker"
			labelId="album-picker"
			@close="showAlbumPicker = false">
			<AlbumPicker @albumPicked="addSelectionToAlbum" />
		</NcModal>

		<Slideshow
			v-if="slideshowOpen"
			:photos="slideshowPhotos"
			@close="slideshowOpen = false" />
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
import PlayIcon from 'vue-material-design-icons/Play.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import PlusBoxMultipleOutline from 'vue-material-design-icons/PlusBoxMultipleOutline.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import DownloadOutline from 'vue-material-design-icons/TrayArrowDown.vue'
import ViewGridIcon from 'vue-material-design-icons/ViewGridOutline.vue'
import ActionFavorite from '../components/Actions/ActionFavorite.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import AlbumPicker from '../components/Albums/AlbumPicker.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotosSourceLocationsSettings from '../components/Settings/PhotosSourceLocationsSettings.vue'
import Slideshow from '../components/Slideshow.vue'
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
		FilesListViewer,
		FileComponent,
		ActionFavorite,
		HeaderNavigation,
		PhotosSourceLocationsSettings,
		AlertCircleOutline,
		PlayIcon,
		Slideshow,
		ViewGridIcon,
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

		return {
			isMobile,
			selectedFilters,
			filtersQuery,
		}
	},

	data() {
		return {
			loadingCount: 0,
			showAlbumCreationForm: false,
			showAlbumPicker: false,
			appContent: document.getElementById('app-content-vue'),
			showFilters: false,
			slideshowOpen: false,
			// When set, the AlbumPicker flow targets a single photo
			// (from the per-tile actions menu) instead of the bulk
			// selection. Cleared after picking.
			singleFileForAlbumPicker: null as { fileid: number } | null,
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		createAlbumButtonLabel() {
			if (Object.keys(this.selectedFilters).length > 0) {
				return this.t('photos', 'Create new album from filters')
			} else {
				return this.t('photos', 'Create new album')
			}
		},

		gridDensity(): 'small' | 'medium' | 'large' {
			return this.$store.state.userConfig.gridDensity
		},

		// Photos to feed into the slideshow when invoked. Uses the same
		// fetched IDs that drive the timeline so order matches what the
		// user sees, and only includes files that have hydrated into the
		// store.
		slideshowPhotos() {
			return this.fetchedFileIds
				.map((id) => this.files[id])
				.filter((file) => file !== undefined)
		},

		// Tile-row target height per density. The mobile-medium fallback
		// (120px) is preserved from the original behaviour.
		tileBaseHeight(): number {
			switch (this.gridDensity) {
				case 'small': return this.isMobile ? 80 : 120
				case 'large': return this.isMobile ? 200 : 320
				case 'medium':
				default: return this.isMobile ? 120 : 200
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

	unmounted() {
		unsubscribe(configChangedEvent, this.handleUserConfigChange)
	},

	methods: {
		setDensity(value: 'small' | 'medium' | 'large') {
			this.$store.dispatch('updateUserConfig', { key: 'gridDensity', value })
		},

		startSlideshow() {
			if (this.slideshowPhotos.length > 0) {
				this.slideshowOpen = true
			}
		},

		dateMonth(date: string): string {
			return moment(date, 'YYYYMM').format('MMMM')
		},

		dateYear(date: string): string {
			return moment(date, 'YYYYMM').format('YYYY')
		},

		getContent() {
			this.fetchFiles({
				mimesType: this.mimesType,
				onThisDay: this.onThisDay,
				onlyFavorites: this.onlyFavorites,
				extraFilters: this.filtersQuery,
			})
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
			// Per-tile flow takes precedence: if a single file was queued
			// up, add only it and clear the queue. Otherwise fall back
			// to the bulk-selection ids as before.
			const fileIdsToAdd = this.singleFileForAlbumPicker !== null
				? [this.singleFileForAlbumPicker.fileid.toString()]
				: this.selectedFileIds
			this.singleFileForAlbumPicker = null
			await this.$store.dispatch('addFilesToCollection', { collectionFileName: album.root + album.path, fileIdsToAdd })
		},

		// --- per-photo actions menu wiring ---

		onRequestAddToAlbum(file: { fileid: number }) {
			this.singleFileForAlbumPicker = file
			this.showAlbumPicker = true
		},

		onRequestShare(file: { path?: string }) {
			// The Files sidebar already exposes a Sharing tab; opening
			// it on the file is the cheapest way to surface NC's full
			// share UI without re-implementing it here.
			const path = typeof file.path === 'string' ? file.path : ''
			if (window.OCA?.Files?.Sidebar?.open !== undefined && path !== '') {
				window.OCA.Files.Sidebar.open(path)
			}
		},

		async onRequestDelete(file: { fileid: number }) {
			const fileIdStr = file.fileid.toString()
			// Drop from local state first so the tile disappears
			// immediately; the dispatched deleteFiles re-adds it on
			// failure (see store/files.ts deleteFiles error path).
			this.fetchedFileIds = this.fetchedFileIds.filter((id) => id !== fileIdStr)
			await this.$store.dispatch('deleteFiles', [fileIdStr])
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
