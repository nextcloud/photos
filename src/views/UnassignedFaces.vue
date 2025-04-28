<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="errorFetchingFiles">
		<template #icon>
			<AlertCircle />
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
					<h2 :class="{'face-name': true}">
						{{ t('photos', 'Unassigned faces') }}
					</h2>
				</div>

				<NcLoadingIcon v-if="loadingCount > 0 || loadingFaces" />
			</div>
			<div class="face__header__actions">
				<NcActions :force-menu="true">
					<template v-if="selectedFileIds.length">
						<NcActionButton :close-after-click="true"
							:aria-label="t('photos', 'Download selected files')"
							@click="downloadSelection">
							<Download slot="icon" />
							{{ t('photos', 'Download selected photos') }}
						</NcActionButton>
						<NcActionButton v-if="shouldFavoriteSelection"
							:close-after-click="true"
							:aria-label="t('photos', 'Mark selection as favorite')"
							@click="favoriteSelection">
							<Star slot="icon" />
							{{ t('photos', 'Favorite') }}
						</NcActionButton>
						<NcActionButton v-else
							:close-after-click="true"
							:aria-label="t('photos', 'Remove selection from favorites')"
							@click="unFavoriteSelection">
							<Star slot="icon" />
							{{ t('photos', 'Remove from favorites') }}
						</NcActionButton>
						<NcActionButton :close-after-click="true"
							@click="showMoveModal = true">
							<template #icon>
								<AccountSwitch />
							</template>
							{{ n('photos', 'Move photo to a different person', 'Move photos to a different person', selectedFileIds.length) }}
						</NcActionButton>
					</template>
				</NcActions>
			</div>
		</div>

		<FilesListViewer class="face__photos"
			:container-element="appContent"
			:file-ids="faceFileIds"
			:loading="loadingFiles || loadingFaces">
			<File slot-scope="{file, distance}"
				:file="files[file.id]"
				:allow-selection="true"
				:selected="selection[file.id] === true"
				:distance="distance"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>

		<NcDialog v-if="showMoveModal"
			:name="t('photos', 'Move to different person')"
			close-on-click-outside
			size="normal"
			@closing="showMoveModal = false">
			<FaceMergeForm :first-face="'-1'" @select="handleMove($event, selectedFileIds)" />
		</NcDialog>
	</div>
</template>

<script lang='ts'>
import AlertCircle from 'vue-material-design-icons/AlertCircle.vue'
import Star from 'vue-material-design-icons/Star.vue'
import Download from 'vue-material-design-icons/Download.vue'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import AccountSwitch from 'vue-material-design-icons/AccountSwitch.vue'

import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcDialog from '@nextcloud/vue/dist/Components/NcDialog.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon.js'
import { translate as t } from '@nextcloud/l10n'

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesListViewer from '../components/FilesListViewer.vue'
import File from '../components/File.vue'
import logger from '../services/logger.js'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import Vue from 'vue'
import FaceMergeForm from '../components/Faces/FaceMergeForm.vue'
import { toViewerFileInfo } from '../utils/fileUtils.js'

export default {
	name: 'UnassignedFaces',
	components: {
		Star,
		Download,
		AlertCircle,
		ArrowLeft,
		FaceMergeForm,
		FilesListViewer,
		File,
		NcLoadingIcon,
		NcEmptyContent,
		NcActions,
		NcActionButton,
		NcDialog,
		AccountSwitch,
	},

	directives: {
		focus(el) {
			Vue.nextTick(() => el.focus())
		},
	},

	mixins: [
		FetchFacesMixin,
		FetchFilesMixin,
		FilesSelectionMixin,
	],

	data() {
		return {
			showMoveModal: false,
			loadingCount: 0,
			appContent: document.getElementById('app-content-vue'),
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		unassignedFiles() {
			return this.$store.state.faces.unassignedFiles
		},

		faceFileIds(): string[] {
			return this.unassignedFiles || []
		},

		shouldFavoriteSelection(): boolean {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].attributes.favorite === 0)
		},
	},

	mounted() {
		this.fetchUnassignedFaces()
	},

	methods: {
		openViewer(fileId) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: this.faceFileIds.map(fileId => toViewerFileInfo(this.files[fileId])),
			})
		},

		async handleMove(faceName, fileIds) {
			try {
				this.loadingCount++
				await this.$store.dispatch('moveFilesToFace', { oldFace: null, faceName, fileIdsToMove: fileIds })
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
				await this.$store.dispatch('toggleFavoriteForFiles', { fileIds: this.selectedFileIds, favoriteState: true })
			} catch (error) {
				logger.error('Failed to favorite selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		async unFavoriteSelection() {
			try {
				this.loadingCount++
				await this.$store.dispatch('toggleFavoriteForFiles', { fileIds: this.selectedFileIds, favoriteState: false })
			} catch (error) {
				logger.error('Failed to unfavorite selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		async downloadSelection() {
			try {
				this.loadingCount++
				await this.$store.dispatch('downloadFiles', this.selectedFileIds)
			} catch (error) {
				logger.error('Faile to download selection', { error })
			} finally {
				this.loadingCount--
			}
		},

		t,
	},
}
</script>
<style lang="scss" scoped>
@use '../mixins/FaceContent';
</style>
