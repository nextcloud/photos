<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
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
				:cover-url="collection.attributes['last-photo'] | coverUrl">
				<span class="place__name">
					{{ collection.basename }}
				</span>

				<div slot="subtitle" class="place__details">
					{{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems,) }}
				</div>
			</CollectionCover>

			<NcEmptyContent slot="empty-collections-list" :name="t('photos', 'There is no place yet!')">
				<FolderMultipleImage slot="icon" />
			</NcEmptyContent>
		</CollectionsList>
	</div>
</template>

<script lang='ts'>

import FolderMultipleImage from 'vue-material-design-icons/FolderMultipleImage.vue'

import { generateUrl } from '@nextcloud/router'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import { getCurrentUser } from '@nextcloud/auth'
import { translate, translatePlural } from '@nextcloud/l10n'

import FetchCollectionsMixin from '../mixins/FetchCollectionsMixin.js'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import type { Collection } from '../services/collectionFetcher.js'

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
		places(): Record<string, Collection> {
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
		font-size: 20px;
		margin-bottom: 12px;
		line-height: 30px;
		color: var(--color-main-text);
	}
}
</style>
