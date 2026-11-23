<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="calendar">
		<HeaderNavigation
			key="navigation"
			:loading="loading"
			path="/"
			:title="rootTitle"
			:rootTitle="rootTitle"
			@refresh="loadDays" />

		<NcEmptyContent
			v-if="years.length === 0"
			class="calendar__empty-content"
			:name="emptyContentName">
			<template #icon>
				<AlertCircleOutline v-if="failed" />
				<CalendarMonthOutline v-else />
			</template>
		</NcEmptyContent>

		<div v-else class="calendar__content" @keydown="onKeydown">
			<p class="calendar__legend">
				{{ t('photos', 'Fewer photos') }}
				<span
					v-for="level in HEATMAP_LEVELS + 1"
					:key="level"
					class="calendar__swatch"
					:data-level="level - 1"
					aria-hidden="true" />
				{{ t('photos', 'More photos') }}
			</p>

			<section
				v-for="year in years"
				:key="year.year"
				class="calendar__year"
				:aria-labelledby="`calendar-year-${year.year}`">
				<h2 :id="`calendar-year-${year.year}`" class="calendar__year__title">
					{{ year.year }}
					<span class="calendar__year__total">{{ n('photos', '%n photo', '%n photos', year.total) }}</span>
				</h2>
				<div class="calendar__year__scroller">
					<table class="calendar__grid" role="grid" :aria-labelledby="`calendar-year-${year.year}`">
						<thead>
							<tr>
								<td />
								<th
									v-for="{ month, span } in year.months"
									:key="month"
									class="calendar__month"
									scope="col"
									:colspan="span">
									{{ monthNames[month] }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(row, rowIndex) in year.rows" :key="rowIndex">
								<th class="calendar__weekday" scope="row">
									<span aria-hidden="true">{{ weekdays[rowIndex].short }}</span>
									<span class="hidden-visually">{{ weekdays[rowIndex].long }}</span>
								</th>
								<td v-for="(cell, week) in row" :key="week">
									<button
										v-if="cell !== null"
										type="button"
										class="calendar__day"
										:data-day="cell.day"
										:data-level="cell.level"
										:tabindex="cell.day === activeDay ? 0 : -1"
										:aria-disabled="cell.count === 0"
										:aria-label="dayLabel(cell)"
										:title="dayLabel(cell)"
										@focus="activeDay = cell.day"
										@click="openDay(cell)" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { DayCount, HeatmapDay, HeatmapYear } from '../utils/calendarHeatmap.ts'

import axios from '@nextcloud/axios'
import { getCanonicalLocale, getDayNames, getDayNamesMin, getFirstDay, getMonthNamesShort, isRTL, n, t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'
import CalendarMonthOutline from 'vue-material-design-icons/CalendarMonthOutline.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import { logger } from '../services/logger.ts'
import { dateRangeFilterId } from '../services/PhotosFilters/dateRangeFilter.ts'
import { useFilterStore } from '../store/filters.ts'
import { buildHeatmap, dayToTimestamp, HEATMAP_LEVELS, shiftDay } from '../utils/calendarHeatmap.ts'

defineProps<{
	rootTitle: string
}>()

const router = useRouter()
const filtersStore = useFilterStore()

const days = ref<DayCount[]>([])
const loading = ref(false)
const failed = ref(false)
// The one day of the grids that is in the tab order, the others are reached
// with the arrow keys.
const activeDay = ref('')

const firstDay = getFirstDay()
const monthNames = getMonthNamesShort()
const weekdays = Array.from({ length: 7 }, (_, row) => ({
	short: getDayNamesMin()[(firstDay + row) % 7],
	long: getDayNames()[(firstDay + row) % 7],
}))
// The days of the API are UTC days.
const dateFormatter = new Intl.DateTimeFormat(getCanonicalLocale(), { dateStyle: 'long', timeZone: 'UTC' })

const years = computed<HeatmapYear[]>(() => buildHeatmap(days.value, firstDay))

const emptyContentName = computed<string>(() => {
	if (failed.value) {
		return t('photos', 'An error occurred')
	}
	return loading.value ? t('photos', 'Loading your calendar…') : t('photos', 'No photos or videos in here')
})

onMounted(loadDays)

/**
 * Fetch the number of photos per day.
 */
async function loadDays(): Promise<void> {
	loading.value = true
	failed.value = false
	try {
		const response = await axios.get(generateOcsUrl('apps/photos/api/v1/timeline/days'))
		days.value = response.data.ocs.data
		if (!days.value.some(({ day }) => day === activeDay.value)) {
			// The newest day with photos.
			activeDay.value = days.value.reduce((newest, { day }) => day > newest ? day : newest, '')
		}
	} catch (error) {
		failed.value = true
		logger.error('Failed to fetch the photo count per day', { error })
	} finally {
		loading.value = false
	}
}

/**
 * @param cell - The day to describe, like *14 June 2024: 23 photos*
 */
function dayLabel(cell: HeatmapDay): string {
	const date = dateFormatter.format(dayToTimestamp(cell.day))
	return cell.count === 0
		? t('photos', '{date}: no photos', { date })
		: n('photos', '{date}: %n photo', '{date}: %n photos', cell.count, { date })
}

/**
 * Open the timeline filtered to a day.
 *
 * @param cell - The day to open
 */
function openDay(cell: HeatmapDay): void {
	if (cell.count === 0) {
		return
	}
	const timestamp = dayToTimestamp(cell.day)
	filtersStore.selectedFilters[dateRangeFilterId] = [{ start: timestamp, end: timestamp }]
	router.push({ name: 'all_media' })
}

/**
 * Move the focus to another day, if it is part of a grid.
 *
 * @param day - The day to focus, as `YYYY-MM-DD`
 */
async function focusDay(day: string): Promise<void> {
	const target = document.querySelector<HTMLElement>(`.calendar__day[data-day="${day}"]`)
	if (target === null) {
		return
	}
	activeDay.value = day
	await nextTick()
	target.focus()
	target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

/**
 * Move between the days with the arrow keys, and between the years with the
 * page keys.
 *
 * @param event - The key press
 */
function onKeydown(event: KeyboardEvent): void {
	const day = (event.target as HTMLElement).dataset?.day
	if (day === undefined) {
		return
	}

	const week = isRTL() ? -7 : 7
	const yearIndex = years.value.findIndex(({ year }) => year === Number(day.slice(0, 4)))
	// The years are listed newest first.
	const otherYear = (step: number) => {
		const year = years.value[yearIndex + step]?.year
		return year === undefined ? day : `${year}${day.slice(4)}`
	}
	const targets: Record<string, () => string> = {
		ArrowUp: () => shiftDay(day, -1),
		ArrowDown: () => shiftDay(day, 1),
		ArrowLeft: () => shiftDay(day, -week),
		ArrowRight: () => shiftDay(day, week),
		PageUp: () => otherYear(-1),
		PageDown: () => otherYear(1),
	}

	const target = targets[event.key]?.()
	if (target !== undefined) {
		event.preventDefault()
		focusDay(target)
	}
}
</script>

<style lang="scss" scoped>
.calendar {
	--calendar-cell-size: 14px;
	display: flex;
	flex-direction: column;
	height: 100%;

	@media (pointer: coarse) {
		--calendar-cell-size: 24px;
	}

	&__empty-content {
		flex: 1;
	}

	&__content {
		padding: 0 calc(var(--default-grid-baseline) * 4) calc(var(--default-grid-baseline) * 4);
	}

	&__legend {
		display: flex;
		align-items: center;
		gap: var(--default-grid-baseline);
		color: var(--color-text-maxcontrast);
	}

	&__year {
		margin-block-start: calc(var(--default-grid-baseline) * 6);

		&__title {
			margin: 0 0 var(--default-grid-baseline);
			font-size: 1.25rem;
		}

		&__total {
			margin-inline-start: var(--default-grid-baseline);
			font-size: var(--default-font-size);
			font-weight: normal;
			color: var(--color-text-maxcontrast);
		}

		&__scroller {
			overflow-x: auto;
			// Room for the focus outline of the outer days.
			padding-block: var(--default-grid-baseline);
			padding-inline-end: var(--default-grid-baseline);
		}
	}

	&__grid {
		border-collapse: separate;
		border-spacing: 3px;

		td {
			padding: 0;
		}
	}

	&__month,
	&__weekday {
		padding: 0;
		font-size: 0.75rem;
		font-weight: normal;
		line-height: var(--calendar-cell-size);
		text-align: start;
		color: var(--color-text-maxcontrast);
	}

	&__weekday {
		position: sticky;
		inset-inline-start: 0;
		padding-inline-end: var(--default-grid-baseline);
		background-color: var(--color-main-background);
		// Covers the cell spacing before the label while the days scroll under it.
		box-shadow: -3px 0 var(--color-main-background), 3px 0 var(--color-main-background);
	}

	&__day,
	&__swatch {
		display: block;
		box-sizing: border-box;
		width: var(--calendar-cell-size);
		height: var(--calendar-cell-size);
		border: 1px solid var(--color-border-dark);
		border-radius: 3px;
		background-color: var(--color-background-dark);

		@for $level from 1 through 4 {
			&[data-level='#{$level}'] {
				border-color: transparent;
				background-color: color-mix(in srgb, var(--color-primary-element) #{10% + $level * 22.5%}, var(--color-main-background));
			}
		}
	}

	&__swatch {
		width: 14px;
		height: 14px;
	}

	&__day {
		min-height: 0;
		margin: 0;
		padding: 0;
		cursor: pointer;

		&[aria-disabled='true'] {
			cursor: default;
		}

		&:hover,
		&:focus-visible {
			outline: 2px solid var(--color-main-text);
			outline-offset: 1px;
			box-shadow: none;
		}
	}
}
</style>
