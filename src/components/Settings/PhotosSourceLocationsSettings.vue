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
	<div class="photos-locations">
		<ul>
			<li v-for="(source, index) in photosSourceFolders"
				:key="index">
				<PhotosFolder :path="source" :can-delete="photosSourceFolders.length !== 1" @remove-folder="removeSourceFolder(index)" />
			</li>
		</ul>

		<NcButton :aria-label="t('photos', 'Add source directory')"
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

import Plus from 'vue-material-design-icons/Plus.vue'

import { NcButton } from '@nextcloud/vue'
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import UserConfig from '../../mixins/UserConfig.js'
import PhotosFolder from './PhotosFolder.vue'

export default defineComponent({
	name: 'PhotosSourceLocationsSettings',

	components: {
		NcButton,
		Plus,
		PhotosFolder,
	},

	mixins: [
		UserConfig,
	],

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
			this.photosSourceFolders.push(pickedFolder)
			this.updateSetting('photosSourceFolders')
		},

		removeSourceFolder(index) {
			this.photosSourceFolders.splice(index, 1)
			this.updateSetting('photosSourceFolders')
		},

		t,
	},
})
</script>

<style lang="scss" scoped>
.photos-locations {
	display: flex;
	flex-direction: column;
	width: fit-content;

	ul {
		margin-bottom: 16px;
	}
}
</style>
