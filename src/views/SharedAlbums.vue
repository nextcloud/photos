<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<CollectionsList
		:collections="sharedAlbums"
		:loading="loadingCollections"
		:error="errorFetchingCollections"
		class="albums-list">
		<HeaderNavigation
			key="navigation"
			slot="header"
			:loading="loadingCollections"
			:title="t('photos', 'Collaborative albums')"
			:root-title="t('photos', 'Collaborative albums')"
			@refresh="fetchSharedAlbums" />

		<CollectionCover
			:key="collection.basename"
			slot-scope="{ collection }"
			parent-route="/sharedalbums"
			:collection-name="collection.basename"
			:alt-img="t('photos', 'Cover photo for shared album {albumName}', { albumName: collection.basename })"
			:data-test="collection.basename"
			:cover-url="collection.attributes['last-photo'] | coverUrl">
			<span class="album__name">
				{{ collection | albumOriginalName }}
			</span>

			<div slot="subtitle" class="album__details">
				{{ collection.attributes.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
				<br>
				{{ t('photos', 'Shared by') }}&nbsp;<NcUserBubble :display-name="collection.attributes.collaborators[0].label" :user="collection.attributes.collaborators[0].id" />
			</div>
		</CollectionCover>

		<NcEmptyContent slot="empty-collections-list" :name="t('photos', 'There is no album yet!')">
			<ImageMultipleOutline slot="icon" />
		</NcEmptyContent>
	</CollectionsList>
</template>

<script lang='ts'>
import type { Album } from '../store/albums.js'

import { getCurrentUser } from '@nextcloud/auth'
import { translate, translatePlural } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcUserBubble from '@nextcloud/vue/components/NcUserBubble'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import FetchCollectionsMixin from '../mixins/FetchCollectionsMixin.js'
import { albumsExtraProps } from '../store/albums.ts'

export default {
	name: 'SharedAlbums',
	components: {
		ImageMultipleOutline,
		NcEmptyContent,
		CollectionsList,
		CollectionCover,
		HeaderNavigation,
		NcUserBubble,
	},

	filters: {
		coverUrl(lastPhoto: number): string {
			if (lastPhoto === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`)
		},

		albumOriginalName(album: Album): string {
			return album.basename.replace(new RegExp(`\\(${album.attributes.collaborators[0].id}\\)$`), '')
		},
	},

	mixins: [FetchCollectionsMixin],

	computed: {
		sharedAlbums(): Record<string, Album> {
			return this.$store.getters.sharedAlbums
		},
	},

	async beforeMount() {
		this.fetchSharedAlbums()
	},

	methods: {
		fetchSharedAlbums() {
			this.fetchCollections(
				`/photos/${getCurrentUser()?.uid}/sharedalbums`,
				albumsExtraProps,
			)
		},

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
		font-size: 20px;
		margin-bottom: 12px;
		line-height: 30px;
		color: var(--color-main-text);
	}
}
</style>
