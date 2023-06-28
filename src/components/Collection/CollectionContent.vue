<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
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
	<!-- Errors handlers-->
	<NcEmptyContent v-if="(collection === undefined && !loading) || error === 404"
		class="empty-content-with-illustration"
		:title="t('photos', 'This collection does not exist')">
		<FolderMultipleImage slot="icon" />
	</NcEmptyContent>
	<NcEmptyContent v-else-if="error" :title="t('photos', 'An error occurred')">
		<AlertCircle slot="icon" />
	</NcEmptyContent>

	<div v-else class="collection">
		<!-- Header -->
		<slot class="collection__header" name="header" :selected-file-ids="selectedFileIds" />

		<!-- No content -->
		<slot v-if="collectionFileIds.length === 0 && !loading" name="empty-content" />

		<!-- Media list -->
		<FilesListViewer v-if="collection !== undefined"
			:container-element="appContent"
			class="collection__media"
			:file-ids="collectionFileIds"
			:base-height="isMobile ? 120 : 200"
			:loading="loading">
			<File slot-scope="{file, distance}"
				:file="files[file.id]"
				:allow-selection="true"
				:selected="selection[file.id] === true"
				:distance="distance"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AlertCircle from 'vue-material-design-icons/AlertCircle.vue'
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'

import { NcEmptyContent, isMobile } from '@nextcloud/vue'

import FilesSelectionMixin from '../../mixins/FilesSelectionMixin.js'
import FilesListViewer from '.././FilesListViewer.vue'
import File from '.././File.vue'
import FolderIllustration from '../../assets/Illustrations/folder.svg'

export default {
	name: 'CollectionContent',

	components: {
		AlertCircle,
		FolderMultipleImage,
		NcEmptyContent,
		FilesListViewer,
		File,
	},

	mixins: [
		FilesSelectionMixin,
		isMobile,
	],

	props: {
		collection: {
			type: Object,
			default: () => undefined,
		},

		collectionFileIds: {
			type: Array,
			required: true,
		},

		loading: {
			type: Boolean,
			default: false,
		},

		error: {
			type: [Error, Number],
			default: null,
		},
	},

	data() {
		return {
			FolderIllustration,
			appContent: document.getElementById('app-content-vue'),
		}
	},

	computed: {
		...mapGetters([
			'files',
		]),
	},

	methods: {
		openViewer(fileId) {
			const file = this.files[fileId]
			OCA.Viewer.open({
				fileInfo: file,
				list: this.collectionFileIds.map(fileId => this.files[fileId]).filter(file => !file.sectionHeader),
				loadMore: file.loadMore ? async () => await file.loadMore(true) : () => [],
				canLoop: file.canLoop,
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.collection {
	display: flex;
	flex-direction: column;

	&__media {
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}
	}
}
</style>
