<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<RouterLink ref="cover" class="tag-cover" :to="`/tags/${tag.attributes['display-name']}`">
		<img
			v-if="tag.attributes['files-assigned'] !== 0"
			class="tag-cover__image"
			:src="coverUrl">
		<div v-else class="tag-cover__image tag-cover__image--placeholder">
			<ImageMultipleOutline :size="128" />
		</div>
		<div class="tag-cover__details">
			<div class="tag-cover__details__first-line">
				<h3 class="tag-cover__details__name">
					{{ t('recognize', tag.attributes['display-name']) }}
				</h3>
			</div>
			<div class="tag-cover__details__second-line">
				{{ n('photos', '%n photo', '%n photos', count) }}
			</div>
		</div>
	</RouterLink>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { Tag } from '../store/systemtags.ts'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import ImageMultipleOutline from 'vue-material-design-icons/ImageMultipleOutline.vue'
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
	if (!loadCover.value) {
		return ''
	}
	return generateUrl(`/core/preview?fileId=${props.tag.attributes['reference-fileid']}&x=${512}&y=${512}&forceIcon=0&a=1`)
})

const count = computed(() => props.tag.attributes['files-assigned'])

watch(loadCover, () => {
	if (props.tag.attributes['files-assigned']) {
		return
	}
	systemTagsStore.fetchTagFiles(props.tag.attributes.id, abortSignal.value)
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

<style scoped lang="scss">
.tag-cover {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-radius: 12px;

	&:hover, &:focus {
		background: var(--color-background-dark);
	}

	&__image {
		width: 350px;
		height: 350px;
		object-fit: cover;
		border-radius: 12px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
			height: 250px;
		}

		&--placeholder {
			background: var(--color-primary-element-light);

			:deep(.material-design-icon) {
				width: 100%;
				height: 100%;

				.material-design-icon__svg {
					fill: var(--color-primary-element);
				}
			}
		}
	}

	&__details {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		width: 350px;

		@media only screen and (max-width: 1200px) {
			width: 250px;
		}

		&__first-line {
			display: flex;
		}

		&__second-line {
			display: flex;
			color: var(--color-text-lighter);
		}

		&__name {
			flex-grow: 1;
			margin: 0;
			font-weight: normal;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

		}
	}

}
</style>
