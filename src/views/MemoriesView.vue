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
						<span class="memories__trip__details__title">{{ getTripTitle(trip) ?? formatDateRange(trip) }}</span>
						<span class="memories__trip__details__meta">
							<span v-if="trip.places.length > 0">{{ formatDateRange(trip) }}</span>
							<AnimatedNumber :value="trip.photos.length">
								<template #default="{ current }">
									{{ n('photos', '%n photo', '%n photos', current) }}
								</template>
							</AnimatedNumber>
						</span>
					</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import type { Trip, YearRecap } from '../services/memories.ts'

import { n, t } from '@nextcloud/l10n'
import { getViewer } from '@nextcloud/viewer'
import { computed, onMounted } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AnimatedNumber from '../components/AnimatedNumber.vue'
import EmptyIllustration from '../components/EmptyIllustration.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import { buildYearRecap, detectTrips } from '../services/memories.ts'
import { formatDateRange as formatRange } from '../utils/dateUtils.ts'
import { getPreviewUrl } from '../utils/fileUtils.ts'

defineProps<{
	rootTitle: string
}>()

const { photos, loading, loadPhotos } = useLoadedPhotos()

// The trips are refined as more photos get loaded by the other views, so they
// are built from whatever is already in the store instead of waiting a fetch.
const trips = computed<Trip[]>(() => detectTrips(photos.value))

const yearRecap = computed<YearRecap | null>(() => buildYearRecap(photos.value))

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
 * Name a trip after the places where most of its photos were taken.
 *
 * @param trip - The trip to name
 * @return The name, `null` when none of the photos of the trip has a place
 */
function getTripTitle(trip: Trip): string | null {
	const [firstPlace, secondPlace] = trip.places

	if (firstPlace === undefined) {
		return null
	}

	if (secondPlace === undefined) {
		return firstPlace
	}

	// Rendered as text, so neither escaping nor sanitizing is needed, and both
	// would turn the "&" into an HTML entity.
	return t('photos', '{firstPlace} & {secondPlace}', { firstPlace, secondPlace }, undefined, { escape: false, sanitize: false })
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
// Text laid over the bottom of a cover. The scrim is at least 62% black behind
// the text and only fades out in the padding above it, which keeps white text
// above a 4.5:1 contrast even on a white photo.
@mixin cover-details {
	--memories-scrim-fade: calc(var(--default-grid-baseline) * 12);
	position: absolute;
	inset-block-end: 0;
	inset-inline: 0;
	display: flex;
	flex-direction: column;
	gap: var(--default-grid-baseline);
	padding: calc(var(--default-grid-baseline) * 4);
	padding-block-start: var(--memories-scrim-fade);
	text-align: start;
	color: #fff;
	background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.62) calc(100% - var(--memories-scrim-fade)), transparent);
}

// The date range and the counts, set apart from the title by their size and weight.
@mixin cover-meta {
	display: flex;
	flex-wrap: wrap;
	column-gap: calc(var(--default-grid-baseline) * 2);
	font-size: var(--font-size-small, 13px);
	font-weight: normal;
	line-height: 1.4;
	color: rgba(255, 255, 255, 0.9);

	> :not(:first-child)::before {
		content: '·';
		margin-inline-end: calc(var(--default-grid-baseline) * 2);
	}
}

.memories {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__empty-content {
		flex: 1;
	}

	// The cards are buttons: the element selector outweighs the margin the
	// server styles give to every button.
	button#{&}__recap {
		margin: calc(var(--default-grid-baseline) * 4) calc(var(--default-grid-baseline) * 4) 0;
	}

	&__recap {
		position: relative;
		flex-shrink: 0;
		height: 280px;
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
			@include cover-details;

			&__eyebrow {
				text-transform: uppercase;
				letter-spacing: 0.12em;
				font-size: 0.75rem;
				font-weight: bold;
				line-height: 1.4;
			}

			&__title {
				font-size: clamp(1.5rem, 5vw, 2rem);
				font-weight: bold;
				line-height: 1.15;
			}

			&__meta {
				@include cover-meta;
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

		button#{&}__button {
			display: block;
			width: 100%;
			height: 100%;
			margin: 0;
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
			@include cover-details;

			&__title {
				display: -webkit-box;
				overflow: hidden;
				font-size: 1.25rem;
				font-weight: bold;
				line-height: 1.25;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}

			&__meta {
				@include cover-meta;
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
