<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcDialog
		:name="t('photos', 'Your {year} in numbers', { year })"
		@update:open="emit('close')">
		<div class="year-stats">
			<canvas
				ref="canvas"
				class="year-stats__card"
				role="img"
				:aria-label="description" />
			<p class="year-stats__hint" aria-live="polite">
				{{ loading
					? t('photos', 'Counting the photos of the year…')
					: t('photos', 'Computed in your browser from your photos, nothing is sent anywhere.') }}
			</p>
		</div>

		<template #actions>
			<NcButton v-if="canShare" :disabled="loading" @click="share">
				<template #icon>
					<ShareVariantOutline :size="20" />
				</template>
				{{ t('photos', 'Share') }}
			</NcButton>
			<NcButton variant="primary" :disabled="loading" @click="download">
				<template #icon>
					<DownloadOutline :size="20" />
				</template>
				{{ t('photos', 'Download image') }}
			</NcButton>
		</template>
	</NcDialog>
</template>

<script lang="ts" setup>
import type { PhotoFile } from '../store/files.ts'
import type { YearStatsCard } from '../utils/yearStatsCard.ts'

import { showError } from '@nextcloud/dialogs'
import { n, t } from '@nextcloud/l10n'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDialog from '@nextcloud/vue/components/NcDialog'
import ShareVariantOutline from 'vue-material-design-icons/ShareVariantOutline.vue'
import DownloadOutline from 'vue-material-design-icons/TrayArrowDown.vue'
import { allMimes } from '../services/AllowedMimes.ts'
import { logger } from '../services/logger.ts'
import { getPhotos } from '../services/PhotoSearch.ts'
import { buildYearStats } from '../services/yearStats.ts'
import { useFilesStore } from '../store/files.ts'
import { formatDate, formatMonth } from '../utils/dateUtils.ts'
import { drawYearStatsCard } from '../utils/yearStatsCard.ts'

const props = defineProps<{
	/** Photos loaded so far, of any year. */
	photos: PhotoFile[]
	/** Year to sum up. */
	year: number
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

/** Number of photos fetched per request while loading the year. */
const BATCH_SIZE = 500

const filesStore = useFilesStore()
const abortController = new AbortController()
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const loading = ref(true)

const stats = computed(() => buildYearStats(props.photos, props.year))

const card = computed<YearStatsCard>(() => {
	const { photoCount, videoCount, dayCount, placeCount, busiestMonth, busiestDay, topPlaces } = stats.value

	return {
		eyebrow: t('photos', 'Your year in numbers'),
		title: String(props.year),
		tiles: [
			{ count: photoCount, label: n('photos', 'photo taken', 'photos taken', photoCount) },
			{ count: videoCount, label: n('photos', 'video recorded', 'videos recorded', videoCount) },
			{ count: dayCount, label: n('photos', 'day with photos', 'days with photos', dayCount) },
			{ count: placeCount, label: n('photos', 'place visited', 'places visited', placeCount) },
		]
			.filter(({ count }) => count > 0)
			.map(({ count, label }) => ({ value: count.toLocaleString(), label })),
		facts: [
			...(busiestMonth === null
				? []
				: [{ label: t('photos', 'Busiest month'), value: `${formatMonth(busiestMonth.month)} · ${n('photos', '%n photo', '%n photos', busiestMonth.count)}` }]),
			...(busiestDay === null
				? []
				: [{ label: t('photos', 'Busiest day'), value: `${formatDate(busiestDay.date)} · ${n('photos', '%n photo', '%n photos', busiestDay.count)}` }]),
			...(topPlaces.length === 0
				? []
				: [{ label: t('photos', 'Top places'), value: topPlaces.map(({ name }) => name).join(' · ') }]),
		],
	}
})

// The card is an image, so its texts are given to screen readers as a label.
const description = computed<string>(() => [
	`${card.value.eyebrow}: ${card.value.title}`,
	...card.value.tiles.map(({ value, label }) => `${value} ${label}`),
	...card.value.facts.map(({ label, value }) => `${label}: ${value}`),
].join('. '))

const fileName = computed(() => `photos-${props.year}.png`)

const canShare = typeof navigator.canShare === 'function'
	&& navigator.canShare({ files: [new File([], 'card.png', { type: 'image/png' })] })

watch(card, draw)

onMounted(async () => {
	draw()
	await loadYear()
})

onUnmounted(() => abortController.abort())

function draw(): void {
	if (canvas.value === null) {
		return
	}

	const style = getComputedStyle(document.body)
	drawYearStatsCard(canvas.value, card.value, {
		color: style.getPropertyValue('--color-primary-element') || '#00679e',
		fontFamily: style.fontFamily,
	})
}

/**
 * Load every photo of the year, so the numbers do not depend on how far the
 * other views were scrolled.
 */
async function loadYear(): Promise<void> {
	const start = new Date(props.year, 0, 1).getTime() / 1000
	const end = new Date(props.year + 1, 0, 1).getTime() / 1000
	const extraFilters = `
		<d:gte><d:prop><nc:metadata-photos-original_date_time/></d:prop><d:literal>${start}</d:literal></d:gte>
		<d:lt><d:prop><nc:metadata-photos-original_date_time/></d:prop><d:literal>${end}</d:literal></d:lt>`

	try {
		for (let firstResult = 0; ; firstResult += BATCH_SIZE) {
			const files = await getPhotos({
				mimesType: allMimes,
				firstResult,
				nbResults: BATCH_SIZE,
				extraFilters,
				signal: abortController.signal,
			})
			filesStore.appendFiles(files)

			if (files.length < BATCH_SIZE) {
				break
			}
		}
	} catch (error) {
		if (abortController.signal.aborted) {
			return
		}

		logger.error('Error fetching the photos of a year', { error })
		showError(t('photos', 'Error fetching files'))
	} finally {
		loading.value = false
	}
}

function toBlob(): Promise<Blob | null> {
	return new Promise((resolve) => canvas.value?.toBlob(resolve, 'image/png'))
}

async function download(): Promise<void> {
	const blob = await toBlob()
	if (blob === null) {
		return
	}

	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = fileName.value
	link.click()
	URL.revokeObjectURL(link.href)
}

async function share(): Promise<void> {
	const blob = await toBlob()
	if (blob === null) {
		return
	}

	try {
		await navigator.share({
			title: t('photos', 'Your {year} in numbers', { year: props.year }),
			files: [new File([blob], fileName.value, { type: 'image/png' })],
		})
	} catch (error) {
		// Closing the share sheet is not an error.
		if (!(error instanceof DOMException && error.name === 'AbortError')) {
			logger.error('Error sharing the numbers of a year', { error })
			showError(t('photos', 'Could not share the image'))
		}
	}
}
</script>

<style lang="scss" scoped>
.year-stats {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: calc(var(--default-grid-baseline) * 2);
	padding-block-end: calc(var(--default-grid-baseline) * 2);

	&__card {
		max-width: 100%;
		max-height: 60vh;
		border-radius: var(--border-radius-large);
	}

	&__hint {
		color: var(--color-text-maxcontrast);
		text-align: center;
	}
}
</style>
