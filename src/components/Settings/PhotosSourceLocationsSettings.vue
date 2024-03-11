<!--
 - @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @author John Molakvoæ <skjnldsv@protonmail.com>
 -
 - @license AGPL-3.0-or-later
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<div class="photos-locations-container">
		<div class="photos-locations">
			<PhotosFolder :path="photosSourceFolder" :root-folder-label="t('photos', 'All folders')" :root-folder-icon="FolderMultiple" />
			<!-- TODO: uncomment when SEARCH on multiple folders is implemented. -->
			<!-- <li v-for="(source, index) in photosSourceFolder"
				:key="index">
				<PhotosFolder :path="source"
					:can-delete="photosSourceFolder.length !== 1"
					:root-folder-label="t('photos', 'All folders')"
					@remove-folder="removeSourceFolder(index)" />
			</li> -->
		</div>

		<NcButton :aria-label="t('photos', 'Choose a Photos source for the timelines')"
			@click="debounceAddSourceFolder">
			<!-- TODO: uncomment when SEARCH on multiple folders is implemented. -->
			<!-- <template #icon>
				<Plus :size="20" />
			</template> -->
			{{ t('photos', 'Choose a different folder') }}
		</NcButton>
	</div>
</template>

<script>
import debounce from 'debounce'
import { defineComponent } from 'vue'

import FolderMultiple from 'vue-material-design-icons/FolderMultiple.vue'

import { NcButton } from '@nextcloud/vue'
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import PhotosFolder from './PhotosFolder.vue'

export default defineComponent({
	name: 'PhotosSourceLocationsSettings',

	components: {
		NcButton,
		PhotosFolder,
	},

	data() {
		return {
			FolderMultiple,
		}
	},

	computed: {
		/** @return {string} */
		photosSourceFolder() {
			return this.$store.state.userConfig.photosSourceFolder
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
			// TODO: uncomment when SEARCH on multiple folders is implemented.
			// if (this.photosSourceFolder.includes(pickedFolder)) {
			//   return
			// }
			this.$store.dispatch('updateUserConfig', { key: 'photosSourceFolder', value: pickedFolder })
		},

		removeSourceFolder(index) {
			const folders = [...this.photosSourceFolder]
			folders.splice(index, 1)
			this.$store.dispatch('updateUserConfig', { key: 'photosSourceFolder', value: folders })
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
	}
}
</style>
