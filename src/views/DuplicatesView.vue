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
			:rootTitle="rootTitle"
			@refresh="loadAllPhotos">
			<template #right>
				<NcButton
					v-if="selectedFiles.length > 0"
					variant="error"
					@click="deleteConfirmationShown = true">
					<template #icon>
						<TrashCanOutline :size="20" />
					</template>
					{{ n('photos', 'Delete %n copy', 'Delete %n copies', selectedFiles.length) }}
				</NcButton>
			</template>
		</HeaderNavigation>

		<NcEmptyContent
			v-if="groups.length === 0"
			class="duplicates__empty-content"
			:name="loading ? t('photos', 'Looking for duplicates…') : t('photos', 'No duplicates found')"
			:description="t('photos', 'Files with the same size, capture time and dimensions are listed as copies of each other. Visually similar photos are not detected.')">
			<template #icon>
				<ContentDuplicate />
			</template>
		</NcEmptyContent>

		<template v-else>
			<p class="duplicates__summary">
				{{ n('photos', '%n group of identical files.', '%n groups of identical files.', groups.length) }}
				{{ t('photos', 'Files with the same size, capture time and dimensions are listed as copies of each other. Visually similar photos are not detected.') }}
			</p>

			<ul class="duplicates__groups">
				<li v-for="group in groups" :key="group[0].fileid" class="duplicates__group">
					<h3 class="duplicates__group__title">
						{{ n('photos', '%n copy', '%n copies', group.length) }}
						· {{ formatFileSize(group[0].size ?? 0) }}
						· {{ formatDate(new Date(group[0].attributes.timestamp * 1000)) }}
					</h3>

					<ul class="duplicates__group__files">
						<li v-for="file in group" :key="file.fileid" class="duplicates__file">
							<button
								type="button"
								class="duplicates__file__preview"
								:aria-label="t('photos', 'Open {name}', { name: file.basename })"
								@click="getViewer().open(group, file)">
								<img
									:src="getPreviewUrl(file, 256)"
									alt=""
									loading="lazy"
									decoding="async">
							</button>
							<NcCheckboxRadioSwitch
								:modelValue="selectedFileIds.includes(file.fileid)"
								:disabled="!canSelect(file, group)"
								@update:modelValue="toggleSelection(file, $event)">
								<span class="duplicates__file__path">{{ getDisplayPath(file) }}</span>
							</NcCheckboxRadioSwitch>
						</li>
					</ul>
				</li>
			</ul>
		</template>

		<NcDialog
			v-if="deleteConfirmationShown"
			:name="t('photos', 'Delete copies')"
			@update:open="deleteConfirmationShown = false">
			<p>{{ n('photos', 'Are you sure you want to move %n copy to the trash?', 'Are you sure you want to move %n copies to the trash?', selectedFiles.length) }}</p>

			<template #actions>
				<NcButton variant="tertiary" @click="deleteConfirmationShown = false">
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

import { showError } from '@nextcloud/dialogs'
import { formatFileSize, Permission } from '@nextcloud/files'
import { getRootPath } from '@nextcloud/files/dav'
import { n, t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { computed, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import ContentDuplicate from 'vue-material-design-icons/ContentDuplicate.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import { findDuplicateGroups } from '../services/duplicates.ts'
import { logger } from '../services/logger.ts'
import { useFilesStore } from '../store/files.ts'
import { formatDate } from '../utils/dateUtils.ts'
import { getPreviewUrl, toPhotoTarget } from '../utils/fileUtils.ts'

defineProps<{
	rootTitle: string
}>()

const filesStore = useFilesStore()
const { photos, loading, loadAllPhotos } = useLoadedPhotos()

const groups = computed<PhotoFile[][]>(() => findDuplicateGroups(photos.value))

const selectedFileIds = ref<number[]>([])
const deleteConfirmationShown = ref(false)

// Files deleted from another view leave the groups, so the selection is
// read through them.
const selectedFiles = computed<PhotoFile[]>(() => groups.value
	.flat()
	.filter((file) => selectedFileIds.value.includes(file.fileid)))

onMounted(loadAllPhotos)

/**
 * @param file - File to get the path of
 * @return The path of the file in the user's files
 */
function getDisplayPath(file: PhotoFile): string {
	return toPhotoTarget(file).davPath.slice(getRootPath().length)
}

/**
 * A copy can be selected when it can be deleted, and as long as one copy of
 * the group is left unselected.
 *
 * @param file - File to check
 * @param group - Group the file belongs to
 */
function canSelect(file: PhotoFile, group: PhotoFile[]): boolean {
	if (selectedFileIds.value.includes(file.fileid)) {
		return true
	}

	if ((file.permissions & Permission.DELETE) === 0) {
		return false
	}

	return group.some((other) => other !== file && !selectedFileIds.value.includes(other.fileid))
}

/**
 * @param file - File to add to or remove from the selection
 * @param selected - Whether the file is selected
 */
function toggleSelection(file: PhotoFile, selected: boolean): void {
	selectedFileIds.value = selected
		? [...selectedFileIds.value, file.fileid]
		: selectedFileIds.value.filter((fileId) => fileId !== file.fileid)
}

async function confirmDelete(): Promise<void> {
	deleteConfirmationShown.value = false
	const files = selectedFiles.value
	selectedFileIds.value = []

	for (const file of files) {
		const photo = toPhotoTarget(file)
		try {
			await filesStore.deletePhoto(photo)
		} catch (error) {
			logger.error('Error deleting a photo', { error, filename: photo.basename })
			showError(t('photos', 'Failed to delete {fileName}', { fileName: photo.basename }))
		}
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

	&__summary {
		padding: 0 calc(var(--default-grid-baseline) * 4);
		color: var(--color-text-maxcontrast);
	}

	&__groups {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 6);
		padding: calc(var(--default-grid-baseline) * 4);
	}

	&__group__title {
		margin-block: 0 calc(var(--default-grid-baseline) * 2);
		font-size: 1rem;
	}

	&__group__files {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: calc(var(--default-grid-baseline) * 4);
	}

	&__file {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);
		min-width: 0;

		&__preview {
			aspect-ratio: 1;
			padding: 0;
			overflow: hidden;
			border: none;
			border-radius: var(--border-radius-large);
			background-color: var(--color-primary-element-light);
			cursor: pointer;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&__path {
			overflow-wrap: anywhere;
		}
	}
}
</style>
