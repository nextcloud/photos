<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent
		v-if="(collection === undefined && !loading) || error === 404"
		class="empty-content-with-illustration"
		:name="t('photos', 'This collection does not exist')">
		<template #icon>
			<ImageMultipleOutline />
		</template>
	</NcEmptyContent>
	<NcEmptyContent v-else-if="error" :name="t('photos', 'An error occurred')">
		<template #icon>
			<AlertCircleOutline />
		</template>
	</NcEmptyContent>

	<div v-else class="collection">
		<!-- Header -->
		<slot
			class="collection__header"
			name="header"
			:selected-file-ids="selectedFileIds"
			:reset-selection="resetSelection" />

		<!-- No content -->
		<slot v-if="sortedCollectionFileIds.length === 0 && !loading" name="empty-content" />

		<!-- Media list -->
		<FilesListViewer
			v-if="collection !== undefined && sortedCollectionFileIds.length > 0 "
			:container-element="appContent"
			class="collection__media"
			:file-ids="sortedCollectionFileIds"
			:base-height="isMobile ? 120 : 200"
			:loading="loading">
			<template #default="{ file, distance }">
				<FileComponent
					:file="files[file.id]"
					:allow-selection="allowSelection"
					:selected="selection[file.id] === true"
					:distance="distance"
					@click="openViewer"
					@select-toggled="onFileSelectToggle" />
			</template>
		</FilesListViewer>
	</div>
</template>

<script lang='ts'>
import type { PropType } from 'vue'
import type { Album } from '../../store/albums.ts'

import { t } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { defineComponent } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import FileComponent from '../FileComponent.vue'
import FilesListViewer from '../FilesListViewer.vue'
import FilesSelectionMixin from '../../mixins/FilesSelectionMixin.ts'
import { toViewerFileInfo } from '../../utils/fileUtils.ts'

export default defineComponent({
	name: 'CollectionContent',

	components: {
		AlertCircleOutline,
		ImageMultipleOutline,
		NcEmptyContent,
		FilesListViewer,
		FileComponent,
	},

	mixins: [FilesSelectionMixin],

	props: {
		collection: {
			type: Object as PropType<Album>,
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

	setup() {
		return {
			isMobile: useIsMobile(),
		}
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
				list: this.sortedCollectionFileIds.map((fileId) => toViewerFileInfo(this.files[fileId])),
				onClose() { window.OCA.Files.Sidebar.close() },
			})
		},

		t,
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
