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
	<div class="photos-location">
		<PhotosFolder :path="photosLocation" />

		<NcButton :aria-label="t('photos', 'Choose default Photos upload and Albums location')"
			@click="debounceSelectPhotosFolder">
			{{ t('photos', 'Choose a different folder') }}
		</NcButton>
	</div>
</template>

<script>
import debounce from 'debounce'
import { defineComponent } from 'vue'

import { NcButton } from '@nextcloud/vue'
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import UserConfig from '../../mixins/UserConfig.js'
import PhotosFolder from './PhotosFolder.vue'

export default defineComponent({
	name: 'PhotosUploadLocationSettings',

	components: {
		NcButton,
		PhotosFolder,
	},

	mixins: [
		UserConfig,
	],

	methods: {
		debounceSelectPhotosFolder: debounce(function() {
			this.selectPhotosFolder()
		}),

		async selectPhotosFolder() {
			const pickedFolder = await this.openFilePicker(t('photos', 'Select the default upload location for your media'))
			this.updatePhotosFolder(pickedFolder)
		},

		async openFilePicker(title) {
			const picker = getFilePickerBuilder(title)
				.setMultiSelect(false)
				.setModal(true)
				.setType(1)
				.addMimeTypeFilter('httpd/unix-directory')
				.allowDirectories()
				.startAt(this.photosLocation)
				.build()

			return picker.pick()
		},

		updatePhotosFolder(path) {
			this.photosLocation = path
			this.updateSetting('photosLocation')
		},

		t,
	},
})
</script>

<style lang="scss" scoped>
.photos-location {
	display: flex;
	flex-direction: column;
	width: fit-content;

	.folder {
		margin-bottom: 16px;
	}
}
</style>
