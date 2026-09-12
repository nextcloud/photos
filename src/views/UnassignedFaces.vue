<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="errorFetchingFiles">
		<template #icon>
			<AlertCircleOutline />
		</template>
		{{ t('photos', 'An error occurred') }}
	</NcEmptyContent>

	<div v-else class="face">
		<div class="face__header">
			<div class="face__header__left">
				<NcActions>
					<NcActionButton @click="router.push('/faces/')">
						<template #icon>
							<ArrowLeft />
						</template>{{ t('photos', 'Back') }}
					</NcActionButton>
				</NcActions>
				<div class="face__header__title">
					<h2 class="face-name">
						{{ t('photos', 'Unassigned faces') }}
					</h2>
				</div>

				<NcLoadingIcon v-if="loadingCount > 0 || loadingFaces" />
			</div>
			<div class="face__header__actions">
				<NcActions :forceMenu="true">
					<template v-if="selectedFileIds.length">
						<NcActionButton
							:closeAfterClick="true"
							:aria-label="t('photos', 'Download selected files')"
							@click="downloadSelection">
							<template #icon>
								<DownloadOutline />
							</template>
							{{ t('photos', 'Download selected photos') }}
						</NcActionButton>
						<NcActionButton
							v-if="shouldFavoriteSelection"
							:closeAfterClick="true"
							:aria-label="t('photos', 'Mark selection as favorite')"
							@click="favoriteSelection">
							<template #icon>
								<StarOutline />
							</template>
							{{ t('photos', 'Favorite') }}
						</NcActionButton>
						<NcActionButton
							v-else
							:closeAfterClick="true"
							:aria-label="t('photos', 'Remove selection from favorites')"
							@click="unFavoriteSelection">
							<template #icon>
								<Star />
							</template>
							{{ t('photos', 'Remove from favorites') }}
						</NcActionButton>
						<NcActionButton
							:closeAfterClick="true"
							@click="showMoveModal = true">
							<template #icon>
								<AccountSwitchOutline />
							</template>
							{{ n('photos', 'Move photo to a different person', 'Move photos to a different person', selectedFileIds.length) }}
						</NcActionButton>
					</template>
				</NcActions>
			</div>
		</div>

		<FilesListViewer
			class="face__photos"
			:containerElement="appContent"
			:fileIds="faceFileIds"
			:loading="loadingFiles || loadingFaces">
			<template #default="{ file }">
				<FileComponent
					:file="files[file.id]"
					:allowSelection="true"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@selectToggled="onFileSelectToggle"
					@deleted="onPhotoDeleted" />
			</template>
		</FilesListViewer>

		<NcDialog
			v-if="showMoveModal"
			:name="t('photos', 'Move to different person')"
			closeOnClickOutside
			size="normal"
			@closing="showMoveModal = false">
			<FaceMergeForm firstFace="-1" @select="handleMove($event, selectedFileIds)" />
		</NcDialog>
	</div>
</template>

<script setup lang="ts">
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { n, t } from '@nextcloud/l10n'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import AccountSwitchOutline from 'vue-material-design-icons/AccountSwitchOutline.vue'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import DownloadOutline from 'vue-material-design-icons/TrayArrowDown.vue'
import FaceMergeForm from '../components/Faces/FaceMergeForm.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import { useFetchFaces } from '../composables/useFetchFaces.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { downloadFiles } from '../services/downloadFiles.ts'
import { logger } from '../services/logger.ts'
import { openInViewer } from '../services/viewer.ts'
import { useFacesStore } from '../store/faces.ts'
import { useFilesStore } from '../store/files.ts'

const router = useRouter()
const facesStore = useFacesStore()
const filesStore = useFilesStore()
const { fetchUnassignedFaces, loadingFaces, loadingFiles, errorFetchingFiles } = useFetchFaces()
const { selection, selectedFileIds, onFileSelectToggle, onUncheckFiles } = useFilesSelection()

const showMoveModal = ref(false)
const loadingCount = ref(0)
const appContent = document.getElementById('app-content-vue')

const files = computed(() => filesStore.files)
const unassignedFiles = computed(() => facesStore.unassignedFiles)
const faceFileIds = computed<string[]>(() => unassignedFiles.value || [])

// Favorite all selection if at least one file is not on the favorites.
const shouldFavoriteSelection = computed<boolean>(() => selectedFileIds.value.some((fileId) => filesStore.files[fileId].attributes.favorite === 0))

// The photo is already gone from the store, it only has to leave the
// list of the unassigned faces.
function onPhotoDeleted(photo: PhotoTarget): void {
	onUncheckFiles([photo.fileid.toString()])
	facesStore.removeUnassignedFiles([photo.fileid.toString()])
}

function openViewer(fileId: number): void {
	openInViewer(faceFileIds.value.map((fileId) => files.value[fileId]), files.value[fileId])
}

async function handleMove(faceName: string, fileIds: string[]): Promise<void> {
	try {
		loadingCount.value++
		await facesStore.moveFilesToFace(faceName, fileIds)
		showMoveModal.value = false
	} catch (error) {
		logger.error('Failed to move selection', { error })
	} finally {
		loadingCount.value--
	}
}

async function favoriteSelection(): Promise<void> {
	try {
		loadingCount.value++
		await filesStore.toggleFavoriteForFiles(selectedFileIds.value, 1)
	} catch (error) {
		logger.error('Failed to favorite selection', { error })
	} finally {
		loadingCount.value--
	}
}

async function unFavoriteSelection(): Promise<void> {
	try {
		loadingCount.value++
		await filesStore.toggleFavoriteForFiles(selectedFileIds.value, 0)
	} catch (error) {
		logger.error('Failed to unfavorite selection', { error })
	} finally {
		loadingCount.value--
	}
}

async function downloadSelection(): Promise<void> {
	try {
		loadingCount.value++
		await downloadFiles(selectedFileIds.value.map((fileId) => files.value[fileId]))
	} catch (error) {
		logger.error('Faile to download selection', { error })
	} finally {
		loadingCount.value--
	}
}

onMounted(() => {
	fetchUnassignedFaces()
})
</script>

<style lang="scss" scoped>
@use './FaceContent.scss';
</style>
