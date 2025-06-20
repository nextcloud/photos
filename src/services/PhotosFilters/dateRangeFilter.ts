/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import calendarMonthSvg from '@mdi/svg/svg/calendar-month.svg?raw'
import { t } from '@nextcloud/l10n'
import { spawnDialog } from '@nextcloud/vue/functions/dialog'
import CustomDateRangePickerDialog from '../../components/PhotosFilters/CustomDateRangePickerDialog.vue'
import DateRangeOption from '../../components/PhotosFilters/DateRangeOption.vue'

export type DateRangeValueType = { start: number, end: number }

export const dateRangeFilterId = 'date-range'

export const dateRangeFilter: PhotosFilter<DateRangeValueType> = {
	id: dateRangeFilterId,
	icon: calendarMonthSvg,
	renderOptionComponent: DateRangeOption,
	async getOptions() {
		const now = new Date()

		return [
			{
				filterId: dateRangeFilterId,
				label: t('photos', 'Last week'),
				value: {
					start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7).getTime(),
					end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1).getTime(),
				},
			},
			{
				filterId: dateRangeFilterId,
				label: t('photos', 'Last Month'),
				value: {
					start: new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(),
					end: new Date(now.getFullYear(), now.getMonth(), 0).getTime(),
				},
			},
			{
				filterId: dateRangeFilterId,
				label: t('photos', 'Custom…'),
				value: undefined,
				async getValue() {
					return new Promise((resolve) => {
						spawnDialog(CustomDateRangePickerDialog, undefined, resolve)
					})
				},
			},
		]
	},
	getQuery(dateRangeOptions: DateRangeValueType[]): string {
		// Add one day to the end date to include the whole day.
		const dav = dateRangeOptions.map((option) => `
			<d:and>
				<d:gt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${option.start / 1000}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${option.end / 1000 + 24 * 60 * 60}</d:literal>
				</d:lt>
			</d:and>`)

		return `<d:or>${dav.join('')}</d:or>`
	},
}
