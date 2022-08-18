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
	<router-link class="face-cover" :to="`/faces/${baseName}`">
		<div class="face-cover__crop-container">
			<img ref="image"
				class="face-cover__image"
				:src="coverUrl"
				:style="coverDimensions">
		</div>
		<div class="face-cover__details">
			<div class="face-cover__details__first-line">
				<h2 :class="{'face-cover__details__name': true, 'hidden-visually': baseName.match(/^[0-9]+$/)}">
					{{ baseName }}
				</h2>
			</div>
			<div v-if="facesFiles[baseName]" class="face-cover__details__second-line">
				{{ n('photos', '%n photos', '%n photos', facesFiles[baseName].length,) }}
			</div>
		</div>
	</router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateUrl } from '@nextcloud/router'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'
import FaceCoverMixin from '../mixins/FaceCoverMixin.js'

export default {
	name: 'FaceCover',

	mixins: [
		FetchFacesMixin,
		FaceCoverMixin,
	],

	props: {
		baseName: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapGetters([
			'files',
			'faces',
			'facesFiles',
		]),

		/**
		 * @return {Face}
		 */
		face() {
			return this.faces[this.baseName]
		},

		/**
		 * @return {string}
		 */
		coverUrl() {
			if (!this.cover) {
				return ''
			}

			return generateUrl(`/core/preview?fileId=${this.cover.fileid}&x=${512}&y=${512}&forceIcon=0&a=1`)
		},

		cover() {
			return this.getFaceCover(this.face.basename)
		},

		coverDimensions() {
			if (!this.cover) return {}
			return this.getCoverStyle(this.face.basename)
		},
	},

	async beforeMount() {
		await this.fetchFiles()
	},

	beforeDestroy() {
		this.cancelFilesRequest('Changed view')
	},

	methods: {
		async fetchFiles() {
			await this.fetchFaceContent(this.face.basename)
		},
	},
}
</script>

<style lang="scss" scoped>
.face-cover {
	display: flex;
	flex-direction: column;
	padding: 10px;
	border-radius: var(--border-radius-large);

	&__crop-container {
		overflow: hidden;
		width: 250px;
		height: 250px;
		border-radius: 250px;
		position: relative;
		background: var(--color-background-darker);
	  --photos-face-width: 250px;

		@media only screen and (max-width: 1020px) {
			width: 95px;
			height: 95px;
			--photos-face-width: 95px;
		}
	}

	&:hover, &:focus {
		background: var(--color-background-hover);
	}

	&__details {
		display: flex;
		flex-direction: column;
		width: 250px;
		margin-top: 4px;
		text-align: center;

		@media only screen and (max-width: 1020px) {
			width: 95px;
		}

		&__first-line {
			display: flex;
			height: 2em;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&__second-line {
			color: var(--color-text-maxcontrast);
		}

		&__name {
			flex-grow: 1;
			margin: 0;
		}
	}
}
</style>
