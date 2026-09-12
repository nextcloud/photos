<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<!-- Errors handlers-->
		<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')" />

		<NcEmptyContent v-if="!loading && tagsList.length === 0" :name="t('photos', 'No tags yet')" :description="t('photos', 'Photos with tags will show up here')" />

		<NcLoadingIcon v-if="loading" class="loader" />

		<div v-else class="container">
			<h2 v-if="popularTags.length">
				{{ t('photos', 'Popular tags') }}
			</h2>
			<div class="popular-tags">
				<TagCover v-for="tag in popularTags" :key="tag.attributes.id" :tag="tag" />
			</div>
			<h2 v-if="tagsList.length">
				{{ t('photos', 'All tags') }}
			</h2>
			<div class="tags">
				<TagCover v-for="tag in tagsList" :key="tag.attributes.id" :tag="tag" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Tag } from '../store/systemtags.ts'

import { t } from '@nextcloud/l10n'
import { computed, onBeforeMount, ref } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import TagCover from '../components/TagCover.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { logger } from '../services/logger.ts'
import { closeViewer } from '../services/viewer.ts'
import { useSystemTagsStore } from '../store/systemtags.ts'

const systemTagsStore = useSystemTagsStore()
const { abortSignal } = useAbortController()

const error = ref<boolean | null>(null)
const loading = ref(false)

const tags = computed(() => systemTagsStore.tags)
const tagsNames = computed(() => systemTagsStore.names)

const tagsList = computed<Tag[]>(() => Object.keys(tagsNames.value)
	.map((tagName) => tags.value[tagsNames.value[tagName]])
	.filter((tag) => tag && tag.attributes.id))

const popularTags = computed<Tag[]>(() => Object.keys(tagsNames.value)
	.filter((tagName) => (tags.value[tagsNames.value[tagName]].attributes['files-assigned']) > 50)
	.sort((a, b) => (tags.value[tagsNames.value[b]]['files-assigned']) - (tags.value[tagsNames.value[a]]['files-assigned']))
	.slice(0, 9)
	.map((tagName) => tags.value[tagsNames.value[tagName]]))

async function fetchRootContent(): Promise<void> {
	// close any potential opened viewer
	closeViewer()

	error.value = null

	try {
		// fetch content
		if (!tagsList.value.length) {
			loading.value = true
			await systemTagsStore.fetchAllTags(abortSignal.value)
		}
	} catch (fetchError) {
		logger.error('Failed to fetch tags', { error: fetchError })
		error.value = true
	} finally {
		// done loading
		loading.value = false
	}
}

onBeforeMount(async () => {
	await fetchRootContent()
})
</script>

<style lang="scss" scoped>
.loader {
	margin-top: 30vh;
}

.container {
	padding-inline-start: 44px;

	> h2 {
		margin-inline-start: 14px;
		margin-top: 40px;
	}
}

.popular-tags, .tags {
	display: flex;
	flex-direction: row;
	gap: 8px;
	flex-wrap: wrap;
}
</style>
