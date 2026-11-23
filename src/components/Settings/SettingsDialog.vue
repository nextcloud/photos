<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsDialog
		:open="open"
		:name="t('photos', 'Photos settings')"
		:legacy="false"
		@update:open="onClose">
		<NcAppSettingsSection id="layout-settings" :name="t('photos', 'General')">
			<PhotosSourceLocationsSettings />
			<PhotosUploadLocationSettings />
			<CroppedLayoutSettings />
			<NcNoteCard
				v-if="isEndToEndEncryptionEnabled"
				type="info"
				:heading="t('photos', 'End-to-end encrypted folders')"
				:text="t('photos', 'Their photos can only be decrypted on your devices, so Photos shows these folders locked and cannot use them as media or upload folders. Open them in the Nextcloud desktop or mobile app.')" />
		</NcAppSettingsSection>
		<KeyboardShortcutsSettings />
	</NcAppSettingsDialog>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import NcAppSettingsDialog from '@nextcloud/vue/components/NcAppSettingsDialog'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import CroppedLayoutSettings from './CroppedLayoutSettings.vue'
import KeyboardShortcutsSettings from './KeyboardShortcutsSettings.vue'
import PhotosSourceLocationsSettings from './PhotosSourceLocationsSettings.vue'
import PhotosUploadLocationSettings from './PhotosUploadLocationSettings.vue'
import { isEndToEndEncryptionEnabled } from '../../services/IsEndToEndEncryptionEnabled.ts'

withDefaults(defineProps<{
	open?: boolean
}>(), {
	open: false,
})

const emit = defineEmits<{
	'update:open': [open: boolean]
}>()

// This can only be called if the AppSettingsDialog
// is shown. So closing only
function onClose() {
	emit('update:open', false)
}
</script>
