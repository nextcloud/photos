<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<CollectionCover
		ref="cover"
		parentRoute="/tags"
		:collectionName="tag.attributes['display-name']"
		:altImg="t('photos', 'Cover photo for tag {tagName}', { tagName: tag.attributes['display-name'] })"
		:coverUrl="coverUrl">
		<template #default>
			{{ t('recognize', tag.attributes['display-name']) }}
		</template>

		<template #subtitle>
			{{ n('photos', '%n photo', '%n photos', count) }}
		</template>
	</CollectionCover>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { Tag } from '../store/systemtags.ts'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import CollectionCover from './Collection/CollectionCover.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { useSystemTagsStore } from '../store/systemtags.ts'

const props = defineProps<{
	tag: Tag
}>()

const systemTagsStore = useSystemTagsStore()
const { abortSignal } = useAbortController()

const cover = useTemplateRef<ComponentPublicInstance>('cover')

const loadCover = ref(false)

const coverUrl = computed<string>(() => {
	if (!loadCover.value || props.tag.attributes['files-assigned'] === 0) {
		return ''
	}
	return generateUrl(`/core/preview?fileId=${props.tag.attributes['reference-fileid']}&x=${512}&y=${512}&forceIcon=0&a=1`)
})

const count = computed(() => props.tag.attributes['files-assigned'])

watch(loadCover, () => {
	if (props.tag.attributes['files-assigned']) {
		return
	}
	systemTagsStore.fetchTagFiles(props.tag.id, abortSignal.value)
})

onMounted(() => {
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			loadCover.value = true
			observer.disconnect()
		}
	})
	observer.observe(cover.value!.$el)
})
</script>
