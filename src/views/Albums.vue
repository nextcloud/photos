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
	<EmptyContent v-if="errorFetchingAlbums">
		{{ t('photos', 'An error occurred') }}
	</EmptyContent>

	<!-- Album list -->
	<div v-else class="albums">
		<div class="albums__header">
			<Button type="primary"
				:aria-label="t('photos', 'Create a new album.')"
				@click="showAlbumCreationForm = true">
				<template #icon>
					<Plus />
				</template>
				{{ t('photos', 'New album') }}
			</Button>

			<Loader v-if="loadingAlbums" />
		</div>

		<!-- No albums -->
		<div v-if="noAlbums && !loadingAlbums" class="albums__empty">
			<EmptyContent>
				<template #icon>
					<FolderMultipleImage />
				</template>
				<template #desc>
					{{ t('photos', "There is no album yet!") }}
				</template>
			</EmptyContent>

			<Button class="albums__empty__button"
				type="primary"
				:aria-label="t('photos', 'Create a new album')"
				@click="showAlbumCreationForm = true">
				<template #icon>
					<Plus />
				</template>
				{{ t('photos', "Add") }}
			</Button>
		</div>

		<div v-else-if="!noAlbums" class="albums__list">
			<AlbumCover v-for="album in albums"
				:key="album.basename"
				class="album"
				:base-name="album.basename" />
		</div>

		<Modal v-if="showAlbumCreationForm"
			:title="t('photos', 'New album')"
			@close="showAlbumCreationForm = false">
			<AlbumForm @done="handleAlbumCreated" />
		</Modal>
	</div>
</template>

<script>
import Plus from 'vue-material-design-icons/Plus'
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage'

import { Button, Modal, EmptyContent } from '@nextcloud/vue'

import FetchAlbumsMixin from '../mixins/FetchAlbumsMixin.js'
import AlbumCover from '../components/AlbumCover.vue'
import AlbumForm from '../components/AlbumForm.vue'
import Loader from '../components/Loader.vue'

export default {
	name: 'Albums',
	components: {
		AlbumCover,
		EmptyContent,
		AlbumForm,
		Loader,
		Modal,
		Button,
		Plus,
		FolderMultipleImage,
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
			this.$router.push(`/albums/${album.basename}`)
		},
	},
}
</script>
<style lang="scss" scoped>
.albums {
	display: flex;
	flex-direction: column;

	&__header {
		display: flex;
		min-height: 60px;
		align-items: center;
		padding: 8px 64px 32px 64px;
		position: sticky;
		top: var(--header-height);
		width: 100%;
		z-index: 3;
		background: var(--color-main-background);

		@media only screen and (max-width: 1200px) {
			padding: 8px 48px 32px 48px;
		}

		button {
			margin-right: 32px;
		}
	}

	&__list {
		padding: 0px 48px 32px 48px;
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: flex-start;

		@media only screen and (max-width: 1200px) {
			padding: 0px 12px 32px 12px;
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
