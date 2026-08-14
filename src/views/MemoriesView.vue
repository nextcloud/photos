<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="memories">
		<HeaderNavigation
			key="navigation"
			:loading="loading"
			path="/"
			:title="rootTitle"
			:root-title="rootTitle"
			@refresh="loadPhotos" />

		<NcEmptyContent
			v-if="trips.length === 0 && yearRecap === null"
			class="memories__empty-content empty-content-with-illustration"
			:name="loading ? t('photos', 'Looking for memories…') : t('photos', 'No memories yet')"
			:description="t('photos', 'Memories gather the photos of your trips and multi-day events.')">
			<template #icon>
				<EmptyIllustration variant="memories" />
			</template>
		</NcEmptyContent>

		<button
			v-if="yearRecap !== null"
			type="button"
			class="memories__recap"
			:aria-label="recapAriaLabel"
			@click="recapOpen = true">
			<img
				class="memories__recap__cover"
				:src="getPreviewUrl(yearRecap.cover, 1024)"
				alt=""
				decoding="async">
			<span class="memories__recap__details">
				<span class="memories__recap__details__eyebrow">{{ t('photos', 'Year in review') }}</span>
				<span class="memories__recap__details__title">{{ t('photos', 'Your {year} in photos', { year: yearRecap.year }) }}</span>
				<span class="memories__recap__details__meta">
					<AnimatedNumber :value="yearRecap.highlights.length">
						<template #default="{ current }">
							{{ n('photos', '%n highlight', '%n highlights', current) }}
						</template>
					</AnimatedNumber>
					·
					<AnimatedNumber :value="yearRecap.totalCount">
						<template #default="{ current }">
							{{ n('photos', '%n photo this year', '%n photos this year', current) }}
						</template>
					</AnimatedNumber>
				</span>
			</span>
		</button>

		<ul v-if="trips.length > 0" class="memories__list">
			<li v-for="trip in trips" :key="trip.id" class="memories__trip">
				<button
					type="button"
					class="memories__trip__button"
					@click="openTrip(trip)">
					<img
						class="memories__trip__cover"
						:src="getPreviewUrl(trip.cover, 512)"
						alt=""
						loading="lazy"
						decoding="async">
					<span class="memories__trip__details">
						<span class="memories__trip__details__title">{{ formatDateRange(trip) }}</span>
						<AnimatedNumber :value="trip.photos.length">
							<template #default="{ current }">
								{{ n('photos', '%n photo', '%n photos', current) }}
							</template>
						</AnimatedNumber>
					</span>
				</button>
			</li>
		</ul>

		<PhotoSlideshow
			v-if="recapOpen && yearRecap !== null"
			:photos="yearRecap.highlights"
			@close="recapOpen = false" />
	</div>
</template>

<script lang="ts" setup>
import type { Trip, YearRecap } from '../services/memories.ts'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { computed, onMounted, ref } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AnimatedNumber from '../components/AnimatedNumber.vue'
import EmptyIllustration from '../components/EmptyIllustration.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import PhotoSlideshow from '../components/PhotoSlideshow.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import { buildYearRecap, detectTrips } from '../services/memories.ts'
import { getPreviewUrl, toViewerFileInfo } from '../utils/fileUtils.ts'

defineProps<{
	rootTitle: string
}>()

const { photos, loading, loadPhotos } = useLoadedPhotos()

// The trips are refined as more photos get loaded by the other views, so they
// are built from whatever is already in the store instead of waiting a fetch.
const trips = computed<Trip[]>(() => detectTrips(photos.value))

const yearRecap = computed<YearRecap | null>(() => buildYearRecap(photos.value))

const recapOpen = ref(false)

const recapAriaLabel = computed<string>(() => yearRecap.value === null
	? ''
	: t('photos', 'Play a slideshow of your {year} highlights', { year: yearRecap.value.year }))

onMounted(() => {
	if (photos.value.length === 0) {
		loadPhotos()
	}
})

/**
 * @param trip - The trip to open in the viewer
 */
function openTrip(trip: Trip): void {
	window.OCA.Viewer.open({
		fileInfo: toViewerFileInfo(trip.cover),
		list: trip.photos.map((photo) => toViewerFileInfo(photo)),
	})
}

/**
 * Format the period covered by a trip, leaving out the parts shared by both
 * ends of the range.
 *
 * @param trip - The trip to format the date range of
 */
function formatDateRange(trip: Trip): string {
	const start = moment.unix(trip.startTimestamp)
	const end = moment.unix(trip.endTimestamp)

	if (start.isSame(end, 'day')) {
		return start.format('LL')
	}

	if (start.isSame(end, 'month')) {
		return `${start.format('D')} – ${end.format('LL')}`
	}

	if (start.isSame(end, 'year')) {
		return `${start.format('D MMM')} – ${end.format('LL')}`
	}

	return `${start.format('LL')} – ${end.format('LL')}`
}
</script>

<style lang="scss" scoped>
.memories {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__empty-content {
		flex: 1;
	}

	&__recap {
		position: relative;
		flex-shrink: 0;
		height: 280px;
		margin: calc(var(--default-grid-baseline) * 4) calc(var(--default-grid-baseline) * 4) 0;
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
			padding: calc(var(--default-grid-baseline) * 6);
			text-align: start;
			color: #fff;
			text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
			background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);

			&__eyebrow {
				text-transform: uppercase;
				letter-spacing: 0.12em;
				font-size: 0.75rem;
				font-weight: bold;
				opacity: 0.85;
			}

			&__title {
				margin-block: 6px;
				font-size: 2rem;
				font-weight: bold;
				line-height: 1.1;
			}
		}
	}

	&__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: calc(var(--default-grid-baseline) * 4);
		padding: calc(var(--default-grid-baseline) * 4);
	}

	&__trip {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: var(--border-radius-large);
		background-color: var(--color-primary-element-light);

		&__button {
			width: 100%;
			height: 100%;
			padding: 0;
			border: none;
			border-radius: 0;
			background-color: transparent;
			cursor: pointer;
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
			padding: calc(var(--default-grid-baseline) * 4);
			text-align: start;
			color: #fff;
			background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);

			&__title {
				font-weight: bold;
			}
		}
	}
}

// The illustration stands in for the icon, so it must not be held to the icon size.
.empty-content-with-illustration :deep(.empty-content__icon) {
	width: 220px;
	height: auto;
	opacity: 1;

	svg {
		width: 100% !important;
		height: auto !important;
		max-width: none !important;
		max-height: none !important;
	}
}
</style>
