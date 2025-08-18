<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<MapMarkerOutline /> <b>{{ t('photos', 'Places') }}: </b>
		<span v-for="place in selectedPlaces" :key="place.label">
			<NcChip no-close>
				<template v-if="place.previewUrl !== undefined" #icon>
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
import type { PlacesValueType } from '../../services/PhotosFilters/placesFilter.ts'

import { t } from '@nextcloud/l10n'
import NcChip from '@nextcloud/vue/components/NcChip'
import MapMarkerOutline from 'vue-material-design-icons/MapMarkerOutline.vue'
import usePlaceFilter from './usePlaceFilter.ts'

const props = defineProps<{
	value: PlacesValueType
}>()

const emit = defineEmits<{
	(event: 'update:value', value: PlacesValueType): void
}>()

const { selectedPlaces } = usePlaceFilter(props, emit)
</script>

<style lang="scss" scoped>
.place__preview {
	width: 20px;
	height: 20px;
	border-radius: 100%;
}
</style>
