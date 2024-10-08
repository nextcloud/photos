<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="errorFetchingFaces">
		{{ t('photos', 'An error occurred') }}
	</NcEmptyContent>

	<!-- Face list -->
	<div v-else class="faces">
		<NcLoadingIcon v-if="loadingFaces" />

		<!-- No faces -->
		<div v-if="noFaces && !loadingFaces" class="faces__empty">
			<NcEmptyContent class="empty-content-with-illustration">
				<template #icon>
					<AccountBoxMultipleOutline />
				</template>
				<template #desc>
					{{ t('photos', 'This might take some time depending on the size of your photo library.') }}
				</template>
				{{ t('photos', 'Recognized people will show up here') }}
			</NcEmptyContent>
		</div>

		<div v-else-if="!noFaces" class="faces__list">
			<router-link v-for="face in orderedFaces"
				:key="face.basename"
				:to="`/faces/${encodeURIComponent(face.basename)}`">
				<FaceCover :base-name="face.basename" />
			</router-link>
			<router-link key="unassigned"
				:to="`/faces/unassigned`">
				<UnassignedFacesCover />
			</router-link>
		</div>
	</div>
</template>

<script>
import AccountBoxMultipleOutline from 'vue-material-design-icons/AccountBoxMultipleOutline.vue'

import { NcEmptyContent, NcLoadingIcon } from '@nextcloud/vue'

import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import FaceCover from '../components/Faces/FaceCover.vue'
import { mapGetters } from 'vuex'
import UnassignedFacesCover from '../components/Faces/UnassignedFacesCover.vue'

export default {
	name: 'Faces',
	components: {
		UnassignedFacesCover,
		FaceCover,
		NcEmptyContent,
		NcLoadingIcon,
		AccountBoxMultipleOutline,
	},

	mixins: [
		FetchFacesMixin,
	],

	computed: {
		...mapGetters([
			'facesFiles',
			'unassignedFilesCount',
		]),

		/**
		 * @return {boolean} Whether the list of face is empty or not.
		 */
		noFaces() {
			return Object.keys(this.faces).length === 0
		},

		orderedFaces() {
			return Object.values(this.faces).sort((a, b) => {
				if (a.props.nbItems && b.props.nbItems) {
					return b.props.nbItems - a.props.nbItems
				}
				if (!this.facesFiles[b.basename] || !this.facesFiles[a.basename]) {
					return 0
				}
				return this.facesFiles[b.basename].length - this.facesFiles[a.basename].length
			})
		},
	},
}
</script>
<style lang="scss" scoped>
.faces {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--header-height));
	padding-left: 64px;

	@media only screen and (max-width: 1020px) {
		padding: 0;
	}

	&__header {
		display: flex;
		min-height: 60px;
		align-items: center;

		button {
			margin-right: 32px;
		}
	}

	&__list {
		padding-top: 24px;
		padding-bottom: 32px;
		flex-grow: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 32px;
		align-content: flex-start;
	}

	&__empty {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__button {
			margin-top: 32px;
		}
	}
}

.empty-content-with-illustration :deep .empty-content__icon {
	width: 200px;
	height: 200px;

	svg {
		width: 200px;
		height: 200px;
	}
}
</style>
