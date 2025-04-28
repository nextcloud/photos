<!--
 - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsDialog :open="open"
		:show-navigation="true"
		:name="t('photos', 'Photos settings')"
		@update:open="onClose">
		<NcAppSettingsSection id="layout-settings" :name="t('photos', 'View')">
			<CroppedLayoutSettings />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="source-directories-settings" :name="t('photos', 'Media folders')">
			<div class="setting-section-subline">
				{{ t('photos', 'Choose the folders from where photos and videos are shown.') }}
			</div>

			<PhotosSourceLocationsSettings />
		</NcAppSettingsSection>

		<NcAppSettingsSection id="upload-directory-settings" :name="t('photos', 'Upload folder')">
			<div class="setting-section-subline">
				{{ t('photos', 'Choose the folder where photos and albums are uploaded to.') }}
			</div>

			<PhotosUploadLocationSettings />
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script lang='ts'>
import NcAppSettingsDialog from '@nextcloud/vue/dist/Components/NcAppSettingsDialog.js'
import NcAppSettingsSection from '@nextcloud/vue/dist/Components/NcAppSettingsSection.js'
import { translate as t } from '@nextcloud/l10n'

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

<style lang="scss">
.app-settings {
	.setting-section-subline {
		color: var(--color-text-lighter);
		margin-bottom: 8px;
	}
}
</style>
