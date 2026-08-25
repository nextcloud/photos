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
		<NcAppSettingsSection id="tools-settings" :name="t('photos', 'Tools')">
			<NcButton @click="openDuplicates">
				<template #icon>
					<ContentDuplicate :size="20" />
				</template>
				{{ t('photos', 'Find duplicate photos') }}
			</NcButton>
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script lang='ts'>
import { t } from '@nextcloud/l10n'
import NcAppSettingsDialog from '@nextcloud/vue/components/NcAppSettingsDialog'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import NcButton from '@nextcloud/vue/components/NcButton'
import ContentDuplicate from 'vue-material-design-icons/ContentDuplicate.vue'
import CroppedLayoutSettings from './CroppedLayoutSettings.vue'
import PhotosSourceLocationsSettings from './PhotosSourceLocationsSettings.vue'
import PhotosUploadLocationSettings from './PhotosUploadLocationSettings.vue'

export default {
	name: 'SettingsDialog',

	components: {
		NcAppSettingsDialog,
		NcAppSettingsSection,
		NcButton,
		ContentDuplicate,
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

		// Close the settings and open the (full-page) duplicate finder.
		openDuplicates() {
			this.$emit('update:open', false)
			this.$router.push({ name: 'duplicates' }).catch(() => {})
		},

		t,
	},
}
</script>
