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
	<div v-if="!showAlbumCreationForm" class="album-picker">
		<h2>
			{{ t('photos', 'Add to Album') }}
			<NcLoadingIcon v-if="loadingAlbums" class="loading-icon" />
		</h2>

		<ul class="albums-container">
			<NcListItem v-for="album in albums"
				:key="album.basename"
				class="album"
				:title="album.basename"
				:aria-label="t('photos', 'Add selection to album {albumName}', {albumName: album.basename})"
				@click="pickAlbum(album.basename)">
				<template slot="icon">
					<img v-if="album.lastPhoto !== -1" class="album__image" :src="album.lastPhoto | toCoverUrl">
					<div v-else class="album__image album__image--placeholder">
						<ImageMultiple :size="32" />
					</div>
				</template>

				<template slot="subtitle">
					{{ n('photos', '%n item', '%n photos and videos', album.nbItems) }}
					<!-- TODO: finish collaboration -->
					<!--⸱ {{ n('photos', 'Share with %n user', 'Share with %n users', album.isShared) }}-->
				</template>
			</NcListItem>
		</ul>

		<NcButton :aria-label="t('photos', 'Create a new album.')"
			class="new-album-button"
			type="tertiary"
			@click="showAlbumCreationForm = true">
			<template #icon>
				<Plus />
			</template>
			{{ t('photos', 'Create new album') }}
		</NcButton>
	</div>

	<AlbumForm v-else
		:display-back-button="true"
		:title="t('photos', 'New album')"
		@back="showAlbumCreationForm = false"
		@done="albumCreatedHandler" />
</template>

<script>
import Plus from 'vue-material-design-icons/Plus.vue'
import ImageMultiple from 'vue-material-design-icons/ImageMultiple.vue'

import { NcButton, NcListItem, NcLoadingIcon } from '@nextcloud/vue'
import { generateUrl } from '@nextcloud/router'

import FetchAlbumsMixin from '../../mixins/FetchAlbumsMixin.js'
import AlbumForm from './AlbumForm.vue'

export default {
	name: 'AlbumPicker',

	components: {
		Plus,
		ImageMultiple,
		NcButton,
		NcListItem,
		NcLoadingIcon,
		AlbumForm,
	},

	filters: {
		/**
		 * @param {string} fileId - The id of the file.
		 * @return {string}
		 */
		toCoverUrl(fileId) {
			return generateUrl(`/apps/photos/api/v1/preview/${fileId}?x=${64}&y=${64}`)
		},
	},

	mixins: [
		FetchAlbumsMixin,
	],

	data() {
		return {
			showAlbumCreationForm: false,
		}
	},

	methods: {
		albumCreatedHandler() {
			this.showAlbumCreationForm = false
			this.fetchAlbums()
		},

		pickAlbum(albumBaseName) {
			this.$emit('album-picked', albumBaseName)
		},
	},
}
</script>

<style lang="scss" scoped>
.album-picker {
	padding: 32px;
	padding-top: 16px;

	h2 {
		display: flex;
		align-items: center;
		height: 60px;

		.loading-icon {
			margin-left: 32px;
		}
	}

	.albums-container {
		min-height: 150px;
		max-height: 350px;
		overflow-x: scroll;
		padding: 2px;

		.album {

			:deep .list-item {
				padding: 8px 16px;
				box-sizing: border-box;
			}

			&:not(:last-child) {
				margin-bottom: 16px;
			}

			&__image {
				width: 40px;
				height: 40px;
				object-fit: none;
				border-radius: var(--border-radius);

				&--placeholder {
					background: var(--color-primary-element-light);

					:deep .material-design-icon {
						width: 100%;
						height: 100%;

						.material-design-icon__svg {
							fill: var(--color-primary-element);
						}
					}
				}
			}
		}
	}

	.new-album-button {
		margin-top: 32px;
	}
}
</style>
