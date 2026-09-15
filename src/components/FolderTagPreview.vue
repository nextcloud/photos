<!--
 - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<RouterLink
		class="folder"
		:to="toLink"
		:aria-label="ariaLabel">
		<img
			v-if="previewUrl"
			class="folder__image"
			:src="previewUrl"
			alt=""
			@error="onPreviewFail">

		<span v-else class="folder__image folder__image--placeholder">
			<FolderOutline
				class="folder__icon"
				:size="96"
				fillColor="var(--color-primary-element)" />
		</span>

		<span class="folder__details">
			<FolderOutline />
			<span class="folder__title">{{ name }}</span>
		</span>
	</RouterLink>
</template>

<script setup lang="ts">
import type { File } from '@nextcloud/files'
import type { RouteLocationRaw } from 'vue-router'

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'

const props = withDefaults(defineProps<{
	name: string
	/** Path of the folder, relative to the root of the account. */
	path?: string
	fileList?: File[]
}>(), {
	path: '',
	fileList: () => [],
})

const route = useRoute()

const failed = ref<number[]>([])

const ariaLabel = computed(() => t('photos', 'Open the "{name}" folder', { name: props.name }))

/**
 * Previews list without the failed ones
 */
const previewList = computed<File[]>(() => props.fileList
	.filter((file) => failed.value.indexOf(file.fileid as number) === -1))

/** The photo the folder is shown under, the last one that has not failed. */
const cover = computed<File | undefined>(() => previewList.value.at(-1))

const previewUrl = computed<string | null>(() => {
	if (cover.value === undefined) {
		return null
	}

	// use etag to force cache reload if file changed
	return generateUrl(`/core/preview?fileId=${cover.value.id}&c=${cover.value.attributes.etag}&x=${250}&y=${250}&forceIcon=0&a=0`)
})

/**
 * We do not want encoded slashes when browsing by folder
 * so we generate a new valid route object based on the
 * current named route, get the final url back, decode it
 * and use it as a direct string.
 * Which vue-router does not encode afterwards!
 */
const toLink = computed<RouteLocationRaw>(() => {
	// always remove first slash, the router
	// manage it automatically
	const regex = /^\/?(.+)/i
	const path = (regex.exec(props.path) as string[])[1]

	// keep the current route, so folders and shared folders each stay in theirs
	return { name: route.name ?? undefined, params: { path } }
})

/**
 * Drop the photo whose preview could not be shown, so that the folder falls
 * back to the next one it holds — and to its icon once none is left.
 */
function onPreviewFail(): void {
	if (cover.value !== undefined) {
		failed.value.push(cover.value.fileid as number)
	}
}
</script>

<style lang="scss" scoped>
.folder {
	// The tile size is given by the layout, the preview fills it.
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 8px;
	border-radius: var(--border-radius-large);

	&:hover,
	&:focus {
		background-color: var(--color-background-dark);
	}

	&__image {
		// The image takes all the space the title does not need.
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		object-fit: cover;
		border-radius: var(--border-radius-large);

		&--placeholder {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--color-primary-element-light);
		}
	}

	&__icon {
		max-width: 100%;
		max-height: 100%;
	}

	&__details {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		width: 100%;
	}

	&__title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--color-main-text);
	}
}
</style>
