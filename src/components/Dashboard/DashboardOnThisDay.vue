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
				:allow-selection="false" />
			<NcButton :href="moreUrl">
				{{ t('photos', 'More photos from this day') }}
			</NcButton>
		</template>
	</div>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ImageOutlineIcon from 'vue-material-design-icons/ImageOutline.vue'
import FileComponent from '../FileComponent.vue'
import { allMimes } from '../../services/AllowedMimes.js'
import logger from '../../services/logger.js'
import getPhotos from '../../services/PhotoSearch.js'

export default {
	name: 'DashboardOnThisDay',
	components: {
		FileComponent,
		NcButton,
		NcLoadingIcon,
		NcEmptyContent,
		ImageOutlineIcon,
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

	methods: {
		t,
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
