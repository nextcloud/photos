<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcFormBox>
		<NcFormBoxSwitch
			:modelValue="showCalendarEvents"
			:label="t('photos', 'Show calendar events in the timeline')"
			@update:modelValue="setShowCalendarEvents" />
	</NcFormBox>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxSwitch from '@nextcloud/vue/components/NcFormBoxSwitch'
import { setShowCalendarEvents, showCalendarEvents } from '../../composables/useCalendarEvents.ts'
</script>
