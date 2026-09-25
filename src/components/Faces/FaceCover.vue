<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="face-cover" :class="[small && 'face-cover--small']" @click="$emit('click')">
		<div class="face-cover__crop-container">
			<img
				class="face-cover__image"
				:src="coverUrl"
				:style="coverDimensions">
		</div>
		<div class="face-cover__details">
			<div v-if="!baseName.match(/^[0-9]+$/)" class="face-cover__details__first-line">
				<span class="face-cover__details__name">
					{{ baseName }}
				</span>
			</div>
			<div v-if="!small" class="face-cover__details__second-line">
				{{ n('photos', '%n photos', '%n photos', face.attributes.nbItems) }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Collection } from '../../services/collectionFetcher.js'

import { n } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed } from 'vue'
import { useFaceCover } from '../../composables/useFaceCover.ts'
import { useFetchFaces } from '../../composables/useFetchFaces.ts'
import { useFacesStore } from '../../store/faces.ts'

const props = withDefaults(defineProps<{
	baseName: string
	small?: boolean
}>(), {
	small: false,
})

defineEmits<{ click: [] }>()

const facesStore = useFacesStore()
useFetchFaces()
const { getFaceCover, getCoverStyle } = useFaceCover()

const face = computed<Collection>(() => facesStore.faces[props.baseName])

const cover = computed(() => getFaceCover(face.value.basename))

const coverUrl = computed<string>(() => {
	if (!cover.value) {
		return ''
	}

	return generateUrl(`/apps/photos/api/v1/preview/${cover.value.fileid}?x=${512}&y=${512}`)
})

const coverDimensions = computed(() => {
	if (!cover.value) {
		return {}
	}

	return getCoverStyle(face.value.basename)
})
</script>

<style lang="scss" scoped>
@use './FaceCover.scss';
</style>
