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
import { mapActions, mapGetters } from 'vuex'
import Star from 'vue-material-design-icons/Star.vue'

import { NcActionButton } from '@nextcloud/vue'

export default {
	name: 'ActionFavorite',
	components: {
		Star,
		NcActionButton,
	},

	props: {
		selectedFileIds: {
			type: Array,
			required: true,
		},
	},

	computed: {
		...mapGetters([
			'files',
		]),

		/** @return {boolean} */
		shouldFavoriteSelection() {
			// Favorite all selection if at least one file is not in the favorites.
			return this.selectedFileIds.some((fileId) => this.files[fileId].favorite === 0)
		},
	},

	methods: {
		...mapActions([
			'toggleFavoriteForFiles',
		]),

		async favoriteSelection() {
			await this.toggleFavoriteForFiles({ fileIds: this.selectedFileIds, favoriteState: 1 })
		},

		async unFavoriteSelection() {
			await this.toggleFavoriteForFiles({ fileIds: this.selectedFileIds, favoriteState: 0 })
		},
	},
}
</script>
