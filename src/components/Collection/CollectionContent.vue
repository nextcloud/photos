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
			:selectedFileIds="selectedFileIds"
			:resetSelection="resetSelection" />

		<!-- No content -->
		<slot v-if="sortedCollectionFileIds.length === 0 && !loading" name="emptyContent" />

		<!-- Media list -->
		<FilesListViewer
			v-if="collection !== undefined && sortedCollectionFileIds.length > 0"
			:containerElement="appContent"
			class="collection__media"
			:fileIds="sortedCollectionFileIds"
			:baseHeight="isMobile ? 120 : 200"
			:loading="loading">
			<template #default="{ file }">
				<FileComponent
					:file="files[file.id]"
					:allowSelection="allowSelection"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@selectToggled="onFileSelectToggle"
					@deleted="onPhotoDeleted" />
			</template>
		</FilesListViewer>
	</div>
</template>

<script setup lang="ts">
import type { Node } from '@nextcloud/files'
import type { Collection } from '../../services/collectionFetcher.ts'
import type { PhotoTarget } from '../../utils/fileUtils.ts'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { t } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, onMounted, onUnmounted } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import FileComponent from '../FileComponent.vue'
import FilesListViewer from '../FilesListViewer.vue'
import { useFilesSelection } from '../../composables/useFilesSelection.ts'
import { useCollectionsStore } from '../../store/collections.ts'
import { useFilesStore } from '../../store/files.ts'
import { toViewerFileInfo } from '../../utils/fileUtils.ts'

const props = withDefaults(defineProps<{
	collection?: Collection
	collectionFileIds: string[]
	loading?: boolean
	allowSelection?: boolean
	error?: Error | number | null
}>(), {
	collection: undefined,
	loading: false,
	allowSelection: true,
	error: null,
})

const isMobile = useIsMobile()
const collectionsStore = useCollectionsStore()
const filesStore = useFilesStore()
const { selection, selectedFileIds, onFileSelectToggle, onUncheckFiles, resetSelection } = useFilesSelection()

const appContent = document.getElementById('app-content-vue')

const files = computed(() => filesStore.files)

const sortedCollectionFileIds = computed(() => props.collectionFileIds.toSorted((fileId1, fileId2) => files.value[fileId1].attributes.timestamp < files.value[fileId2].attributes.timestamp ? -1 : 1))

function openViewer(fileId: number): void {
	window.OCA.Viewer.open({
		fileInfo: toViewerFileInfo(files.value[fileId]),
		list: sortedCollectionFileIds.value.map((fileId) => toViewerFileInfo(files.value[fileId])),
	})
}

function handleFileDeleted({ fileid }: Node): void {
	removeFromCollection(fileid as number)
}

// The photo is already gone from the store, it only has to leave the
// collection it was shown in.
function onPhotoDeleted(photo: PhotoTarget): void {
	onUncheckFiles([photo.fileid.toString()])
	removeFromCollection(photo.fileid)
}

function removeFromCollection(fileId: number): void {
	if (props.collection === undefined) {
		return
	}

	collectionsStore.removeFileIdsFromCollection(props.collection.root + props.collection.path, [fileId?.toString()])
}

onMounted(() => {
	subscribe('files:node:deleted', handleFileDeleted)
})

onUnmounted(() => {
	unsubscribe('files:node:deleted', handleFileDeleted)
})

defineExpose({ selectedFileIds, onUncheckFiles })
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
