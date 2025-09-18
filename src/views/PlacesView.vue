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
			<template #header>
				<HeaderNavigation
					key="navigation"

					:loading="loadingCollections"
					:title="t('photos', 'Places')"
					:root-title="t('photos', 'Places')"
					@refresh="fetchPlaces" />
			</template>

			<template #default="{ collection }">
				<CollectionCover
					:key="collection.basename"
					:link="`/places/${collection.basename}`"
					:alt-img="t('photos', 'Cover photo for place {placeName}', { placeName: collection.basename })"
					:cover-url="coverUrl(collection.attributes['last-photo'])">
					<span class="place__name">
						{{ collection.basename }}
					</span>

					<template #subtitle>
						<div class="place__details">
							{{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
						</div>
					</template>
				</CollectionCover>
			</template>

			<template #empty-collections-list>
				<NcEmptyContent :name="t('photos', 'There is no place yet!')">
					<template #icon>
						<ImageMultipleOutline />
					</template>
				</NcEmptyContent>
			</template>
		</CollectionsList>
	</div>
</template>

<script lang='ts'>

import { n, t } from '@nextcloud/l10n'
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

		coverUrl(fileId: number) {
			if (fileId === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${fileId}?x=${512}&y=${512}`)
		},

		t,
		n,
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
