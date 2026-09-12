<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-location">
		<NcFormBox>
			<NcFormBoxButton
				:description="photosLocationName"
				:invertedAccent="true"
				@click="debounceSelectPhotosFolder">
				<template #icon>
					<FolderOpenOutline :size="20" />
				</template>
				{{ t('photos', 'Upload folder') }}
			</NcFormBoxButton>
		</NcFormBox>
	</div>
</template>

<script setup lang="ts">
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import debounce from 'debounce'
import { computed } from 'vue'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxButton from '@nextcloud/vue/components/NcFormBoxButton'
import FolderOpenOutline from 'vue-material-design-icons/FolderOpenOutline.vue'
import { logger } from '../../services/logger.ts'
import { useUserConfigStore } from '../../store/userConfig.ts'

const userConfigStore = useUserConfigStore()

const photosLocation = computed<string>(() => userConfigStore.photosLocation)

const photosLocationName = computed<string>(() => {
	switch (photosLocation.value) {
		case '/':
			return t('photos', 'Home')
		default:
			return photosLocation.value
	}
})

const debounceSelectPhotosFolder = debounce(selectPhotosFolder)

async function selectPhotosFolder(): Promise<void> {
	const pickedFolder = await openFilePicker(t('photos', 'Select the default upload location for your media'))
	updatePhotosFolder(pickedFolder)
}

async function openFilePicker(title: string): Promise<string> {
	const picker = getFilePickerBuilder(title)
		.setMultiSelect(false)
		.addMimeTypeFilter('httpd/unix-directory')
		.allowDirectories()
		.startAt(photosLocation.value)
		.addButton({
			label: t('photos', 'Pick folder'),
			callback: (nodes) => logger.debug('Picked', { nodes }),
		})
		.build()

	return picker.pick()
}

function updatePhotosFolder(path: string): void {
	userConfigStore.updateUserConfig('photosLocation', path)
}
</script>

<style lang="scss" scoped>
.photos-location {
	display: flex;
	flex-direction: column;

	.folder {
		margin-bottom: 16px;
	}
}
</style>
