<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Create video')"
		size="normal"
		@update:open="emit('close')">
		<div v-if="step === 'setup'" class="memory-video">
			<NcNoteCard v-if="!supported" type="error">
				{{ t('photos', 'This browser cannot record videos.') }}
			</NcNoteCard>

			<NcTextField v-model="videoTitle" :label="t('photos', 'Title')" />

			<div class="memory-video__audio">
				<template v-if="audioPath !== null">
					<MusicNote :size="20" />
					<span class="memory-video__audio__name">{{ basename(audioPath) }}</span>
					<NcButton variant="tertiary" :aria-label="t('photos', 'Remove music')" @click="audioPath = null">
						<template #icon>
							<Close :size="20" />
						</template>
					</NcButton>
				</template>
				<NcButton v-else variant="secondary" @click="pickAudio">
					<template #icon>
						<MusicNotePlus :size="20" />
					</template>
					{{ t('photos', 'Add music from your files') }}
				</NcButton>
			</div>

			<p class="memory-video__hint">
				{{ n('photos', '%n photo, about {seconds} seconds', '%n photos, about {seconds} seconds', videoPhotos.length, { seconds: estimatedSeconds }) }}
			</p>
		</div>

		<div v-else-if="step !== 'done'" class="memory-video">
			<p>
				{{ step === 'loading' ? t('photos', 'Loading photos…') : t('photos', 'Recording the video, keep this tab open…') }}
			</p>
			<NcProgressBar :value="Math.round(progress * 100)" size="medium" />
		</div>

		<div v-else-if="video !== null" class="memory-video">
			<video class="memory-video__preview" :src="videoUrl" controls />
			<p class="memory-video__hint">
				{{ formatFileSize(video.blob.size) }} · {{ n('photos', '%n second', '%n seconds', Math.round(video.duration / 1000)) }}
			</p>
			<NcNoteCard v-if="savedPath !== null" type="success">
				{{ t('photos', 'Saved to {path}', { path: savedPath }) }}
				<a :href="savedFolderUrl" class="memory-video__link">{{ t('photos', 'Open in Files') }}</a>
			</NcNoteCard>
		</div>

		<template #actions>
			<template v-if="step === 'setup'">
				<NcButton variant="tertiary" @click="emit('close')">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="primary" :disabled="!supported || videoPhotos.length === 0" @click="createVideo">
					<template #icon>
						<MovieOpenPlayOutline :size="20" />
					</template>
					{{ t('photos', 'Create video') }}
				</NcButton>
			</template>
			<NcButton v-else-if="step !== 'done'" variant="tertiary" @click="abortController?.abort()">
				{{ t('photos', 'Cancel') }}
			</NcButton>
			<template v-else>
				<NcButton variant="secondary" :disabled="saving || savedPath !== null" @click="saveToFiles">
					<template #icon>
						<NcLoadingIcon v-if="saving" :size="20" />
						<FolderOutline v-else :size="20" />
					</template>
					{{ t('photos', 'Save to Files') }}
				</NcButton>
				<NcButton variant="primary" @click="download">
					<template #icon>
						<Download :size="20" />
					</template>
					{{ t('photos', 'Download') }}
				</NcButton>
			</template>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { MemoryVideo } from '../services/memoryVideoRenderer.ts'
import type { PhotoFile } from '../store/files.ts'

import { FilePickerClosed, getFilePickerBuilder, showError } from '@nextcloud/dialogs'
import { formatFileSize } from '@nextcloud/files'
import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { n, t } from '@nextcloud/l10n'
import { basename, dirname, encodePath } from '@nextcloud/paths'
import { generateUrl } from '@nextcloud/router'
import { computed, onBeforeUnmount, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import Close from 'vue-material-design-icons/Close.vue'
import Download from 'vue-material-design-icons/Download.vue'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'
import MovieOpenPlayOutline from 'vue-material-design-icons/MovieOpenPlayOutline.vue'
import MusicNote from 'vue-material-design-icons/MusicNote.vue'
import MusicNotePlus from 'vue-material-design-icons/MusicNotePlus.vue'
import { logger } from '../services/logger.ts'
import { buildTimeline, getVideoFilename, sampleVideoPhotos, saveVideoToFiles } from '../services/memoryVideo.ts'
import { renderMemoryVideo } from '../services/memoryVideoRenderer.ts'
import { isVideoRecordingSupported } from '../services/videoRecorder.ts'
import { useUserConfigStore } from '../store/userConfig.ts'

const props = defineProps<{
	/** Photos of the memory, the video shows a selection of them. */
	photos: PhotoFile[]
	/** Default text of the title card. */
	title: string
	/** Smaller text under the title. */
	subtitle: string
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

/** Sound tracks the browsers can play. */
const AUDIO_MIMES = ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/opus', 'audio/flac', 'audio/wav', 'audio/webm']

const userConfigStore = useUserConfigStore()

const supported = isVideoRecordingSupported()
const videoPhotos = computed<PhotoFile[]>(() => sampleVideoPhotos(props.photos))
const estimatedSeconds = computed<number>(() => Math.round(buildTimeline(videoPhotos.value.length + 1).duration / 1000))

const videoTitle = ref(props.title)
const audioPath = ref<string | null>(null)

const step = ref<'setup' | 'loading' | 'recording' | 'done'>('setup')
const progress = ref(0)
const abortController = ref<AbortController | null>(null)

const video = ref<MemoryVideo | null>(null)
const videoUrl = ref('')
const saving = ref(false)
const savedPath = ref<string | null>(null)

const filename = computed<string>(() => getVideoFilename(videoTitle.value, video.value?.mimeType ?? ''))
const savedFolderUrl = computed<string>(() => generateUrl('/apps/files/?dir={dir}', { dir: dirname(savedPath.value ?? '/') }))

onBeforeUnmount(() => {
	abortController.value?.abort()
	URL.revokeObjectURL(videoUrl.value)
})

/**
 * Let the user pick a sound track among their files.
 */
async function pickAudio(): Promise<void> {
	try {
		audioPath.value = await getFilePickerBuilder(t('photos', 'Pick a music track'))
			.setMultiSelect(false)
			.setMimeTypeFilter(AUDIO_MIMES)
			.addButton({ label: t('photos', 'Use this track'), callback: () => {} })
			.build()
			.pick()
	} catch (error) {
		if (!(error instanceof FilePickerClosed)) {
			logger.error('Error picking a music track', { error })
		}
	}
}

/**
 * Render the video.
 */
async function createVideo(): Promise<void> {
	const controller = new AbortController()
	abortController.value = controller
	progress.value = 0
	step.value = 'loading'

	try {
		video.value = await renderMemoryVideo({
			photos: videoPhotos.value,
			title: videoTitle.value,
			subtitle: props.subtitle,
			audioUrl: audioPath.value === null ? undefined : defaultRemoteURL + encodePath(defaultRootPath + audioPath.value),
			animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
			signal: controller.signal,
			onProgress: (currentStep, currentProgress) => {
				step.value = currentStep
				progress.value = currentProgress
			},
		})
		URL.revokeObjectURL(videoUrl.value)
		videoUrl.value = URL.createObjectURL(video.value.blob)
		savedPath.value = null
		step.value = 'done'
	} catch (error) {
		step.value = 'setup'
		if (!controller.signal.aborted) {
			logger.error('Error creating a memory video', { error })
			showError(t('photos', 'The video could not be created'))
		}
	} finally {
		abortController.value = null
	}
}

function download(): void {
	const link = document.createElement('a')
	link.href = videoUrl.value
	link.download = filename.value
	link.click()
}

async function saveToFiles(): Promise<void> {
	if (video.value === null) {
		return
	}

	saving.value = true
	try {
		savedPath.value = await saveVideoToFiles(video.value.blob, filename.value, userConfigStore.photosLocation)
	} catch (error) {
		logger.error('Error saving a memory video', { error })
		showError(t('photos', 'The video could not be saved'))
	} finally {
		saving.value = false
	}
}
</script>

<style lang="scss" scoped>
.memory-video {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 3);
	padding-block: calc(var(--default-grid-baseline) * 2);

	&__audio {
		display: flex;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);

		&__name {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	&__hint {
		color: var(--color-text-maxcontrast);
	}

	&__preview {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: var(--border-radius-large);
		background-color: #000;
	}

	&__link {
		display: block;
		text-decoration: underline;
	}
}
</style>
