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
			:rootTitle="rootTitle"
			@refresh="loadPhotos" />

		<NcEmptyContent
			v-if="trips.length === 0 && yearRecap === null && thenAndNowPairs.length === 0"
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
			@click="startRecap">
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

		<section v-if="thenAndNowPairs.length > 0" class="memories__then-and-now" :aria-labelledby="thenAndNowTitleId">
			<h2 :id="thenAndNowTitleId" class="memories__then-and-now__title">
				{{ t('photos', 'Then and now') }}
			</h2>
			<ul class="memories__list">
				<li v-for="pair in thenAndNowPairs" :key="pair.id" class="memories__pair">
					<button
						type="button"
						class="memories__pair__button"
						@click="openPair(pair)">
						<span class="memories__pair__photos">
							<span v-for="photo in [pair.then, pair.now]" :key="photo.fileid" class="memories__pair__photo">
								<img
									class="memories__pair__photo__image"
									:src="getPreviewUrl(photo, 512)"
									alt=""
									loading="lazy"
									decoding="async">
								<span class="memories__pair__photo__date">{{ formatDate(new Date(photo.attributes.timestamp * 1000)) }}</span>
							</span>
						</span>
						<span class="memories__pair__place">{{ pair.place }}</span>
					</button>
				</li>
			</ul>
		</section>

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
	</div>
</template>

<script lang="ts" setup>
import type { ThenAndNow, Trip, YearRecap } from '../services/memories.ts'

import { n, t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { computed, onMounted, useId } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AnimatedNumber from '../components/AnimatedNumber.vue'
import EmptyIllustration from '../components/EmptyIllustration.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import { buildThenAndNow, buildYearRecap, detectTrips } from '../services/memories.ts'
import { formatDate, formatDateRange as formatRange } from '../utils/dateUtils.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'

defineProps<{
	rootTitle: string
}>()

const { photos, loading, loadPhotos } = useLoadedPhotos()

// The trips are refined as more photos get loaded by the other views, so they
// are built from whatever is already in the store instead of waiting a fetch.
const trips = computed<Trip[]>(() => detectTrips(photos.value))

const yearRecap = computed<YearRecap | null>(() => buildYearRecap(photos.value))

const thenAndNowPairs = computed<ThenAndNow[]>(() => buildThenAndNow(photos.value))

const thenAndNowTitleId = useId()

const recapAriaLabel = computed<string>(() => yearRecap.value === null
	? ''
	: t('photos', 'Play a slideshow of your {year} highlights', { year: yearRecap.value.year }))

onMounted(() => {
	if (photos.value.length === 0) {
		loadPhotos()
	}
})

function startRecap(): void {
	if (yearRecap.value === null) {
		return
	}

	getViewer().open(yearRecap.value.highlights, yearRecap.value.highlights[0], { startSlideshow: true })
}

/**
 * @param trip - The trip to open in the viewer
 */
function openTrip(trip: Trip): void {
	getViewer().open(trip.photos, trip.cover)
}

/**
 * @param pair - The pair of photos to open in the viewer
 */
function openPair(pair: ThenAndNow): void {
	getViewer().open([pair.then, pair.now], pair.then)
}

/**
 * Format the period covered by a trip, leaving out the parts shared by both
 * ends of the range.
 *
 * @param trip - The trip to format the date range of
 */
function formatDateRange(trip: Trip): string {
	return formatRange(new Date(trip.startTimestamp * 1000), new Date(trip.endTimestamp * 1000))
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

	&__then-and-now {
		flex-shrink: 0;

		&__title {
			margin: calc(var(--default-grid-baseline) * 4) calc(var(--default-grid-baseline) * 4) 0;
			font-size: 1.25rem;
			font-weight: bold;
		}
	}

	&__pair {
		overflow: hidden;
		border-radius: var(--border-radius-large);
		background-color: var(--color-background-dark);

		&__button {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			border: none;
			border-radius: 0;
			background-color: transparent;
			color: var(--color-main-text);
			cursor: pointer;

			&:hover,
			&:focus-visible {
				background-color: var(--color-background-hover);
			}

			&:focus-visible {
				outline: 2px solid var(--color-main-text);
				outline-offset: -2px;
			}
		}

		&__photos {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2px;
			width: 100%;
		}

		&__photo {
			position: relative;
			aspect-ratio: 3 / 4;
			background-color: var(--color-primary-element-light);

			&__image {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			&__date {
				position: absolute;
				inset-block-end: 0;
				inset-inline: 0;
				padding: calc(var(--default-grid-baseline) * 6) calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 2);
				text-align: start;
				color: #fff;
				background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
			}
		}

		&__place {
			padding: calc(var(--default-grid-baseline) * 2) calc(var(--default-grid-baseline) * 3);
			text-align: start;
			font-weight: bold;
		}
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
