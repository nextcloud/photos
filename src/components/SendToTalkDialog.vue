<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Send to Talk')"
		size="normal"
		isForm
		@submit="send"
		@update:open="emit('close')">
		<div class="send-to-talk">
			<p>{{ n('photos', '%n photo will be shared with the participants of the conversation.', '%n photos will be shared with the participants of the conversation.', pending.length) }}</p>

			<NcNoteCard v-if="loadingFailed" type="error">
				{{ t('photos', 'Failed to load your conversations') }}
			</NcNoteCard>
			<NcNoteCard v-else-if="!loading && conversations.length === 0" type="info">
				{{ t('photos', 'You have no conversation you can post in') }}
			</NcNoteCard>

			<NcSelect
				v-model="conversation"
				:options="conversations"
				label="displayName"
				:inputLabel="t('photos', 'Conversation')"
				:placeholder="t('photos', 'Select a conversation')"
				:loading="loading"
				:disabled="sending"
				:clearable="false"
				data-cy-send-to-talk="conversation" />

			<NcTextArea
				v-if="canSendCaption"
				v-model="message"
				:label="t('photos', 'Message (optional)')"
				:disabled="sending"
				resize="vertical"
				data-cy-send-to-talk="message" />

			<div v-if="sending" class="send-to-talk__progress" aria-live="polite">
				<NcProgressBar :value="done / pending.length * 100" />
				{{ t('photos', 'Sending {done} of {total}', { done, total: pending.length }) }}
			</div>

			<NcNoteCard v-if="failures.length > 0" type="error">
				<p>{{ n('photos', '%n photo could not be sent:', '%n photos could not be sent:', failures.length) }}</p>
				<ul class="send-to-talk__failures">
					<li v-for="failure in failures" :key="failure.photo.fileid">
						{{ failure.message === '' ? failure.photo.basename : `${failure.photo.basename} – ${failure.message}` }}
					</li>
				</ul>
			</NcNoteCard>
		</div>

		<template #actions>
			<NcButton variant="tertiary" :disabled="sending" @click="emit('close')">
				{{ t('photos', 'Cancel') }}
			</NcButton>
			<NcButton
				variant="primary"
				type="submit"
				:disabled="conversation === null || sending"
				data-cy-send-to-talk="send">
				<template #icon>
					<NcLoadingIcon v-if="sending" :size="20" />
					<Send v-else :size="20" />
				</template>
				{{ failures.length > 0 ? t('photos', 'Retry') : t('photos', 'Send') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { Conversation, SendFailure } from '../services/talk.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showSuccess } from '@nextcloud/dialogs'
import { n, t } from '@nextcloud/l10n'
import { onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import NcSelect from '@nextcloud/vue/components/NcSelect'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import Send from 'vue-material-design-icons/Send.vue'
import { logger } from '../services/logger.ts'
import { canSendCaption, fetchConversations, sendToConversation } from '../services/talk.ts'

const props = defineProps<{
	/** Photos to post in the conversation. */
	photos: PhotoTarget[]
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

const conversations = ref<Conversation[]>([])
const conversation = ref<Conversation | null>(null)
const message = ref('')
const loading = ref(true)
const loadingFailed = ref(false)
const sending = ref(false)
const done = ref(0)
const failures = ref<SendFailure[]>([])
// The photos still to send: all of them at first, then the ones that failed.
const pending = ref<PhotoTarget[]>([...props.photos])

onMounted(async () => {
	try {
		conversations.value = await fetchConversations()
	} catch (error) {
		logger.error('Error fetching the Talk conversations', { error })
		loadingFailed.value = true
	} finally {
		loading.value = false
	}
})

async function send(): Promise<void> {
	if (conversation.value === null || sending.value) {
		return
	}

	sending.value = true
	done.value = 0
	failures.value = await sendToConversation(conversation.value.token, pending.value, message.value, (count) => {
		done.value = count
	})
	sending.value = false

	const sent = pending.value.length - failures.value.length
	if (sent > 0) {
		showSuccess(n('photos', '%n photo sent to {conversation}', '%n photos sent to {conversation}', sent, { conversation: conversation.value.displayName }))
	}

	if (failures.value.length === 0) {
		emit('close')
		return
	}

	logger.error('Error sending photos to a Talk conversation', { failures: failures.value })
	// The message goes out with the last photo, and must not be posted again
	// when the others are retried.
	const last = pending.value[pending.value.length - 1]
	pending.value = failures.value.map((failure) => failure.photo)
	if (!pending.value.includes(last)) {
		message.value = ''
	}
}
</script>

<style lang="scss" scoped>
.send-to-talk {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 3);
	// Leaves the list of conversations room to open inside the dialog.
	min-height: 260px;
	padding-block-end: calc(var(--default-grid-baseline) * 2);

	&__progress {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);
		color: var(--color-text-maxcontrast);
	}

	&__failures {
		list-style: disc;
		padding-inline-start: calc(var(--default-grid-baseline) * 5);
		overflow-wrap: anywhere;
	}
}
</style>
