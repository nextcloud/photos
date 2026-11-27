<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Text in {name}', { name: photo.basename })"
		@update:open="emit('close')">
		<div v-if="text === undefined && errorMessage === ''" class="photo-text__progress">
			<NcLoadingIcon :size="32" />
			<p>
				{{ status === 'STATUS_RUNNING'
					? t('photos', 'Recognizing text …')
					: t('photos', 'Waiting for the text recognition to start …') }}
			</p>
			<NcProgressBar v-if="progress !== null" :value="Math.round(progress * 100)" />
		</div>

		<NcNoteCard v-else-if="errorMessage !== ''" type="error">
			{{ errorMessage }}
		</NcNoteCard>

		<p v-else-if="text === ''" class="photo-text__empty">
			{{ t('photos', 'No text was found in this photo.') }}
		</p>

		<pre v-else class="photo-text__content">{{ text }}</pre>

		<template v-if="text" #actions>
			<NcButton variant="primary" @click="copy">
				<template #icon>
					<ContentCopy :size="20" />
				</template>
				{{ t('photos', 'Copy') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { TaskStatus } from '../services/textExtraction.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError, showSuccess } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { logger } from '../services/logger.ts'
import { extractText, TextExtractionFailedError, TextExtractionTimeoutError } from '../services/textExtraction.ts'

const props = defineProps<{
	/** Photo to recognize the text of. */
	photo: PhotoTarget
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

// Closing the dialog aborts the polling, which cancels the task on the server.
const { abortSignal } = useAbortController()

/** Recognized text, `undefined` until the task succeeded. */
const text = ref<string | undefined>()
const errorMessage = ref('')
const status = ref<TaskStatus>('STATUS_SCHEDULED')
const progress = ref<number | null>(null)

onMounted(async () => {
	try {
		text.value = await extractText(props.photo.fileid, {
			signal: abortSignal.value,
			onUpdate: (taskStatus, taskProgress) => {
				status.value = taskStatus
				progress.value = taskProgress
			},
		})
	} catch (error) {
		if (abortSignal.value.aborted) {
			return
		}

		logger.error('Error recognizing the text of a photo', { error, filename: props.photo.basename })

		if (error instanceof TextExtractionTimeoutError) {
			errorMessage.value = t('photos', 'The text recognition took too long and was stopped. Please try again later.')
		} else if (error instanceof TextExtractionFailedError && error.userFacingMessage !== null) {
			errorMessage.value = error.userFacingMessage
		} else {
			errorMessage.value = t('photos', 'The text of this photo could not be recognized.')
		}
	}
})

async function copy(): Promise<void> {
	try {
		await navigator.clipboard.writeText(text.value ?? '')
		showSuccess(t('photos', 'Text copied to the clipboard'))
	} catch (error) {
		logger.error('Error copying the text of a photo', { error })
		showError(t('photos', 'Failed to copy the text to the clipboard'))
	}
}
</script>

<style lang="scss" scoped>
.photo-text {
	&__progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		margin-block: calc(var(--default-grid-baseline) * 4);
	}

	&__empty {
		color: var(--color-text-maxcontrast);
		text-align: center;
	}

	&__content {
		max-height: 50vh;
		margin: 0;
		padding: calc(var(--default-grid-baseline) * 2);
		overflow: auto;
		border-radius: var(--border-radius-large);
		background-color: var(--color-background-dark);
		font-family: inherit;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
}
</style>
