<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcActionButton
		v-if="shouldFavoriteSelection"
		:close-after-click="true"
		:aria-label="t('photos', 'Mark selection as favorite')"
		@click="favoriteSelection">
		{{ t('photos', 'Add selection to favorites') }}
		<StarOutline slot="icon" />
	</NcActionButton>
	<NcActionButton
		v-else
		:close-after-click="true"
		:aria-label="t('photos', 'Remove selection from favorites')"
		@click="unFavoriteSelection">
		{{ t('photos', 'Remove selection from favorites') }}
		<Star slot="icon" />
	</NcActionButton>
</template>

<script lang='ts'>
import type { PropType } from 'vue'

import { t } from '@nextcloud/l10n'
import {
	defineComponent,
} from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import useFilesStore from '../../store/files.ts'

export default defineComponent({
	name: 'ActionFavorite',
	components: {
		Star,
		StarOutline,
		NcActionButton,
	},

	props: {
		selectedFileIds: {
			type: Array as PropType<string[]>,
			required: true,
		},
	},

	computed: {
		files() {
			return useFilesStore().files
		},

		shouldFavoriteSelection() {
			// Favorite all selection if at least one file is not in the favorites.
			return this.selectedFileIds.some((fileId) => this.files[fileId].attributes.favorite === 0)
		},
	},

	methods: {
		async favoriteSelection() {
			await useFilesStore().toggleFavoriteForFiles(this.selectedFileIds, 1)
		},

		async unFavoriteSelection() {
			await useFilesStore().toggleFavoriteForFiles(this.selectedFileIds, 0)
		},

		t,
	},
})
</script>
