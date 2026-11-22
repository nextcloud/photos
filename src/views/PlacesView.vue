<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionsList
			:collections="places"
			:loading="loadingCollections"
			:error="errorFetchingCollections">
			<template #header>
				<HeaderNavigation
					key="navigation"

					:loading="loadingCollections"
					:title="t('photos', 'Places')"
					:rootTitle="t('photos', 'Places')"
					@refresh="fetchPlaces" />
			</template>

			<template #default="{ collection }">
				<CollectionCover
					:key="collection.basename"
					parentRoute="/places"
					:collectionName="collection.basename"
					:altImg="t('photos', 'Cover photo for place {placeName}', { placeName: collection.basename })"
					:coverUrl="coverUrl(collection.attributes['last-photo'])">
					<template #default>
						{{ collection.basename }}
					</template>

					<template #subtitle>
						{{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
					</template>
				</CollectionCover>
			</template>

			<template #emptyCollectionsList>
				<NcEmptyContent
					:name="t('photos', 'No places yet')"
					:description="t('photos', 'Photos taken with a device recording its location are grouped by place here')">
					<template #icon>
						<ImageMultipleOutline />
					</template>
				</NcEmptyContent>
			</template>
		</CollectionsList>
	</div>
</template>

<script setup lang="ts">
import { n, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onBeforeMount } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useFetchCollections } from '../composables/useFetchCollections.ts'
import { placesPrefix, usePlacesStore } from '../store/places.ts'

const placesStore = usePlacesStore()
const { fetchCollections, errorFetchingCollections, loadingCollections } = useFetchCollections()

const places = computed(() => placesStore.places)

function coverUrl(fileId: number): string {
	if (fileId === -1) {
		return ''
	}

	return generateUrl(`/apps/photos/api/v1/preview/${fileId}?x=${512}&y=${512}`)
}

function fetchPlaces() {
	fetchCollections(placesPrefix)
}

onBeforeMount(() => {
	fetchPlaces()
})
</script>
