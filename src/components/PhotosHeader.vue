<!--
 - @copyright Copyright (c) 2019 Louis Chemineau <louis@chmn.me>
 -
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
	<div class="photos-header">
		<Actions v-if="selection.length === 0" :menu-title="t('photos', 'Add')" :primary="true">
			<Plus slot="icon" />
			<!-- TODO: uncomment when implementing upload -->
			<!-- <ActionButton :close-after-click="true" :title="t('photos', 'Upload media')" @click="openUploader">
				<FileUpload slot="icon" />
			</ActionButton> -->
			<!-- TODO: uncomment when implementing albums -->
			<!-- <ActionButton :close-after-click="true" :title="t('photos', 'Create new album')" @click="createNewAlbum">
				<PlusBoxMultiple slot="icon" />
			</ActionButton> -->
		</Actions>

		<template v-else>
			<!-- TODO: uncomment when implementing albums -->
			<!-- <Actions :force-title="true" :menu-title="t('photos', 'Add to album')" :primary="true">
				<ActionButton :close-after-click="true"
					:primary="true"
					:title="t('photos', 'Add to album')"
					@click="openAlbumPicker">
					<Plus slot="icon" />
				</ActionButton>
			</Actions> -->
			<Actions :force-menu="true">
				<ActionButton :close-after-click="true" :title="t('photos', 'Download')" @click="downloadSelection">
					<DownloadOutline slot="icon" />
				</ActionButton>
				<ActionButton v-if="shouldFavorite"
					:close-after-click="true"
					:title="t('photos', 'Favorite')"
					@click="favoriteSelection">
					<Star slot="icon" />
				</ActionButton>
				<ActionButton v-else
					:close-after-click="true"
					:title="t('photos', 'Remove from favorites')"
					@click="unFavoriteSelection">
					<Star slot="icon" />
				</ActionButton>
				<ActionButton :close-after-click="true" :title="t('photos', 'Delete')" @click="deleteSelection">
					<TrashCan slot="icon" />
				</ActionButton>
			</Actions>
		</template>

		<Loading v-if="loadingCount > 0" class="loading-icon" />
	</div>
</template>
<script>

import { mapActions } from 'vuex'

import Plus from 'vue-material-design-icons/Plus'
import TrashCan from 'vue-material-design-icons/TrashCan.vue'
// import PlusBoxMultiple from 'vue-material-design-icons/PlusBoxMultiple'
// import FileUpload from 'vue-material-design-icons/FileUpload.vue'
import Star from 'vue-material-design-icons/Star.vue'
import DownloadOutline from 'vue-material-design-icons/DownloadOutline.vue'
import Loading from 'vue-material-design-icons/Loading'

import { Actions, ActionButton } from '@nextcloud/vue'

import logger from '../services/logger.js'

export default {
	name: 'PhotosHeader',
	components: {
		Actions,
		ActionButton,
		Loading,
		Plus,
		TrashCan,
		// FileUpload,
		// PlusBoxMultiple,
		Star,
		DownloadOutline,
	},
	props: {
		selection: {
			type: Array,
			default: () => [],
		},
	},

	data() {
		return {
			loadingCount: 0,
		}
	},

	computed: {
		/** @type {boolean} */
		shouldFavorite() {
			// Favorite all selection if at least one file is not on the favorites.
			return this.selection.some((fileId) => this.$store.state.files.files[fileId].favorite === 0)
		},
	},

	methods: {
		...mapActions(['deleteFiles', 'toggleFavoriteForFiles', 'downloadFiles']),

		// TODO: uncomment when implementing upload
		// openUploader() {

		// },

		// TODO: uncomment when implementing albums
		// createNewAlbum() {

		// },
		// openAlbumPicker() {

		// },
		// async moveSelectionToAlbum() {

		// },

		async favoriteSelection() {
			try {
				this.loadingCount++
				await this.toggleFavoriteForFiles({ fileIds: this.selection, favoriteState: true })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async unFavoriteSelection() {
			try {
				this.loadingCount++
				await this.toggleFavoriteForFiles({ fileIds: this.selection, favoriteState: false })
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async deleteSelection() {
			try {
				this.loadingCount++
				const items = this.selection
				this.$emit('uncheck-items', items)
				await this.deleteFiles(items)
			} catch (error) {
				logger.error(error)
			} finally {
				this.loadingCount--
			}
		},

		async downloadSelection() {
			try {
				this.loadingCount++
				await this.downloadFiles(this.selection)
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
.photos-header {
	display: flex;
	margin: 16px 0;
	padding-left: 32px;

	& > * {
		margin: 0 16px;
	}

	.loading-icon::v-deep svg {
		animation: rotate var(--animation-duration, 0.8s) linear infinite;
		color: var(--color-loading-dark);
	}
}
</style>
