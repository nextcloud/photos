<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-tab">
		<NcLoadingIcon v-if="metadata === undefined" :size="32" class="photos-tab__loading" />
		<PhotoMetadataList v-else :metadata="metadata" />
	</div>
</template>

<script lang="ts" setup>
import type { IFolder, INode, IView, Node } from '@nextcloud/files'
import type { PhotoExif } from '../utils/exif.ts'

import { ref, watch } from 'vue'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import PhotoMetadataList from '../components/PhotoMetadataList.vue'
import { fetchPhotoExif } from '../services/exifFetcher.ts'
import { toPhotoTarget } from '../utils/fileUtils.ts'

const props = defineProps<{
	/** Whether the tab is the one shown in the sidebar. */
	active: boolean
	node: INode

	// eslint-disable-next-line vue/no-unused-properties -- part of the sidebar tab interface
	folder?: IFolder
	// eslint-disable-next-line vue/no-unused-properties -- part of the sidebar tab interface
	view?: IView
}>()

/** Metadata of the photo, `undefined` while it is being fetched. */
const metadata = ref<PhotoExif | undefined>()

/** Source of the node the metadata was fetched for. */
let fetchedSource: string | undefined

// The metadata is only fetched once the tab is shown, and the viewer moves the
// sidebar along with every photo, so a response may arrive after the next node.
watch([() => props.node?.source, () => props.active], async ([source, active]) => {
	if (!active || source === undefined || source === fetchedSource) {
		return
	}

	fetchedSource = source
	metadata.value = undefined
	const result = await fetchPhotoExif(toPhotoTarget(props.node as Node))
	if (fetchedSource === source) {
		metadata.value = result
	}
}, { immediate: true })
</script>

<style lang="scss" scoped>
.photos-tab {
	padding-block: calc(var(--default-grid-baseline) * 2);

	&__loading {
		margin: calc(var(--default-grid-baseline) * 4) auto;
	}
}
</style>
