<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="(collection === undefined && !loading) || error === 404"
		class="empty-content-with-illustration"
		:name="t('photos', 'This collection does not exist')">
		<FolderMultipleImage slot="icon" />
	</NcEmptyContent>
	<NcEmptyContent v-else-if="error" :name="t('photos', 'An error occurred')">
		<AlertCircle slot="icon" />
	</NcEmptyContent>

	<div v-else class="collection">
		<!-- Header -->
		<slot class="collection__header"
			name="header"
			:selected-file-ids="selectedFileIds"
			:reset-selection="resetSelection" />

		<!-- No content -->
		<slot v-if="sortedCollectionFileIds.length === 0 && !loading" name="empty-content" />

		<!-- Media list -->
		<FilesListViewer v-if="collection !== undefined && sortedCollectionFileIds.length > 0 "
			:container-element="appContent"
			class="collection__media"
			:file-ids="sortedCollectionFileIds"
			:base-height="isMobile ? 120 : 200"
			:loading="loading">
			<File slot-scope="{file, distance}"
				:file="files[file.id]"
				:allow-selection="allowSelection"
				:selected="selection[file.id] === true"
				:distance="distance"
				@click="openViewer"
				@select-toggled="onFileSelectToggle" />
		</FilesListViewer>
	</div>
</template>

<script lang='ts'>
import { defineComponent, type PropType } from 'vue'

import AlertCircle from 'vue-material-design-icons/AlertCircle.vue'
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'

import { NcEmptyContent, isMobile } from '@nextcloud/vue'
import { translate } from '@nextcloud/l10n'

import FilesSelectionMixin from '../../mixins/FilesSelectionMixin.js'
import FilesListViewer from '../FilesListViewer.vue'
import File from '../File.vue'
import type { PublicAlbum } from '../../store/publicAlbums.js'
import { toViewerFileInfo } from '../../utils/fileUtils.js'

export default defineComponent({
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
			type: Object as PropType<PublicAlbum>,
			default: () => undefined,
		},

		collectionFileIds: {
			type: Array as PropType<string[]>,
			required: true,
		},

		loading: {
			type: Boolean,
			default: false,
		},

		allowSelection: {
			type: Boolean,
			default: true,
		},

		error: {
			type: [Error, Number],
			default: null,
		},
	},

	data() {
		return {
			appContent: document.getElementById('app-content-vue'),
		}
	},

	computed: {
		files() {
			return this.$store.getters.files
		},

		sortedCollectionFileIds() {
			return this.collectionFileIds.toSorted((fileId1, fileId2) => this.files[fileId1].attributes.timestamp < this.files[fileId2].attributes.timestamp ? -1 : 1)
		},
	},

	methods: {
		openViewer(fileId: string) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(this.files[fileId]),
				list: this.sortedCollectionFileIds.map(fileId => toViewerFileInfo(this.files[fileId])),
			})
		},

		t: translate,
	},
})

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
