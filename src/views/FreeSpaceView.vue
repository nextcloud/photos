<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="free-space">
		<HeaderNavigation
			key="navigation"
			:loading="loading"
			path="/"
			:title="rootTitle"
			:rootTitle="rootTitle"
			@refresh="loadCandidates" />

		<NcEmptyContent
			v-if="totalCount === 0"
			class="free-space__empty-content"
			:name="loading ? t('photos', 'Looking for files to clean up…') : t('photos', 'Nothing to clean up')"
			:description="t('photos', 'Screenshots, screen recordings and large videos will show up here.')">
			<template #icon>
				<Broom />
			</template>
		</NcEmptyContent>

		<template v-else>
			<p class="free-space__summary">
				{{ t('photos', 'Up to {size} can be freed up by moving these files to the trash.', { size: formatFileSize(totalSize) }) }}
			</p>

			<ul class="free-space__categories">
				<li
					v-for="category in visibleCategories"
					:key="category.id"
					class="free-space__category">
					<button
						type="button"
						class="free-space__category__header"
						:aria-expanded="expanded[category.id] === true ? 'true' : 'false'"
						:aria-controls="`free-space-${category.id}`"
						@click="expanded[category.id] = !expanded[category.id]">
						<component :is="category.icon" class="free-space__category__icon" :size="24" />
						<span class="free-space__category__title">
							<span class="free-space__category__name">{{ category.name }}</span>
							<span class="free-space__category__description">{{ category.description }}</span>
						</span>
						<span class="free-space__category__stats">
							{{ n('photos', '%n item', '%n items', categories[category.id].length) }}
							· {{ formatFileSize(getTotalSize(categories[category.id])) }}
						</span>
						<ChevronDown class="free-space__category__chevron" :size="20" />
					</button>

					<div
						v-if="expanded[category.id]"
						:id="`free-space-${category.id}`"
						class="free-space__category__content">
						<div class="free-space__category__actions">
							<NcButton variant="tertiary" @click="toggleCategorySelection(category.id)">
								{{ isCategorySelected(category.id) ? t('photos', 'Unselect all') : t('photos', 'Select all') }}
							</NcButton>
							<NcButton
								variant="error"
								:disabled="selectedFiles(category.id).length === 0"
								@click="trashSelection(category.id)">
								<template #icon>
									<TrashCanOutline :size="20" />
								</template>
								{{ trashButtonLabel(category.id) }}
							</NcButton>
						</div>

						<ul class="free-space__grid">
							<li v-for="file in categories[category.id]" :key="file.fileid" class="free-space__tile">
								<div class="free-space__tile__preview">
									<FileComponent
										:file="file"
										:selected="selection[file.fileid] === true"
										:showActionsMenu="false"
										@click="openViewer(category.id, file)"
										@selectToggled="onFileSelectToggle" />
								</div>
								<span class="free-space__tile__size">{{ formatFileSize(file.size ?? 0) }}</span>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</template>
	</div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { PhotoFile } from '../store/files.ts'
import type { CleanupCategoryId } from '../utils/cleanup.ts'

import { showError } from '@nextcloud/dialogs'
import { formatFileSize } from '@nextcloud/files'
import { n, t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { computed, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import Broom from 'vue-material-design-icons/Broom.vue'
import CellphoneScreenshot from 'vue-material-design-icons/CellphoneScreenshot.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import MonitorScreenshot from 'vue-material-design-icons/MonitorScreenshot.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import VideoBox from 'vue-material-design-icons/VideoBox.vue'
import FileComponent from '../components/FileComponent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { imageMimes, videoMimes } from '../services/AllowedMimes.ts'
import { logger } from '../services/logger.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { confirmOperation } from '../store/collections.ts'
import { useFilesStore } from '../store/files.ts'
import { getScreenshotSearchFilter, getTotalSize, getVideoSearchFilter, groupCleanupCandidates, LARGE_VIDEO_SIZE } from '../utils/cleanup.ts'

defineProps<{
	rootTitle: string
}>()

/** Maximum number of candidates fetched by each search. */
const MAX_CANDIDATES = 1000

const filesStore = useFilesStore()
const { abortSignal } = useAbortController()
const { selection, onFileSelectToggle, onUncheckFiles } = useFilesSelection()

const loading = ref(false)
const candidateIds = ref<number[]>([])
const expanded = ref<Partial<Record<CleanupCategoryId, boolean>>>({})

const categoryList: Array<{ id: CleanupCategoryId, name: string, description: string, icon: Component }> = [
	{
		id: 'screenshots',
		name: t('photos', 'Screenshots'),
		description: t('photos', 'Pictures named like screenshots, and PNG files with the size of a phone screen'),
		icon: CellphoneScreenshot,
	},
	{
		id: 'screenRecordings',
		name: t('photos', 'Screen recordings'),
		description: t('photos', 'Videos named like screen recordings'),
		icon: MonitorScreenshot,
	},
	{
		id: 'largeVideos',
		name: t('photos', 'Large videos'),
		description: t('photos', 'Videos larger than {size}', { size: formatFileSize(LARGE_VIDEO_SIZE) }),
		icon: VideoBox,
	},
]

// Built from the store, so that deleted files drop out on their own and come
// back when the server refuses to delete them.
const categories = computed(() => groupCleanupCandidates(candidateIds.value
	.map((fileId) => filesStore.files[fileId])
	.filter((file) => file !== undefined)))

const visibleCategories = computed(() => categoryList.filter(({ id }) => categories.value[id].length > 0))

const totalCount = computed(() => Object.values(categories.value).reduce((count, files) => count + files.length, 0))

const totalSize = computed(() => Object.values(categories.value).reduce((size, files) => size + getTotalSize(files), 0))

onMounted(loadCandidates)

async function loadCandidates(): Promise<void> {
	if (loading.value) {
		return
	}

	try {
		loading.value = true
		const results = await Promise.all([
			getPhotos({
				mimesType: imageMimes,
				nbResults: MAX_CANDIDATES,
				extraFilters: getScreenshotSearchFilter(),
				signal: abortSignal.value,
			}),
			getPhotos({
				mimesType: videoMimes,
				nbResults: MAX_CANDIDATES,
				extraFilters: getVideoSearchFilter(),
				signal: abortSignal.value,
			}),
		])
		const files = results.flat()
		filesStore.appendFiles(files)
		candidateIds.value = files.map((file) => file.fileid as number)
	} catch (error) {
		if (error instanceof DOMException && error.code === error.ABORT_ERR) {
			return
		}

		logger.error('Error fetching files to clean up', { error })
		showError(t('photos', 'Error fetching files'))
	} finally {
		loading.value = false
	}
}

/**
 * @param categoryId - Category to look into
 */
function selectedFiles(categoryId: CleanupCategoryId): PhotoFile[] {
	return categories.value[categoryId].filter((file) => selection.value[file.fileid] === true)
}

/**
 * @param categoryId - Category to look into
 */
function isCategorySelected(categoryId: CleanupCategoryId): boolean {
	return selectedFiles(categoryId).length === categories.value[categoryId].length
}

/**
 * Select every file of a category, or unselect them all when they already are.
 *
 * @param categoryId - Category to update
 */
function toggleCategorySelection(categoryId: CleanupCategoryId): void {
	const value = !isCategorySelected(categoryId)
	categories.value[categoryId].forEach((file) => {
		selection.value[file.fileid] = value
	})
}

/**
 * @param categoryId - Category of the button
 */
function trashButtonLabel(categoryId: CleanupCategoryId): string {
	const files = selectedFiles(categoryId)
	return n('photos', 'Move %n item to trash ({size})', 'Move %n items to trash ({size})', files.length, { size: formatFileSize(getTotalSize(files)) })
}

/**
 * @param categoryId - Category the file is listed in
 * @param file - File to open
 */
function openViewer(categoryId: CleanupCategoryId, file: PhotoFile): void {
	getViewer().open(categories.value[categoryId], file)
}

/**
 * @param categoryId - Category whose selected files get deleted
 */
async function trashSelection(categoryId: CleanupCategoryId): Promise<void> {
	const files = selectedFiles(categoryId)
	const confirmed = await confirmOperation(
		t('photos', 'Move to trash'),
		n('photos', 'Move %n item to the trash? This frees up {size}.', 'Move %n items to the trash? This frees up {size}.', files.length, { size: formatFileSize(getTotalSize(files)) }),
	)
	if (!confirmed) {
		return
	}

	const fileIds = files.map((file) => file.fileid.toString())
	onUncheckFiles(fileIds)
	await filesStore.deleteFiles(fileIds)
}
</script>

<style lang="scss" scoped>
.free-space {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__empty-content {
		flex: 1;
	}

	&__summary {
		padding-inline: calc(var(--default-grid-baseline) * 4);
		color: var(--color-text-maxcontrast);
	}

	&__categories {
		display: flex;
		flex-direction: column;
		gap: calc(var(--default-grid-baseline) * 3);
		padding: calc(var(--default-grid-baseline) * 4);
	}

	&__category {
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-large);

		&__header {
			display: grid;
			grid-template-areas: 'icon title stats chevron';
			grid-template-columns: auto 1fr auto auto;
			gap: calc(var(--default-grid-baseline) * 3);
			align-items: center;
			width: 100%;
			min-height: var(--default-clickable-area);
			margin: 0;
			padding: calc(var(--default-grid-baseline) * 3);
			border: none;
			border-radius: var(--border-radius-large);
			background-color: transparent;
			color: var(--color-main-text);
			font-weight: normal;
			text-align: start;
			cursor: pointer;

			&:hover,
			&:focus-visible {
				background-color: var(--color-background-hover);
			}

			&[aria-expanded='true'] .free-space__category__chevron {
				transform: rotate(180deg);
			}
		}

		&__icon {
			grid-area: icon;
		}

		&__title {
			display: flex;
			grid-area: title;
			flex-direction: column;
			min-width: 0;
		}

		&__name {
			font-weight: bold;
		}

		&__description {
			color: var(--color-text-maxcontrast);
		}

		&__stats {
			grid-area: stats;
			white-space: nowrap;
		}

		&__chevron {
			grid-area: chevron;
			transition: transform var(--animation-quick) ease-out;
		}

		&__content {
			padding: 0 calc(var(--default-grid-baseline) * 3) calc(var(--default-grid-baseline) * 3);
		}

		&__actions {
			display: flex;
			flex-wrap: wrap;
			gap: calc(var(--default-grid-baseline) * 2);
			justify-content: flex-end;
			margin-block-end: calc(var(--default-grid-baseline) * 3);
		}
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: calc(var(--default-grid-baseline) * 2);
	}

	&__tile {
		display: flex;
		flex-direction: column;
		gap: var(--default-grid-baseline);

		&__preview {
			position: relative;
			aspect-ratio: 1;
		}

		&__size {
			color: var(--color-text-maxcontrast);
			text-align: center;
		}
	}
}

@media (max-width: 512px) {
	.free-space__category__header {
		grid-template-areas: 'icon title chevron' 'icon stats chevron';
		grid-template-columns: auto 1fr auto;
	}
}

@media (prefers-reduced-motion: reduce) {
	.free-space__category__chevron {
		transition: none;
	}
}
</style>
