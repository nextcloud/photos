<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsSection v-if="canInstall" id="install-settings" :name="t('photos', 'Install app')">
		<p class="install-settings__hint">
			{{ t('photos', 'Install Photos on this device to open it like an app. Your favorites and most recent photos stay available offline.') }}
		</p>
		<NcButton @click="install">
			<template #icon>
				<TrayArrowDown :size="20" />
			</template>
			{{ t('photos', 'Install app') }}
		</NcButton>
	</NcAppSettingsSection>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import NcButton from '@nextcloud/vue/components/NcButton'
import TrayArrowDown from 'vue-material-design-icons/TrayArrowDown.vue'
import { useInstallPrompt } from '../../composables/useInstallPrompt.ts'

const { canInstall, install } = useInstallPrompt()
</script>

<style lang="scss" scoped>
.install-settings__hint {
	margin-bottom: calc(var(--default-grid-baseline) * 2);
	color: var(--color-text-maxcontrast);
}
</style>
