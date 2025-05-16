<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<MapMarker /> <b>{{ t('photos', 'Places') }}: </b>
		<span v-for="place in selectedOptions" :key="place.label">
			<NcChip no-close>
				<template #icon>
					<img :src="place.previewUrl" class="place__preview">
				</template>
				<template #default>
					{{ place.label }}
				</template>
			</NcChip>
		</span>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import MapMarker from 'vue-material-design-icons/MapMarker.vue'

import { generateUrl } from '@nextcloud/router'
import { t } from '@nextcloud/l10n'
import NcChip from '@nextcloud/vue/components/NcChip'

import type { PlacesValueType } from '../../services/PhotosFilters/placesFilter.ts'
import { fetchCollections } from '../../services/collectionFetcher.ts'
import { placesPrefix } from '../../store/places.ts'

type NcSelectPlaceOption = {
	label: string
	previewUrl?: string
}

const props = defineProps<{
	value: PlacesValueType
}>()

const loading = ref(true)
const availableOptions = ref<NcSelectPlaceOption[]>([])
const selectedOptions = ref<NcSelectPlaceOption[]>((props.value ?? []).map(place => ({ label: place })))

fetchCollections(placesPrefix)
	.then(places => {
		availableOptions.value = places.map(place => ({
			label: place.basename,
			previewUrl: generateUrl(`/apps/photos/api/v1/preview/${place.attributes['last-photo']}?x=${64}&y=${64}`),
		}))

		selectedOptions.value = (props.value ?? [])
			.map(place => availableOptions.value.find(option => option.label === place))
			.filter(place => place !== undefined)

		loading.value = false
	})
</script>
<style lang="scss" scoped>
.place__preview {
	width: 20px;
	height: 20px;
	border-radius: 100%;
}
</style>
