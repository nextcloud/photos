<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="duplicates">
		<HeaderNavigation
			key="navigation"
			:loading="loading"
			path="/"
			:title="rootTitle"
			:root-title="rootTitle"
			@refresh="loadPhotos" />

		<NcEmptyContent
			v-if="groups.length === 0"
			class="duplicates__empty-content"
			:name="loading ? t('photos', 'Looking for duplicates…') : t('photos', 'No duplicates found')"
			:description="t('photos', 'Photos with the same size and dimensions are grouped here so you can remove the extra copies.')">
			<template #icon>
				<ContentDuplicate :size="64" />
			</template>
		</NcEmptyContent>

		<ul v-else class="duplicates__list">
			<li v-for="group in groups" :key="group.id" class="duplicates__group">
				<h3 class="duplicates__group__title">
					{{ n('photos', '%n copy', '%n copies', group.photos.length) }}
					<span class="duplicates__group__meta">{{ formatFileSize(group.size) }}</span>
				</h3>
				<ul class="duplicates__group__grid">
					<li v-for="photo in group.photos" :key="photo.fileid" class="duplicates__photo">
						<button
							type="button"
							class="duplicates__photo__open"
							:aria-label="t('photos', 'Open {name}', { name: photo.basename })"
							@click="openViewer(group, photo)">
							<img
								class="duplicates__photo__image"
								:src="getPreviewUrl(photo, 256)"
								:alt="photo.basename"
								loading="lazy"
								decoding="async">
						</button>
						<NcButton
							class="duplicates__photo__delete"
							variant="error"
							:aria-label="t('photos', 'Move {name} to the trash', { name: photo.basename })"
							@click="photoToDelete = photo">
							<template #icon>
								<Delete :size="20" />
							</template>
						</NcButton>
					</li>
				</ul>
			</li>
		</ul>

		<NcDialog
			v-if="photoToDelete !== null"
			:name="t('photos', 'Move to trash')"
			@update:open="photoToDelete = null">
			<p>{{ t('photos', 'Are you sure you want to move "{name}" to the trash?', { name: photoToDelete.basename }) }}</p>
			<template #actions>
				<NcButton variant="tertiary" @click="photoToDelete = null">
					{{ t('photos', 'Cancel') }}
				</NcButton>
				<NcButton variant="error" @click="confirmDelete">
					{{ t('photos', 'Move to trash') }}
				</NcButton>
			</template>
		</NcDialog>
	</div>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { DuplicateGroup } from '../utils/duplicates.ts'

import { formatFileSize } from '@nextcloud/files'
import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import { computed, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ContentDuplicate from 'vue-material-design-icons/ContentDuplicate.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import store from '../store/index.ts'
import { findDuplicateGroups } from '../utils/duplicates.ts'
import { getPreviewUrl, toViewerFileInfo } from '../utils/fileUtils.ts'

defineProps<{
	rootTitle: string
}>()

const { photos, loading, loadPhotos } = useLoadedPhotos()

const groups = computed<DuplicateGroup[]>(() => findDuplicateGroups(photos.value))

// The photo pending a delete confirmation, or null when the dialog is closed.
const photoToDelete = ref<PhotoFile | null>(null)

onMounted(() => {
	// Reuse whatever the other views already loaded; only fetch on a cold start.
	if (photos.value.length === 0) {
		loadPhotos()
	}
})

/**
 * Open a duplicate in the viewer, with the rest of its group as the viewer's
 * list, so the copies can be compared side by side before deleting one.
 *
 * @param group - The duplicate group the photo belongs to
 * @param photo - The photo to open
 */
function openViewer(group: DuplicateGroup, photo: PhotoFile): void {
	window.OCA.Viewer.open({
		fileInfo: toViewerFileInfo(photo),
		list: group.photos.map((duplicate) => toViewerFileInfo(duplicate)),
	})
}

/** Move the pending photo to the trash (recoverable). The group shrinks live. */
async function confirmDelete(): Promise<void> {
	const photo = photoToDelete.value
	photoToDelete.value = null
	if (photo !== null) {
		await store.dispatch('deleteFiles', [photo.fileid])
	}
}
</script>

<style lang="scss" scoped>
.duplicates {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__empty-content {
		flex: 1;
	}

	&__list {
		margin: 0;
		padding: calc(var(--default-grid-baseline) * 4);
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 6);
	}

	&__group__title {
		display: flex;
		align-items: baseline;
		gap: calc(var(--default-grid-baseline) * 2);
		margin: 0 0 calc(var(--default-grid-baseline) * 2);
		font-weight: bold;
	}

	&__group__meta {
		color: var(--color-text-maxcontrast);
		font-weight: normal;
		font-size: 0.9em;
	}

	&__group__grid {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: calc(var(--default-grid-baseline) * 3);
	}

	&__photo {
		position: relative;
		aspect-ratio: 1;
		border-radius: var(--border-radius-large);
		overflow: hidden;
		background-color: var(--color-background-dark);

		&__open {
			width: 100%;
			height: 100%;
			padding: 0;
			border: none;
			background: none;
			cursor: pointer;
		}

		&__image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		// Revealed on hover or keyboard focus, never hidden behind hover alone.
		&__delete {
			position: absolute;
			inset-block-start: calc(var(--default-grid-baseline) * 1);
			inset-inline-end: calc(var(--default-grid-baseline) * 1);
			opacity: 0;
			transition: opacity var(--animation-quick) ease-out;
		}

		&:hover &__delete,
		&:focus-within &__delete {
			opacity: 1;
		}
	}
}

@media (hover: none) {
	// No hover on touch, so keep the delete button always visible there.
	.duplicates__photo__delete {
		opacity: 1;
	}
}
</style>
