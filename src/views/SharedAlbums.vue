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
	<CollectionsList :collections="sharedAlbums"
		:loading="loadingAlbums"
		:error="errorFetchingAlbums"
		class="albums-list">
		<HeaderNavigation key="navigation"
			slot="header"
			:loading="loadingAlbums"
			:title="t('photos', 'Shared albums')"
			:root-title="t('photos', 'Shared albums')"
			@refresh="fetchAlbums" />

		<CollectionCover :key="collection.basename"
			slot-scope="{collection}"
			:link="`/sharedalbums/${collection.basename}`"
			:alt-img="t('photos', 'Cover photo for shared album {albumName}.', { albumName: collection.basename })"
			:data-test="collection.basename"
			:cover-url="collection.lastPhoto | coverUrl">
			<h2 class="album__name">
				{{ collection | albumOriginalName }}
			</h2>

			<div slot="subtitle" class="album__details">
				{{ collection.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', collection.nbItems,) }}
				<br>
				{{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :display-name="collection.collaborators[0].label" :user="collection.collaborators[0].id" />
			</div>
		</CollectionCover>

		<NcEmptyContent slot="empty-collections-list" :title="t('photos', 'There is no album yet!')">
			<FolderMultipleImage slot="icon" />
		</NcEmptyContent>
	</CollectionsList>
</template>

<script>
import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'

import { generateUrl } from '@nextcloud/router'
import { NcEmptyContent, NcUserBubble } from '@nextcloud/vue'

import FetchSharedAlbumsMixin from '../mixins/FetchSharedAlbumsMixin.js'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { translate, translatePlural } from '@nextcloud/l10n'

export default {
	name: 'SharedAlbums',
	components: {
		FolderMultipleImage,
		NcEmptyContent,
		CollectionsList,
		CollectionCover,
		HeaderNavigation,
		NcUserBubble,
	},

	filters: {
		/**
		 * @param {string} lastPhoto The album's last photos.
		 * @return {string}
		 */
		coverUrl(lastPhoto) {
			if (lastPhoto === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`)
		},

		/**
		 * @param {import('../services/Albums.js').Album} album The album's full name, including the userid.
		 * @return {string} The album name without the userId between parentheses.
		 */
		albumOriginalName(album) {
			return album.basename.replace(new RegExp(`\\(${album.collaborators[0].id}\\)$`), '')
		},
	},

	mixins: [
		FetchSharedAlbumsMixin,
	],

	methods: {
		t: translate,
		n: translatePlural,
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
