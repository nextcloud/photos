<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcSelect
		v-model="selectedPlaces"
		class="places-select"
		:options="availablePlacesWithoutSelections"
		:aria-label-combobox="t('photos', 'Select places')"
		:placeholder="t('photos', 'Select places')"
		:loading="loadingCollections"
		:multiple="true">
		<template #option="option">
			<NcListItemIcon
				:name="option.label"
				:is-no-user="true"
				:url="option.previewUrl" />
		</template>
		<template #selected-option="option">
			<NcChip no-close>
				<template #icon>
					<img :src="option.previewUrl" class="place__preview">
				</template>
				<template #default>
					{{ option.label }}
				</template>
			</NcChip>
		</template>
	</NcSelect>
</template>

<script lang="ts" setup>
import type { PlacesValueType } from '../../services/PhotosFilters/placesFilter.ts'

import { t } from '@nextcloud/l10n'
import NcChip from '@nextcloud/vue/components/NcChip'
import NcListItemIcon from '@nextcloud/vue/components/NcListItemIcon'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import usePlaceFilter from './usePlaceFilter.ts'

const props = defineProps<{
	value: PlacesValueType
}>()

const emit = defineEmits<{
	(event: 'update:value', value: PlacesValueType): void
}>()

const { availablePlacesWithoutSelections, loadingCollections, selectedPlaces } = usePlaceFilter(props, emit)
</script>

<style lang="scss" scoped>
.places-select {
	margin-bottom: 0 !important;
}

.place__preview {
	width: 20px;
	height: 20px;
	border-radius: 100%;
}
</style>
