<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent
		v-if="face === undefined && !loadingFiles && !loadingFaces"
		class="empty-content-with-illustration">
		<template #icon>
			<AccountBoxMultipleOutline />
		</template>
		{{ t('photos', 'This person could not be found') }}
	</NcEmptyContent>
	<NcEmptyContent v-else-if="errorFetchingFiles || errorFetchingFaces">
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
					<h2
						v-if="face !== undefined"
						class="face-name"
						:class="{ 'hidden-visually': face.basename.match(/^[0-9]+$/) }">
						{{ face.basename }}
					</h2>
				</div>

				<NcLoadingIcon v-if="loadingCount > 0 || loadingFaces" />
			</div>
			<div v-if="face !== undefined" class="face__header__actions">
				<NcActions>
					<NcActionButton
						:close-after-click="true"
						:aria-label="t('photos', 'Rename person')"
						@click="showRenameModal = true">
						<template #icon>
							<PencilOutline />
						</template>
						{{ t('photos', 'Rename person') }}
					</NcActionButton>
				</NcActions>
				<NcActions :force-menu="true">
					<NcActionButton
						v-if="Object.keys(faces).length > 1"
						:close-after-click="true"
						:aria-label="t('photos', 'Merge with different person')"
						@click="showMergeModal = true">
						<template #icon>
							<Merge />
						</template>
						{{ t('photos', 'Merge with different person') }}
					</NcActionButton>
					<template v-if="selectedFileIds.length">
						<NcActionButton
							:close-after-click="true"
							:aria-label="t('photos', 'Download selected files')"
							@click="downloadSelection">
							<Download slot="icon" />
							{{ t('photos', 'Download selected photos') }}
						</NcActionButton>
						<NcActionButton
							v-if="shouldFavoriteSelection"
							:close-after-click="true"
							:aria-label="t('photos', 'Mark selection as favorite')"
							@click="favoriteSelection">
							<StarOutline slot="icon" />
							{{ t('photos', 'Favorite') }}
						</NcActionButton>
						<NcActionButton
							v-else
							:close-after-click="true"
							:aria-label="t('photos', 'Remove selection from favorites')"
							@click="unFavoriteSelection">
							<Star slot="icon" />
							{{ t('photos', 'Remove from favorites') }}
						</NcActionButton>
						<NcActionButton
							:close-after-click="true"
							@click="showMoveModal = true">
							<template #icon>
								<AccountSwitchOutline />
							</template>
							{{ n('photos', 'Move photo to a different person', 'Move photos to a different person', selectedFileIds.length) }}
						</NcActionButton>
						<NcActionButton
							:close-after-click="true"
							@click="handleRemoveFilesFromFace(selectedFileIds)">
							<template #icon>
								<Close />
							</template>
							{{ n('photos', 'Remove photo from person', 'Remove photos from person', selectedFileIds.length) }}
						</NcActionButton>
					</template>
					<NcActionButton
						:close-after-click="true"
						@click="handleDeleteFace">
						<template #icon>
							<Close />
						</template>
						{{ t('photos', 'Remove person') }}
					</NcActionButton>
				</NcActions>
			</div>
		</div>

		<FilesListViewer
			v-if="face !== undefined"
			class="face__photos"
			:container-element="appContent"
			:file-ids="faceFileIds"
			:loading="loadingFiles || loadingFaces">
			<FileComponent
				slot-scope="{ file, distance }"
				:file="files[file.id]"
				:allow-selection="true"
				:selected="selection[file.id] === true"
				:distance="distance"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>

		<NcDialog
			v-if="showRenameModal"
			:name="t('photos', 'Rename person')"
			close-on-click-outside
			size="small"
			@closing="showRenameModal = false">
			<div class="rename-form">
				<input
					ref="nameInput"
					v-focus
					:value="faceName"
					type="text"
					name="name"
					required
					:placeholder="t('photos', 'Name of this person')"
					@keydown.enter="handleRenameFace($refs.nameInput.value)">
			</div>
			<template #actions>
				<NcButton
					:aria-label="t('photos', 'Save.')"
					variant="primary"
					:disabled="$refs.nameInput && $refs.nameInput.value.trim() === ''"
					@click="handleRenameFace($refs.nameInput.value)">
					<template #icon>
						<NcLoadingIcon v-if="loadingCount" />
						<SendOutline v-else />
					</template>
					{{ t('photos', 'Save') }}
				</NcButton>
			</template>
		</NcDialog>

		<NcDialog
			v-if="showMergeModal"
			:name="t('photos', 'Merge person')"
			close-on-click-outside
			size="normal"
			@closing="showMergeModal = false">
			<FaceMergeForm :first-face="faceName" @select="handleMerge($event)" />
		</NcDialog>

		<NcDialog
			v-if="showMoveModal"
			:name="t('photos', 'Move to different person')"
			close-on-click-outside
			size="normal"
			@closing="showMoveModal = false">
			<FaceMergeForm :first-face="faceName" @select="handleMove($event, selectedFileIds)" />
		</NcDialog>
	</div>
</template>

<script lang='ts'>
import type { Collection } from '../services/collectionFetcher.js'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import Vue from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import AccountBoxMultipleOutline from 'vue-material-design-icons/AccountBoxMultipleOutline.vue'
import AccountSwitchOutline from 'vue-material-design-icons/AccountSwitchOutline.vue'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import Close from 'vue-material-design-icons/Close.vue'
import Merge from 'vue-material-design-icons/Merge.vue'
import PencilOutline from 'vue-material-design-icons/PencilOutline.vue'
import SendOutline from 'vue-material-design-icons/SendOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import Download from 'vue-material-design-icons/TrayArrowDown.vue'
import FaceMergeForm from '../components/Faces/FaceMergeForm.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import FilesSelectionMixin from '../mixins/FilesSelectionMixin.js'
import logger from '../services/logger.js'
import { toViewerFileInfo } from '../utils/fileUtils.js'

export default {
	name: 'FaceContent',
	components: {
		PencilOutline,
		Star,
		StarOutline,
		Download,
		Close,
		AlertCircleOutline,
		SendOutline,
		Merge,
		ArrowLeft,
		AccountBoxMultipleOutline,
		FaceMergeForm,
		FilesListViewer,
		FileComponent,
		NcLoadingIcon,
		NcEmptyContent,
		NcActions,
		NcActionButton,
		NcDialog,
		NcButton,
		AccountSwitchOutline,
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

	props: {
		faceName: {
			type: String,
			default: '/',
		},
	},

	data() {
		return {
			showMoveModal: false,
			showMergeModal: false,
			showRenameModal: false,
			loadingCount: 0,
			appContent: document.getElementById('app-content-vue'),
		}
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		facesFiles() {
			return this.$store.state.faces.facesFiles
		},

		face(): Collection {
			return this.faces[this.faceName]
		},

		faceFileIds(): string[] {
			return this.facesFiles[this.faceName] || []
		},

		shouldFavoriteSelection(): boolean {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selectedFileIds.some((fileId) => this.$store.state.files.files[fileId].attributes.favorite === 0)
		},
	},

	watch: {
		face() {
			if (this.face) {
				this.fetchFaceContent(this.faceName)
			}
		},
	},

	mounted() {
		this.fetchFaceContent(this.faceName)
	},

	methods: {
		openViewer(fileId: string) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: this.faceFileIds.map((fileId) => toViewerFileInfo(this.files[fileId])),
			})
		},

		async handleRemoveFilesFromFace(fileIds: string[]) {
			try {
				this.loadingCount++
				await this.$store.dispatch('removeFilesFromFace', { faceName: this.faceName, fileIdsToRemove: fileIds })
				this.resetSelection()
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async handleDeleteFace() {
			try {
				this.loadingCount++
				await this.$store.dispatch('deleteFace', { faceName: this.faceName })
				this.$router.push('/faces')
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async handleRenameFace(faceName: string) {
			try {
				this.loadingCount++
				this.showRenameModal = false
				const oldName = this.faceName
				await this.$store.dispatch('renameFace', { oldName, faceName })
				this.$router.push({ name: 'facecontent', params: { faceName } })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async handleMerge(faceName: string) {
			try {
				this.loadingCount++
				await this.$store.dispatch('moveFilesToFace', { oldFace: this.faceName, faceName, fileIdsToMove: this.facesFiles[this.faceName] })
				await this.$store.dispatch('deleteFace', { faceName: this.faceName })
				this.showMergeModal = false
				this.$router.push({ name: 'facecontent', params: { faceName } })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async handleMove(faceName: string, fileIds: string[]) {
			try {
				this.loadingCount++
				await this.$store.dispatch('moveFilesToFace', { oldFace: this.faceName, faceName, fileIdsToMove: fileIds })
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
				await this.$store.dispatch('toggleFavoriteForFiles', { fileIds: this.selectedFileIds, favoriteState: true })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async unFavoriteSelection() {
			try {
				this.loadingCount++
				await this.$store.dispatch('toggleFavoriteForFiles', { fileIds: this.selectedFileIds, favoriteState: false })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async downloadSelection() {
			try {
				this.loadingCount++
				await this.$store.dispatch('downloadFiles', this.selectedFileIds)
			} catch (error) {
				logger.error(error)
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
@use '../mixins/FaceContent';
</style>
