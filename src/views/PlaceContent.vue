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
		<CollectionContent ref="collectionContent"
			:collection="place"
			:collection-file-ids="placeFileIds"
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
				:title="t('photos', 'This place does not have any photos or videos yet!')"
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

<script>
import Plus from 'vue-material-design-icons/Plus.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'

import { NcButton, NcEmptyContent, isMobile } from '@nextcloud/vue'
import { translate } from '@nextcloud/l10n'

import FetchCollectionsContentMixin from '../mixins/FetchCollectionsContentMixin.js'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { getCurrentUser } from '@nextcloud/auth'

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
		FetchCollectionsContentMixin,
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
		/**
		 * @return {import('../services/collectionFetcher.js').Collection} The place information for the current placeName.
		 */
		place() {
			return this.$store.getters.getPlace(this.placeName)
		},

		/**
		 * @return {string} The place's filename based on its name. Useful to fetch the place information and content.
		 */
		placeFileName() {
			return `/photos/${getCurrentUser()?.uid}/places/${this.placeName}`
		},

		/**
		 * @return {string[]} The list of files for the current placeName.
		 */
		placeFileIds() {
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
