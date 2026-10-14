<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="face-cover" :class="[small && 'face-cover--small']" @click="$emit('click')">
		<div class="face-cover__crop-container">
			<AccountOffOutlineIcon :size="128" :fillColor="colorMainBackground" />
		</div>
		<div class="face-cover__details">
			<div v-if="!small" class="face-cover__details__second-line">
				{{ n('photos', '%n unassigned photo', '%n unassigned photos', unassignedFilesCount) }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { n } from '@nextcloud/l10n'
import { computed, onMounted } from 'vue'
import AccountOffOutlineIcon from 'vue-material-design-icons/AccountOffOutline.vue'
import { useFetchFaces } from '../../composables/useFetchFaces.ts'
import { useFacesStore } from '../../store/faces.ts'

withDefaults(defineProps<{
	small?: boolean
}>(), {
	small: false,
})

defineEmits<{ click: [] }>()

const facesStore = useFacesStore()
const { fetchUnassignedFacesCount } = useFetchFaces()

const unassignedFilesCount = computed(() => facesStore.unassignedFilesCount)

const colorMainBackground = computed(() => getComputedStyle(document.documentElement).getPropertyValue('--color-main-background'))

onMounted(async () => {
	await fetchUnassignedFacesCount()
})
</script>

<style lang="scss" scoped>
@use './FaceCover.scss';
</style>
