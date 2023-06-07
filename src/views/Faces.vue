<!--
 - @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 - @copyright Copyright (c) 2022 Marcel Klehr <mklehr@gmx.net>
 -
 - @author Louis Chemineau <louis@chmn.me>
 - @author Marcel Klehr <mklehr@gmx.net>
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
				:to="`/faces/${face.basename}`">
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
