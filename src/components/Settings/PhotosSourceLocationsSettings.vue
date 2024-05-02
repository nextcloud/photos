<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-locations-container">
		<div class="photos-locations">
			<li v-for="(source, index) in photosSourceFolders"
				:key="index">
				<PhotosFolder :path="source"
					:can-delete="photosSourceFolders.length !== 1"
					:root-folder-label="t('photos', 'All folders')"
					:root-folder-icon="FolderMultiple"
					@remove-folder="removeSourceFolder(index)" />
			</li>
		</div>

		<NcButton :aria-label="t('photos', 'Add a Photos source for the timelines')"
			@click="debounceAddSourceFolder">
			<template #icon>
				<Plus :size="20" />
			</template>
			{{ t('photos', 'Add folder') }}
		</NcButton>
	</div>
</template>

<script>
import debounce from 'debounce'
import { defineComponent } from 'vue'

import FolderMultiple from 'vue-material-design-icons/FolderMultiple.vue'
import Plus from 'vue-material-design-icons/Plus.vue'

import { NcButton } from '@nextcloud/vue'
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import PhotosFolder from './PhotosFolder.vue'

export default defineComponent({
	name: 'PhotosSourceLocationsSettings',

	components: {
		NcButton,
		PhotosFolder,
		Plus,
	},

	data() {
		return {
			FolderMultiple,
		}
	},

	computed: {
		/** @return {string[]} */
		photosSourceFolders() {
			return this.$store.state.userConfig.photosSourceFolders
		},
	},

	methods: {
		debounceAddSourceFolder: debounce(function(...args) {
			this.addSourceFolder(...args)
		}, 200, false),

		async openFilePicker(title) {
			const picker = getFilePickerBuilder(title)
				.setMultiSelect(false)
				.setModal(true)
				.setType(1)
				.addMimeTypeFilter('httpd/unix-directory')
				.allowDirectories()
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
.photos-locations-container {
	display: flex;
	flex-direction: column;
	width: fit-content;

	.photos-locations {
		margin-bottom: 16px;

		li {
			list-style: none;
		}
	}
}
</style>
