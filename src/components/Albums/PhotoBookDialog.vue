<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Create photo book (PDF)')"
		size="normal"
		@update:open="emit('close')">
		<div class="photo-book">
			<NcRadioGroup v-model="format" :label="t('photos', 'Paper size')">
				<NcRadioGroupButton value="a4" :label="t('photos', 'A4')" :disabled="generating" />
				<NcRadioGroupButton value="letter" :label="t('photos', 'Letter')" :disabled="generating" />
			</NcRadioGroup>

			<NcRadioGroup v-model="orientation" :label="t('photos', 'Orientation')">
				<NcRadioGroupButton value="landscape" :label="t('photos', 'Landscape')" :disabled="generating" />
				<NcRadioGroupButton value="portrait" :label="t('photos', 'Portrait')" :disabled="generating" />
			</NcRadioGroup>

			<NcRadioGroup
				v-model="layout"
				:label="t('photos', 'Photos per page')"
				:description="t('photos', 'Automatic gives a photo a full page when it has the orientation of the page, and pairs the others.')">
				<NcRadioGroupButton value="auto" :label="t('photos', 'Automatic')" :disabled="generating" />
				<NcRadioGroupButton value="1" label="1" :disabled="generating" />
				<NcRadioGroupButton value="2" label="2" :disabled="generating" />
				<NcRadioGroupButton value="4" label="4" :disabled="generating" />
			</NcRadioGroup>

			<NcCheckboxRadioSwitch v-model="titlePage" type="switch" :disabled="generating">
				{{ t('photos', 'Title page with album name, location and dates') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="captions" type="switch" :disabled="generating">
				{{ t('photos', 'Print the date below every photo') }}
			</NcCheckboxRadioSwitch>

			<NcProgressBar v-if="generating" :value="100 * finishedPages / pageCount" />
			<p class="photo-book__status" role="status">
				{{ status }}
			</p>
		</div>

		<template #actions>
			<NcButton v-if="generating" @click="abortController?.abort()">
				{{ t('photos', 'Cancel') }}
			</NcButton>
			<template v-else-if="pdf !== undefined">
				<NcButton v-if="canSaveToFiles" :disabled="saving" @click="saveToFiles">
					<template #icon>
						<NcLoadingIcon v-if="saving" :size="20" />
						<FolderOutline v-else :size="20" />
					</template>
					{{ t('photos', 'Save to Files') }}
				</NcButton>
				<NcButton variant="primary" @click="download">
					<template #icon>
						<TrayArrowDown :size="20" />
					</template>
					{{ t('photos', 'Download') }}
				</NcButton>
			</template>
			<NcButton
				v-else
				variant="primary"
				:disabled="images.length === 0"
				@click="generate">
				{{ t('photos', 'Create PDF') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoBookOptions } from '../../services/photoBook.ts'
import type { PhotoFile } from '../../store/files.ts'
import type { PageFormat, PageOrientation, PhotoBookLayout } from '../../utils/photoBook.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { getFilePickerBuilder, showError, showSuccess } from '@nextcloud/dialogs'
import { formatFileSize } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import NcRadioGroup from '@nextcloud/vue/components/NcRadioGroup'
import NcRadioGroupButton from '@nextcloud/vue/components/NcRadioGroupButton'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'
import TrayArrowDown from 'vue-material-design-icons/TrayArrowDown.vue'
import { logger } from '../../services/logger.ts'
import { countPhotoBookPages, createPhotoBook, savePhotoBook } from '../../services/photoBook.ts'
import { useFilesStore } from '../../store/files.ts'

const props = defineProps<{
	/** Name of the album, used as title and file name. */
	title: string
	/** Lines printed below the title: location and date range of the album. */
	subtitles: string[]
	/** Ids of the files of the album. */
	fileIds: string[]
}>()

const emit = defineEmits<{
	close: []
}>()

const format = ref<PageFormat>('a4')
const orientation = ref<PageOrientation>('landscape')
const layout = ref<PhotoBookLayout>('auto')
const titlePage = ref(true)
const captions = ref(false)

const pdf = shallowRef<Blob>()
const abortController = shallowRef<AbortController>()
const finishedPages = ref(0)
const saving = ref(false)

const canSaveToFiles = getCurrentUser() !== null
const generating = computed(() => abortController.value !== undefined)
const filesStore = useFilesStore()

// The photos of the album, oldest first like the album shows them.
const images = computed<PhotoFile[]>(() => props.fileIds
	.map((fileId) => filesStore.files[fileId])
	.filter((file) => file?.mime?.startsWith('image/'))
	.toSorted((file1, file2) => file1.attributes.timestamp - file2.attributes.timestamp))

const options = computed<PhotoBookOptions>(() => ({
	format: format.value,
	orientation: orientation.value,
	layout: layout.value,
	captions: captions.value,
	title: titlePage.value ? props.title : undefined,
	subtitles: props.subtitles,
}))

const pageCount = computed(() => countPhotoBookPages(images.value, options.value))

const status = computed(() => {
	if (images.value.length === 0) {
		return t('photos', 'This album has no photos to print.')
	}
	if (generating.value) {
		return t('photos', 'Page {page} of {pages}', { page: finishedPages.value, pages: pageCount.value })
	}
	const pages = n('photos', '%n page', '%n pages', pageCount.value)
	return pdf.value === undefined
		? n('photos', '%n photo on {pages}', '%n photos on {pages}', images.value.length, { pages })
		: t('photos', 'The photo book is ready: {pages}, {size}', { pages, size: formatFileSize(pdf.value.size) })
})

// A finished book is outdated as soon as an option changes.
watch(options, () => {
	pdf.value = undefined
})

onBeforeUnmount(() => abortController.value?.abort())

async function generate(): Promise<void> {
	abortController.value = new AbortController()
	finishedPages.value = 0
	try {
		pdf.value = await createPhotoBook(images.value, options.value, (pages) => {
			finishedPages.value = pages
		}, abortController.value.signal)
	} catch (error) {
		if (!abortController.value.signal.aborted) {
			logger.error('Failed to create the photo book', { error })
			showError(t('photos', 'Failed to create the photo book'))
		}
	} finally {
		abortController.value = undefined
	}
}

function download(): void {
	const link = document.createElement('a')
	link.href = URL.createObjectURL(pdf.value!)
	link.download = `${props.title}.pdf`
	link.click()
	setTimeout(() => URL.revokeObjectURL(link.href), 60_000)
}

async function saveToFiles(): Promise<void> {
	let folder: string
	try {
		folder = await getFilePickerBuilder(t('photos', 'Choose where to save the photo book'))
			.setMultiSelect(false)
			.addMimeTypeFilter('httpd/unix-directory')
			.allowDirectories()
			.addButton({ label: t('photos', 'Save here'), variant: 'primary', callback: () => {} })
			.build()
			.pick()
	} catch {
		// The picker was closed without choosing a folder.
		return
	}

	saving.value = true
	try {
		const path = await savePhotoBook(pdf.value!, folder, props.title)
		showSuccess(t('photos', 'Photo book saved as {path}', { path }))
	} catch (error) {
		logger.error('Failed to save the photo book', { error })
		showError(t('photos', 'Failed to save the photo book'))
	} finally {
		saving.value = false
	}
}
</script>

<style lang="scss" scoped>
.photo-book {
	display: flex;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	padding-block-end: calc(2 * var(--default-grid-baseline));

	&__status {
		color: var(--color-text-maxcontrast);
	}
}
</style>
