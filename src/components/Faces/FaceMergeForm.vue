<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="merge-form face-list">
		<FaceCover
			v-for="face in filteredFaces"
			:key="face.basename"
			:baseName="face.basename"
			small
			@click="handleSelect(face.basename)" />
	</div>
</template>

<script lang='ts'>
import FaceCover from './FaceCover.vue'
import FaceCoverMixin from '../../mixins/FaceCoverMixin.js'
import FetchFacesMixin from '../../mixins/FetchFacesMixin.js'
import { useFacesStore } from '../../store/faces.ts'
import { useFilesStore } from '../../store/files.ts'

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

	setup() {
		return { facesStore: useFacesStore(), filesStore: useFilesStore() }
	},

	data() {
		return {
			loading: false,
		}
	},

	computed: {
		files() {
			return this.filesStore.files
		},

		faces() {
			return this.facesStore.faces
		},

		facesFiles() {
			return this.facesStore.facesFiles
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
