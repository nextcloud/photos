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
			<Loader v-if="loadingAlbums" class="loading-icon" />
		</h2>

		<div class="albums-container">
			<div v-for="album in albums"
				:key="album.basename"
				class="album"
				@click="pickAlbum(album.basename)">
				<img v-if="album.lastPhoto !== 0" class="album__image" :src="album.lastPhoto | toCoverUrl">
				<div v-else class="album__image album__image--placeholder">
					<ImageMultiple :size="32" />
				</div>
				<div class="album__details">
					<div class="album__details__first-line">
						<b class="album__details__name">
							{{ album.basename }}
						</b>
					</div>
					<div class="album__details__second-line">
						{{ n('photos', '%n item', '%n photos and videos', album.nbItems) }}
						<!-- TODO: finish collaboration -->
						<!--⸱ {{ n('photos', 'Share with %n user', 'Share with %n users', album.isShared) }}-->
					</div>
				</div>
			</div>
		</div>

		<Button :aria-label="t('photos', 'Create a new album.')"
			class="new-album-button"
			type="tertiary"
			@click="showAlbumCreationForm = true">
			<template #icon>
				<Plus />
			</template>
			{{ t('photos', 'Create new album') }}
		</Button>
	</div>

	<AlbumForm v-else
		:display-back-button="true"
		:title="t('photos', 'New album')"
		@back="showAlbumCreationForm = false"
		@done="albumCreatedHandler" />
</template>

<script>
import Plus from 'vue-material-design-icons/Plus'
import ImageMultiple from 'vue-material-design-icons/ImageMultiple'

import { Button } from '@nextcloud/vue'
import { generateUrl } from '@nextcloud/router'

import FetchAlbumsMixin from '../mixins/FetchAlbumsMixin.js'
import AlbumForm from './AlbumForm.vue'
import Loader from '../components/Loader.vue'

export default {
	name: 'AlbumPicker',

	components: {
		Button,
		AlbumForm,
		Loader,
		Plus,
		ImageMultiple,
	},

	filters: {
		/**
		 * @param {string} fileId - The id of the file.
		 * @return {string}
		 */
		toCoverUrl(fileId) {
			return generateUrl(`/core/preview?fileId=${fileId}&x=${64}&y=${64}&forceIcon=0&a=1`)
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
		padding-left: 8px;

		.loading-icon {
			margin-left: 32px;
		}
	}

	.albums-container {
		min-height: 150px;
		max-height: 350px;
		overflow: scroll;
		padding-right: 8px;

		.album {
			display: flex;
			padding: 8px;
			border-radius: 8px;

			&, & * {
				cursor: pointer;
			}

			&:not(:last-child) {
				margin-bottom: 16px;
			}

			&:hover {
				background: var(--color-background-dark);
			}

			&__image {
				width: 50px;
				height: 50px;
				object-fit: none;
				border-radius: 4px;
				margin-right: 8px;
				background: var(--color-background-darker);

				&--placeholder {
					background: var(--color-primary-light);

					::v-deep .material-design-icon {
						width: 100%;
						height: 100%;

						.material-design-icon__svg {
							fill: var(--color-primary);
						}
					}
				}
			}

			&__details {
				display: flex;
				align-items: flex-start;
				flex-direction: column;
				min-width: 0;

				&__first-line {
					width: 100%;
				}

				&__name {
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				&__second-line{
					color: var(--color-text-lighter);
				}
			}
		}
	}

	.new-album-button {
		margin-top: 32px;
	}
}
</style>
