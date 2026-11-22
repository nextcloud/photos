<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')">
		<template #icon>
			<AlertCircleOutline />
		</template>
	</NcEmptyContent>

	<div v-else class="recently-deleted">
		<HeaderNavigation
			key="navigation"
			path="/"
			:title="t('photos', 'Recently deleted')"
			:rootTitle="t('photos', 'Recently deleted')"
			:loading="loading"
			@refresh="fetchContent">
			<div v-if="selectedFileIds.length > 0" class="recently-deleted__header">
				<NcButton
					variant="primary"
					:disabled="restoring"
					data-cy-header-action="restore-selection"
					@click="restore(selectedFileIds)">
					<template #icon>
						<History :size="20" />
					</template>
					{{ n('photos', 'Restore %n item', 'Restore %n items', selectedFileIds.length) }}
				</NcButton>

				<NcButton
					:aria-label="t('photos', 'Unselect all')"
					data-cy-header-action="unselect-all"
					@click="resetSelection">
					<template #icon>
						<Close :size="20" />
					</template>
					<template v-if="!isMobile" #default>
						{{ t('photos', 'Unselect all') }}
					</template>
				</NcButton>
			</div>
		</HeaderNavigation>

		<FilesListViewer
			class="recently-deleted__file-list"
			:containerElement="appContent"
			:fileIds="fileIds"
			:baseHeight="isMobile ? 120 : 200"
			:loading="loading"
			:emptyMessage="t('photos', 'No recently deleted photos or videos')">
			<template #default="{ file }">
				<div class="recently-deleted__item">
					<FileComponent
						:file="files[file.id]"
						:selected="selection[file.id] === true"
						:showActionsMenu="false"
						:previewUrl="(size) => getTrashedPreviewUrl(Number(file.id), size)"
						:label="t('photos', 'Select {name}', { name: files[file.id].displayname })"
						@click="toggleSelection"
						@selectToggled="onFileSelectToggle" />

					<NcButton
						class="recently-deleted__restore"
						:aria-label="t('photos', 'Restore {name}', { name: files[file.id].displayname })"
						:title="t('photos', 'Restore')"
						:disabled="restoring"
						@click="restore([file.id])">
						<template #icon>
							<History :size="20" />
						</template>
					</NcButton>
				</div>
			</template>
		</FilesListViewer>
	</div>
</template>

<script setup lang="ts">
import type { File } from '@nextcloud/files'

import { showError, showSuccess } from '@nextcloud/dialogs'
import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, onBeforeMount, onBeforeUnmount, ref, shallowRef } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import Close from 'vue-material-design-icons/Close.vue'
import History from 'vue-material-design-icons/History.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { logger } from '../services/logger.ts'
import { fetchTrashedMedia, getTrashedPreviewUrl, restoreTrashedItems } from '../services/trashbin.ts'
import { useFilesStore } from '../store/files.ts'

const isMobile = useIsMobile()
const filesStore = useFilesStore()
const { abortSignal } = useAbortController()
const { selection, selectedFileIds, onFileSelectToggle, onUncheckFiles, resetSelection } = useFilesSelection()

const appContent = document.getElementById('app-content-vue')

const error = ref(false)
const loading = ref(false)
const restoring = ref(false)
// The trashed photos and videos, the most recently deleted first.
const trashedFiles = shallowRef<File[]>([])

const files = computed(() => filesStore.files)
const fileIds = computed(() => trashedFiles.value.map((file) => String(file.fileid)))

/**
 * List the trashed photos and videos. They go to the files store for the grid
 * to lay them out, and leave it again with this view.
 */
async function fetchContent(): Promise<void> {
	loading.value = true
	error.value = false

	try {
		const fetched = await fetchTrashedMedia(abortSignal.value)
		dropFromStore(trashedFiles.value)
		filesStore.appendFiles(fetched)
		trashedFiles.value = fetched
		resetSelection()
	} catch (fetchError) {
		logger.error('Failed to fetch the trashed photos', { error: fetchError })
		error.value = true
	} finally {
		loading.value = false
	}
}

/**
 * @param fileIds - Ids of the trashed files to restore
 */
async function restore(fileIds: string[]): Promise<void> {
	const toRestore = trashedFiles.value.filter((file) => fileIds.includes(String(file.fileid)))

	restoring.value = true
	try {
		const { restored, failed } = await restoreTrashedItems(toRestore)

		const restoredIds = restored.map((file) => String(file.fileid))
		onUncheckFiles(restoredIds)
		dropFromStore(restored)
		trashedFiles.value = trashedFiles.value.filter((file) => !restoredIds.includes(String(file.fileid)))

		if (restored.length > 0) {
			showSuccess(n('photos', '%n item restored', '%n items restored', restored.length))
		}

		failed.forEach(({ node, error }) => {
			logger.error('Failed to restore a trashed file', { error, node })
			showError(t('photos', 'Failed to restore {name}', { name: node.displayname }))
		})
	} finally {
		restoring.value = false
	}
}

/**
 * @param fileId - Id of the clicked file
 */
function toggleSelection(fileId: number): void {
	onFileSelectToggle({ id: fileId, value: selection.value[fileId] !== true })
}

/**
 * @param trashed - Trashed files to remove from the files store
 */
function dropFromStore(trashed: File[]): void {
	trashed.forEach((file) => filesStore.deleteFile(file.fileid as number))
}

onBeforeMount(fetchContent)

onBeforeUnmount(() => dropFromStore(trashedFiles.value))
</script>

<style scoped lang="scss">
.recently-deleted {
	display: flex;
	flex-direction: column;

	&__header {
		display: flex;
		gap: 4px;
	}

	&__file-list {
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}
	}

	&__item {
		position: relative;
		width: 100%;
		height: 100%;

		&:hover,
		&:focus-within {
			.recently-deleted__restore {
				opacity: 1;
			}
		}
	}

	&__restore {
		position: absolute;
		z-index: 5; // above the preview layers
		inset-block-start: calc(var(--default-grid-baseline) * 2);
		inset-inline-start: calc(var(--default-grid-baseline) * 2);
		opacity: 0;
		transition: opacity var(--animation-quick) ease-out;
	}
}
</style>
