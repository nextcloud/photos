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

<script>
import { mapActions, mapGetters } from 'vuex'
import AlertCircle from 'vue-material-design-icons/AlertCircle.vue'
import Star from 'vue-material-design-icons/Star.vue'
import Download from 'vue-material-design-icons/Download.vue'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import AccountSwitch from 'vue-material-design-icons/AccountSwitch.vue'

import { NcActions, NcActionButton, NcDialog, NcEmptyContent, NcLoadingIcon } from '@nextcloud/vue'

import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import FilesListViewer from '../components/FilesListViewer.vue'
import File from '../components/File.vue'
import logger from '../services/logger.js'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import Vue from 'vue'
import FaceMergeForm from '../components/Faces/FaceMergeForm.vue'

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
		...mapGetters([
			'files',
			'unassignedFiles',
		]),

		/**
		 * @return {string[]} The list of files for the current faceName.
		 */
		faceFileIds() {
			return this.unassignedFiles || []
		},

		/** @type {boolean} */
		shouldFavoriteSelection() {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].favorite === 0)
		},
	},

	mounted() {
		this.fetchUnassignedFaces()
	},

	methods: {
		...mapActions([
			'appendFiles',
			'deleteFace',
			'renameFace',
			'downloadFiles',
			'toggleFavoriteForFiles',
			'removeFilesFromFace',
			'moveFilesToFace',
		]),

		openViewer(fileId) {
			const file = this.files[fileId]
			OCA.Viewer.open({
				path: '/' + file.filename.split('/').slice(3).join('/'),
				list: this.faceFileIds.map(fileId => ({ ...this.files[fileId], filename: '/' + this.files[fileId].filename.split('/').slice(3).join('/') })),
				loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
				canLoop: file.canLoop,
			})
		},

		async handleMove(faceName, fileIds) {
			try {
				this.loadingCount++
				await this.moveFilesToFace({ oldFace: null, faceName, fileIdsToMove: fileIds })
				this.showMoveModal = false
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
@import '../mixins/FaceContent';
</style>
