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
	<NcEmptyContent v-if="errorFetchingAlbums">
		{{ t('photos', 'An error occurred') }}
	</NcEmptyContent>

	<!-- Album list -->
	<div v-else class="albums">
		<HeaderNavigation key="navigation"
			:loading="loadingAlbums"
			:title="t('photos', 'Albums')"
			:root-title="t('photos', 'Albums')"
			@refresh="onRefresh">
			<NcButton type="primary"
				:aria-label="t('photos', 'Create a new album.')"
				@click="showAlbumCreationForm = true">
				<template #icon>
					<Plus />
				</template>
				{{ t('photos', 'New album') }}
			</NcButton>
		</HeaderNavigation>

		<!-- No albums -->
		<div v-if="noAlbums && !loadingAlbums" class="albums__empty">
			<NcEmptyContent>
				<template #icon>
					<FolderMultipleImage />
				</template>
				<template #desc>
					{{ t('photos', "There is no album yet!") }}
				</template>
			</NcEmptyContent>

			<NcButton class="albums__empty__button"
				type="primary"
				:aria-label="t('photos', 'Create a new album')"
				@click="showAlbumCreationForm = true">
				<template #icon>
					<Plus />
				</template>
				{{ t('photos', "Add") }}
			</NcButton>
		</div>

		<div v-else-if="!noAlbums" class="albums__list">
			<AlbumCover v-for="album in albums"
				:key="album.basename"
				class="album"
				:base-name="album.basename" />
		</div>

		<NcModal v-if="showAlbumCreationForm"
			:title="t('photos', 'New album')"
			@close="showAlbumCreationForm = false">
			<AlbumForm @done="handleAlbumCreated" />
		</NcModal>
	</div>
</template>

<script>
import { NcButton, NcModal, NcEmptyContent } from '@nextcloud/vue'

import Plus from 'vue-material-design-icons/Plus'
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage'

import FetchAlbumsMixin from '../mixins/FetchAlbumsMixin.js'
import AlbumCover from '../components/AlbumCover.vue'
import AlbumForm from '../components/AlbumForm.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'

export default {
	name: 'Albums',
	components: {
		AlbumCover,
		AlbumForm,
		FolderMultipleImage,
		HeaderNavigation,
		NcButton,
		NcEmptyContent,
		NcModal,
		Plus,
	},

	mixins: [
		FetchAlbumsMixin,
	],

	data() {
		return {
			showAlbumCreationForm: false,
		}
	},

	computed: {
		/**
		 * @return {boolean} Whether the list of album is empty or not.
		 */
		noAlbums() {
			return Object.keys(this.albums).length === 0
		},
	},

	methods: {
		handleAlbumCreated({ album }) {
			this.showAlbumCreationForm = false
			this.$router.push({
				name: 'albums',
				params: {
					path: album.basename,
				},
			})
		},

		onRefresh() {
			this.fetchAlbums()
		},
	},
}
</script>
<style lang="scss" scoped>
.albums {
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
