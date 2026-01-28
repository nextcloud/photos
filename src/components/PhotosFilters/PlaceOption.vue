<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcChip
		data-cy-photos-filters-option="place"
		@close="emit('deselect')">
		<template v-if="value !== undefined" #icon>
			<img :src="placeImageSource" class="place__preview">
		</template>
		<template #default>
			{{ value }}
		</template>
	</NcChip>
</template>

<script lang="ts" setup>
import type { PlacesValueType } from '../../services/PhotosFilters/placesFilter.ts'

import { generateUrl } from '@nextcloud/router'
import { computed } from 'vue'
import NcChip from '@nextcloud/vue/components/NcChip'
import useFetchCollections from '../../mixins/useFetchCollections.ts'
import store from '../../store/index.ts'
import { placesPrefix } from '../../store/places.ts'

const props = defineProps<{
	value: PlacesValueType
}>()

const emit = defineEmits(['deselect'])

const { fetchCollections } = useFetchCollections()

const placeImageSource = computed<string>(() => {
	const place = store.getters.getPlace(props.value)

	if (!place) {
		return ''
	}

	return generateUrl(`/apps/photos/api/v1/preview/${place.attributes['last-photo']}?x=${64}&y=${64}`)
})

if (Object.values(store.getters.places).length === 0) {
	fetchCollections(placesPrefix)
}

</script>

<style lang="scss" scoped>
.place__preview {
	width: 20px;
	height: 20px;
	border-radius: 100%;
}
</style>
