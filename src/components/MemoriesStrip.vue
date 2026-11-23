<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<section
		v-if="memories.length > 0"
		class="memories-strip"
		:aria-labelledby="`${listId}-title`">
		<div class="memories-strip__header">
			<h2 :id="`${listId}-title`" class="memories-strip__title">
				{{ t('photos', 'On this day') }}
			</h2>
			<NcButton
				variant="tertiary"
				:aria-label="collapsed ? t('photos', 'Show memories') : t('photos', 'Hide memories')"
				:aria-expanded="collapsed ? 'false' : 'true'"
				:aria-controls="listId"
				@click="toggleCollapsed">
				<template #icon>
					<ChevronDown v-if="collapsed" :size="20" />
					<ChevronUp v-else :size="20" />
				</template>
			</NcButton>
		</div>

		<ul v-show="!collapsed" :id="listId" class="memories-strip__list">
			<li v-for="memory in memories" :key="memory.yearsAgo" class="memories-strip__item">
				<button
					type="button"
					class="memories-strip__card"
					:aria-label="n('photos', 'Play a slideshow of your photos from %n year ago', 'Play a slideshow of your photos from %n years ago', memory.yearsAgo)"
					@click="playMemory(memory)">
					<img
						class="memories-strip__card__cover"
						:src="getPreviewUrl(memory.cover, 512)"
						alt=""
						loading="lazy"
						decoding="async">
					<span class="memories-strip__card__details">
						<span class="memories-strip__card__title">
							{{ n('photos', '%n year ago', '%n years ago', memory.yearsAgo) }}
						</span>
						<span>{{ n('photos', '%n photo', '%n photos', memory.photos.length) }}</span>
					</span>
				</button>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import type { YearsAgoMemory } from '../services/memories.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { n, t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { onMounted, ref, shallowRef, useId } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { logger } from '../services/logger.ts'
import { groupByYearsAgo } from '../services/memories.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { useFilesStore } from '../store/files.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'

/** Upper bound of photos loaded for the strip, across all years. */
const MAX_PHOTOS = 500

const filesStore = useFilesStore()
const { abortSignal } = useAbortController()

const listId = useId()
const memories = shallowRef<YearsAgoMemory[]>([])
const storageKey = `photos:memories-strip-collapsed:${getCurrentUser()?.uid ?? ''}`
const collapsed = ref(readCollapsed())

onMounted(loadMemories)

/**
 * Load the photos taken around today's date in earlier years.
 */
async function loadMemories(): Promise<void> {
	try {
		const fetchedFiles = await getPhotos({
			nbResults: MAX_PHOTOS,
			onThisDay: true,
			signal: abortSignal.value,
		})

		filesStore.appendFiles(fetchedFiles)

		// The store leaves out hidden and excluded files.
		const photos = fetchedFiles
			.map((file) => filesStore.files[file.fileid as number])
			.filter((photo) => photo !== undefined)

		memories.value = groupByYearsAgo(photos)
	} catch (error) {
		if (!(error instanceof DOMException && error.name === 'AbortError')) {
			logger.error('Failed to load the memories of this day', { error })
		}
	}
}

/**
 * @param memory - The memory to play as a slideshow
 */
function playMemory(memory: YearsAgoMemory): void {
	getViewer().open(memory.photos, memory.photos[0], { startSlideshow: true })
}

function toggleCollapsed(): void {
	collapsed.value = !collapsed.value
	try {
		window.localStorage.setItem(storageKey, collapsed.value ? '1' : '0')
	} catch (error) {
		logger.debug('Could not remember the memories strip state', { error })
	}
}

function readCollapsed(): boolean {
	try {
		return window.localStorage.getItem(storageKey) === '1'
	} catch {
		return false
	}
}
</script>

<style lang="scss" scoped>
.memories-strip {
	padding-block: calc(var(--default-grid-baseline) * 2);

	&__header {
		display: flex;
		align-items: center;
		gap: var(--default-grid-baseline);
	}

	&__title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: bold;
	}

	&__list {
		display: flex;
		gap: calc(var(--default-grid-baseline) * 3);
		padding-block: calc(var(--default-grid-baseline) * 2);
		overflow-x: auto;
		scroll-snap-type: x proximity;
	}

	&__item {
		flex: 0 0 auto;
		scroll-snap-align: start;
	}

	&__card {
		position: relative;
		display: block;
		width: 200px;
		height: 150px;
		padding: 0;
		overflow: hidden;
		border: none;
		border-radius: var(--border-radius-large);
		background-color: var(--color-primary-element-light);
		cursor: pointer;
		transition: transform var(--animation-quick) ease-out, box-shadow var(--animation-quick) ease-out;

		&:hover,
		&:focus-visible {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;

			&:hover,
			&:focus-visible {
				transform: none;
			}
		}

		&__cover {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&__details {
			position: absolute;
			inset-block-end: 0;
			inset-inline: 0;
			display: flex;
			flex-direction: column;
			padding: calc(var(--default-grid-baseline) * 3);
			text-align: start;
			color: #fff;
			text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
			background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
		}

		&__title {
			font-size: 1.1rem;
			font-weight: bold;
		}
	}
}
</style>
