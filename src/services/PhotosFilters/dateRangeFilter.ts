/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import DateRangeFilterDisplay from '../../components/PhotosFilters/DateRangeFilterDisplay.vue'
import DateRangeFilterInput from '../../components/PhotosFilters/DateRangeFilterInput.vue'

export type DateRangeValueType = { start: number, end: number } | undefined

export const dateRangeFilterId = 'date-range'

export const dateRangeFilter: PhotosFilter = {
	id: dateRangeFilterId,
	inputComponent: DateRangeFilterInput,
	displayComponent: DateRangeFilterDisplay,
	getQuery(dateRange: DateRangeValueType): string {
		if (dateRange === undefined) {
			return ''
		}

		// Add one day to the end date to include the whole day.
		return `
			<d:and>
				<d:gt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${dateRange.start / 1000}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${dateRange.end / 1000 + 24 * 60 * 60}</d:literal>
				</d:lt>
			</d:and>`
	},
}
