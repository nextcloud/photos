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
import { ref, watch } from 'vue'

import { t } from '@nextcloud/l10n'
import NcDateTimePicker from '@nextcloud/vue/components/NcDateTimePicker'

import type { DateRangeValueType } from '../../services/PhotosFilters/dateRangeFilter.ts'

const props = defineProps<{
	value: DateRangeValueType
}>()

const emit = defineEmits<{
	(event: 'update:value', value: DateRangeValueType): void
}>()

const dateRange = ref<[Date, Date]|[null, null]>([null, null])

if (props.value !== undefined) {
	dateRange.value = [
		new Date(props.value.start),
		new Date(props.value.end),
	]
}

watch(dateRange, (newDateRangeValue) => {
	if (newDateRangeValue[0] === null || newDateRangeValue[1] === null) {
		emit('update:value', undefined)
	} else {
		emit('update:value', {
			start: newDateRangeValue[0].getTime(),
			end: newDateRangeValue[1].getTime(),
		})
	}
})
</script>
