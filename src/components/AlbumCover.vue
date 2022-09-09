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
	<router-link class="album-cover" :to="`/albums/${baseName}`">
		<img v-if="album.lastPhoto !== 0"
			class="album-cover__image"
			:src="coverUrl"
			:alt="altImg">
		<div v-else class="album-cover__image album-cover__image--placeholder">
			<ImageMultiple :size="128" />
		</div>
		<div class="album-cover__details">
			<div class="album-cover__details__first-line">
				<h2 class="album-cover__details__name">
					{{ baseName }}
				</h2>
				<!-- <div class="album-cover__details__state">
					<ShareVariant v-if="album.isShared" />
					<AccountMultiple v-if="album.isCollaborative" />
				</div> -->
			</div>
			<div class="album-cover__details__second-line">
				{{ album.date }} ⸱ {{ n('photos', '%n item', '%n photos and videos', album.nbItems,) }}
			</div>
		</div>
	</router-link>
</template>

<script>

import { mapGetters } from 'vuex'
// import ShareVariant from 'vue-material-design-icons/ShareVariant'
// import AccountMultiple from 'vue-material-design-icons/AccountMultiple'
import ImageMultiple from 'vue-material-design-icons/ImageMultiple'

import { generateUrl } from '@nextcloud/router'

export default {
	name: 'AlbumCover',

	components: {
		// ShareVariant,
		// AccountMultiple,
		ImageMultiple,
	},

	props: {
		baseName: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapGetters([
			'files',
			'albums',
		]),

		/**
		 * @return {Album}
		 */
		album() {
			return this.albums[this.baseName]
		},

		/**
		 * @return {string}
		 */
		coverUrl() {
			return generateUrl(`/core/preview?fileId=${this.album.lastPhoto}&x=${512}&y=${512}&forceIcon=0&a=1`)
		},

		altImg() {
			return t('photos', 'Cover photo for the album "{albumName}".', { albumName: this.baseName })
		},
	},
}
</script>

<style lang="scss" scoped>
.album-cover {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-radius: 12px;

	&:hover, &:focus {
		background: var(--color-background-dark);
	}

	&__image {
		width: 350px;
		height: 350px;
		object-fit: none;
		border-radius: 12px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
			height: 250px;
		}

		&--placeholder {
			background: var(--color-primary-light);

			::v-deep .material-design-icon {
				width: 100%;
				height: 100%;

				.material-design-icon__svg {
					fill: var(--color-primary);
				}
			}
		}
	}

	&__details {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		width: 350px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
		}

		&__first-line {
			display: flex;
		}

		&__second-line {
			display: flex;
			color: var(--color-text-lighter);
		}

		&__name {
			flex-grow: 1;
			margin: 0;
			font-weight: normal;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

		}
	}

}
</style>
