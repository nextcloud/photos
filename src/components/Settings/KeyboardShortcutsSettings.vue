<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsShortcutsSection>
		<NcHotkeyList :label="t('photos', 'Slideshow')">
			<NcHotkey
				:label="t('photos', 'Previous photo')"
				hotkey="ArrowLeft" />
			<NcHotkey
				:label="t('photos', 'Next photo')"
				hotkey="ArrowRight" />
			<NcHotkey
				:label="t('photos', 'Play or pause the slideshow')"
				hotkey="Space" />
			<NcHotkey
				:label="t('photos', 'Close the slideshow')"
				hotkey="Escape" />
			<NcHotkey
				:label="t('photos', 'Show or hide photo metadata')"
				hotkey="i" />
		</NcHotkeyList>
	</NcAppSettingsShortcutsSection>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import NcAppSettingsShortcutsSection from '@nextcloud/vue/components/NcAppSettingsShortcutsSection'
import NcHotkey from '@nextcloud/vue/components/NcHotkey'
import NcHotkeyList from '@nextcloud/vue/components/NcHotkeyList'
</script>
