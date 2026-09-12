<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')" />

	<NcLoadingIcon v-else-if="loading" class="loader" />

	<!-- Folder content -->
	<div v-else>
		<div class="photos-navigation">
			<NcActions class="photos-navigation__back">
				<NcActionButton @click="router.push({ name: 'tags' })">
					<template #icon>
						<ArrowLeft />
					</template>
					{{ t('photos', 'Back to tags overview') }}
				</NcActionButton>
			</NcActions>
			<h2 class="photos-navigation__title">
				{{ path }}
			</h2>
		</div>
		<div class="heading-subline">
			{{ n('photos', '%n photo', '%n photos', fileIds.length) }}
		</div>
		<NcEmptyContent v-if="isEmpty" :name="t('photos', 'No photos with this tag yet')" />

		<FilesListViewer
			class="tag__photos"
			:containerElement="appContent"
			:fileIds="fileIds"
			:baseHeight="isMobile ? 120 : 200"
			:loading="loading">
			<template #default="{ file }">
				<FileComponent
					:file="files[file.id]"
					:allowSelection="true"
					:selected="selection[file.id] === true"
					@click="openViewer"
					@selectToggled="onFileSelectToggle"
					@deleted="onPhotoDeleted" />
			</template>
		</FilesListViewer>
	</div>
</template>

<script setup lang="ts">
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import { useIsMobile } from '@nextcloud/vue/composables/useIsMobile'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue'
import FileComponent from '../components/FileComponent.vue'
import FilesListViewer from '../components/FilesListViewer.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { useFilesSelection } from '../composables/useFilesSelection.ts'
import { logger } from '../services/logger.ts'
import { closeViewer, openInViewer } from '../services/viewer.ts'
import { useFilesStore } from '../store/files.ts'
import { useSystemTagsStore } from '../store/systemtags.ts'

const props = withDefaults(defineProps<{
	path?: string
}>(), {
	path: '',
})

const router = useRouter()
const isMobile = useIsMobile()
const filesStore = useFilesStore()
const systemTagsStore = useSystemTagsStore()
const { abortSignal } = useAbortController()
const { selection, onFileSelectToggle, onUncheckFiles } = useFilesSelection()

const error = ref<boolean | null>(null)
const loading = ref(false)
const appContent = document.getElementById('app-content-vue')

const files = computed(() => filesStore.files)
const tags = computed(() => systemTagsStore.tags)

// current tag id from current path
const tagId = computed(() => systemTagsStore.tagId(props.path))

// current tag
const tag = computed(() => tags.value[tagId.value])

// files list of the current tag, as the string ids the file listing works with
const fileIds = computed(() => (systemTagsStore.tagsFiles[tagId.value] ?? []).map(String))

const isEmpty = computed(() => fileIds.value.length === 0)

watch(() => props.path, () => {
	fetchContent()
})

// The photo is already gone from the files store, it only has to leave the
// list of the photos of the tag.
function onPhotoDeleted(photo: PhotoTarget): void {
	onUncheckFiles([photo.fileid.toString()])
	systemTagsStore.removeTagFile(tagId.value, photo.fileid)
}

async function fetchContent(): Promise<void> {
	// close any potential opened viewer
	closeViewer()

	loading.value = true
	error.value = null

	try {
		// if we don't already have some cached data let's show a loader
		if (!tags.value[tagId.value]) {
			await systemTagsStore.fetchAllTags(abortSignal.value)
		}

		if (tag.value && !fileIds.value) {
			await systemTagsStore.fetchTagFiles(tagId.value, abortSignal.value)
		}
	} catch (fetchError) {
		logger.error('Failed to fetch tags', { error: fetchError })
		error.value = true
	} finally {
		// done loading
		loading.value = false
	}
}

function openViewer(fileId: number): void {
	openInViewer(fileIds.value.map((fileId) => files.value[fileId]), files.value[fileId])
}

onBeforeMount(() => {
	fetchContent()
})
</script>

<style scoped lang="scss">
.loader {
	margin-top: 30vh;
}

.photos-navigation {
	display: flex;
	height: 44px;
	padding: 0 40px;
	align-items: center;
	max-width: 100%;

	h2 {
		padding: 0;
		margin: 0;
	}
}

.heading-subline {
	margin-inline-start: 85px;
	margin-top: -11px;
	color: var(--color-text-maxcontrast);
}

.tag__photos {
	padding: 0 64px;
}
</style>
