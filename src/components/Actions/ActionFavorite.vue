<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcActionButton v-if="shouldFavoriteSelection"
		:close-after-click="true"
		:aria-label="t('photos', 'Mark selection as favorite')"
		@click="favoriteSelection">
		{{ t('photos', 'Add selection to favorites') }}
		<Star slot="icon" />
	</NcActionButton>
	<NcActionButton v-else
		:close-after-click="true"
		:aria-label="t('photos', 'Remove selection from favorites')"
		@click="unFavoriteSelection">
		{{ t('photos', 'Remove selection from favorites') }}
		<Star slot="icon" />
	</NcActionButton>
</template>

<script lang='ts'>
import { defineComponent, type PropType } from 'vue'
import Star from 'vue-material-design-icons/Star.vue'

import { NcActionButton } from '@nextcloud/vue'
import { translate as t } from '@nextcloud/l10n'

export default defineComponent({
	name: 'ActionFavorite',
	components: {
		Star,
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
			return this.$store.state.files.files
		},

		shouldFavoriteSelection() {
			// Favorite all selection if at least one file is not in the favorites.
			return this.selectedFileIds.some((fileId) => this.files[fileId].attributes.favorite === 0)
		},
	},

	methods: {
		async favoriteSelection() {
			await this.$store.dispatch('toggleFavoriteForFiles', { fileIds: this.selectedFileIds, favoriteState: 1 })
		},

		async unFavoriteSelection() {
			await this.$store.dispatch('toggleFavoriteForFiles', { fileIds: this.selectedFileIds, favoriteState: 0 })
		},

		t,
	},
})
</script>
