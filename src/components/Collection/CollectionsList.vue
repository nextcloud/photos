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
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error" :title="t('photos', 'An error occurred') ">
		<AlertCircle slot="icon" />
	</NcEmptyContent>

	<div v-else class="collections">
		<!-- Collection header -->
		<slot name="header" />

		<!-- No collections -->
		<slot v-if="noCollection && !loading" name="empty-collections-list" class="collections__empty" />

		<!-- List -->
		<ul v-else-if="!noCollection" class="collections__list">
			<slot v-for="collection in collections"
				:collection="collection"
				class="collection" />
		</ul>
	</div>
</template>

<script>
import AlertCircle from 'vue-material-design-icons/AlertCircle.vue'

import { NcEmptyContent } from '@nextcloud/vue'

export default {
	name: 'CollectionsList',

	components: {
		AlertCircle,
		NcEmptyContent,
	},

	props: {
		collections: {
			type: Object,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		error: {
			type: Error,
			default: null,
		},
	},

	computed: {
		/**
		 * @return {boolean} Whether the list of collections is empty or not.
		 */
		noCollection() {
			return Object.keys(this.collections).length === 0
		},
	},
}
</script>
<style lang="scss" scoped>
.collections {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__list {
		padding: 32px 48px;
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: flex-start;
		height: calc(100% - 60px);
		overflow-x: scroll;

		@media only screen and (max-width: 1200px) {
			padding: 32px 12px;
			justify-content: center;
		}
	}
}
</style>
