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

<script lang='ts'>
import debounce from 'debounce'
import { defineComponent } from 'vue'

import Home from 'vue-material-design-icons/Home.vue'

import { NcButton } from '@nextcloud/vue'
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import PhotosFolder from './PhotosFolder.vue'
import logger from '../../services/logger.js'

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
		photosLocation(): string {
			return this.$store.state.userConfig.photosLocation
		},
	},

	methods: {
		debounceSelectPhotosFolder: debounce(function() {
			this.selectPhotosFolder()
		}),

		async selectPhotosFolder(): Promise<void> {
			const pickedFolder = await this.openFilePicker(t('photos', 'Select the default upload location for your media'))
			this.updatePhotosFolder(pickedFolder)
		},

		async openFilePicker(title: string): Promise<string> {
			const picker = getFilePickerBuilder(title)
				.setMultiSelect(false)
				.addMimeTypeFilter('httpd/unix-directory')
				.allowDirectories()
				.startAt(this.photosLocation)
				.addButton({
					label: t('photos', 'Pick folder'),
					callback: (nodes) => logger.debug('Picked', { nodes }),
				})
				.build()

			return picker.pick()
		},

		updatePhotosFolder(path: string): void {
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
