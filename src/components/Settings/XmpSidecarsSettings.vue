<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcFormBox>
		<NcFormBoxSwitch
			:modelValue="xmpSidecars"
			:label="t('photos', 'Save edits to XMP sidecar files')"
			:description="t('photos', 'Corrected dates and locations are also written to a file next to the photo, such as IMG_1234.jpg.xmp, which other photo applications can read.')"
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

const xmpSidecars = computed(() => userConfigStore.xmpSidecars)

/**
 * @param value - Whether edits are written to sidecar files
 */
function updateSetting(value: boolean) {
	userConfigStore.updateUserConfig('xmpSidecars', value)
}
</script>
