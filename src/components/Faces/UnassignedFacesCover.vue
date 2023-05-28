<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 - @copyright Copyright (c) 2022 Marcel Klehr <mklehr@gmx.net>
 -
 - @author Louis Chemineau <louis@chmn.me>
 - @author Marcel Klehr <mklehr@gmx.net>
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
	<div :class="['face-cover', small && 'face-cover--small']" @click="$emit('click')">
		<div class="face-cover__crop-container">
			<AccountOffIcon :size="'auto'" :fill-color="colorMainBackground" />
		</div>
		<div class="face-cover__details">
			<div v-if="!small" class="face-cover__details__second-line">
				{{ n('photos', '%n unassigned photo', '%n unassigned photos', unassignedFilesCount) }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import FetchFacesMixin from '../../mixins/FetchFacesMixin.js'
import FaceCoverMixin from '../../mixins/FaceCoverMixin.js'
import AccountOffIcon from 'vue-material-design-icons/AccountOff.vue'

export default {
	name: 'UnassignedFacesCover',

	components: { AccountOffIcon },

	mixins: [
		FetchFacesMixin,
		FaceCoverMixin,
	],

	props: {
		small: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		...mapGetters([
			'unassignedFilesCount',
		]),
		colorMainBackground() {
			return getComputedStyle(document.documentElement).getPropertyValue('--color-main-background')
		},
	},

	async mounted() {
		await this.fetchUnassignedFacesCount()
	},
}
</script>

<style lang="scss" scoped>
@import '../../mixins/FaceCover';
</style>
