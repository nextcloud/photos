<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="memories">
		<HeaderNavigation
			key="navigation"
			:loading="loadingFiles"
			path="/"
			:title="rootTitle"
			:rootTitle="rootTitle"
			@refresh="refresh" />

		<NcEmptyContent
			v-if="!loadingFiles && trips.length === 0"
			:name="t('photos', 'No memories yet')"
			:description="t('photos', 'Memories surface trips and multi-day events from your library. Take more photos and check back here.')">
			<template #icon>
				<TimelapseIcon />
			</template>
		</NcEmptyContent>

		<ul v-else class="memories__list">
			<li v-for="trip in trips" :key="trip.id" class="memories__card">
				<button
					type="button"
					class="memories__card__link"
					:aria-label="cardAriaLabel(trip)"
					@click="openTrip(trip)">
					<img
						:src="coverUrl(trip.cover)"
						alt=""
						class="memories__card__cover"
						loading="lazy"
						decoding="async">
					<div class="memories__card__overlay">
						<div class="memories__card__title">
							{{ formatTripDateRange(trip) }}
						</div>
						<div class="memories__card__meta">
							{{ n('photos', '%n photo', '%n photos', trip.photos.length) }}
						</div>
					</div>
				</button>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import type { Trip } from '../services/memories.ts'

import { translatePlural as n, translate as t } from '@nextcloud/l10n'
import moment from '@nextcloud/moment'
import { generateUrl } from '@nextcloud/router'
import { defineComponent } from 'vue'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import TimelapseIcon from 'vue-material-design-icons/Timelapse.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import FetchFilesMixin from '../mixins/FetchFilesMixin.js'
import { allMimes } from '../services/AllowedMimes.ts'
import { detectTrips } from '../services/memories.ts'
import { toViewerFileInfo } from '../utils/fileUtils.ts'

export default defineComponent({
	name: 'MemoriesView',

	components: {
		HeaderNavigation,
		NcEmptyContent,
		TimelapseIcon,
	},

	mixins: [FetchFilesMixin],

	props: {
		rootTitle: {
			type: String,
			required: true,
		},
	},

	computed: {
		files() {
			return this.$store.state.files.files
		},

		// Trip clusters built from every photo currently in the store.
		// We don't gate this view on a fresh fetch — trips refine as the
		// user scrolls the timeline, but a meaningful first answer should
		// be visible immediately.
		trips(): Trip[] {
			const allPhotos = Object.values(this.files)
			return detectTrips(allPhotos)
		},
	},

	async mounted() {
		// If nothing is loaded yet, request a generous batch so the user
		// sees memories on first visit.
		if (Object.keys(this.files).length === 0) {
			await this.fetchFiles({ mimesType: allMimes, nbResults: 500 })
		}
	},

	methods: {
		t,
		n,

		refresh() {
			this.resetFetchFilesState()
			this.fetchFiles({ mimesType: allMimes, nbResults: 500 })
		},

		coverUrl(file: { fileid: number, attributes: { etag: string } }): string {
			const etag = file.attributes.etag.replace(/&quot;/g, '')
			return generateUrl(`/apps/photos/api/v1/preview/${file.fileid}?etag=${etag}&x=512&y=512`)
		},

		openTrip(trip: Trip) {
			window.OCA.Viewer.open({
				fileInfo: toViewerFileInfo(trip.cover),
				list: trip.photos.map((photo) => toViewerFileInfo(photo)),
				onClose() { window.OCA.Files.Sidebar.close() },
			})
		},

		cardAriaLabel(trip: Trip): string {
			return t(
				'photos',
				'Trip from {start} to {end}, {count} photos',
				{
					start: moment.unix(trip.startTimestamp).format('LL'),
					end: moment.unix(trip.endTimestamp).format('LL'),
					count: trip.photos.length,
				},
			)
		},

		formatTripDateRange(trip: Trip): string {
			const start = moment.unix(trip.startTimestamp)
			const end = moment.unix(trip.endTimestamp)

			// Same day — show just one date.
			if (start.isSame(end, 'day')) {
				return start.format('LL')
			}

			// Same month and year — fold the month label.
			if (start.isSame(end, 'month')) {
				return `${start.format('D')}–${end.format('D MMMM YYYY')}`
			}

			// Same year — show two month-day labels with one year suffix.
			if (start.isSame(end, 'year')) {
				return `${start.format('D MMM')} – ${end.format('D MMM YYYY')}`
			}

			return `${start.format('D MMM YYYY')} – ${end.format('D MMM YYYY')}`
		},
	},
})
</script>

<style lang="scss" scoped>
.memories {
	padding: 16px;

	&__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
	}

	&__card {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: var(--border-radius-large);
		overflow: hidden;
		background: var(--color-primary-element-light);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
		transition: transform 200ms ease, box-shadow 200ms ease;

		&:hover, &:focus-within {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		}

		&__link {
			// Reset native button styles since we're using <button> for
			// proper keyboard / screen-reader semantics.
			display: block;
			width: 100%;
			height: 100%;
			padding: 0;
			border: none;
			background: transparent;
			color: var(--color-main-background);
			text-align: inherit;
			cursor: pointer;
			text-decoration: none;

			&:focus-visible {
				outline: 3px solid var(--color-primary-element);
				outline-offset: 2px;
			}
		}

		&__cover {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}

		&__overlay {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 16px;
			background: linear-gradient(
				to top,
				rgba(0, 0, 0, 0.65) 0%,
				rgba(0, 0, 0, 0.35) 50%,
				rgba(0, 0, 0, 0) 100%
			);
		}

		&__title {
			font-size: 1.05rem;
			font-weight: 600;
			line-height: 1.2;
			margin-bottom: 4px;
		}

		&__meta {
			font-size: 0.85rem;
			opacity: 0.85;
		}
	}
}
</style>
