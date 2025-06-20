<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcDialog
		:name="t('photos', 'Select a custom date range')"
		size="normal"
		@closing="emit('close', undefined)">
		<div
			class="date-range-picker-dialog"
			data-cy-photos-filters-input="custom-date-range">
			<NcDateTimePicker
				v-model="dateRange"
				class="date-range-picker-dialog__picker"
				:clearable="true"
				type="date-range"
				:placeholder="t('photos', 'Select a date range')">
				<template #default>
					{{ t('photos', 'Date range') }}
				</template>
			</NcDateTimePicker>
		</div>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { DateRangeValueType } from '../../services/PhotosFilters/dateRangeFilter.ts'

import { t } from '@nextcloud/l10n'
import { ref, watch } from 'vue'
import NcDateTimePicker from '@nextcloud/vue/components/NcDateTimePicker'
import NcDialog from '@nextcloud/vue/components/NcDialog'

const emit = defineEmits<{
	(event: 'close', value: DateRangeValueType | undefined): void
}>()

const dateRange = ref<[Date, Date] | [null, null]>([null, null])

watch(dateRange, (newDateRangeValue) => {
	if (newDateRangeValue[0] !== null || newDateRangeValue[1] !== null) {
		emit('close', {
			start: newDateRangeValue[0].getTime(),
			end: newDateRangeValue[1].getTime(),
		})
	}
})
</script>

<style lang="scss" scoped>
.date-range-picker-dialog {
	height: 400px;
	display: flex;
	justify-content: center;
	align-items: flex-start;

	&__picker {
		flex-grow: 1;
	}
}
</style>
