<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="photos-location">
		<NcFormBox>
			<NcFormBoxButton
				:description="photosLocationName"
				:inverted-accent="true"
				@click="debounceSelectPhotosFolder">
				<template #icon>
					<FolderOpenOutline :size="20" />
				</template>
				{{ t('photos', 'Upload folder') }}
			</NcFormBoxButton>
		</NcFormBox>
	</div>
</template>

<script lang='ts'>
import { getFilePickerBuilder } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import debounce from 'debounce'
import { defineComponent } from 'vue'
import NcFormBox from '@nextcloud/vue/components/NcFormBox'
import NcFormBoxButton from '@nextcloud/vue/components/NcFormBoxButton'
import FolderOpenOutline from 'vue-material-design-icons/FolderOpenOutline.vue'
import HomeOutline from 'vue-material-design-icons/HomeOutline.vue'
import logger from '../../services/logger.js'

export default defineComponent({
	name: 'PhotosUploadLocationSettings',

	components: {
		NcFormBox,
		NcFormBoxButton,
		FolderOpenOutline,
	},

	data() {
		return {
			HomeOutline,
		}
	},

	computed: {
		photosLocation(): string {
			return this.$store.state.userConfig.photosLocation
		},

		photosLocationName(): string {
			switch (this.photosLocation) {
				case '/':
					return t('photos', 'Home')
				default:
					return this.photosLocation
			}
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

	.folder {
		margin-bottom: 16px;
	}
}
</style>
