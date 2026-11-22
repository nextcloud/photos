<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Edit {name} with AI', { name: photo.basename })"
		size="large"
		:isForm="step === 'choose'"
		@submit="run"
		@update:open="emit('close')">
		<div v-if="step === 'choose'" class="photo-ai-edit__form">
			<NcNoteCard type="info">
				{{ t('photos', 'The photo is sent to the AI provider set up by your administrator, which may be an external service. The original photo is left untouched.') }}
			</NcNoteCard>

			<NcNoteCard v-if="errorMessage !== ''" type="error">
				{{ errorMessage }}
			</NcNoteCard>

			<NcRadioGroup v-model="preset" :label="t('photos', 'Kind of edit')" hideLabel>
				<NcCheckboxRadioSwitch value="enhance" :description="t('photos', 'Improve exposure, contrast, colors and sharpness')">
					{{ t('photos', 'Enhance') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch value="remove" :description="t('photos', 'Remove an object or people you describe')">
					{{ t('photos', 'Remove something') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch value="restore" :description="t('photos', 'Remove scratches, dust and noise, revive faded colors')">
					{{ t('photos', 'Restore an old photo') }}
				</NcCheckboxRadioSwitch>
				<NcCheckboxRadioSwitch value="custom" :description="t('photos', 'Describe the changes yourself')">
					{{ t('photos', 'Custom') }}
				</NcCheckboxRadioSwitch>
			</NcRadioGroup>

			<NcTextField
				v-if="preset === 'remove'"
				v-model="details"
				:label="t('photos', 'What should be removed?')"
				:placeholder="t('photos', 'For example: the people in the background')" />
			<NcTextArea
				v-else-if="preset === 'custom'"
				v-model="details"
				:label="t('photos', 'Describe the changes')"
				resize="vertical" />
		</div>

		<div v-else-if="step === 'running'" class="photo-ai-edit__progress">
			<NcLoadingIcon :size="32" />
			<p>
				{{ status === 'STATUS_RUNNING'
					? t('photos', 'Editing the photo …')
					: t('photos', 'Waiting for the AI provider to start …') }}
			</p>
			<NcProgressBar v-if="progress !== null" :value="Math.round(progress * 100)" />
		</div>

		<div v-else class="photo-ai-edit__compare" :style="{ '--split': `${split}%` }">
			<img class="photo-ai-edit__image" :src="originalUrl" :alt="t('photos', 'Original')">
			<img class="photo-ai-edit__image photo-ai-edit__image--edited" :src="editedUrl" :alt="t('photos', 'Edited')">
			<span class="photo-ai-edit__label" aria-hidden="true">{{ t('photos', 'Before') }}</span>
			<span class="photo-ai-edit__label photo-ai-edit__label--edited" aria-hidden="true">{{ t('photos', 'After') }}</span>
			<span class="photo-ai-edit__divider" aria-hidden="true" />
			<input
				v-model.number="split"
				class="photo-ai-edit__slider"
				type="range"
				min="0"
				max="100"
				:aria-label="t('photos', 'Compare the original and the edited photo')">
		</div>

		<template #actions>
			<template v-if="step === 'choose'">
				<NcButton variant="tertiary" @click="emit('close')">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton
					variant="primary"
					type="submit"
					:disabled="prompt === ''">
					{{ t('photos', 'Edit photo') }}
				</NcButton>
			</template>

			<NcButton v-else-if="step === 'running'" variant="tertiary" @click="emit('close')">
				{{ t('photos', 'Cancel') }}
			</NcButton>

			<template v-else>
				<NcButton variant="tertiary" :disabled="saving" @click="discard">
					{{ t('photos', 'Discard') }}
				</NcButton>
				<NcButton variant="primary" :disabled="saving" @click="save">
					<template v-if="saving" #icon>
						<NcLoadingIcon :size="20" />
					</template>
					{{ t('photos', 'Save as copy') }}
				</NcButton>
			</template>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { ImageEditPreset, TaskStatus } from '../services/imageEditing.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError, showUndo } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { basename } from '@nextcloud/paths'
import { generateUrl } from '@nextcloud/router'
import { computed, onBeforeUnmount, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import NcRadioGroup from '@nextcloud/vue/components/NcRadioGroup'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { useAbortController } from '../composables/useAbortController.ts'
import { davClient } from '../services/DavClient.ts'
import { editImage, getEditPrompt, ImageEditFailedError, ImageEditTimeoutError, saveEditedImage } from '../services/imageEditing.ts'
import { logger } from '../services/logger.ts'

const props = defineProps<{
	/** Photo to edit. */
	photo: PhotoTarget
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

// Closing the dialog aborts the polling, which cancels the task on the server.
const { abortSignal } = useAbortController()

const step = ref<'choose' | 'running' | 'result'>('choose')
const preset = ref<ImageEditPreset>('enhance')
const details = ref('')
const errorMessage = ref('')
const status = ref<TaskStatus>('STATUS_SCHEDULED')
const progress = ref<number | null>(null)
const saving = ref(false)
/** Position of the line between the original and the edited photo, in percent. */
const split = ref(50)

const prompt = computed(() => getEditPrompt(preset.value, details.value))

const originalUrl = generateUrl('/core/preview?fileId={fileId}&x=1920&y=1920&a=1', { fileId: props.photo.fileid })

let editedImage: Blob | null = null
const editedUrl = ref('')

onBeforeUnmount(() => URL.revokeObjectURL(editedUrl.value))

async function run(): Promise<void> {
	if (prompt.value === '') {
		return
	}

	errorMessage.value = ''
	status.value = 'STATUS_SCHEDULED'
	progress.value = null
	step.value = 'running'

	try {
		editedImage = await editImage(props.photo.fileid, prompt.value, {
			signal: abortSignal.value,
			onUpdate: (taskStatus, taskProgress) => {
				status.value = taskStatus
				progress.value = taskProgress
			},
		})
		editedUrl.value = URL.createObjectURL(editedImage)
		split.value = 50
		step.value = 'result'
	} catch (error) {
		if (abortSignal.value.aborted) {
			return
		}

		logger.error('Error editing a photo with AI', { error, filename: props.photo.basename })

		if (error instanceof ImageEditTimeoutError) {
			errorMessage.value = t('photos', 'The edit took too long and was stopped. Please try again later.')
		} else if (error instanceof ImageEditFailedError && error.userFacingMessage !== null) {
			errorMessage.value = error.userFacingMessage
		} else {
			errorMessage.value = t('photos', 'The photo could not be edited.')
		}
		step.value = 'choose'
	}
}

/** Drop the edited image and go back to the choice of the edit. */
function discard(): void {
	URL.revokeObjectURL(editedUrl.value)
	editedUrl.value = ''
	editedImage = null
	step.value = 'choose'
}

async function save(): Promise<void> {
	if (editedImage === null) {
		return
	}

	saving.value = true

	try {
		const davPath = await saveEditedImage(props.photo, editedImage)
		showUndo(t('photos', 'Saved as {name}', { name: basename(davPath) }), () => removeCopy(davPath))
		emit('close')
	} catch (error) {
		logger.error('Error saving an edited photo', { error, filename: props.photo.basename })
		showError(t('photos', 'Failed to save the edited copy of {fileName}', { fileName: props.photo.basename }))
	} finally {
		saving.value = false
	}
}

/**
 * @param davPath - Path of the copy to move to the trash
 */
async function removeCopy(davPath: string): Promise<void> {
	try {
		await davClient.deleteFile(davPath)
	} catch (error) {
		logger.error('Error deleting an edited photo', { error, davPath })
		showError(t('photos', 'Failed to delete {fileName}', { fileName: basename(davPath) }))
	}
}
</script>

<style lang="scss" scoped>
.photo-ai-edit {
	&__form {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 3);
		padding-block-end: calc(var(--default-grid-baseline) * 2);
	}

	&__progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		margin-block: calc(var(--default-grid-baseline) * 4);
	}

	// The comparison is laid out physically, the original on the left, whatever
	// the direction of the language.
	&__compare {
		position: relative;
		direction: ltr;
		height: min(60vh, 600px);
		overflow: hidden;
		border-radius: var(--border-radius-large);
		background-color: var(--color-background-dark);
	}

	&__image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;

		&--edited {
			clip-path: inset(0 0 0 var(--split));
		}
	}

	&__label {
		position: absolute;
		inset-block-start: calc(var(--default-grid-baseline) * 2);
		inset-inline-start: calc(var(--default-grid-baseline) * 2);
		padding: var(--default-grid-baseline) calc(var(--default-grid-baseline) * 2);
		border-radius: var(--border-radius-element);
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;

		&--edited {
			inset-inline: auto calc(var(--default-grid-baseline) * 2);
		}
	}

	&__divider {
		position: absolute;
		inset-block: 0;
		inset-inline-start: var(--split);
		width: 2px;
		margin-inline-start: -1px;
		background-color: #fff;
		pointer-events: none;
	}

	// The range input covers the whole picture, so dragging anywhere on it
	// moves the divider. It overflows by half a thumb on each side, which puts
	// the center of the thumb right on the divider.
	&__slider {
		position: absolute;
		inset-block: 0;
		inset-inline-start: calc(var(--slider-thumb-size) / -2);
		width: calc(100% + var(--slider-thumb-size));
		height: 100%;
		margin: 0;
		background: transparent;
		cursor: ew-resize;
		appearance: none;
		--slider-thumb-size: 32px;

		&::-webkit-slider-thumb {
			width: var(--slider-thumb-size);
			height: var(--slider-thumb-size);
			border: 2px solid #fff;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.5);
			appearance: none;
		}

		&::-moz-range-thumb {
			width: var(--slider-thumb-size);
			height: var(--slider-thumb-size);
			border: 2px solid #fff;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.5);
		}

		&:focus-visible {
			outline: none;

			&::-webkit-slider-thumb {
				box-shadow: 0 0 0 2px var(--color-primary-element);
			}

			&::-moz-range-thumb {
				box-shadow: 0 0 0 2px var(--color-primary-element);
			}
		}
	}
}
</style>
