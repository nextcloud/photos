<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div v-if="value !== undefined">
		<CalendarMonth /> <b>{{ t('photos', 'Date range') }}: </b>
		<span>
			<NcDateTime :timestamp="value['start']" :format=" { dateStyle: 'long' }" :relative-time="false" />
			⸱
			<NcDateTime :timestamp="value['end']" :format=" { dateStyle: 'long' }" :relative-time="false" />
		</span>
	</div>
</template>
<script lang="ts" setup>
import CalendarMonth from 'vue-material-design-icons/CalendarMonth.vue'

import { t } from '@nextcloud/l10n'
import NcDateTime from '@nextcloud/vue/dist/Components/NcDateTime.js'

import type { DateRangeValueType } from '../../services/PhotosFilters/dateRangeFilter.ts'

defineProps<{
	value: DateRangeValueType
}>()
</script>
