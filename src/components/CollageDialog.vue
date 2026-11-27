<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Create collage')"
		size="normal"
		@update:open="emit('close')">
		<div class="collage">
			<div class="collage__preview" :class="{ 'collage__preview--loading': loading }">
				<canvas
					ref="canvas"
					class="collage__preview__canvas"
					role="img"
					:aria-label="t('photos', 'Preview of the collage')" />
				<NcLoadingIcon v-if="loading" :size="32" class="collage__preview__loading" />
			</div>

			<fieldset class="collage__layouts">
				<legend class="hidden-visually">
					{{ t('photos', 'Layout') }}
				</legend>
				<NcCheckboxRadioSwitch
					v-for="option in layoutOptions"
					:key="option.value"
					v-model="layout"
					:value="option.value"
					name="photos-collage-layout"
					type="radio"
					:buttonVariant="true"
					buttonVariantGrouped="horizontal">
					{{ option.label }}
				</NcCheckboxRadioSwitch>
			</fieldset>

			<NcCheckboxRadioSwitch v-model="spacing" type="switch">
				{{ t('photos', 'Space between photos') }}
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="darkBackground" type="switch" :disabled="!spacing">
				{{ t('photos', 'Dark background') }}
			</NcCheckboxRadioSwitch>

			<fieldset class="collage__target">
				<legend>{{ t('photos', 'Save to') }}</legend>
				<NcCheckboxRadioSwitch
					v-model="target"
					value="photo"
					name="photos-collage-target"
					type="radio">
					{{ t('photos', 'Folder of the first photo ({path})', { path: firstPhotoFolder }) }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch
					v-model="target"
					value="upload"
					name="photos-collage-target"
					type="radio">
					{{ t('photos', 'Upload folder ({path})', { path: uploadFolder }) }}
				</NcCheckboxRadioSwitch>
			</fieldset>
		</div>

		<template #actions>
			<NcButton :disabled="loading || saving" @click="download">
				<template #icon>
					<DownloadOutline :size="20" />
				</template>
				{{ t('photos', 'Download') }}
			</NcButton>
			<NcButton variant="primary" :disabled="loading || saving" @click="save">
				<template #icon>
					<NcLoadingIcon v-if="saving" :size="20" />
				</template>
				{{ t('photos', 'Save') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { CollageLayout } from '../utils/collageLayout.ts'

import { showError, showSuccess } from '@nextcloud/dialogs'
import { defaultRootPath } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { join } from '@nextcloud/paths'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import DownloadOutline from 'vue-material-design-icons/TrayArrowDown.vue'
import { davClient } from '../services/DavClient.ts'
import { logger } from '../services/logger.ts'
import { useUserConfigStore } from '../store/userConfig.ts'
import { computeCollageGeometry, computeCoverCrop, getCollageFileName } from '../utils/collageLayout.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'

const props = defineProps<{
	/** The 2 to 9 photos of the collage, the first one is the featured one. */
	photos: PhotoFile[]
}>()

const emit = defineEmits<{
	close: []
	saved: []
}>()

/** Width of the collage, in pixels. */
const COLLAGE_WIDTH = 2400
/** Space between the photos when it is enabled, in pixels. */
const COLLAGE_GAP = 24
/** How many file names are tried before giving up on saving. */
const MAX_NAME_ATTEMPTS = 50

const userConfigStore = useUserConfigStore()

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const layout = ref<CollageLayout>('grid')
const spacing = ref(true)
const darkBackground = ref(false)
const target = ref<'photo' | 'upload'>('photo')
const loading = ref(true)
const saving = ref(false)

let images: HTMLImageElement[] = []

const layoutOptions: { value: CollageLayout, label: string }[] = [
	{ value: 'grid', label: t('photos', 'Grid') },
	{ value: 'featured', label: t('photos', 'One large') },
	{ value: 'strip', label: t('photos', 'Strip') },
]

const firstPhotoFolder = computed(() => props.photos[0].dirname)
const uploadFolder = computed(() => userConfigStore.photosLocation || '/')

watch([layout, spacing, darkBackground], draw)

onMounted(async () => {
	try {
		images = await Promise.all(props.photos.map(loadPreview))
		loading.value = false
		draw()
	} catch (error) {
		logger.error('Error loading the photos of the collage', { error })
		showError(t('photos', 'Failed to load the photos of the collage'))
		emit('close')
	}
})

/**
 * Load the preview of a photo. The cells of a collage of many photos are
 * small, so only the first photo, which may be featured, is loaded large then.
 *
 * @param photo - The photo to load
 * @param index - Position of the photo in the collage
 */
async function loadPreview(photo: PhotoFile, index: number): Promise<HTMLImageElement> {
	const image = new Image()
	image.src = getPreviewUrl(photo, index === 0 || props.photos.length <= 4 ? 2048 : 1024)
	await image.decode()
	return image
}

function draw(): void {
	const context = canvas.value?.getContext('2d')
	if (!canvas.value || !context || images.length === 0) {
		return
	}

	const geometry = computeCollageGeometry(layout.value, images.length, COLLAGE_WIDTH, spacing.value ? COLLAGE_GAP : 0)
	canvas.value.width = geometry.width
	canvas.value.height = geometry.height

	context.fillStyle = darkBackground.value ? '#000' : '#fff'
	context.fillRect(0, 0, geometry.width, geometry.height)

	for (const [index, cell] of geometry.cells.entries()) {
		const image = images[index]
		const crop = computeCoverCrop(image.naturalWidth, image.naturalHeight, cell)
		context.drawImage(image, crop.x, crop.y, crop.width, crop.height, cell.x, cell.y, cell.width, cell.height)
	}
}

function toJpeg(): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.value!.toBlob((blob) => blob ? resolve(blob) : reject(new Error('The collage could not be encoded')), 'image/jpeg', 0.92)
	})
}

async function download(): Promise<void> {
	const url = URL.createObjectURL(await toJpeg())
	const link = document.createElement('a')
	link.download = getCollageFileName(new Date())
	link.href = url
	link.click()
	URL.revokeObjectURL(url)
}

/**
 * Upload the collage as a new file: the name is numbered until a free one is
 * found, so an existing file is never overwritten.
 */
async function save(): Promise<void> {
	const folder = target.value === 'upload'
		? join(defaultRootPath, userConfigStore.photosLocation)
		: join(props.photos[0].root, props.photos[0].dirname)

	try {
		saving.value = true
		const content = await (await toJpeg()).arrayBuffer()
		const now = new Date()

		for (let attempt = 0; attempt < MAX_NAME_ATTEMPTS; attempt++) {
			const name = getCollageFileName(now, attempt)
			if (await davClient.putFileContents(join(folder, name), content, { overwrite: false })) {
				showSuccess(t('photos', 'Collage saved as {name}', { name }))
				emit('saved')
				return
			}
		}

		throw new Error('No free file name left for the collage')
	} catch (error) {
		logger.error('Error saving the collage', { error })
		showError(t('photos', 'Failed to save the collage'))
	} finally {
		saving.value = false
	}
}
</script>

<style lang="scss" scoped>
.collage {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 2);
	padding-block-end: calc(var(--default-grid-baseline) * 2);

	&__preview {
		position: relative;
		display: flex;
		justify-content: center;
		min-height: 120px;

		&__canvas {
			max-width: 100%;
			max-height: 45vh;
			border: 1px solid var(--color-border);
			border-radius: var(--border-radius);
		}

		&--loading &__canvas {
			visibility: hidden;
		}

		&__loading {
			position: absolute;
			inset: 0;
		}
	}

	&__layouts {
		display: flex;
		justify-content: center;
	}

	&__target legend {
		font-weight: bold;
	}
}
</style>
