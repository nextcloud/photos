<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<FolderTagPreview
		:id="item.fileid"
		:name="item.basename"
		:path="item.path"
		:previews="item.attributes.previews" />
</template>

<script setup lang='ts'>
import type { Folder } from '@nextcloud/files'
import type { PropType } from 'vue'

import FolderTagPreview from './FolderTagPreview.vue'

defineProps({
	item: {
		type: Object as PropType<Folder>,
		required: true,
	},
})
</script>
