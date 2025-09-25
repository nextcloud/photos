<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionsList
			:collections="places"
			:loading="loadingCollections"
			:error="errorFetchingCollections"
			class="places-list">
			<HeaderNavigation
				key="navigation"
				slot="header"
				:loading="loadingCollections"
				:title="t('photos', 'Places')"
				:root-title="t('photos', 'Places')"
				@refresh="fetchPlaces" />

			<CollectionCover
				:key="collection.basename"
				slot-scope="{ collection }"
				parent-route="/places"
				:collection-name="collection.basename"
				:alt-img="t('photos', 'Cover photo for place {placeName}', { placeName: collection.basename })"
				:cover-url="collection.attributes['last-photo'] | coverUrl">
				<span class="place__name">
					{{ collection.basename }}
				</span>

				<div slot="subtitle" class="place__details">
					{{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
				</div>
			</CollectionCover>

			<NcEmptyContent slot="empty-collections-list" :name="t('photos', 'There is no place yet!')">
				<ImageMultipleOutline slot="icon" />
			</NcEmptyContent>
		</CollectionsList>
	</div>
</template>

<script lang='ts'>

import { translate, translatePlural } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import FetchCollectionsMixin from '../mixins/FetchCollectionsMixin.js'
import { placesPrefix } from '../store/places.js'

export default {
	name: 'PlacesView',
	components: {
		ImageMultipleOutline,
		NcEmptyContent,
		CollectionsList,
		CollectionCover,
		HeaderNavigation,
	},

	filters: {
		coverUrl(fileId: number) {
			if (fileId === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${fileId}?x=${512}&y=${512}`)
		},
	},

	mixins: [FetchCollectionsMixin],

	computed: {
		places() {
			return this.$store.getters.places
		},
	},

	async beforeMount() {
		this.fetchPlaces()
	},

	methods: {
		fetchPlaces() {
			this.fetchCollections(placesPrefix)
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
		font-size: 20px;
		margin-bottom: 12px;
		line-height: 30px;
		color: var(--color-main-text);
	}
}
</style>
