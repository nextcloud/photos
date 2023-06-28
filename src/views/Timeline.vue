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
		<!-- Header -->
		<HeaderNavigation key="navigation"
			:loading="loadingCount > 0"
			:path="'/'"
			:title="rootTitle"
			:root-title="rootTitle"
			@refresh="resetFetchFilesState">
			<div class="timeline__header__left">
				<!-- TODO: UploadPicker -->
				<NcActions v-if="selectedFileIds.length === 0"
					:force-title="true"
					:force-menu="true"
					:menu-title="t('photos', 'Add')">
					<Plus slot="icon" />
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

					<NcActions :aria-label="t('photos', 'Open actions menu')">
						<ActionDownload :selected-file-ids="selectedFileIds" :title="t('photos', 'Download selected files')">
							<Download slot="icon" />
						</ActionDownload>

						<ActionFavorite :selected-file-ids="selectedFileIds" />

						<NcActionButton :close-after-click="true"
							:aria-label="t('photos', 'Delete selection')"
							@click="deleteSelection">
							{{ t('photos', 'Delete selection') }}
							<Delete slot="icon" />
						</NcActionButton>
					</NcActions>
				</template>
			</div>
		</HeaderNavigation>

		<FilesListViewer ref="filesListViewer"
			:container-element="appContent"
			class="timeline__file-list"
			:file-ids-by-section="fileIdsByMonth"
			:sections="monthsList"
			:loading="loadingFiles"
			:base-height="isMobile ? 120 : 200"
			:empty-message="t('photos', 'No photos or videos in here')"
			@need-content="getContent">
			<template slot-scope="{file, distance}">
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
					:distance="distance"
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
import Plus from 'vue-material-design-icons/Plus.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import PlusBoxMultiple from 'vue-material-design-icons/PlusBoxMultiple.vue'
import Download from 'vue-material-design-icons/Download.vue'

import { NcModal, NcActions, NcActionButton, NcButton, NcEmptyContent, isMobile } from '@nextcloud/vue'
import moment from '@nextcloud/moment'

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
import { translate } from '@nextcloud/l10n'

export default {
	name: 'Timeline',
	components: {
		Delete,
		PlusBoxMultiple,
		Download,
		Plus,
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
		}
	},

	computed: {
		...mapGetters([
			'files',
		]),
	},

	methods: {
		...mapActions(['deleteFiles', 'addFilesToAlbum']),

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
				fileInfo: file,
				list: Object.values(this.fileIdsByMonth).flat().map(fileId => this.files[fileId]),
				loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
				canLoop: file.canLoop,
			})
		},

		openUploader() {
			// TODO: finish when implementing upload
		},

		async addSelectionToAlbum(albumName) {
			this.showAlbumPicker = false
			await this.addFilesToAlbum({ albumName, fileIdsToAdd: this.selectedFileIds })
		},

		async deleteSelection() {
			// Need to store the file ids so it is not changed before the deleteFiles call.
			const fileIds = this.selectedFileIds
			this.onUncheckFiles(fileIds)
			this.fetchedFileIds = this.fetchedFileIds.filter(fileid => !fileIds.includes(fileid))
			await this.deleteFiles(fileIds)
		},

		t: translate,
	},
}
</script>
<style lang="scss" scoped>
.timeline {
	display: flex;
	flex-direction: column;

	&__header {
		&__left {
			display: flex;
		}
	}

	&__file-list {
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}

		:deep .files-list-viewer__section-header {
			top: var(--photos-navigation-height);
		}
	}
}
</style>
