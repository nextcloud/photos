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
		<NcTextField class="photos-location__text-field"
			:label="t('photos', 'Default Photos upload and Albums location')"
			:label-visible="true"
			:value.sync="photosLocation"
			@update:value="debounceUpdatePhotosFolder(photosLocation)" />
		<NcButton :aria-label="t('photos', 'Choose default Photos upload and Albums location')"
			@click="debounceSelectPhotosFolder">
			<template #icon>
				<Folder :size="20" />
			</template>
		</NcButton>
	</div>
</template>

<script>
import debounce from 'debounce'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcTextField from '@nextcloud/vue/dist/Components/NcTextField.js'
import Folder from 'vue-material-design-icons/Folder.vue'

import { getFilePickerBuilder, showError } from '@nextcloud/dialogs'

import UserConfig from '../../mixins/UserConfig.js'

export default {
	name: 'PhotosLocationSettings',

	mixins: [
		UserConfig,
	],

	components: {
		NcButton,
		NcTextField,
		Folder,
	},

	methods: {
		debounceSelectPhotosFolder: debounce(function() {
			this.selectPhotosFolder()
		}),

		selectPhotosFolder() {
			const picker = getFilePickerBuilder(t('photos', 'Select the default location for your media'))
				.setMultiSelect(false)
				.setModal(true)
				.setType(1)
				.addMimeTypeFilter('httpd/unix-directory')
				.allowDirectories()
				.startAt(this.photosLocation)
				.build()

			picker.pick()
				.then(this.updatePhotosFolder)
		},

		debounceUpdatePhotosFolder: debounce(function(...args) {
			this.updatePhotosFolder(...args)
		}, 300),

		updatePhotosFolder(path) {
			console.debug(`Path '${path}' selected for photos location`)
			if (typeof path !== 'string' || path.trim() === '' || !path.startsWith('/')) {
				showError(t('photos', 'Invalid location selected'))
				return
			}

			if (path.includes('//')) {
				path = path.replace(/\/\//gi, '/')
			}

			this.photosLocation = path
			this.updateSetting('photosLocation')
		},
	},
}
</script>

<style lang="scss" scoped>
.photos-location {
	display: flex;
	align-items: flex-end;
	gap: 0 8px;

	&__text-field {
		max-width: 300px;

		:deep {
			.input-field__main-wrapper,
			input {
				height: var(--default-clickable-area) !important;
			}
		}
	}
}
</style>
