<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
	Minimal Vue 3 replacement for the `<UploadPicker>` component that was
	dropped in @nextcloud/upload@2.x. Wraps the headless `getUploader()` /
	`batchUpload()` primitives behind an NcButton + hidden <input type="file">.

	Drop-in equivalent for the subset of v8 UploadPicker props the photos app
	uses: `accept`, `destination`, `multiple`. Emits `uploaded` for each
	completed upload (mirrors the v8 API signature).

	When @nextcloud/upload@2 ships an official Vue 3 picker, this file can be
	deleted and consumers re-pointed at the upstream component.
-->

<template>
	<div class="local-upload-picker">
		<NcButton
			variant="primary"
			:aria-label="t('photos', 'Upload files')"
			:disabled="!destination || activeCount > 0"
			@click="triggerFilePicker">
			<template #icon>
				<UploadIcon :size="20" />
			</template>
			{{ buttonLabel }}
		</NcButton>
		<input
			ref="fileInput"
			class="local-upload-picker__input"
			type="file"
			:accept="accept.join(',')"
			:multiple="multiple"
			tabindex="-1"
			aria-hidden="true"
			@change="onFilesSelected">
	</div>
</template>

<script lang="ts">
import type { Folder } from '@nextcloud/files'
import type { Upload } from '@nextcloud/upload'
import type { PropType } from 'vue'

import { t } from '@nextcloud/l10n'
import { getUploader } from '@nextcloud/upload'
import { defineComponent, markRaw } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import UploadIcon from 'vue-material-design-icons/Upload.vue'

export default defineComponent({
	name: 'LocalUploadPicker',

	components: {
		NcButton,
		UploadIcon,
	},

	props: {
		/**
		 * Accepted MIME types (forwarded to the file input's `accept` attribute).
		 */
		accept: {
			type: Array as PropType<string[]>,
			default: () => [],
		},

		/**
		 * Destination folder for the upload. The Uploader's destination is
		 * temporarily switched to this folder for the duration of the upload.
		 */
		destination: {
			type: Object as PropType<Folder | undefined>,
			default: undefined,
		},

		/**
		 * Allow selecting multiple files at once.
		 */
		multiple: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['uploaded'],

	data() {
		return {
			// markRaw: Uploader uses private class fields that throw under Vue 3's reactive Proxy.
			uploader: markRaw(getUploader()),
			activeCount: 0,
		}
	},

	computed: {
		buttonLabel(): string {
			return this.activeCount > 0
				? t('photos', 'Uploading…')
				: t('photos', 'Upload files')
		},
	},

	methods: {
		t,

		triggerFilePicker() {
			(this.$refs.fileInput as HTMLInputElement | undefined)?.click()
		},

		async onFilesSelected(event: Event) {
			const input = event.target as HTMLInputElement
			const files = input.files
			if (!files || files.length === 0 || !this.destination) {
				return
			}

			// Switch the singleton uploader's destination for this batch and
			// restore it after we're done so we don't leak the override across
			// other consumers.
			const previousDestination = this.uploader.destination
			this.uploader.destination = this.destination

			try {
				const uploads = await this.uploader.batchUpload(
					'',
					Array.from(files),
				)

				for (const upload of uploads) {
					this.$emit('uploaded', upload as Upload)
				}
			} finally {
				this.uploader.destination = previousDestination
				// Reset the input so selecting the same file again still fires `change`.
				input.value = ''
			}
		},
	},
})
</script>

<style lang="scss" scoped>
.local-upload-picker {
	display: inline-flex;
	align-items: center;

	&__input {
		// Hidden but reachable via this.$refs.fileInput.click()
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}
}
</style>
