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
	<div>
		<CollectionsList :collections="albums"
			:loading="loadingAlbums"
			:error="errorFetchingAlbums"
			class="albums-list">
			<HeaderNavigation key="navigation"
				slot="header"
				:loading="loadingAlbums"
				:title="t('photos', 'Albums')"
				:root-title="t('photos', 'Albums')"
				@refresh="fetchAlbums">
				<NcButton :aria-label="t('photos', 'Create a new album.')"
					@click="showAlbumCreationForm = true">
					<template #icon>
						<Plus />
					</template>
					{{ t('photos', 'New album') }}
				</NcButton>
			</HeaderNavigation>

			<CollectionCover :key="collection.basename"
				slot-scope="{collection}"
				:link="`/albums/${collection.basename}`"
				:alt-img="t('photos', 'Cover photo for album {albumName}', { albumName: collection.basename })"
				:cover-url="collection.lastPhoto | coverUrl">
				<h2 class="album__name">
					{{ collection.basename }}
				</h2>

				<div slot="subtitle" class="album__details">
					{{ collection.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', collection.nbItems,) }}
				</div>
			</CollectionCover>

			<NcEmptyContent slot="empty-collections-list" :title="t('photos', 'There is no album yet!')">
				<FolderMultipleImage slot="icon" />
			</NcEmptyContent>
		</CollectionsList>

		<NcModal v-if="showAlbumCreationForm"
			:title="t('photos', 'New album')"
			@close="showAlbumCreationForm = false">
			<AlbumForm @done="handleAlbumCreated" />
		</NcModal>
	</div>
</template>

<script>
import Plus from 'vue-material-design-icons/Plus.vue'
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'

import { generateUrl } from '@nextcloud/router'
import { NcModal, NcButton, NcEmptyContent } from '@nextcloud/vue'

import FetchAlbumsMixin from '../mixins/FetchAlbumsMixin.js'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'

export default {
	name: 'Albums',
	components: {
		Plus,
		FolderMultipleImage,
		NcModal,
		NcButton,
		NcEmptyContent,
		CollectionsList,
		CollectionCover,
		HeaderNavigation,
		AlbumForm,
	},

	filters: {
		/**
		 * @param {string} lastPhoto The album's last photos.
		 */
		coverUrl(lastPhoto) {
			if (lastPhoto === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`)
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
		handleAlbumCreated({ album }) {
			this.showAlbumCreationForm = false
			this.$router.push(`albums/${album.basename}`)
		},
	},
}
</script>
<style lang="scss" scoped>
.albums-list {
	display: flex;
	flex-direction: column;

	.album__name {
		font-weight: normal;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
