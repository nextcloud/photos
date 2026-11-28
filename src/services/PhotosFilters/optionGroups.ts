/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FilterOption, PhotosFilter } from './PhotosFilter.ts'

/** Entry of the options list naming the filter the options below it belong to. */
export type FilterOptionsHeading = {
	heading: true
	filterId: string
	label: string
}

export type FilterOptionsEntry = FilterOption<unknown> | FilterOptionsHeading

/**
 * @param entry - Entry of the options list
 */
export function isHeading(entry: FilterOptionsEntry): entry is FilterOptionsHeading {
	return 'heading' in entry
}

/**
 * List the options filter by filter, in the order of the filters, each group
 * below a heading. Filters without options are left out.
 *
 * @param filters - The filters to list the options of
 * @param optionsByFilter - The options of each filter, by filter id
 */
export function groupFilterOptions(filters: Pick<PhotosFilter<unknown>, 'id' | 'label'>[], optionsByFilter: Record<string, FilterOption<unknown>[]>): FilterOptionsEntry[] {
	return filters.flatMap((filter) => {
		const options = optionsByFilter[filter.id] ?? []
		if (options.length === 0) {
			return []
		}

		return [{ heading: true, filterId: filter.id, label: filter.label ?? '' }, ...options]
	})
}

/**
 * Narrow a grouped options list down to the options matching a search,
 * keeping the headings of the groups that still have some.
 *
 * @param entries - The grouped options
 * @param search - Text typed by the user
 */
export function searchFilterOptions(entries: FilterOptionsEntry[], search: string): FilterOptionsEntry[] {
	const term = search.trim().toLocaleLowerCase()
	const matching = entries.filter((entry) => isHeading(entry) || entry.label.toLocaleLowerCase().includes(term))

	return matching.filter((entry, index) => {
		const next = matching[index + 1]
		return !isHeading(entry) || (next !== undefined && !isHeading(next))
	})
}
