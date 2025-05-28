<!--
 - SPDX-FileCopyrightText: 2020 The Nextcloud Bookmarks contributors.
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="on-this-day-dashboard">
		<NcLoadingIcon v-if="loading" :size="48" />
		<NcEmptyContent v-else-if="items.length === 0"
			:name="t('photos', 'No picture for this day')"
			:description="t('photos', 'Picture taken on this day will show up here.')">
			<template #icon>
				<ImageIcon />
			</template>
		</NcEmptyContent>
		<template v-else>
			<File class="on-this-day-dashboard__file"
				:file="items[0]"
				:allow-selection="false" />
			<NcButton :href="moreUrl">
				{{ t('photos', 'More photos from this day') }}
			</NcButton>
		</template>
	</div>
</template>

<script lang='ts'>
import Image from 'vue-material-design-icons/Image.vue'

import { generateUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'

import getPhotos from '../../services/PhotoSearch.js'
import { allMimes } from '../../services/AllowedMimes.js'
import File from '../File.vue'
import logger from '../../services/logger.js'

export default {
	name: 'DashboardOnThisDay',
	components: {
		File,
		NcButton,
		NcLoadingIcon,
		NcEmptyContent,
		ImageIcon: Image,
	},
	data() {
		return {
			loading: true,
			items: [],
		}
	},
	computed: {
		moreUrl() {
			return generateUrl('/apps/photos/thisday')
		},
	},
	async created() {
		try {
			this.items = await getPhotos({
				firstResult: 0,
				nbResults: 1,
				mimesType: allMimes,
				onThisDay: true,
			})
		} catch (error) {
			logger.error('Failed to load on this day pictures', { error })
		} finally {
			this.loading = false
		}
	},
}
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
