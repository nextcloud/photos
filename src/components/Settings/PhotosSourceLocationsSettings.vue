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
					:can-delete="photosSourceFolders.length !== 1"
					:root-folder-label="t('photos', 'All folders')"
					:root-folder-icon="FolderMultipleOutline"
					@remove-folder="removeSourceFolder(index)" />
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

<script lang='ts'>
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import debounce from 'debounce'
import { defineComponent } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import FolderMultipleOutline from 'vue-material-design-icons/FolderMultipleOutline.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import PhotosFolder from './PhotosFolder.vue'
import logger from '../../services/logger.js'

export default defineComponent({
	name: 'PhotosSourceLocationsSettings',

	components: {
		NcButton,
		PhotosFolder,
		Plus,
	},

	data() {
		return {
			FolderMultipleOutline,
		}
	},

	computed: {
		photosSourceFolders(): string[] {
			return this.$store.state.userConfig.photosSourceFolders
		},
	},

	methods: {
		debounceAddSourceFolder: debounce(function(...args) {
			this.addSourceFolder(...args)
		}, 200, { immediate: false }),

		async openFilePicker(title: string): Promise<string> {
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
		},

		async addSourceFolder() {
			const pickedFolder = await this.openFilePicker(t('photos', 'Select a source folder for your media'))
			if (this.photosSourceFolders.includes(pickedFolder)) {
				return
			}
			this.$store.dispatch('updateUserConfig', { key: 'photosSourceFolders', value: [...this.photosSourceFolders, pickedFolder] })
		},

		removeSourceFolder(index) {
			const folders = [...this.photosSourceFolders]
			folders.splice(index, 1)
			this.$store.dispatch('updateUserConfig', { key: 'photosSourceFolders', value: folders })
		},

		t,
	},
})
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
