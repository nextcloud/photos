<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="family-library">
		<div class="family-library__title">
			{{ t('photos', 'Family library') }}
		</div>
		<div class="family-library__description">
			{{ t('photos', 'A folder your household shares: one you share with them, one shared with you or a group folder. Its photos join your timeline, show who added them and can be shown on their own.') }}
		</div>

		<PhotosFolder
			v-if="familyLibrary !== ''"
			class="family-library__folder"
			:path="familyLibrary"
			:rootFolderLabel="t('photos', 'All folders')"
			:rootFolderIcon="FolderMultipleOutline" />

		<div class="family-library__actions">
			<NcButton :wide="true" @click="debouncePickFamilyLibrary">
				<template #icon>
					<AccountGroupOutline :size="20" />
				</template>
				{{ familyLibrary === '' ? t('photos', 'Choose family library') : t('photos', 'Change family library') }}
			</NcButton>
			<NcButton
				v-if="familyLibrary !== ''"
				variant="tertiary"
				:wide="true"
				@click="userConfigStore.setFamilyLibrary('')">
				{{ t('photos', 'Stop using a family library') }}
			</NcButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import debounce from 'debounce'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import AccountGroupOutline from 'vue-material-design-icons/AccountGroupOutline.vue'
import FolderMultipleOutline from 'vue-material-design-icons/FolderMultipleOutline.vue'
import PhotosFolder from './PhotosFolder.vue'
import { logger } from '../../services/logger.ts'
import { useUserConfigStore } from '../../store/userConfig.ts'

const userConfigStore = useUserConfigStore()

const familyLibrary = computed<string>(() => userConfigStore.familyLibrary)

const debouncePickFamilyLibrary = debounce(pickFamilyLibrary, 200, { immediate: false })

async function pickFamilyLibrary(): Promise<void> {
	const picker = getFilePickerBuilder(t('photos', 'Select the folder your household shares'))
		.setMultiSelect(false)
		.addMimeTypeFilter('httpd/unix-directory')
		.allowDirectories()
		.addButton({
			label: t('photos', 'Pick folder'),
			callback: (nodes) => logger.debug('Picked', { nodes }),
		})
		.build()

	const pickedFolder = await picker.pick()
	// The root holds every file of the user, not a library.
	if (pickedFolder === '/' || pickedFolder === familyLibrary.value) {
		return
	}

	await userConfigStore.setFamilyLibrary(pickedFolder)
}
</script>

<style lang="scss" scoped>
.family-library {
	margin-block-start: calc(var(--default-grid-baseline) * 4);

	&__title {
		padding-inline-start: 12px;
		font-weight: bold;
	}

	&__description {
		padding-inline-start: 12px;
		color: var(--color-text-maxcontrast);
	}

	&__folder {
		padding-inline-start: 12px;
		margin-block: calc(var(--default-grid-baseline) * 4);
	}

	&__actions {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);
		margin-block-start: calc(var(--default-grid-baseline) * 2);
	}
}
</style>
