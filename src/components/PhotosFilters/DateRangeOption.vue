<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcChip
		data-cy-photos-filters-option="date-range"
		@close=" emit('deselect')">
		<template #default>
			<NcDateTime
				:timestamp="value['start']"
				:format=" { dateStyle: 'long' }"
				:relative-time="false" />
			⸱
			<NcDateTime
				:timestamp="value['end']"
				:format=" { dateStyle: 'long' }"
				:relative-time="false" />
		</template>
	</NcChip>
</template>

<script lang="ts" setup>
import type { DateRangeValueType } from '../../services/PhotosFilters/dateRangeFilter.ts'

import NcChip from '@nextcloud/vue/components/NcChip'
import NcDateTime from '@nextcloud/vue/components/NcDateTime'

defineProps<{
	value: DateRangeValueType
}>()

const emit = defineEmits(['deselect'])
</script>
