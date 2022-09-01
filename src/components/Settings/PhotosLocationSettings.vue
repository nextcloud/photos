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
	<div>
		<!-- Description -->
		<p class="app-settings-section__desc">
			{{ t('photos', 'Default Photos upload and Albums location') }}
		</p>

		<!-- Picker -->
		<input v-model="photosLocation"
			class="app-settings-section__input"
			type="text"
			@input="debounceUpdatePhotosFolder(photosLocation)"
			@change="debounceUpdatePhotosFolder(photosLocation)"
			@focus="selectPhotosFolder"
			@click="selectPhotosFolder">
	</div>
</template>

<script>
import { getFilePickerBuilder, showError } from '@nextcloud/dialogs'
import debounce from 'debounce'

import UserConfig from '../../mixins/UserConfig.js'

export default {
	name: 'PhotosLocationSettings',

	mixins: [
		UserConfig,
	],

	methods: {
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
