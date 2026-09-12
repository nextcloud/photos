<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-locations">
		<div class="photos-locations__title">
			{{ t('photos', 'Media folders') }}
		</div>
		<div class="photos-locations__description">
			{{ t('photos', 'Choose the folders from where photos and videos are shown.') }}
		</div>

		<ul class="photos-locations__list">
			<li
				v-for="(source, index) in photosSourceFolders"
				:key="index">
				<PhotosFolder
					:path="source"
					canDelete
					:rootFolderLabel="t('photos', 'All folders')"
					:rootFolderIcon="FolderMultipleOutline"
					@removeFolder="removeSourceFolder(index)" />
			</li>
		</ul>

		<NcButton
			:aria-label="t('photos', 'Add a Photos source for the timelines')"
			:wide="true"
			@click="debounceAddSourceFolder">
			<template #icon>
				<Plus :size="20" />
			</template>
			{{ t('photos', 'Add folder') }}
		</NcButton>
	</div>
</template>

<script setup lang="ts">
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import debounce from 'debounce'
import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import FolderMultipleOutline from 'vue-material-design-icons/FolderMultipleOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import PhotosFolder from './PhotosFolder.vue'
import { logger } from '../../services/logger.ts'
import { useUserConfigStore } from '../../store/userConfig.ts'

const userConfigStore = useUserConfigStore()

const photosSourceFolders = computed<string[]>(() => userConfigStore.photosSourceFolders)

const debounceAddSourceFolder = debounce(addSourceFolder, 200, { immediate: false })

async function openFilePicker(title: string): Promise<string> {
	const picker = getFilePickerBuilder(title)
		.setMultiSelect(false)
		.addMimeTypeFilter('httpd/unix-directory')
		.allowDirectories()
		.addButton({
			label: t('photos', 'Pick folder'),
			callback: (nodes) => logger.debug('Picked', { nodes }),
		})
		.build()

	return picker.pick()
}

async function addSourceFolder() {
	const pickedFolder = await openFilePicker(t('photos', 'Select a source folder for your media'))
	if (photosSourceFolders.value.includes(pickedFolder)) {
		return
	}
	userConfigStore.updateUserConfig('photosSourceFolders', [...photosSourceFolders.value, pickedFolder])
}

function removeSourceFolder(index: number) {
	const folders = [...photosSourceFolders.value]
	folders.splice(index, 1)
	userConfigStore.updateUserConfig('photosSourceFolders', folders)
}
</script>

<style lang="scss" scoped>
.photos-locations {
	&__title {
		padding-inline-start: 12px;
		font-weight: bold;
	}

	&__description {
		padding-inline-start: 12px;
		color: var(--color-text-lighter);
	}

	&__list {
		padding-inline-start: 12px;
		margin: 16px 0;

		li {
			list-style: none;
		}
	}
}
</style>
