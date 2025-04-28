<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<CollectionContent ref="collectionContent"
			:collection="place"
			:collection-file-ids="placeFileIds"
			:allow-selection="false"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation v-if="place !== null"
				key="navigation"
				slot="header"
				:loading="loadingCollection || loadingCollectionFiles"
				:params="{ placeName }"
				:path="'/' + placeName"
				:title="place.basename"
				@refresh="fetchPlaceFiles" />

			<!-- No content -->
			<NcEmptyContent slot="empty-content"
				:name="t('photos', 'This place does not have any photos or videos yet!')"
				class="place__empty">
				<ImagePlus slot="icon" />

				<NcButton slot="action"
					type="primary"
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
import Plus from 'vue-material-design-icons/Plus.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import isMobile from '@nextcloud/vue/dist/Mixins/isMobile.js'
import { translate } from '@nextcloud/l10n'

import FetchCollectionContentMixin from '../mixins/FetchCollectionContentMixin.js'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { getCurrentUser } from '@nextcloud/auth'
import type { Collection } from '../services/collectionFetcher.js'

export default {
	name: 'PlaceContent',
	components: {
		Plus,
		ImagePlus,
		NcEmptyContent,
		NcButton,
		CollectionContent,
		HeaderNavigation,
	},

	mixins: [
		FetchCollectionContentMixin,
		isMobile,
	],

	props: {
		placeName: {
			type: String,
			default: '/',
		},
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
			return `/photos/${getCurrentUser()?.uid}/places/${this.placeName}`
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
		margin-left: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
