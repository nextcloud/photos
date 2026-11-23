<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcModal
		size="full"
		labelId="photo-compare-title"
		@close="emit('close')">
		<div class="compare">
			<header class="compare__header">
				<h2 id="photo-compare-title" class="compare__title">
					{{ t('photos', 'Compare photos') }}
				</h2>
				<NcButton
					variant="tertiary"
					:disabled="transform.scale <= MIN_SCALE"
					:aria-label="t('photos', 'Zoom out')"
					:title="t('photos', 'Zoom out')"
					@click="zoomBy(1 / ZOOM_STEP)">
					<template #icon>
						<MagnifyMinusOutline :size="20" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:disabled="transform.scale >= MAX_SCALE"
					:aria-label="t('photos', 'Zoom in')"
					:title="t('photos', 'Zoom in')"
					@click="zoomBy(ZOOM_STEP)">
					<template #icon>
						<MagnifyPlusOutline :size="20" />
					</template>
				</NcButton>
				<NcButton
					variant="tertiary"
					:disabled="transform.scale <= MIN_SCALE"
					:aria-label="t('photos', 'Reset zoom')"
					:title="t('photos', 'Reset zoom')"
					@click="resetZoom">
					<template #icon>
						<FitToScreenOutline :size="20" />
					</template>
				</NcButton>
			</header>

			<ul class="compare__panes" :class="`compare__panes--${photos.length}`">
				<li v-for="photo in photos" :key="photo.fileid" class="compare__pane">
					<div
						class="compare__viewport"
						:class="{ 'compare__viewport--zoomed': transform.scale > MIN_SCALE }"
						@wheel.prevent="onWheel"
						@pointerdown="onPointerDown"
						@pointermove="onPointerMove"
						@pointerup="onPointerUp"
						@pointercancel="onPointerUp"
						@dblclick="onDoubleClick">
						<img
							class="compare__photo"
							:style="{ transform: cssTransform }"
							:src="getPreviewUrl(photo, PREVIEW_SIZE)"
							:alt="photo.basename"
							draggable="false">
					</div>
					<div class="compare__details">
						<p class="compare__caption">
							<span class="compare__name" :title="photo.basename">{{ photo.basename }}</span>
							<span class="compare__date">{{ formatTakenAt(photo) }}</span>
						</p>
						<NcButton
							variant="tertiary"
							:pressed="photo.attributes.favorite === 1"
							:aria-label="t('photos', 'Favorite {fileName}', { fileName: photo.basename })"
							:title="t('photos', 'Favorite')"
							@update:pressed="toggleFavorite(photo)">
							<template #icon>
								<Star v-if="photo.attributes.favorite === 1" :size="20" />
								<StarOutline v-else :size="20" />
							</template>
						</NcButton>
						<NcButton
							:disabled="!canDeleteOthers(photo)"
							:aria-label="t('photos', 'Keep {fileName} and delete the other photos', { fileName: photo.basename })"
							@click="photoToKeep = photo">
							<template #icon>
								<TrashCanOutline :size="20" />
							</template>
							{{ t('photos', 'Delete others') }}
						</NcButton>
					</div>
				</li>
			</ul>
		</div>

		<NcDialog
			v-if="photoToKeep !== null"
			:name="t('photos', 'Delete the other photos?')"
			:message="n(
				'photos',
				'{fileName} is kept, the other photo is moved to the trash.',
				'{fileName} is kept, the %n other photos are moved to the trash.',
				photos.length - 1,
				{ fileName: photoToKeep.basename },
			)"
			@closing="photoToKeep = null">
			<template #actions>
				<NcButton variant="tertiary" @click="photoToKeep = null">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="error" @click="deleteOthers">
					{{ t('photos', 'Move to trash') }}
				</NcButton>
			</template>
		</NcDialog>
	</NcModal>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { CompareTransform, PanePoint } from '../utils/compareTransform.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { showError } from '@nextcloud/dialogs'
import { Permission } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcModal from '@nextcloud/vue/components/NcModal'
import FitToScreenOutline from 'vue-material-design-icons/FitToScreenOutline.vue'
import MagnifyMinusOutline from 'vue-material-design-icons/MagnifyMinusOutline.vue'
import MagnifyPlusOutline from 'vue-material-design-icons/MagnifyPlusOutline.vue'
import Star from 'vue-material-design-icons/Star.vue'
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import { logger } from '../services/logger.ts'
import { useFilesStore } from '../store/files.ts'
import {
	IDENTITY_TRANSFORM,
	MAX_SCALE,
	MIN_SCALE,
	panBy,
	pinch,
	toCssTransform,
	toPanePoint,
	zoomAt,
} from '../utils/compareTransform.ts'
import { formatDate, formatTime } from '../utils/dateUtils.ts'
import { getPreviewUrl, toPhotoTarget } from '../utils/fileUtils.ts'

const props = defineProps<{
	/** The two to four photos shown side by side. */
	photos: PhotoFile[]
}>()

const emit = defineEmits<{
	(event: 'close'): void
	(event: 'deleted', photo: PhotoTarget): void
}>()

/** Maximum width and height of the requested previews. */
const PREVIEW_SIZE = 2048

/** Factor a button, a key or a notch of the wheel zooms by. */
const ZOOM_STEP = 1.25

/** Zoom a double click goes to from the whole photo. */
const DOUBLE_CLICK_SCALE = 3

const PANE_CENTER: PanePoint = { x: 0, y: 0 }

const filesStore = useFilesStore()

/** Whether the reader asked for the shortcuts of the app to be left alone. */
const shortcutsDisabled = window.OCP?.Accessibility?.disableKeyboardShortcuts?.() ?? false

// One transform for every pane, which is what keeps them in sync.
const transform = ref<CompareTransform>({ ...IDENTITY_TRANSFORM })
const cssTransform = computed(() => toCssTransform(transform.value))

// Where the pointers currently down are, in the pane they went down on.
const pointers = new Map<number, PanePoint>()

const photoToKeep = shallowRef<PhotoFile | null>(null)

// The modal takes the focus, so the shortcuts are bound to the document rather
// than to an element of the comparison.
onMounted(() => document.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown))

/**
 * @param factor - Factor to zoom by, around the center of the panes
 */
function zoomBy(factor: number): void {
	transform.value = zoomAt(transform.value, PANE_CENTER, factor)
}

function resetZoom(): void {
	transform.value = { ...IDENTITY_TRANSFORM }
}

/**
 * @param event - Event of a pointer over a pane
 */
function panePoint(event: MouseEvent): PanePoint {
	return toPanePoint(event.clientX, event.clientY, (event.currentTarget as HTMLElement).getBoundingClientRect())
}

/**
 * @param event - Turn of the wheel over a pane
 */
function onWheel(event: WheelEvent): void {
	transform.value = zoomAt(transform.value, panePoint(event), event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP)
}

/**
 * @param event - Double click on a pane
 */
function onDoubleClick(event: MouseEvent): void {
	if (transform.value.scale > MIN_SCALE) {
		resetZoom()
	} else {
		transform.value = zoomAt(transform.value, panePoint(event), DOUBLE_CLICK_SCALE)
	}
}

/**
 * @param event - Pointer going down on a pane
 */
function onPointerDown(event: PointerEvent): void {
	// A third finger has nothing to add to a drag or a pinch.
	if (pointers.size >= 2 || (event.pointerType === 'mouse' && event.button !== 0)) {
		return
	}

	(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
	pointers.set(event.pointerId, panePoint(event))
}

/**
 * @param event - Move of a pointer dragging or pinching a pane
 */
function onPointerMove(event: PointerEvent): void {
	const previous = pointers.get(event.pointerId)
	if (previous === undefined) {
		return
	}

	const current = panePoint(event)
	const other = [...pointers].find(([pointerId]) => pointerId !== event.pointerId)?.[1]

	transform.value = other === undefined
		? panBy(transform.value, current.x - previous.x, current.y - previous.y)
		: pinch(transform.value, [previous, other], [current, other])

	pointers.set(event.pointerId, current)
}

/**
 * @param event - Pointer leaving a pane
 */
function onPointerUp(event: PointerEvent): void {
	pointers.delete(event.pointerId)
}

/**
 * @param event - The key press to handle
 */
function onKeyDown(event: KeyboardEvent): void {
	if (shortcutsDisabled || event.ctrlKey || event.metaKey || event.altKey) {
		return
	}

	if (event.key === '+' || event.key === '=') {
		zoomBy(ZOOM_STEP)
	} else if (event.key === '-') {
		zoomBy(1 / ZOOM_STEP)
	} else if (event.key === '0') {
		resetZoom()
	}
}

/**
 * @param photo - Photo to describe
 * @return The day and the time the photo was taken
 */
function formatTakenAt(photo: PhotoFile): string {
	const takenAt = new Date(photo.attributes.timestamp * 1000)
	return `${formatDate(takenAt)}, ${formatTime(takenAt)}`
}

/**
 * @param photo - Photo to keep
 * @return Whether every other photo can be deleted by the current user
 */
function canDeleteOthers(photo: PhotoFile): boolean {
	return props.photos.every((other) => other === photo || (other.permissions & Permission.DELETE) !== 0)
}

/**
 * @param photo - Photo to mark as a favorite, or to take that mark off again
 */
async function toggleFavorite(photo: PhotoFile): Promise<void> {
	const target = toPhotoTarget(photo)

	try {
		await filesStore.setPhotoFavorite(target, !target.favorite)
	} catch (error) {
		logger.error('Error setting the favorite state of a photo', { error, filename: target.basename })
		showError(target.favorite
			? t('photos', 'Failed to remove {fileName} from the favorites', { fileName: target.basename })
			: t('photos', 'Failed to add {fileName} to the favorites', { fileName: target.basename }))
	}
}

/**
 * Move every photo but the one to keep to the trash, and close the comparison
 * as there is nothing left to compare.
 */
async function deleteOthers(): Promise<void> {
	const others = props.photos.filter((photo) => photo !== photoToKeep.value).map(toPhotoTarget)
	photoToKeep.value = null

	await Promise.all(others.map(async (target) => {
		try {
			await filesStore.deletePhoto(target)
			emit('deleted', target)
		} catch (error) {
			logger.error('Error deleting a photo', { error, filename: target.basename })
			showError(t('photos', 'Failed to delete {fileName}', { fileName: target.basename }))
		}
	}))

	emit('close')
}
</script>

<style lang="scss" scoped>
.compare {
	display: flex;
	flex-direction: column;
	gap: calc(var(--default-grid-baseline) * 2);
	box-sizing: border-box;
	height: 100%;
	padding: calc(var(--default-grid-baseline) * 4);

	&__header {
		display: flex;
		align-items: center;
		gap: var(--default-grid-baseline);
		// Leaves room for the close button of the modal.
		padding-inline-end: calc(var(--default-clickable-area) + var(--default-grid-baseline) * 2);
	}

	&__title {
		flex: 1;
		margin: 0;
		font-size: 20px;
	}

	&__panes {
		display: grid;
		flex: 1;
		grid-auto-rows: minmax(0, 1fr);
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: calc(var(--default-grid-baseline) * 2);
		min-height: 0;

		&--3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		// Photos below each other use a narrow, upright screen better.
		@media (orientation: portrait) {
			&--2,
			&--3 {
				grid-template-columns: minmax(0, 1fr);
			}
		}
	}

	&__pane {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);
		min-height: 0;
	}

	&__viewport {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		border-radius: var(--border-radius-large);
		background-color: var(--color-background-dark);
		cursor: zoom-in;
		touch-action: none;
		user-select: none;

		&--zoomed {
			cursor: grab;
		}
	}

	&__photo {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	&__details {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--default-grid-baseline);
	}

	&__caption {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		margin: 0;
		line-height: 1.3;
	}

	&__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__date {
		color: var(--color-text-maxcontrast);
	}
}
</style>
