<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		v-if="!userConfigStore.welcomeDismissed"
		:name="t('photos', 'Welcome to Photos')"
		size="normal"
		@update:open="dismiss">
		<ol class="welcome-dialog">
			<li class="welcome-dialog__step">
				<FolderImage class="welcome-dialog__icon" :size="32" />
				<div>
					<h3 class="welcome-dialog__title">
						{{ t('photos', 'Where your photos come from') }}
					</h3>
					<p>{{ t('photos', 'Photos shows the pictures and videos stored in your media folders. You decide which folders these are.') }}</p>
					<NcButton @click="chooseMediaFolders">
						{{ t('photos', 'Choose media folders') }}
					</NcButton>
				</div>
			</li>
			<li class="welcome-dialog__step">
				<TrayArrowUp class="welcome-dialog__icon" :size="32" />
				<div>
					<h3 class="welcome-dialog__title">
						{{ t('photos', 'Bring photos from elsewhere') }}
					</h3>
					<p>{{ t('photos', 'Upload pictures and videos from your computer into a media folder with Files, they then show up here.') }}</p>
					<NcButton :href="uploadFolderUrl">
						{{ t('photos', 'Open the upload folder in Files') }}
					</NcButton>
				</div>
			</li>
			<li class="welcome-dialog__step">
				<Cellphone class="welcome-dialog__icon" :size="32" />
				<div>
					<h3 class="welcome-dialog__title">
						{{ t('photos', 'Get the mobile app') }}
					</h3>
					<p>{{ t('photos', 'The Nextcloud apps for Android and iOS upload the photos you take automatically.') }}</p>
					<NcButton
						:href="MOBILE_APPS_URL"
						target="_blank"
						rel="noreferrer noopener">
						{{ t('photos', 'Get the mobile apps') }}
					</NcButton>
				</div>
			</li>
		</ol>

		<template #actions>
			<NcButton variant="primary" @click="dismiss">
				{{ t('photos', 'Get started') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script setup lang="ts">
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import Cellphone from 'vue-material-design-icons/Cellphone.vue'
import FolderImage from 'vue-material-design-icons/FolderImage.vue'
import TrayArrowUp from 'vue-material-design-icons/TrayArrowUp.vue'
import { logger } from '../services/logger.ts'
import { useUserConfigStore } from '../store/userConfig.ts'

const emit = defineEmits<{
	/** The user asked for the media folders settings. */
	openSettings: []
}>()

const MOBILE_APPS_URL = 'https://nextcloud.com/install/#install-clients'

const userConfigStore = useUserConfigStore()

const uploadFolderUrl = computed(() => generateUrl('/apps/files/files?dir={dir}', { dir: userConfigStore.photosLocation || '/' }))

/**
 * Close the dialog for good. It stays closed for the session even if storing the choice fails.
 */
async function dismiss() {
	try {
		await userConfigStore.updateUserConfig('welcomeDismissed', true)
	} catch (error) {
		logger.error('Could not store that the welcome dialog was dismissed', { error })
	}
}

function chooseMediaFolders() {
	dismiss()
	emit('openSettings')
}
</script>

<style lang="scss" scoped>
.welcome-dialog {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 4);
	padding-block-end: calc(var(--default-grid-baseline) * 2);
	list-style: none;

	&__step {
		display: flex;
		gap: calc(var(--default-grid-baseline) * 4);
	}

	&__icon {
		flex-shrink: 0;
		align-self: flex-start;
		color: var(--color-primary-element);
	}

	&__title {
		margin: 0 0 var(--default-grid-baseline);
		font-size: var(--default-font-size);
		font-weight: bold;
	}

	p {
		margin-block-end: calc(var(--default-grid-baseline) * 2);
	}
}
</style>
