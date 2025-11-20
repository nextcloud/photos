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
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import NcAppSettingsDialog from '@nextcloud/vue/components/NcAppSettingsDialog'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import CroppedLayoutSettings from './CroppedLayoutSettings.vue'
import PhotosSourceLocationsSettings from './PhotosSourceLocationsSettings.vue'
import PhotosUploadLocationSettings from './PhotosUploadLocationSettings.vue'

export default {
	name: 'SettingsDialog',

	components: {
		NcAppSettingsDialog,
		NcAppSettingsSection,
		CroppedLayoutSettings,
		PhotosSourceLocationsSettings,
		PhotosUploadLocationSettings,
	},

	props: {
		open: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		// This can only be called if the AppSettingsDialog
		// is shown. So closing only
		onClose() {
			this.$emit('update:open', false)
		},

		t,
	},
}
</script>
