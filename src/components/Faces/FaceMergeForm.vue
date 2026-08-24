<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="merge-form face-list">
		<FaceCover
			v-for="face in filteredFaces"
			:key="face.basename"
			:base-name="face.basename"
			small
			@click="handleSelect(face.basename)" />
	</div>
</template>

<script lang='ts'>
import FaceCover from './FaceCover.vue'
import { useFetchFaces } from '../../composables/useFetchFaces.ts'

export default {
	name: 'FaceMergeForm',
	components: { FaceCover },

	props: {
		firstFace: {
			type: String,
			required: true,
		},
	},

	setup() {
		const { faces } = useFetchFaces()

		return {
			faces,
		}
	},

	data() {
		return {
			loading: false,
		}
	},

	computed: {
		facesFiles() {
			return this.$store.getters.facesFiles
		},

		filteredFaces() {
			return Object.values(this.faces)
				.filter((face) => face.basename !== this.firstFace)
				.sort((a, b) => {
					if (a.attributes.nbItems && b.attributes.nbItems) {
						return b.attributes.nbItems - a.attributes.nbItems
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
