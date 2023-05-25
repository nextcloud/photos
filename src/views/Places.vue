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
		<CollectionsList :collections="places"
			:loading="loadingCollections"
			:error="errorFetchingCollections"
			class="places-list">
			<HeaderNavigation key="navigation"
				slot="header"
				:loading="loadingCollections"
				:title="t('photos', 'Places')"
				:root-title="t('photos', 'Places')"
				@refresh="fetchPlaces" />

			<CollectionCover :key="collection.basename"
				slot-scope="{collection}"
				:link="`/places/${collection.basename}`"
				:alt-img="t('photos', 'Cover photo for place {placeName}', { placeName: collection.basename })"
				:cover-url="collection.lastPhoto | coverUrl">
				<h2 class="place__name">
					{{ collection.basename }}
				</h2>

				<div slot="subtitle" class="place__details">
					{{ n('photos', '%n item', '%n photos and videos', collection.nbItems,) }}
				</div>
			</CollectionCover>

			<NcEmptyContent slot="empty-collections-list" :title="t('photos', 'There is no place yet!')">
				<FolderMultipleImage slot="icon" />
			</NcEmptyContent>
		</CollectionsList>
	</div>
</template>

<script>

import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'

import { generateUrl } from '@nextcloud/router'
import { NcEmptyContent } from '@nextcloud/vue'
import { getCurrentUser } from '@nextcloud/auth'
import { translate, translatePlural } from '@nextcloud/l10n'

import FetchCollectionsMixin from '../mixins/FetchCollectionsMixin.js'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'

export default {
	name: 'Places',
	components: {
		FolderMultipleImage,
		NcEmptyContent,
		CollectionsList,
		CollectionCover,
		HeaderNavigation,
	},

	filters: {
		/**
		 * @param {string} fileId The place's last photo.
		 */
		coverUrl(fileId) {
			if (fileId === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${fileId}?x=${512}&y=${512}`)
		},
	},

	mixins: [
		FetchCollectionsMixin,
	],
	computed: {
		/**
		 * @return {{place: Object<string, import('../services/collectionFetcher').Collection>}}
		 */
		places() {
			return this.$store.getters.places
		},
	},

	async beforeMount() {
		this.fetchPlaces()
	},

	methods: {
		fetchPlaces() {
			this.fetchCollections(`/photos/${getCurrentUser()?.uid}/places`)
		},

		t: translate,
		n: translatePlural,
	},
}
</script>
<style lang="scss" scoped>
.places-list {
	display: flex;
	flex-direction: column;

	.place__name {
		font-weight: normal;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
