<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="tags-view">
		<HeaderNavigation
			key="navigation"
			:loading="loading"
			:title="t('photos', 'Tags')"
			:rootTitle="t('photos', 'Tags')"
			@refresh="fetchRootContent" />

		<!-- Errors handlers-->
		<NcEmptyContent v-if="error" :name="t('photos', 'An error occurred')" />

		<NcEmptyContent v-else-if="!loading && tagsList.length === 0" :name="t('photos', 'No tags yet')" :description="t('photos', 'Photos with tags will show up here')">
			<template #icon>
				<TagOutline />
			</template>
		</NcEmptyContent>

		<div v-else-if="!loading" class="tags-view__content">
			<template v-if="popularTags.length">
				<h2>{{ t('photos', 'Popular tags') }}</h2>
				<ul class="tags-view__list">
					<li v-for="tag in popularTags" :key="tag.id">
						<TagCover :tag="tag" />
					</li>
				</ul>
				<h2>{{ t('photos', 'All tags') }}</h2>
			</template>
			<ul class="tags-view__list">
				<li v-for="tag in tagsList" :key="tag.id">
					<TagCover :tag="tag" />
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Tag } from '../store/systemtags.ts'

import { t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { computed, onBeforeMount, ref } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import TagOutline from 'vue-material-design-icons/TagOutline.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import TagCover from '../components/TagCover.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { logger } from '../services/logger.ts'
import { useSystemTagsStore } from '../store/systemtags.ts'

const systemTagsStore = useSystemTagsStore()
const { abortSignal } = useAbortController()

const error = ref<boolean | null>(null)
const loading = ref(false)

const tags = computed(() => systemTagsStore.tags)
const tagsNames = computed(() => systemTagsStore.names)

const tagsList = computed<Tag[]>(() => Object.keys(tagsNames.value)
	.map((tagName) => tags.value[tagsNames.value[tagName]])
	.filter((tag) => tag !== undefined))

const popularTags = computed<Tag[]>(() => Object.keys(tagsNames.value)
	.filter((tagName) => (tags.value[tagsNames.value[tagName]].attributes['files-assigned']) > 50)
	.sort((a, b) => (tags.value[tagsNames.value[b]]['files-assigned']) - (tags.value[tagsNames.value[a]]['files-assigned']))
	.slice(0, 9)
	.map((tagName) => tags.value[tagsNames.value[tagName]]))

async function fetchRootContent(): Promise<void> {
	// close any potential opened viewer
	getViewer().close()

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
@use '../components/Collection/CollectionsGrid.scss' as grid;

.tags-view {
	@include grid.spacing;

	&__content {
		padding: var(--collections-gap) var(--collections-padding) calc(var(--default-grid-baseline) * 8);

		> h2 {
			@include grid.section-title;

			&:not(:first-child) {
				margin-top: calc(var(--default-grid-baseline) * 4);
			}
		}
	}

	&__list {
		@include grid.grid;
	}
}
</style>
