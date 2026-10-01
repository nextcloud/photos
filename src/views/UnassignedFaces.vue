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
					<NcActionButton @click="$router.push('/faces/')">
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

<script lang='ts'>
import { n, t } from '@nextcloud/l10n'
import { nextTick } from 'vue'
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
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import { downloadFiles } from '../services/downloadFiles.ts'
import { logger } from '../services/logger.ts'
import { useFacesStore } from '../store/faces.ts'
import { useFilesStore } from '../store/files.ts'
import { toViewerFileInfo } from '../utils/fileUtils.js'

export default {
	name: 'UnassignedFaces',
	components: {
		Star,
		StarOutline,
		DownloadOutline,
		AlertCircleOutline,
		ArrowLeft,
		FaceMergeForm,
		FilesListViewer,
		FileComponent,
		NcLoadingIcon,
		NcEmptyContent,
		NcActions,
		NcActionButton,
		NcDialog,
		AccountSwitchOutline,
	},

	directives: {
		focus(el) {
			nextTick(() => el.focus())
		},
	},

	mixins: [
		FetchFacesMixin,
		FetchFilesMixin,
		FilesSelectionMixin,
	],

	setup() {
		return { facesStore: useFacesStore(), filesStore: useFilesStore() }
	},

	data() {
		return {
			showMoveModal: false,
			loadingCount: 0,
			appContent: document.getElementById('app-content-vue'),
		}
	},

	computed: {
		files() {
			return this.filesStore.files
		},

		unassignedFiles() {
			return this.facesStore.unassignedFiles
		},

		faceFileIds(): string[] {
			return this.unassignedFiles || []
		},

		shouldFavoriteSelection(): boolean {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selectedFileIds.some((fileId) => this.filesStore.files[fileId].attributes.favorite === 0)
		},
	},

	mounted() {
		this.fetchUnassignedFaces()
	},

	methods: {
		// The photo is already gone from the store, it only has to leave the
		// list of the unassigned faces.
		onPhotoDeleted(photo) {
			this.onUncheckFiles([photo.fileid.toString()])
			this.facesStore.removeUnassignedFiles([photo.fileid.toString()])
		},

		openViewer(fileId) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: this.faceFileIds.map((fileId) => toViewerFileInfo(this.files[fileId])),
			})
		},

		async handleMove(faceName, fileIds) {
			try {
				this.loadingCount++
				await this.facesStore.moveFilesToFace(faceName, fileIds)
				this.showMoveModal = false
			} catch (error) {
				logger.error('Failed to move selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		async favoriteSelection() {
			try {
				this.loadingCount++
				await this.filesStore.toggleFavoriteForFiles(this.selectedFileIds, 1)
			} catch (error) {
				logger.error('Failed to favorite selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		async unFavoriteSelection() {
			try {
				this.loadingCount++
				await this.filesStore.toggleFavoriteForFiles(this.selectedFileIds, 0)
			} catch (error) {
				logger.error('Failed to unfavorite selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		async downloadSelection() {
			try {
				this.loadingCount++
				await downloadFiles(this.selectedFileIds.map((fileId) => this.files[fileId]))
			} catch (error) {
				logger.error('Faile to download selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		t,
		n,
	},
}
</script>

<style lang="scss" scoped>
@use '../mixins/FaceContent.scss';
</style>
