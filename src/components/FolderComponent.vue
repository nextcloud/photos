<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<FolderTagPreview
		:id="item.fileid"
		:name="item.basename.toString()"
		:path="item.filename"
		:file-list="previewFiles" />
</template>

<script setup lang='ts'>
import type { PropType } from 'vue'
import type { FoldersNode } from '../services/FolderContent.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import FolderTagPreview from './FolderTagPreview.vue'
import getFolderContent from '../services/FolderContent.ts'
import logger from '../services/logger.ts'
import store from '../store/index.ts'

const props = defineProps({
	item: {
		type: Object as PropType<FoldersNode>,
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

/** Folder the cover images are taken from: the folder itself or one of its children. */
const previewFolder = ref(props.item.fileid)

const previewFiles = computed<FoldersNode[]>(() => (folders.value[previewFolder.value] ?? [])
	.map((fileid) => files.value[fileid])
	.filter((file) => file !== undefined)
	// only get the 4 first images
	.slice(0, 4))

/**
 * Fetch the content of a folder and store it.
 *
 * @param filename - Absolute path of the folder
 */
async function getFolderData(filename: string) {
	try {
		// Remove leading /file/{userId}
		const prefix = `/files/${getCurrentUser()?.uid}`
		const unPrefixedFileName = filename.replace(new RegExp(`^${prefix}`), '')

		// get data
		const { folder, folders, files } = await getFolderContent(unPrefixedFileName, {
			shared: props.showShared,
			signal: abortController.signal,
		})
		store.dispatch('updateFolders', { fileid: folder?.fileid, files, folders })
		store.dispatch('updateFoldersFiles', { folder, files, folders })
	} catch (error) {
		logger.error('Failed to get folder content', { error, filename })
	}
}

// If we did not find any preview in the folder we try the next subfolder.
// We limit to one subfolder for performance concerns.
watch(previewFiles, () => {
	if (previewFiles.value.length > 0 || previewFolder.value !== props.item.fileid) {
		return
	}

	const firstChildFolder = subFolders.value[props.item.fileid]?.[0]
	if (firstChildFolder === undefined) {
		return
	}

	previewFolder.value = firstChildFolder
	if (folders.value[firstChildFolder] === undefined && files.value[firstChildFolder] !== undefined) {
		getFolderData(files.value[firstChildFolder].filename)
	}
}, { immediate: true })

if (folders.value[props.item.fileid] === undefined) {
	getFolderData(props.item.filename)
}
</script>
