<!--
 - @copyright Copyright (c) 2020 Corentin Mors
 -
 - @license GNU AGPL version 3 or any later version
 -
 - @author Corentin Mors <medias@pixelswap.fr>
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
	<div class="section">
		<h2>{{ t('photos', 'Timeline') }}</h2>

		<p>{{ t('photos', 'Folder for the timeline') }} : {{ timelineRootFolder }}/</p>
		<button
			@click="pickRootFolder">
			{{ t('photos', 'Choose folder') }}
		</button>
	</div>
</template>

<script>
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import UserConfig from '../../mixins/UserConfig'

export default {
	name: 'TimelineSettings',

	mixins: [
		UserConfig,
	],

	methods: {
		pickRootFolder() {
			const picker = getFilePickerBuilder(t('photos', 'Choose a folder to display in the timeline'))
				.setMultiSelect(false)
				.addMimeTypeFilter('httpd/unix-directory')
				.setModal(true)
				.setType(1)
				.allowDirectories(true)
				.build()

			return picker
				.pick()
				.then((dest) => {
					this.timelineRootFolder = dest
					this.updateSetting('timelineRootFolder')
					location.reload()
				})
		},
	},
}
</script>

<style scoped>
.section {
	padding: 10px;
	margin-bottom: 5px;
}
</style>
