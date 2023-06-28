<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 -
 - @author Louis Chemineau <louis@chmn.me>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
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

<script>
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
