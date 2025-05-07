<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcDateTimePicker v-model="dateRange"
		:clearable="true"
		type="date-range"
		:placeholder="t('photos', 'Select a date range')">
		<template #default>
			{{ t('photos', 'Date range') }}
		</template>
	</NcDateTimePicker>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

import { t } from '@nextcloud/l10n'
import NcDateTimePicker from '@nextcloud/vue/components/NcDateTimePicker'

import type { DateRangeValueType } from '../../services/TimelineFilters/dateRangeFilter.ts'

const props = defineProps<{
	value: DateRangeValueType
}>()

const emit = defineEmits<{
	(event: 'input', value: DateRangeValueType): void
}>()

const dateRange = ref<[Date, Date]|[null, null]>([null, null])
const selectedDateRange = computed(() => {
	if (dateRange.value[0] === null || dateRange.value[1] === null) {
		return undefined
	} else {
		return {
			start: dateRange.value[0].getTime(),
			end: dateRange.value[1].getTime(),
		}
	}
})

watch(
	() => props.value,
	(newValue) => {
		if (newValue === undefined) {
			dateRange.value = [null, null]
		} else if (newValue !== selectedDateRange.value) {
			dateRange.value = [
				new Date(newValue.start),
				new Date(newValue.end),
			]
		}
	},
)

watch(selectedDateRange, (newValue) => emit('input', newValue))
</script>
