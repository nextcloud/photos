<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<Teleport to="body">
		<div
			v-if="dragging"
			class="drop-upload__overlay"
			:style="overlayStyle"
			aria-hidden="true">
			<TrayArrowUp :size="48" />
			{{ t('photos', 'Drop photos and videos here to upload them') }}
		</div>

		<div
			v-if="progress.count > 0"
			class="drop-upload__progress"
			role="status"
			aria-live="polite">
			<div class="drop-upload__progress__text">
				<span>{{ n('photos', 'Uploading %n file', 'Uploading %n files', progress.count) }}</span>
				<span class="drop-upload__progress__details">
					{{ t('photos', '{done} of {count} done', { done: progress.done, count: progress.count }) }}
					·
					{{ t('photos', '{uploaded} of {total}', { uploaded: formatFileSize(progress.uploadedBytes), total: formatFileSize(progress.totalBytes) }) }}
				</span>
				<NcProgressBar :value="progress.percent" />
			</div>
			<NcButton variant="tertiary" @click="cancel">
				{{ t('photos', 'Cancel') }}
			</NcButton>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import type { File as FileNode } from '@nextcloud/files'
import type { IUpload } from '@nextcloud/files/upload'

import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'
import { formatFileSize } from '@nextcloud/files'
import { defaultRootPath } from '@nextcloud/files/dav'
import { Uploader, UploadStatus } from '@nextcloud/files/upload'
import { n, t } from '@nextcloud/l10n'
import { join } from '@nextcloud/paths'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import TrayArrowUp from 'vue-material-design-icons/TrayArrowUp.vue'
import { allMimes } from '../services/AllowedMimes.ts'
import { davClient } from '../services/DavClient.ts'
import { fetchFile } from '../services/fileFetcher.ts'
import { logger } from '../services/logger.ts'
import { useFilesStore } from '../store/files.ts'
import { useUserConfigStore } from '../store/userConfig.ts'
import { pastedFileName, splitAcceptedFiles, toUniqueNames } from '../utils/uploadFiles.ts'

/** A file on its way to the upload folder. */
type QueuedUpload = {
	file: File
	/** Name the file is stored under. */
	name: string
	upload?: IUpload
	done: boolean
}

const emit = defineEmits<{
	/** A batch is through, with the ids of the files that made it. */
	uploaded: [fileIds: string[]]
}>()

const filesStore = useFilesStore()
const userConfigStore = useUserConfigStore()

const uploader = new Uploader()
const finalStatuses: number[] = [UploadStatus.FINISHED, UploadStatus.CANCELLED, UploadStatus.FAILED]

const dragging = ref(false)
const overlayStyle = ref<Record<string, string>>({})
const progress = reactive({ count: 0, done: 0, uploadedBytes: 0, totalBytes: 0, percent: 0 })

// Uploads of the batches that are running, a drop during an upload adds to them.
let queue: QueuedUpload[] = []
let runningBatches = 0
let abortController = new AbortController()
// The drag events of the children of the page bubble up, so a drag has
// left the page once it left as often as it entered.
let dragDepth = 0

function updateProgress() {
	progress.count = queue.length
	progress.done = queue.filter(({ done }) => done).length
	progress.totalBytes = queue.reduce((sum, { file }) => sum + file.size, 0)
	progress.uploadedBytes = queue.reduce((sum, { file, upload, done }) => sum + (done ? file.size : Math.max(upload?.uploadedBytes ?? 0, 0)), 0)
	progress.percent = progress.totalBytes > 0 ? progress.uploadedBytes / progress.totalBytes * 100 : 0
}

/**
 * Wait until an upload succeeded, failed or was cancelled.
 *
 * @param upload - Upload to wait for
 */
function settled(upload: IUpload): Promise<void> {
	return new Promise((resolve) => {
		if (finalStatuses.includes(upload.status)) {
			resolve()
		} else {
			upload.addEventListener('finished', () => resolve(), { once: true })
		}
	})
}

/**
 * Upload one file and index it in the store.
 *
 * @param item - File to upload
 * @param folderPath - Path of the upload folder
 * @param signal - Aborted when the user cancels
 * @return Id of the uploaded file, undefined if it was not uploaded
 */
async function uploadFile(item: QueuedUpload, folderPath: string, signal: AbortSignal): Promise<string | undefined> {
	const path = join(folderPath, item.name)
	try {
		item.upload = await uploader.upload(path, item.file, { signal })
		await settled(item.upload)
		if (item.upload.status !== UploadStatus.FINISHED) {
			throw new Error(`Upload ended with status ${item.upload.status}`)
		}

		const node = await fetchFile(defaultRootPath + path, { signal })
		if (node === null) {
			return undefined
		}
		filesStore.appendFiles([node as FileNode])
		return String(node.fileid)
	} catch (error) {
		if (!signal.aborted) {
			logger.error('Failed to upload file', { error, path })
			showError(t('photos', 'Failed to upload {fileName}', { fileName: item.file.name }))
		}
		return undefined
	} finally {
		item.done = true
		updateProgress()
	}
}

/**
 * Upload photos and videos to the upload folder, under names that are free there.
 *
 * @param files - Files that were dropped or pasted
 * @param names - Names to store them under, their own names by default
 */
async function uploadFiles(files: File[], names: string[] = files.map((file) => file.name)) {
	const { accepted, rejected } = splitAcceptedFiles(files, allMimes)
	if (rejected.length > 0) {
		showWarning(n('photos', '%n file was skipped, only photos and videos can be uploaded', '%n files were skipped, only photos and videos can be uploaded', rejected.length))
	}
	if (accepted.length === 0) {
		return
	}

	const folder = userConfigStore.photosLocationFolder
	if (folder === undefined) {
		showError(t('photos', 'The upload folder is not available'))
		return
	}

	const signal = abortController.signal
	runningBatches++
	try {
		const folderContent = await davClient.getDirectoryContents(defaultRootPath + folder.path, { signal }) as { basename: string }[]
		const takenNames = [...folderContent.map(({ basename }) => basename), ...queue.map(({ name }) => name)]
		const acceptedNames = accepted.map((file) => names[files.indexOf(file)])
		const batch = toUniqueNames(acceptedNames, takenNames)
			.map((name, index): QueuedUpload => ({ file: accepted[index], name, done: false }))

		queue.push(...batch)
		updateProgress()

		const results = await Promise.all(batch.map((item) => uploadFile(item, folder.path, signal)))
		const fileIds = results.filter((fileId) => fileId !== undefined)
		if (fileIds.length > 0) {
			showSuccess(n('photos', '%n file uploaded', '%n files uploaded', fileIds.length))
			emit('uploaded', fileIds)
		}
	} catch (error) {
		if (!signal.aborted) {
			logger.error('Failed to list the upload folder', { error })
			showError(t('photos', 'The upload folder is not available'))
		}
	} finally {
		runningBatches--
		if (runningBatches === 0) {
			queue = []
			abortController = new AbortController()
			updateProgress()
		}
	}
}

function cancel() {
	abortController.abort()
}

/**
 * Whether a dialog or the viewer covers the page, they handle their own input.
 */
function isCovered(): boolean {
	return document.querySelector('[aria-modal="true"]') !== null
}

function hasFiles(event: DragEvent): boolean {
	return event.dataTransfer?.types.includes('Files') === true && !isCovered()
}

function onDragEnter(event: DragEvent) {
	if (!hasFiles(event)) {
		return
	}

	dragDepth++
	const rect = document.getElementById('app-content-vue')?.getBoundingClientRect()
	if (rect !== undefined) {
		overlayStyle.value = {
			top: `${rect.top}px`,
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
		}
	}
	dragging.value = true
}

function onDragOver(event: DragEvent) {
	if (hasFiles(event)) {
		// Without it the browser refuses the drop and opens the file instead.
		event.preventDefault()
	}
}

function onDragLeave() {
	dragDepth = Math.max(dragDepth - 1, 0)
	dragging.value = dragDepth > 0
}

function onDrop(event: DragEvent) {
	dragDepth = 0
	dragging.value = false
	if (!hasFiles(event)) {
		return
	}

	event.preventDefault()
	uploadFiles([...event.dataTransfer?.files ?? []])
}

function onPaste(event: ClipboardEvent) {
	const target = event.target as HTMLElement | null
	const files = [...event.clipboardData?.files ?? []]
	if (files.length === 0 || isCovered() || target?.closest?.('input, textarea, select, [contenteditable]')) {
		return
	}

	event.preventDefault()
	const now = new Date()
	uploadFiles(files, files.map((file) => pastedFileName(file, now)))
}

onMounted(() => {
	document.addEventListener('dragenter', onDragEnter)
	document.addEventListener('dragover', onDragOver)
	document.addEventListener('dragleave', onDragLeave)
	document.addEventListener('drop', onDrop)
	document.addEventListener('paste', onPaste)
})

onBeforeUnmount(() => {
	document.removeEventListener('dragenter', onDragEnter)
	document.removeEventListener('dragover', onDragOver)
	document.removeEventListener('dragleave', onDragLeave)
	document.removeEventListener('drop', onDrop)
	document.removeEventListener('paste', onPaste)
})
</script>

<style lang="scss" scoped>
.drop-upload {
	&__overlay {
		position: fixed;
		z-index: 2000;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: calc(var(--default-grid-baseline) * 2);
		box-sizing: border-box;
		padding: calc(var(--default-grid-baseline) * 4);
		border: 2px dashed var(--color-primary-element);
		border-radius: var(--border-radius-container, var(--border-radius-large));
		background-color: color-mix(in srgb, var(--color-main-background) 85%, transparent);
		color: var(--color-main-text);
		font-size: 20px;
		font-weight: bold;
		text-align: center;
		// The drop is handled on the document, the overlay must not get in the
		// way of the drag events.
		pointer-events: none;
	}

	&__progress {
		position: fixed;
		z-index: 2000;
		inset-block-end: calc(var(--default-grid-baseline) * 4);
		inset-inline: 0;
		display: flex;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		box-sizing: border-box;
		width: calc(100% - var(--default-grid-baseline) * 8);
		max-width: 420px;
		margin-inline: auto;
		padding: calc(var(--default-grid-baseline) * 3);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-element, var(--border-radius-large));
		background-color: var(--color-main-background);
		box-shadow: 0 2px 9px var(--color-box-shadow);

		&__text {
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: var(--default-grid-baseline);
			min-width: 0;
		}

		&__details {
			color: var(--color-text-maxcontrast);
		}
	}
}
</style>
