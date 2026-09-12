<!--
 - SPDX-FileCopyrightText: 2020 The Nextcloud Bookmarks contributors.
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="on-this-day-dashboard">
		<NcLoadingIcon v-if="loading" :size="48" />
		<NcEmptyContent
			v-else-if="items.length === 0"
			:name="t('photos', 'No picture for this day')"
			:description="t('photos', 'Picture taken on this day will show up here.')">
			<template #icon>
				<ImageOutlineIcon />
			</template>
		</NcEmptyContent>
		<template v-else>
			<FileComponent
				class="on-this-day-dashboard__file"
				:file="items[0]"
				:allowSelection="false"
				:showActionsMenu="false" />
			<NcButton :href="moreUrl">
				{{ t('photos', 'More photos from this day') }}
			</NcButton>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { PhotoFile } from '../../store/files.ts'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { ref, shallowRef } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ImageOutlineIcon from 'vue-material-design-icons/ImageOutline.vue'
import FileComponent from '../FileComponent.vue'
import { allMimes } from '../../services/AllowedMimes.ts'
import { logger } from '../../services/logger.ts'
import { getPhotos } from '../../services/PhotoSearch.ts'

const loading = ref(true)
const items = shallowRef<PhotoFile[]>([])

const moreUrl = generateUrl('/apps/photos/thisday')

async function loadOnThisDay(): Promise<void> {
	try {
		// The search asks for the photos properties, which the generic File type does not carry.
		items.value = await getPhotos({
			firstResult: 0,
			nbResults: 1,
			mimesType: allMimes,
			onThisDay: true,
		}) as PhotoFile[]
	} catch (error) {
		logger.error('Failed to load on this day pictures', { error })
	} finally {
		loading.value = false
	}
}

loadOnThisDay()
</script>

<style lang="scss" scoped>
.on-this-day-dashboard {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	gap: 16px;

	.file-container {
		flex-grow: 1;
		border: none;
	}
}
</style>
