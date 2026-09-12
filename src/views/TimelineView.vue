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
						<ViewGridOutline :size="20" />
					</template>
					<NcActionRadio
						name="photos-density"
						value="small"
						:modelValue="gridDensity"
						@update:modelValue="setGridDensity">
						{{ t('photos', 'Small tiles') }}
					</NcActionRadio>
					<NcActionRadio
						name="photos-density"
						value="medium"
						:modelValue="gridDensity"
						@update:modelValue="setGridDensity">
						{{ t('photos', 'Default') }}
					</NcActionRadio>
					<NcActionRadio
						name="photos-density"
						value="large"
						:modelValue="gridDensity"
						@update:modelValue="setGridDensity">
						{{ t('photos', 'Large tiles') }}
					</NcActionRadio>
				</NcActions>

				<NcButton
					v-if="selectedFileIds.length === 0 && fetchedFileIds.length > 0"
					:aria-label="t('photos', 'Start slideshow')"
					data-cy-header-action="slideshow"
					@click="startSlideshow">
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
					<template v-if="!isMobile" #default>
						{{ createAlbumButtonLabel }}
					</template>
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

						<NcActionButton
							v-if="shouldFavoriteSelection"
							:closeAfterClick="true"
							:aria-label="t('photos', 'Mark selection as favorite')"
							@click="favoriteSelection">
							{{ t('photos', 'Add selection to favorites') }}
							<template #icon>
								<StarOutline />
							</template>
						</NcActionButton>
						<NcActionButton
							v-else
							:closeAfterClick="true"
							:aria-label="t('photos', 'Remove selection from favorites')"
							@click="unFavoriteSelection">
							{{ t('photos', 'Remove selection from favorites') }}
							<template #icon>
								<Star />
							</template>
						</NcActionButton>

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
			:scrollToSection="scrubberTarget"
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
					:burstCount="burstCount(file.id)"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@selectToggled="onFileSelectToggle"
					@deleted="onPhotoDeleted" />
			</template>
		</FilesListViewer>

		<!-- Drag-to-jump date navigation, hidden when there is only one
			month - there is nothing to scrub then. -->
		<DateScrubber
			:months="monthsList"
			:monthCounts="monthCounts"
			:currentMonth="scrubberTarget || monthsList[0]"
			@jump="onScrubberJump" />

		<NcModal
			v-if="showAlbumCreationForm"
			key="albumCreationForm"
			labelId="new-album-form"
			:setReturnFocus="newAlbumButton?.$el"
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
	</div>
</template>

<script setup lang="ts">
import type { Collection } from '../services/collectionFetcher.ts'
import type { Album } from '../store/albums.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
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
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import DownloadOutline from 'vue-material-design-icons/TrayArrowDown.vue'
import ViewGridOutline from 'vue-material-design-icons/ViewGridOutline.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import AlbumPicker from '../components/Albums/AlbumPicker.vue'
import DateScrubber from '../components/DateScrubber.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotosSourceLocationsSettings from '../components/Settings/PhotosSourceLocationsSettings.vue'
import { useFetchFiles } from '../composables/useFetchFiles.ts'
import { useFilesByMonth } from '../composables/useFilesByMonth.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { useGridDensity } from '../composables/useGridDensity.ts'
import { allMimes } from '../services/AllowedMimes.ts'
import { downloadFiles } from '../services/downloadFiles.ts'
import { openInViewer } from '../services/viewer.ts'
import { useCollectionsStore } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import { useFilterStore } from '../store/filters.ts'
import { configChangedEvent } from '../store/userConfig.ts'

const props = withDefaults(defineProps<{
	onlyFavorites?: boolean
	mimesType?: string[]
	onThisDay?: boolean
	rootTitle: string
}>(), {
	onlyFavorites: false,
	mimesType: () => allMimes,
	onThisDay: false,
})

const router = useRouter()
const isMobile = useIsMobile()

const collectionsStore = useCollectionsStore()
const filesStore = useFilesStore()
const filtersStore = useFilterStore()
const { selectedFilters, filtersQuery } = storeToRefs(filtersStore)

const { gridDensity, tileBaseHeight, setGridDensity } = useGridDensity()
const { fetchFiles, resetFetchFilesState, fetchedFileIds, loadingFiles, errorFetchingFiles } = useFetchFiles()
const { selection, selectedFileIds, onUncheckFiles, resetSelection } = useFilesSelection()

const newAlbumButton = useTemplateRef<InstanceType<typeof NcButton>>('newAlbumButton')

const showAlbumCreationForm = ref(false)
const showAlbumPicker = ref(false)
const appContent = document.getElementById('app-content-vue')
// Month section the user picked in the DateScrubber, forwarded to
// FilesListViewer's `scrollToSection`. Empty means no override.
const scrubberTarget = ref('')

const files = computed(() => filesStore.files)

// Photos taken in one go are shown as a single tile of the timeline, and are
// reachable from the viewer it opens.
const { fileIdsByMonthUngrouped, burstStacks, fileIdsByMonth, monthsList } = useFilesByMonth(fetchedFileIds, files, true)

const shouldFavoriteSelection = computed<boolean>(() => {
	// Favorite all selection if at least one file is not in the favorites.
	return selectedFileIds.value.some((fileId) => files.value[fileId].attributes.favorite === 0)
})

// Photos of the timeline that are loaded, in the order they are shown.
const timelinePhotos = computed(() => fetchedFileIds.value
	.map((fileId) => files.value[fileId])
	.filter((file) => file !== undefined))

// Photo count per month, drives the density ticks of the scrubber. Counted
// before the folding, so a month of bursts reads as dense as it is.
const monthCounts = computed<Record<string, number>>(() => {
	const entries = Object.entries(fileIdsByMonthUngrouped.value)
	return Object.fromEntries(entries.map(([month, fileIds]) => [month, fileIds.length]))
})

const createAlbumButtonLabel = computed(() => {
	if (Object.keys(selectedFilters.value).length > 0) {
		return t('photos', 'Create new album from filters')
	} else {
		return t('photos', 'Create new album')
	}
})

watch(filtersQuery, () => {
	resetFetchFilesState()
	getContent()
})

async function favoriteSelection(): Promise<void> {
	await filesStore.toggleFavoriteForFiles(selectedFileIds.value, 1)
}

async function unFavoriteSelection(): Promise<void> {
	await filesStore.toggleFavoriteForFiles(selectedFileIds.value, 0)
}

function dateMonth(date: string): string {
	return moment(date, 'YYYYMM').format('MMMM')
}

function dateYear(date: string): string {
	return moment(date, 'YYYYMM').format('YYYY')
}

function getContent() {
	fetchFiles({
		mimesType: props.mimesType,
		onThisDay: props.onThisDay,
		onlyFavorites: props.onlyFavorites,
		extraFilters: filtersQuery.value,
	})
}

// FilesListViewer scrolls on its `scrollToSection` prop, so stashing
// the month is all there is to do.
function onScrubberJump(month: string) {
	scrubberTarget.value = month
}

// Selecting the tile of a run selects every photo of it: the photos folded
// into it have no tile of their own to be picked from, and favoriting,
// downloading or deleting a part of a burst would silently leave the rest
// behind.
function onFileSelectToggle({ id, value }: { id: number, value: boolean }): void {
	const fileIds = burstStacks.value[id]?.memberIds ?? [String(id)]
	for (const fileId of fileIds) {
		selection.value[fileId] = value
	}
}

// How many photos the tile of a photo stands for, one being itself.
function burstCount(fileId: string): number {
	return burstStacks.value[fileId]?.memberIds.length ?? 1
}

function openViewer(fileId: number) {
	// A tile standing for a run of photos hands the viewer that run alone, so
	// flipping through it stays inside the burst rather than leaving it for the
	// rest of the timeline. Every other tile hands it the whole grid.
	const fileIds = burstStacks.value[fileId]?.memberIds
		?? Object.values(fileIdsByMonth.value).flat()

	openInViewer(fileIds.map((id) => files.value[id]).filter((file) => file !== undefined), files.value[fileId])
}

function startSlideshow() {
	openInViewer(timelinePhotos.value, timelinePhotos.value[0], { startSlideshow: true })
}

async function addSelectionToAlbum(album: Album) {
	showAlbumPicker.value = false
	await collectionsStore.addFilesToCollection(album.root + album.path, selectedFileIds.value)
}

// The photo is already gone from the store, it only has to leave the
// list of the photos this timeline fetched.
function onPhotoDeleted(photo: PhotoTarget) {
	onUncheckFiles([photo.fileid.toString()])
	fetchedFileIds.value = fetchedFileIds.value.filter((fileId) => fileId !== photo.fileid)
}

async function deleteSelection() {
	// Need to store the file ids so it is not changed before the deleteFiles call.
	const fileIds = selectedFileIds.value
	onUncheckFiles(fileIds)
	fetchedFileIds.value = fetchedFileIds.value.filter((fileid) => !fileIds.includes(fileid.toString()))
	await filesStore.deleteFiles(fileIds)
}

function handleUserConfigChange({ key }: { key: string }) {
	if (key === 'photosSourceFolders') {
		resetFetchFilesState()
	}
}

function handleFormCreationDone({ album }: { album: Collection }) {
	showAlbumCreationForm.value = false
	router.push(`/albums/${album.basename}`)
}

function downloadSelectedFiles() {
	const fileIds = selectedFileIds.value
	onUncheckFiles(fileIds)
	downloadFiles(fileIds.map((fileId) => files.value[fileId]))
}

onBeforeRouteLeave(() => {
	appContent?.scrollTo(0, 0)
	Object.keys(selectedFilters.value).forEach((key) => {
		selectedFilters.value[key] = []
	})
})

onMounted(() => {
	subscribe(configChangedEvent, handleUserConfigChange)
})

onUnmounted(() => {
	unsubscribe(configChangedEvent, handleUserConfigChange)
})
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
