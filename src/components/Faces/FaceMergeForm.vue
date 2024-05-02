<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
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
