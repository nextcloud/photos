<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcFormBox>
		<NcFormBoxSwitch
			:modelValue="croppedLayout"
			:label="t('photos', 'Squared photos view')"
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

const croppedLayout = computed(() => userConfigStore.croppedLayout)

function updateSetting(value: boolean) {
	userConfigStore.updateUserConfig('croppedLayout', value)
}
</script>
