<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Photo metadata')"
		@update:open="emit('close')">
		<NcLoadingIcon v-if="metadata === undefined" :size="32" class="photo-metadata__loading" />

		<PhotoMetadataList v-else :metadata="metadata" :basename="photo.basename" />
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoExif } from '../utils/exif.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { translate as t } from '@nextcloud/l10n'
import { onMounted, ref } from 'vue'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import PhotoMetadataList from './PhotoMetadataList.vue'
import { fetchPhotoExif } from '../services/exifFetcher.ts'

const props = defineProps<{
	/** Photo to show the metadata of. */
	photo: PhotoTarget
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

/** Metadata of the photo, `undefined` while it is being fetched. */
const metadata = ref<PhotoExif | undefined>()

// The EXIF properties are not part of the file listings, they are only fetched
// once the user asks for them.
onMounted(async () => {
	metadata.value = await fetchPhotoExif(props.photo)
})
</script>

<style lang="scss" scoped>
.photo-metadata__loading {
	margin: calc(var(--default-grid-baseline) * 4) auto;
}
</style>
