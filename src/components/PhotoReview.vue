<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcModal
		size="full"
		labelId="photo-review-title"
		@close="emit('close')">
		<div class="review">
			<header class="review__header">
				<h2 id="photo-review-title" class="review__title">
					{{ t('photos', 'Review photos') }}
				</h2>
				<p v-if="currentPhoto !== undefined" class="review__position">
					{{ positionLabel }}
				</p>
				<NcButton
					class="review__undo"
					variant="tertiary"
					:disabled="busy || queue.decisions.length === 0"
					:aria-label="t('photos', 'Undo last action')"
					@click="undo">
					<template #icon>
						<Undo :size="20" />
					</template>
					{{ t('photos', 'Undo') }}
				</NcButton>
				<NcProgressBar
					class="review__progress"
					:value="progress"
					:aria-label="t('photos', 'Review progress')" />
			</header>

			<figure
				v-if="currentPhoto !== undefined"
				class="review__stage"
				@pointerdown="onPointerDown"
				@pointermove="onPointerMove"
				@pointerup="onPointerUp"
				@pointercancel="swipe = null">
				<img
					:key="currentPhoto.fileid"
					class="review__photo"
					:class="{ 'review__photo--busy': busy }"
					:style="swipeStyle"
					:src="getPreviewUrl(currentPhoto, PREVIEW_SIZE)"
					:alt="currentPhoto.basename"
					draggable="false">
				<span v-if="swipeAction !== undefined" class="review__swipe-hint" :class="`review__swipe-hint--${swipeAction}`">
					{{ actionLabels[swipeAction] }}
				</span>
				<figcaption class="review__caption">
					{{ currentPhoto.basename }} · {{ formatDate(new Date(currentPhoto.attributes.timestamp * 1000)) }}
				</figcaption>
			</figure>

			<NcLoadingIcon v-else-if="loading" class="review__stage" :size="64" />

			<NcEmptyContent
				v-else
				class="review__stage"
				:name="t('photos', 'All photos reviewed')"
				:description="summaryLabel">
				<template #icon>
					<Check />
				</template>
				<template #action>
					<NcButton variant="primary" @click="emit('close')">
						{{ t('photos', 'Close') }}
					</NcButton>
				</template>
			</NcEmptyContent>

			<p class="review__status" role="status">
				{{ statusMessage }}
			</p>

			<footer v-if="currentPhoto !== undefined" class="review__actions">
				<NcButton
					size="large"
					variant="error"
					:disabled="busy || !canDelete"
					@click="decide('delete')">
					<template #icon>
						<TrashCanOutline :size="24" />
					</template>
					{{ actionLabels.delete }}
				</NcButton>
				<NcButton
					size="large"
					variant="primary"
					:disabled="busy"
					@click="decide('keep')">
					<template #icon>
						<Check :size="24" />
					</template>
					{{ actionLabels.keep }}
				</NcButton>
				<NcButton
					size="large"
					:disabled="busy"
					@click="decide('favorite')">
					<template #icon>
						<Star v-if="currentPhoto.attributes.favorite === 1" :size="24" />
						<StarOutline v-else :size="24" />
					</template>
					{{ actionLabels.favorite }}
				</NcButton>
			</footer>
		</div>
	</NcModal>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'
import type { ReviewAction } from '../utils/reviewQueue.ts'

import { showError } from '@nextcloud/dialogs'
import { Permission } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcModal from '@nextcloud/vue/components/NcModal'
import NcProgressBar from '@nextcloud/vue/components/NcProgressBar'
import Check from 'vue-material-design-icons/Check.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import Undo from 'vue-material-design-icons/Undo.vue'
import { logger } from '../services/logger.ts'
import { isTrashbinEnabled, restoreFromTrashbin } from '../services/trashbin.ts'
import { useFilesStore } from '../store/files.ts'
import { formatDate } from '../utils/dateUtils.ts'
import { getPreviewUrl, toPhotoTarget } from '../utils/fileUtils.ts'
import {
	appendToReviewQueue,
	createReviewQueue,
	currentReviewFileId,
	recordReviewDecision,
	summarizeReview,
	swipeToReviewAction,
	undoReviewDecision,
} from '../utils/reviewQueue.ts'

const props = withDefaults(defineProps<{
	/** Photos to review, in the order they are shown. Photos added later join the end of the queue. */
	photos: PhotoFile[]
	/** Whether more photos are on their way, which holds the summary back. */
	loading?: boolean
}>(), {
	loading: false,
})

const emit = defineEmits<{
	(event: 'close'): void
	/** The queue is about to run out, for views loading their photos in batches. */
	(event: 'needContent'): void
	(event: 'deleted', photo: PhotoTarget): void
	(event: 'restored', photo: PhotoFile): void
}>()

/** Maximum width and height of the requested previews. */
const PREVIEW_SIZE = 2048

/** Number of photos left at which more of them are asked for. */
const LOW_WATER_MARK = 5

const filesStore = useFilesStore()

/** Whether the reader asked for the shortcuts of the app to be left alone. */
const shortcutsDisabled = window.OCP?.Accessibility?.disableKeyboardShortcuts?.() ?? false

const actionLabels: Record<ReviewAction, string> = {
	keep: t('photos', 'Keep'),
	favorite: t('photos', 'Favorite'),
	delete: isTrashbinEnabled ? t('photos', 'Delete') : t('photos', 'Delete permanently'),
}

// A deleted photo leaves the store and the listing of the view, so the review
// holds on to every photo it was given to still be able to restore it.
const knownPhotos = new Map<number, PhotoFile>()
const queue = reactive(createReviewQueue([]))

const busy = ref(false)
const statusMessage = ref('')
const swipe = ref<{ startX: number, startY: number, deltaX: number, deltaY: number } | null>(null)

const currentPhoto = computed<PhotoFile | undefined>(() => {
	const fileId = currentReviewFileId(queue)
	return fileId === undefined ? undefined : knownPhotos.get(fileId)
})

const canDelete = computed(() => currentPhoto.value !== undefined && (currentPhoto.value.permissions & Permission.DELETE) !== 0)

const progress = computed(() => queue.fileIds.length === 0 ? 0 : (queue.decisions.length / queue.fileIds.length) * 100)

const positionLabel = computed(() => t('photos', '{position} of {count}', {
	position: queue.decisions.length + 1,
	count: queue.fileIds.length,
}))

const summaryLabel = computed(() => {
	const { kept, favorites, deleted } = summarizeReview(queue)
	return [
		n('photos', '%n kept', '%n kept', kept),
		n('photos', '%n favorite', '%n favorites', favorites),
		n('photos', '%n deleted', '%n deleted', deleted),
	].join(', ')
})

const swipeAction = computed(() => swipe.value === null ? undefined : swipeToReviewAction(swipe.value.deltaX, swipe.value.deltaY))

const swipeStyle = computed(() => swipe.value === null
	? undefined
	: { transform: `translate(${swipe.value.deltaX}px, ${Math.min(swipe.value.deltaY, 0)}px)` })

watch(() => props.photos, (photos) => {
	photos.forEach((photo) => knownPhotos.set(photo.fileid, photo))
	appendToReviewQueue(queue, photos.map((photo) => photo.fileid))
}, { immediate: true })

watch(() => queue.fileIds.length - queue.decisions.length, (remaining) => {
	if (remaining <= LOW_WATER_MARK) {
		emit('needContent')
	}
}, { immediate: true })

// Fetch the next photo ahead of time, so deciding quickly does not mean
// waiting for every preview.
watch(() => queue.decisions.length, (position) => {
	const next = knownPhotos.get(queue.fileIds[position + 1])
	if (next !== undefined) {
		new Image().src = getPreviewUrl(next, PREVIEW_SIZE)
	}
}, { immediate: true })

// The modal takes the focus, so the shortcuts are bound to the document rather
// than to an element of the review.
onMounted(() => document.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown))

/**
 * Apply a decision to the current photo and move on to the next one.
 *
 * @param action - What to do with the photo
 */
async function decide(action: ReviewAction): Promise<void> {
	const photo = currentPhoto.value
	if (photo === undefined || busy.value || (action === 'delete' && !canDelete.value)) {
		return
	}

	const target = toPhotoTarget(photo)
	busy.value = true

	try {
		if (action === 'favorite' && !target.favorite) {
			await filesStore.setPhotoFavorite(target, true)
		} else if (action === 'delete') {
			await filesStore.deletePhoto(target)
			emit('deleted', target)
		}

		recordReviewDecision(queue, action, target.favorite)
		statusMessage.value = {
			keep: t('photos', '{fileName} kept', { fileName: target.basename }),
			favorite: t('photos', '{fileName} added to the favorites', { fileName: target.basename }),
			delete: isTrashbinEnabled
				? t('photos', '{fileName} moved to the trash bin', { fileName: target.basename })
				: t('photos', '{fileName} deleted', { fileName: target.basename }),
		}[action]
	} catch (error) {
		logger.error('Error applying a review decision', { error, action, filename: target.basename })
		showError(action === 'delete'
			? t('photos', 'Failed to delete {fileName}', { fileName: target.basename })
			: t('photos', 'Failed to add {fileName} to the favorites', { fileName: target.basename }))
	} finally {
		busy.value = false
	}
}

/**
 * Take the last decision back and show its photo again.
 */
async function undo(): Promise<void> {
	const decision = queue.decisions.at(-1)
	const photo = decision && knownPhotos.get(decision.fileId)
	if (decision === undefined || photo === undefined || busy.value) {
		return
	}

	if (decision.action === 'delete' && !isTrashbinEnabled) {
		statusMessage.value = t('photos', 'Deleting cannot be undone, as the trash bin is not available')
		return
	}

	busy.value = true

	try {
		if (decision.action === 'delete') {
			await restoreFromTrashbin(decision.fileId)
			filesStore.appendFiles([photo])
			emit('restored', photo)
		} else if (decision.action === 'favorite' && !decision.wasFavorite) {
			await filesStore.setPhotoFavorite(toPhotoTarget(photo), false)
		}

		undoReviewDecision(queue)
		statusMessage.value = decision.action === 'delete'
			? t('photos', '{fileName} restored', { fileName: photo.basename })
			: t('photos', 'Back to {fileName}', { fileName: photo.basename })
	} catch (error) {
		logger.error('Error undoing a review decision', { error, decision })
		showError(decision.action === 'delete'
			? t('photos', 'Failed to restore {fileName} from the trash bin', { fileName: photo.basename })
			: t('photos', 'Failed to remove {fileName} from the favorites', { fileName: photo.basename }))
	} finally {
		busy.value = false
	}
}

/**
 * @param event - The key press to handle
 */
function onKeyDown(event: KeyboardEvent): void {
	if (shortcutsDisabled || event.ctrlKey || event.metaKey || event.altKey) {
		return
	}

	const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
	if (key === 'ArrowRight') {
		decide('keep')
	} else if (key === 'ArrowUp' || key === 'f') {
		decide('favorite')
	} else if (key === 'Delete' || key === 'Backspace') {
		decide('delete')
	} else if (key === 'ArrowLeft' || key === 'z') {
		undo()
	} else {
		return
	}

	event.preventDefault()
}

/**
 * @param event - Start of a swipe on the photo
 */
function onPointerDown(event: PointerEvent): void {
	if (!event.isPrimary || event.button !== 0) {
		return
	}

	(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
	swipe.value = { startX: event.clientX, startY: event.clientY, deltaX: 0, deltaY: 0 }
}

/**
 * @param event - Move of the pointer swiping the photo
 */
function onPointerMove(event: PointerEvent): void {
	if (swipe.value !== null) {
		swipe.value.deltaX = event.clientX - swipe.value.startX
		swipe.value.deltaY = event.clientY - swipe.value.startY
	}
}

function onPointerUp(): void {
	const action = swipeAction.value
	swipe.value = null

	if (action !== undefined) {
		decide(action)
	}
}
</script>

<style lang="scss" scoped>
.review {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 2);
	box-sizing: border-box;
	height: 100%;
	padding: calc(var(--default-grid-baseline) * 4);

	&__header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: calc(var(--default-grid-baseline) * 2);
		// Leaves room for the close button of the modal.
		padding-inline-end: calc(var(--default-clickable-area) + var(--default-grid-baseline) * 2);
	}

	&__title {
		margin: 0;
		font-size: 20px;
	}

	&__position {
		margin: 0;
		color: var(--color-text-maxcontrast);
		font-variant-numeric: tabular-nums;
	}

	&__undo {
		margin-inline-start: auto;
	}

	&__progress {
		flex-basis: 100%;
	}

	&__stage {
		position: relative;
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 0;
		margin: 0;
	}

	figure.review__stage {
		overflow: hidden;
		touch-action: none;
		user-select: none;
	}

	&__photo {
		flex: 1;
		min-height: 0;
		max-width: 100%;
		border-radius: var(--border-radius-large);
		object-fit: contain;

		&--busy {
			opacity: 0.5;
		}
	}

	&__caption {
		padding-block-start: calc(var(--default-grid-baseline) * 2);
		color: var(--color-text-maxcontrast);
		text-align: center;
	}

	&__swipe-hint {
		position: absolute;
		inset-block-start: calc(var(--default-grid-baseline) * 4);
		padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 4);
		border-radius: var(--border-radius-element);
		background-color: var(--color-primary-element);
		color: var(--color-primary-element-text);
		font-weight: bold;
		pointer-events: none;

		&--delete {
			background-color: var(--color-element-error, var(--color-error));
			color: #fff;
		}
	}

	&__status {
		min-height: 1lh;
		margin: 0;
		color: var(--color-text-maxcontrast);
		text-align: center;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: calc(var(--default-grid-baseline) * 2);
	}
}
</style>
