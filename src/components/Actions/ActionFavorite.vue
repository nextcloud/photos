<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcActionButton
		v-if="shouldFavoriteSelection"
		:closeAfterClick="true"
		:aria-label="t('photos', 'Mark selection as favorite')"
		@click="favoriteSelection">
		<template #icon>
			<StarOutline />
		</template>
		{{ t('photos', 'Add selection to favorites') }}
	</NcActionButton>
	<NcActionButton
		v-else
		:closeAfterClick="true"
		:aria-label="t('photos', 'Remove selection from favorites')"
		@click="unFavoriteSelection">
		<template #icon>
			<Star />
		</template>
		{{ t('photos', 'Remove selection from favorites') }}
	</NcActionButton>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import {
	type PropType,

	defineComponent,
} from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'

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
