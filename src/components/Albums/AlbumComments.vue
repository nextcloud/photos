<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<Teleport to="#content-vue">
		<NcAppSidebar
			:name="t('photos', 'Comments')"
			:subname="albumName"
			:loading="loading && comments.length === 0"
			@close="emit('close')">
			<div class="album-comments">
				<p v-if="!loading && comments.length === 0" class="album-comments__empty">
					{{ t('photos', 'No comments yet. Start the conversation!') }}
				</p>

				<ul ref="list" class="album-comments__list">
					<li v-for="comment in comments" :key="comment.id" class="album-comments__comment">
						<NcAvatar
							:user="comment.actorId"
							:displayName="comment.actorDisplayName"
							:size="32"
							hideStatus />
						<div class="album-comments__body">
							<div class="album-comments__header">
								<span class="album-comments__author">{{ comment.actorDisplayName || comment.actorId }}</span>
								<NcDateTime
									class="album-comments__date"
									:timestamp="Date.parse(comment.creationDateTime)"
									relativeTime="short"
									ignoreSeconds />
								<NcButton
									v-if="comment.actorId === currentUserId"
									class="album-comments__delete"
									variant="tertiary"
									size="small"
									:aria-label="t('photos', 'Delete comment')"
									@click="deleteComment(comment.id)">
									<template #icon>
										<DeleteOutline :size="20" />
									</template>
								</NcButton>
							</div>
							<p class="album-comments__message">
								{{ comment.message }}
							</p>
						</div>
					</li>
				</ul>

				<form class="album-comments__form" @submit.prevent="submit">
					<NcTextArea
						v-model="message"
						:label="t('photos', 'Write a comment')"
						:disabled="posting"
						:maxlength="1000"
						resize="none"
						@keydown.enter.exact="onEnter" />
					<NcButton
						type="submit"
						variant="primary"
						:aria-label="t('photos', 'Post comment')"
						:disabled="posting || message.trim() === ''">
						<template #icon>
							<NcLoadingIcon v-if="posting" :size="20" />
							<Send v-else :size="20" />
						</template>
					</NcButton>
				</form>
			</div>
		</NcAppSidebar>
	</Teleport>
</template>

<script setup lang="ts">
import { getCurrentUser } from '@nextcloud/auth'
import { t } from '@nextcloud/l10n'
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import NcAppSidebar from '@nextcloud/vue/components/NcAppSidebar'
import NcAvatar from '@nextcloud/vue/components/NcAvatar'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDateTime from '@nextcloud/vue/components/NcDateTime'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcTextArea from '@nextcloud/vue/components/NcTextArea'
import Send from 'vue-material-design-icons/Send.vue'
import DeleteOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import { useAlbumComments } from '../../composables/useAlbumComments.ts'

const props = defineProps<{
	albumId: number
	albumName: string
}>()

const emit = defineEmits<{
	close: []
}>()

const currentUserId = getCurrentUser()?.uid
const message = ref('')
const list = useTemplateRef<HTMLUListElement>('list')

const { comments, loading, posting, fetchComments, addComment, deleteComment } = useAlbumComments(() => props.albumId)

async function submit() {
	if (await addComment(message.value)) {
		message.value = ''
	}
}

// Enter posts the comment, Shift+Enter adds a new line.
function onEnter(event: KeyboardEvent) {
	if (event.isComposing) {
		return
	}
	event.preventDefault()
	submit()
}

// Keep the newest comment, shown last, in view.
watch(comments, async () => {
	await nextTick()
	list.value?.lastElementChild?.scrollIntoView({ block: 'nearest' })
})

watch(() => props.albumId, fetchComments)
onMounted(fetchComments)
</script>

<style lang="scss" scoped>
.album-comments {
	display: flex;
	flex-direction: column;
	gap: calc(2 * var(--default-grid-baseline));
	height: 100%;
	padding: 0 calc(2 * var(--default-grid-baseline)) calc(2 * var(--default-grid-baseline));

	&__empty {
		color: var(--color-text-maxcontrast);
		text-align: center;
		padding: calc(4 * var(--default-grid-baseline)) 0;
	}

	&__list {
		flex: 1 1 auto;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: calc(3 * var(--default-grid-baseline));
	}

	&__comment {
		display: flex;
		gap: calc(2 * var(--default-grid-baseline));
	}

	&__body {
		flex: 1 1 auto;
		min-width: 0;
	}

	&__header {
		display: flex;
		align-items: center;
		gap: var(--default-grid-baseline);
		min-height: var(--default-clickable-area);
	}

	&__author {
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__date {
		color: var(--color-text-maxcontrast);
		white-space: nowrap;
	}

	&__delete {
		margin-inline-start: auto;
	}

	&__message {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	&__form {
		display: flex;
		align-items: flex-end;
		gap: var(--default-grid-baseline);
	}
}
</style>
