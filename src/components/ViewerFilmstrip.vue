<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<Teleport to="body">
		<!-- The viewer keeps the focus inside its dialog, so the strip is a
		     shortcut for pointers only: keyboards and screen readers step
		     through the photos with the viewer's own previous and next. -->
		<ul
			v-if="filmstripFiles.length > 0"
			class="viewer-filmstrip"
			aria-hidden="true">
			<li v-for="file in filmstripFiles" :key="file.fileid">
				<button
					:ref="(element) => file.fileid === filmstripFileId && (currentItem = element as HTMLElement | null)"
					type="button"
					class="viewer-filmstrip__item"
					:class="{ 'viewer-filmstrip__item--current': file.fileid === filmstripFileId }"
					:title="file.basename"
					tabindex="-1"
					@mousedown.prevent
					@click="showInViewer(file.fileid!)">
					<img
						:src="getPreviewUrl(file, 64, token)"
						alt=""
						draggable="false"
						loading="lazy"
						@error="($event.target as HTMLElement).style.visibility = 'hidden'">
				</button>
			</li>
		</ul>
	</Teleport>
</template>

<script setup lang="ts">
import type { Node } from '@nextcloud/files'

import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { filmstripFileId, filmstripFiles, removeFromFilmstrip, showInViewer } from '../services/viewerFilmstrip.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'

const route = useRoute()
const token = computed(() => route.params.token as string | undefined)

const currentItem = ref<HTMLElement | null>(null)

watch([filmstripFileId, () => filmstripFiles.value.length], async () => {
	await nextTick()
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	currentItem.value?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
})

function onNodeDeleted({ fileid }: Node) {
	removeFromFilmstrip(fileid)
}

onMounted(() => subscribe('files:node:deleted', onNodeDeleted))
onBeforeUnmount(() => unsubscribe('files:node:deleted', onNodeDeleted))
</script>

<style lang="scss" scoped>
.viewer-filmstrip {
	// Shown over the dark backdrop of the viewer whatever the theme is.
	--filmstrip-gap: var(--default-grid-baseline);
	position: fixed;
	// The viewer leaves a band as high as its header free under the photo,
	// with its settings button in the corner.
	inset-block-end: 0;
	inset-inline: 0;
	// Above the backdrop of the viewer, below its header and menus.
	z-index: 10000;
	display: flex;
	gap: var(--filmstrip-gap);
	box-sizing: border-box;
	width: fit-content;
	max-width: calc(100% - 2 * (var(--default-clickable-area) + 4 * var(--default-grid-baseline)));
	height: var(--header-height);
	margin-inline: auto;
	padding-block: var(--filmstrip-gap);
	overflow-x: auto;
	scrollbar-width: none;
	list-style: none;

	&__item {
		display: block;
		height: 100%;
		aspect-ratio: 1;
		margin: 0;
		padding: 0;
		overflow: hidden;
		border: 2px solid transparent;
		border-radius: var(--border-radius-small);
		background-color: #171717;
		opacity: .6;
		cursor: pointer;
		transition: opacity var(--animation-quick);

		&:hover,
		&--current {
			opacity: 1;
		}

		&--current {
			border-color: #ffffff;
		}

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}
}
</style>
