<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcFormBox>
		<NcFormBoxSwitch
			:modelValue="onThisDayNotifications"
			:label="t('photos', 'Notify me about memories from this day')"
			:description="t('photos', 'Once a day, when you took photos on this day in earlier years')"
			@update:modelValue="updateSetting" />
	</NcFormBox>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxSwitch from '@nextcloud/vue/components/NcFormBoxSwitch'
import { useUserConfigStore } from '../../store/userConfig.ts'

const userConfigStore = useUserConfigStore()

const onThisDayNotifications = computed(() => userConfigStore.onThisDayNotifications)

function updateSetting(value: boolean) {
	userConfigStore.updateUserConfig('onThisDayNotifications', value)
}
</script>
