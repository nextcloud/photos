<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<FolderTagPreview
		:id="item.fileid"
		:name="item.basename"
		:path="item.path"
		:file-list="previewFiles" />
</template>

<script setup lang='ts'>
import type { File, Folder } from '@nextcloud/files'
import type { PropType } from 'vue'

import { computed, onBeforeUnmount, ref, watch } from 'vue'
import FolderTagPreview from './FolderTagPreview.vue'
import getFolderContent from '../services/FolderContent.ts'
import logger from '../services/logger.ts'
import store from '../store/index.ts'

const props = defineProps({
	item: {
		type: Object as PropType<Folder>,
		required: true,
	},

	showShared: {
		type: Boolean,
		default: false,
	},
})

const abortController = new AbortController()

onBeforeUnmount(() => abortController.abort())

const files = computed(() => store.state.folders.files)
const folders = computed(() => store.state.folders.folders)
const subFolders = computed(() => store.state.folders.subFolders)

/** Id of the folder, which a node of a listing always carries. */
const folderId = computed(() => props.item.fileid as number)

/** Folder the cover images are taken from: the folder itself or one of its children. */
const previewFolder = ref(folderId.value)

const previewFiles = computed<File[]>(() => (folders.value[previewFolder.value] ?? [])
	// A folder holds the ids of the photos it shows, so these are files.
	.map((fileid) => files.value[fileid] as File)
	.filter((file) => file !== undefined)
	// only get the 4 first images
	.slice(0, 4))

/**
 * Fetch the content of a folder and store it.
 *
 * @param path - Path of the folder, relative to the root of the account
 */
async function getFolderData(path: string) {
	try {
		const { folder, folders, files } = await getFolderContent(path, {
			shared: props.showShared,
			signal: abortController.signal,
		})
		store.dispatch('updateFolders', { fileid: folder?.fileid, files, folders })
		store.dispatch('updateFoldersFiles', { folder, files, folders })
	} catch (error) {
		logger.error('Failed to get folder content', { error, path })
	}
}

// If we did not find any preview in the folder we try the next subfolder.
// We limit to one subfolder for performance concerns.
watch(previewFiles, () => {
	if (previewFiles.value.length > 0 || previewFolder.value !== folderId.value) {
		return
	}

	const firstChildFolder = subFolders.value[folderId.value]?.[0]
	if (firstChildFolder === undefined) {
		return
	}

	previewFolder.value = firstChildFolder
	if (folders.value[firstChildFolder] === undefined && files.value[firstChildFolder] !== undefined) {
		getFolderData(files.value[firstChildFolder].path)
	}
}, { immediate: true })

if (folders.value[folderId.value] === undefined) {
	getFolderData(props.item.path)
}
</script>
