<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent
			ref="collectionContent"
			:collection="place"
			:collection-file-ids="placeFileIds"
			:allow-selection="false"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation
				v-if="place !== null"
				key="navigation"
				slot="header"
				:loading="loadingCollection || loadingCollectionFiles"
				:params="{ placeName }"
				:path="'/' + placeName"
				:title="place.basename"
				@refresh="fetchPlaceFiles" />

			<!-- No content -->
			<NcEmptyContent
				slot="empty-content"
				:name="t('photos', 'This place does not have any photos or videos yet!')"
				class="place__empty">
				<ImagePlusOutline slot="icon" />

				<NcButton
					slot="action"
					variant="primary"
					:aria-label="t('photos', 'Add photos to this place')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>
	</div>
</template>

<script lang='ts'>
import type { Collection } from '../services/collectionFetcher.js'

import { translate } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ImagePlusOutline from 'vue-material-design-icons/ImagePlusOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'
import { placesPrefix } from '../store/places.js'

export default {
	name: 'PlaceContent',
	components: {
		Plus,
		ImagePlusOutline,
		NcEmptyContent,
		NcButton,
		CollectionContent,
		HeaderNavigation,
	},

	mixins: [FetchCollectionContentMixin],

	props: {
		placeName: {
			type: String,
			default: '/',
		},
	},

	setup() {
		const isMobile = useIsMobile()
		return {
			isMobile,
		}
	},

	data() {
		return {
			showAddPhotosModal: false,
			loadingCollection: false,
			errorFetchingCollection: null,
			loadingCount: 0,
			loadingAddFilesToPlace: false,
		}
	},

	computed: {
		place(): Collection {
			return this.$store.getters.getPlace(this.placeName)
		},

		placeFileName(): string {
			return `${placesPrefix}/${this.placeName}`
		},

		placeFileIds(): string[] {
			return this.$store.getters.getPlaceFiles(this.placeName)
		},
	},

	async beforeMount() {
		await this.fetchPlace()
		await this.fetchPlaceFiles()
	},

	methods: {
		async fetchPlace() {
			this.fetchCollection(this.placeFileName)
		},

		async fetchPlaceFiles() {
			this.fetchCollectionFiles(this.placeFileName)
		},

		t: translate,
	},
}
</script>

<style lang="scss" scoped>
.place {
	display: flex;
	flex-direction: column;

	&__title {
		width: 100%;
	}

	&__name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__place {
		margin-inline-start: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
