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
	<EmptyContent v-if="errorFetchingFaces">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<!-- Album list -->
	<div v-else class="albums">
		<div class="albums__header">
			<Loader v-if="loadingFaces" />
		</div>

		<!-- No albums -->
		<div v-if="noFaces && !loadingFaces" class="albums__empty">
			<EmptyContent>
				<template #icon>
					<AccountBoxMultipleOutline />
				</template>
				<template #desc>
					{{ t('photos', "No people have been discovered in your photos, yet.") }}
				</template>
			</EmptyContent>
		</div>

		<div v-else-if="!noFaces" class="albums__list">
			<FaceCover v-for="face in faces"
				:key="face.basename"
				class="album"
				:base-name="face.basename" />
		</div>
	</div>
</template>

<script>
import AccountBoxMultipleOutline from 'vue-material-design-icons/AccountBoxMultipleOutline'

import { EmptyContent } from '@nextcloud/vue'

import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import Loader from '../components/Loader.vue'
import FaceCover from '../components/FaceCover.vue'

export default {
	name: 'Faces',
	components: {
		FaceCover,
		EmptyContent,
		Loader,
		AccountBoxMultipleOutline,
	},

	mixins: [
		FetchFacesMixin,
	],

	computed: {
		/**
		 * @return {boolean} Whether the list of album is empty or not.
		 */
		noFaces() {
			return Object.keys(this.faces).length === 0
		},
	},
}
</script>
<style lang="scss" scoped>
.albums {
	height: 100%;
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--header-height));
	padding: 4px 64px;

	@media only screen and (max-width: 1200px) {
		padding: 4px 32px;
	}

	&__header {
		display: flex;
		min-height: 60px;
		align-items: center;

		button {
			margin-right: 32px;
		}
	}

	&__list {
		margin-top: 8px;
		padding-top: 24px;
		padding-bottom: 32px;
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		overflow: scroll;
		gap: 32px;
	}

	&__empty {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__button {
			margin-top: 32px;
		}
	}
}

.empty-content-with-illustration ::v-deep .empty-content__icon {
	width: 200px;
	height: 200px;

	svg {
		width: 200px;
		height: 200px;
	}
}
</style>
