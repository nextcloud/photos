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
			v-if="trips.length === 0"
			class="memories__empty-content"
			:name="loading ? t('photos', 'Looking for memories…') : t('photos', 'No memories yet')"
			:description="t('photos', 'Memories gather the photos of your trips and multi-day events.')">
			<template #icon>
				<TimelapseIcon />
			</template>
		</NcEmptyContent>

		<ul v-else class="memories__list">
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
						<span>{{ n('photos', '%n photo', '%n photos', trip.photos.length) }}</span>
					</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import type { Trip } from '../services/memories.ts'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { computed, onMounted } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import TimelapseIcon from 'vue-material-design-icons/Timelapse.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { useLoadedPhotos } from '../composables/useLoadedPhotos.ts'
import { detectTrips } from '../services/memories.ts'
import { getPreviewUrl, toViewerFileInfo } from '../utils/fileUtils.ts'

defineProps<{
	rootTitle: string
}>()

const { photos, loading, loadPhotos } = useLoadedPhotos()

// The trips are refined as more photos get loaded by the other views, so they
// are built from whatever is already in the store instead of waiting a fetch.
const trips = computed<Trip[]>(() => detectTrips(photos.value))

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
</style>
