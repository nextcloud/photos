<!--
 - @copyright Copyright (c) 2022 Marcel Klehr <mklehr@gmx.net>
 -
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
	<div class="face-cover-small"
		@click="$emit('click')">
		<div class="face-cover-small__crop-container">
			<img class="face-cover-small__image"
				:src="coverUrl"
				:style="coverDimensions">
		</div>
		<div class="face-cover-small__details">
			<span :class="{'hidden-visually': face.basename.match(/^[0-9]+$/)}">{{ face.basename }}</span>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import { generateUrl } from '@nextcloud/router'

import FaceCoverMixin from '../mixins/FaceCoverMixin.js'
import FetchFacesMixin from '../mixins/FetchFacesMixin.js'

export default {
	name: 'FaceCoverSmall',
	mixins: [
		FaceCoverMixin,
		FetchFacesMixin,
	],
	props: {
		baseName: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			observer: null,
		}
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

			return generateUrl(`/apps/photos/api/v1/preview/${this.cover.fileid}?x=${512}&y=${512}`)
		},

		cover() {
			return this.getFaceCover(this.face.basename)
		},

		coverDimensions() {
			if (!this.cover) return {}
			return this.getCoverStyle(this.face.basename)
		},
	},
	mounted() {
		this.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.intersectionRatio > 0) {
					this.fetchFaceContent(this.face.basename)
				}
			})
		})
		this.observer.observe(this.$el)
	},
	beforeDestroy() {
		this.observer.disconnect()
	},
}
</script>

<style scoped lang="scss">
.face-cover-small {
	display: flex;
	flex-direction: column;
	padding: 10px;
	border-radius: var(--border-radius);
	align-items: center;
	cursor: pointer;
	width: 120px;

	* {
		cursor: pointer;
	}

	&__crop-container {
		overflow: hidden;
		width: 60px;
		height: 60px;
		border-radius: 60px;
		position: relative;
		background: var(--color-background-darker);
		--photos-face-width: 60px;
	}

	&:hover, &:focus {
		background: var(--color-background-hover);
	}

	&__details {
		padding: 10px;
		height: 1em;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		text-align: center;
	}
}
</style>
