<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')">
		<template #icon>
			<AlertCircleOutline />
		</template>
	</NcEmptyContent>

	<div v-else class="pets">
		<HeaderNavigation
			key="navigation"
			path="/"
			:title="t('photos', 'Pets')"
			:rootTitle="t('photos', 'Pets')"
			:loading="loading" />

		<FilesListViewer
			class="pets__file-list"
			:containerElement="appContent"
			:fileIdsBySection="grouped.fileIdsBySection"
			:sections="grouped.sections"
			:loading="loading"
			:baseHeight="isMobile ? 120 : 200"
			:emptyMessage="t('photos', 'No photos of animals yet')">
			<template #default="{ file, isHeader }">
				<h2 v-if="isHeader" class="pets__section-header">
					{{ sectionName(file.id) }}
				</h2>
				<FileComponent
					v-else
					:file="files[file.id]"
					:allowSelection="false"
					@click="openViewer"
					@deleted="onPhotoDeleted" />
			</template>
		</FilesListViewer>
	</div>
</template>

<script setup lang="ts">
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { translate as t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, onBeforeMount, ref } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { getAnimalTag, getAnimalTypeTags, groupAnimalPhotos, otherAnimalsSection } from '../services/AnimalTags.ts'
import { logger } from '../services/logger.ts'
import { useFilesStore } from '../store/files.ts'
import { useSystemTagsStore } from '../store/systemtags.ts'

const isMobile = useIsMobile()
const filesStore = useFilesStore()
const systemTagsStore = useSystemTagsStore()
const { abortSignal } = useAbortController()

const error = ref(false)
const loading = ref(false)
const appContent = document.getElementById('app-content-vue')

const files = computed(() => filesStore.files)
const tags = computed(() => Object.values(systemTagsStore.tags))
const typeTags = computed(() => getAnimalTypeTags(tags.value))
const animalTag = computed(() => getAnimalTag(tags.value))

const animalTags = computed(() => animalTag.value ? [...typeTags.value, animalTag.value] : typeTags.value)

const grouped = computed(() => groupAnimalPhotos(
	typeTags.value.map((tag) => [tag.attributes['display-name'], systemTagsStore.tagsFiles[tag.id] ?? []]),
	animalTag.value ? systemTagsStore.tagsFiles[animalTag.value.id] ?? [] : [],
))

// Every photo once, in the order of the sections.
const allFileIds = computed(() => [...new Set(grouped.value.sections.flatMap((section) => grouped.value.fileIdsBySection[section]))])

/**
 * @param section - Id of the section, the name of its tag
 */
function sectionName(section: string): string {
	return section === otherAnimalsSection
		? t('photos', 'Other animals')
		: t('recognize', section)
}

function openViewer(fileId: number): void {
	getViewer().open(allFileIds.value.map((id) => files.value[id]), files.value[fileId])
}

// The photo is already gone from the files store, it only has to leave the
// lists of the photos of the tags.
function onPhotoDeleted(photo: PhotoTarget): void {
	animalTags.value.forEach((tag) => systemTagsStore.removeTagFile(tag.id, photo.fileid))
}

async function fetchContent(): Promise<void> {
	getViewer().close()
	loading.value = true
	error.value = false

	try {
		if (tags.value.length === 0) {
			await systemTagsStore.fetchAllTags(abortSignal.value)
		}

		await Promise.all(animalTags.value
			.filter((tag) => systemTagsStore.tagsFiles[tag.id] === undefined)
			.map((tag) => systemTagsStore.fetchTagFiles(tag.id, abortSignal.value)))
	} catch (fetchError) {
		logger.error('Failed to fetch animal tags', { error: fetchError })
		error.value = true
	} finally {
		loading.value = false
	}
}

onBeforeMount(fetchContent)
</script>

<style lang="scss" scoped>
.pets {
	display: flex;
	flex-direction: column;

	&__file-list {
		padding: 0 64px;

		@media only screen and (max-width: 1200px) {
			padding: 0 4px;
		}

		:deep(.files-list-viewer__section-header) {
			top: var(--photos-navigation-height);
		}
	}

	&__section-header {
		margin: 0;
		padding-top: calc(var(--default-grid-baseline) * 6);
	}
}
</style>
