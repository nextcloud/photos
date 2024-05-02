<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-location">
		<PhotosFolder :path="photosLocation" :root-folder-label="t('photos', 'Home')" :root-folder-icon="Home" />

		<NcButton :aria-label="t('photos', 'Choose default Photos upload and Albums location')"
			@click="debounceSelectPhotosFolder">
			{{ t('photos', 'Choose a different folder') }}
		</NcButton>
	</div>
</template>

<script>
import debounce from 'debounce'
import { defineComponent } from 'vue'

import Home from 'vue-material-design-icons/Home.vue'

import { NcButton } from '@nextcloud/vue'
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import PhotosFolder from './PhotosFolder.vue'

export default defineComponent({
	name: 'PhotosUploadLocationSettings',

	components: {
		NcButton,
		PhotosFolder,
	},

	data() {
		return {
			Home,
		}
	},

	computed: {
		/** @return {string} */
		photosLocation() {
			return this.$store.state.userConfig.photosLocation
		},
	},

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
			this.$store.dispatch('updateUserConfig', { key: 'photosLocation', value: path })
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
