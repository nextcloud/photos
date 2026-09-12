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

<script setup lang="ts">
import { computed, ref } from 'vue'
import FaceCover from './FaceCover.vue'
import { useFetchFaces } from '../../composables/useFetchFaces.ts'
import { useFacesStore } from '../../store/faces.ts'

const props = defineProps<{
	firstFace: string
}>()

const emit = defineEmits<{ select: [faceName: string] }>()

const facesStore = useFacesStore()
useFetchFaces()

const loading = ref(false)

const faces = computed(() => facesStore.faces)
const facesFiles = computed(() => facesStore.facesFiles)

const filteredFaces = computed(() => {
	return Object.values(faces.value)
		.filter((face) => face.basename !== props.firstFace)
		.sort((a, b) => {
			if (a.attributes.nbItems && b.attributes.nbItems) {
				return b.attributes.nbItems - a.attributes.nbItems
			}
			if (!facesFiles.value[b.basename] || !facesFiles.value[a.basename]) {
				return 0
			}
			return facesFiles.value[b.basename].length - facesFiles.value[a.basename].length
		})
})

function handleSelect(faceName: string): void {
	emit('select', faceName)
	loading.value = true
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
