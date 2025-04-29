<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcSelect v-model="selectedOptions"
		class="places-select"
		:options="availableOptions"
		:aria-label-combobox="t('photos', 'Select places')"
		:placeholder="t('photos', 'Select places')"
		:loading="loading"
		:multiple="true">
		<template #option="option">
			<NcListItemIcon :name="option.label"
				:is-no-user="true"
				:url="option.previewUrl" />
		</template>
	</NcSelect>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import NcSelect from '@nextcloud/vue/components/NcSelect'
import NcListItemIcon from '@nextcloud/vue/components/NcListItemIcon'
import { generateUrl } from '@nextcloud/router'
import { t } from '@nextcloud/l10n'

import type { PlacesValueType } from '../../services/TimelineFilters/placesFilter.ts'
import { fetchCollections } from '../../services/collectionFetcher.ts'
import { placesPrefix } from '../../store/places.ts'

type NcSelectPlaceOption = {
	label: string
	previewUrl: string
}

const props = defineProps<{
	value: PlacesValueType
}>()

const emit = defineEmits<{
	(event: 'input', value: PlacesValueType): void
}>()

const loading = ref(true)
const availableOptions = ref<NcSelectPlaceOption[]>([])
const selectedOptions = ref<NcSelectPlaceOption[]>([])

fetchCollections(placesPrefix)
	.then(places => {
		availableOptions.value = places.map(place => ({
			label: place.basename,
			previewUrl: generateUrl(`/apps/photos/api/v1/preview/${place.attributes['last-photo']}?x=${64}&y=${64}`),
		}))
		loading.value = false
	})

watch(
	() => props.value,
	(newValue: PlacesValueType) => {
		if (newValue === undefined) {
			selectedOptions.value = []
		} else if (newValue !== selectedPlaces.value) {
			selectedOptions.value = newValue
				.map(place => availableOptions.value.find(option => option.label === place))
				.filter(place => place !== undefined)
		}
	},
)

const selectedPlaces = computed(() => selectedOptions.value.map(place => place.label))
watch(selectedPlaces, (newValue) => emit('input', newValue))
</script>
<style lang="scss" scoped>
.places-select {
	margin-bottom: 0 !important;
}
</style>
