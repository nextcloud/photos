<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionsList
			:collections="albums"
			:loading="loadingCollections"
			:error="errorFetchingCollections"
			class="albums-list">
			<template #header>
				<HeaderNavigation
					key="navigation"
					:loading="loadingCollections"
					:title="t('photos', 'Albums')"
					:root-title="t('photos', 'Albums')"
					@refresh="fetchAlbums">
					<NcButton
						:aria-label="isMobile ? t('photos', 'New album') : undefined"
						@click="showAlbumCreationForm = true">
						<template #icon>
							<Plus :size="20" />
						</template>
						<template v-if="!isMobile" #default>
							{{ t('photos', 'New album') }}
						</template>
					</NcButton>
				</HeaderNavigation>
			</template>

			<template #default="{ collection }">
				<CollectionCover
					:key="collection.basename"
					parent-route="/albums"
					:collection-name="collection.basename"
					:alt-img="t('photos', 'Cover photo for album {albumName}', { albumName: collection.basename })"
					:cover-url="collection.attributes['last-photo'] | coverUrl">
					<template #default>
						<span class="album__name">
							{{ collection.basename }}
						</span>
						<CogOutline v-if="Object.keys(collection.attributes.filters).length !== 0" fill-color="var(--color-text-lighter)" />
					</template>

					<template #subtitle>
						<div class="album__details">
							{{ collection.attributes.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', collection.attributes.nbItems) }}
						</div>
					</template>
				</CollectionCover>
			</template>

			<template #empty-collections-list>
				<NcEmptyContent :name="t('photos', 'There is no album yet!')">
					<template #icon>
						<ImageMultipleOutline />
					</template>
				</NcEmptyContent>
			</template>
		</CollectionsList>

		<NcModal
			v-if="showAlbumCreationForm"
			label-id="new-album-form"
			@close="showAlbumCreationForm = false">
			<h2 class="album-creation__heading">
				{{ t('photos', 'New album') }}
			</h2>
			<AlbumForm @done="handleAlbumCreated" />
		</NcModal>
	</div>
</template>

<script lang='ts'>
import { translate, translatePlural } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { useIsSmallMobile } from '@nextcloud/vue/composables/useIsMobile'
import { defineComponent } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcModal from '@nextcloud/vue/components/NcModal'
import CogOutline from 'vue-material-design-icons/Cog.vue'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import AlbumForm from '../components/Albums/AlbumForm.vue'
import CollectionCover from '../components/Collection/CollectionCover.vue'
import CollectionsList from '../components/Collection/CollectionsList.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import FetchCollectionsMixin from '../mixins/FetchCollectionsMixin.js'
import { albumsExtraProps, albumsPrefix } from '../store/albums.js'

export default defineComponent({
	name: 'AlbumsView',
	components: {
		Plus,
		ImageMultipleOutline,
		NcModal,
		NcButton,
		NcEmptyContent,
		CollectionsList,
		CollectionCover,
		HeaderNavigation,
		AlbumForm,
		CogOutline,
	},

	filters: {
		coverUrl(lastPhoto: number): string {
			if (lastPhoto === -1) {
				return ''
			}

			return generateUrl(`/apps/photos/api/v1/preview/${lastPhoto}?x=${512}&y=${512}`)
		},
	},

	mixins: [FetchCollectionsMixin],

	setup() {
		const isMobile = useIsSmallMobile()
		return {
			isMobile,
		}
	},

	data() {
		return {
			showAlbumCreationForm: false,
		}
	},

	computed: {
		albums() {
			return this.$store.getters.albums
		},
	},

	async beforeMount() {
		this.fetchAlbums()
	},

	methods: {
		fetchAlbums() {
			this.fetchCollections(
				albumsPrefix,
				albumsExtraProps,
			)
		},

		handleAlbumCreated({ album }) {
			this.showAlbumCreationForm = false
			this.$router.push(`/albums/${album.basename}`)
		},

		t: translate,
		n: translatePlural,
	},
})
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
		color: var(--color-main-text);
	}
}

.album-creation__heading {
	padding: calc(var(--default-grid-baseline) * 4);
	margin-bottom: 0px;
	padding-bottom: 0px;
}
</style>
