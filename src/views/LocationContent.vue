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
			:collection="location"
			:collection-file-ids="locationFileIds"
			:semaphore="semaphore"
			:loading="loadingCollection || loadingCollectionFiles"
			:error="errorFetchingCollection || errorFetchingCollectionFiles">
			<!-- Header -->
			<HeaderNavigation v-if="location !== null"
				key="navigation"
				slot="header"
				:loading="loadingCollection || loadingCollectionFiles"
				:params="{ locationName }"
				:path="'/' + locationName"
				:title="location.basename"
				@refresh="fetchLocationFiles" />

			<!-- No content -->
			<NcEmptyContent slot="empty-content"
				:title="t('photos', 'This location does not have any photos or videos yet!')"
				class="location__empty">
				<ImagePlus slot="icon" />

				<NcButton slot="action"
					type="primary"
					:aria-label="t('photos', 'Add photos to this location')"
					@click="showAddPhotosModal = true">
					<Plus slot="icon" />
					{{ t('photos', "Add") }}
				</NcButton>
			</NcEmptyContent>
		</CollectionContent>
	</div>
</template>

<script>
import Plus from 'vue-material-design-icons/Plus'
import ImagePlus from 'vue-material-design-icons/ImagePlus'

import { NcButton, NcEmptyContent, isMobile } from '@nextcloud/vue'
import { translate } from '@nextcloud/l10n'

import FetchCollectionsContentMixin from '../mixins/FetchCollectionsContentMixin.js'
import CollectionContent from '../components/Collection/CollectionContent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { getCurrentUser } from '@nextcloud/auth'

export default {
	name: 'LocationContent',
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
		locationName: {
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
			loadingAddFilesToLocation: false,
		}
	},

	computed: {
		/**
		 * @return {import('../services/collectionFetcher.js').Collection} The location information for the current locationName.
		 */
		location() {
			return this.$store.getters.getLocation(this.locationName)
		},

		/**
		 * @return {string} The location's filename based on its name. Useful to fetch the location information and content.
		 */
		locationFileName() {
			return `/photos/${getCurrentUser()?.uid}/locations/${this.locationName}`
		},

		/**
		 * @return {string[]} The list of files for the current locationName.
		 */
		locationFileIds() {
			return this.$store.getters.getLocationFiles(this.locationName)
		},
	},

	async beforeMount() {
		await this.fetchLocation()
		await this.fetchLocationFiles()
	},

	methods: {
		async fetchLocation() {
			this.fetchCollection(this.locationFileName)
		},

		async fetchLocationFiles() {
			this.fetchCollectionFiles(this.locationFileName)
		},

		t: translate,
	},
}
</script>
<style lang="scss" scoped>
.location {
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

	&__location {
		margin-left: -4px;
		display: flex;
		color: var(--color-text-lighter);
	}
}
</style>
