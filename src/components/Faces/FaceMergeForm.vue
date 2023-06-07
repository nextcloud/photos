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
	<div class="merge-form face-list">
		<FaceCover v-for="face in filteredFaces"
			:key="face.basename"
			:base-name="face.basename"
			small
			@click="handleSelect(face.basename)" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import FaceCoverMixin from '../../mixins/FaceCoverMixin.js'
import FetchFacesMixin from '../../mixins/FetchFacesMixin.js'
import FaceCover from './FaceCover.vue'

export default {
	name: 'FaceMergeForm',
	components: { FaceCover },
	mixins: [
		FaceCoverMixin,
		FetchFacesMixin,
	],
	props: {
		firstFace: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
		}
	},
	computed: {
		...mapGetters([
			'files',
			'faces',
			'facesFiles',
		]),

		filteredFaces() {
			return Object.values(this.faces)
				.filter(face => face.basename !== this.firstFace)
				.sort((a, b) => {
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
	methods: {
		handleSelect(faceName) {
			this.$emit('select', faceName)
			this.loading = true
		},
	},
}
</script>

<style scoped lang="scss">
.face-list {
	display: flex;
	flex-direction: row;
	height: 350px;
	flex-wrap: wrap;
	padding: 12px;
}

.loader {
	margin: 25% auto;
}
</style>
