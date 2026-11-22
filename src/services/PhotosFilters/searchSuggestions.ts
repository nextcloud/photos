/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { RouteLocationRaw } from 'vue-router'
import type { Album } from '../../store/albums.ts'
import type { DateRangeValueType } from './dateRangeFilter.ts'
import type { FilterOption } from './PhotosFilter.ts'

import imageMultipleOutlineSvg from '@mdi/svg/svg/image-multiple-outline.svg?raw'
import { getCanonicalLocale, getMonthNames, t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { dateRangeFilter, dateRangeFilterId } from './dateRangeFilter.ts'
import { nameFilter, nameFilterId } from './nameFilter.ts'
import { placesFilter, placesFilterId } from './placesFilter.ts'
import { tagsFilter, tagsFilterId } from './tagsFilter.ts'

/** Picking a suggestion either adds a filter value or opens a route. */
export type SearchSuggestion = {
	id: string
	label: string
	imgSrc?: string
	filterOption?: FilterOption<unknown>
	to?: RouteLocationRaw
}

export type SearchSuggestionGroup = {
	id: string
	label: string
	icon: string
	suggestions: SearchSuggestion[]
}

const maxSuggestionsPerGroup = 6

/**
 * Lower case the text and strip its diacritics, so that "zurich" matches "Zürich".
 *
 * @param text - Text to normalize
 */
function normalize(text: string): string {
	return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()
}

/**
 * Keep the items whose label contains the search term, the ones starting with it first.
 *
 * @param items - Items to filter
 * @param searchTerm - Normalized search term
 * @param getLabel - Label of an item
 */
function filterByLabel<T>(items: T[], searchTerm: string, getLabel: (item: T) => string): T[] {
	return items
		.map((item) => ({ item, index: normalize(getLabel(item)).indexOf(searchTerm) }))
		.filter(({ index }) => index !== -1)
		.sort((a, b) => Number(a.index !== 0) - Number(b.index !== 0))
		.map(({ item }) => item)
}

/**
 * @param start - First day of the range
 * @param end - Last day of the range
 */
function dateRange(start: Date, end: Date): DateRangeValueType {
	return { start: start.getTime(), end: end.getTime() }
}

/**
 * Date ranges for the years and month names typed, like "2023", "June" or "jun 2023".
 * A month without a year is suggested for the last three years it already started in.
 *
 * @param searchTerm - Normalized search term
 * @param now - Current date
 */
function getTypedDateOptions(searchTerm: string, now: Date): FilterOption<DateRangeValueType>[] {
	const words = searchTerm.split(/\s+/)
	const year = words.filter((word) => /^\d{4}$/.test(word))
		.map(Number)
		.find((year) => year >= 1900 && year <= now.getFullYear())
	const monthNames = getMonthNames().map(normalize)
	const month = monthNames.findIndex((monthName) => words.some((word) => word.length >= 3 && monthName.startsWith(word)))

	if (month === -1) {
		return year === undefined
			? []
			: [{ filterId: dateRangeFilterId, label: String(year), value: dateRange(new Date(year, 0, 1), new Date(year, 11, 31)) }]
	}

	const lastYear = month <= now.getMonth() ? now.getFullYear() : now.getFullYear() - 1
	const years = year === undefined ? [lastYear, lastYear - 1, lastYear - 2] : [year]

	return years.map((year) => ({
		filterId: dateRangeFilterId,
		label: new Date(year, month).toLocaleDateString(getCanonicalLocale(), { month: 'long', year: 'numeric' }),
		value: dateRange(new Date(year, month, 1), new Date(year, month + 1, 0)),
	}))
}

/**
 * Build the suggestions of the search field, grouped by kind.
 * Filter values that are already selected are not suggested again, empty groups are left out.
 *
 * @param query - Text typed in the search field
 * @param filterOptions - Options of all the filters
 * @param albums - Albums of the user
 * @param selectedFilters - Selected values per filter id
 * @param now - Current date, the reference for the typed months
 */
export function buildSearchSuggestions(
	query: string,
	filterOptions: FilterOption<unknown>[],
	albums: Album[],
	selectedFilters: Record<string, unknown[]>,
	now: Date = new Date(),
): SearchSuggestionGroup[] {
	const typed = query.trim()
	const searchTerm = normalize(typed)

	const isSelected = (option: FilterOption<unknown>) => option.value !== undefined
		&& (selectedFilters[option.filterId] ?? []).some((value) => JSON.stringify(value) === JSON.stringify(option.value))

	const optionsOf = (filterId: string) => filterByLabel(
		filterOptions.filter((option) => option.filterId === filterId && !isSelected(option)),
		searchTerm,
		(option) => option.label,
	)

	const fromOptions = (options: FilterOption<unknown>[]) => options.map((option) => ({ label: option.label, imgSrc: option.imgSrc, filterOption: option }))

	const groups: (Omit<SearchSuggestionGroup, 'suggestions'> & { suggestions: Omit<SearchSuggestion, 'id'>[] })[] = [
		{
			id: placesFilterId,
			label: t('photos', 'Places'),
			icon: placesFilter.icon,
			suggestions: fromOptions(optionsOf(placesFilterId)),
		},
		{
			id: tagsFilterId,
			label: t('photos', 'Tags'),
			icon: tagsFilter.icon,
			suggestions: fromOptions(optionsOf(tagsFilterId)),
		},
		{
			id: dateRangeFilterId,
			label: t('photos', 'Dates'),
			icon: dateRangeFilter.icon,
			suggestions: fromOptions([
				...getTypedDateOptions(searchTerm, now).filter((option) => !isSelected(option)),
				...optionsOf(dateRangeFilterId),
			]),
		},
		{
			id: 'albums',
			label: t('photos', 'Albums'),
			icon: imageMultipleOutlineSvg,
			suggestions: typed === ''
				? []
				: filterByLabel(albums, searchTerm, (album) => album.basename).map((album) => ({
						label: album.basename,
						imgSrc: album.attributes['last-photo'] > 0
							? generateUrl(`/apps/photos/api/v1/preview/${album.attributes['last-photo']}?x=${64}&y=${64}`)
							: undefined,
						to: { name: 'albumsContent', params: { albumName: album.basename } },
					})),
		},
		{
			id: nameFilterId,
			label: t('photos', 'File names'),
			icon: nameFilter.icon,
			suggestions: fromOptions([getNameOption(typed)].filter((option) => option.value !== '' && !isSelected(option))),
		},
	]

	return groups
		.filter((group) => group.suggestions.length > 0)
		.map((group) => ({
			...group,
			suggestions: group.suggestions
				.slice(0, maxSuggestionsPerGroup)
				.map((suggestion, index) => ({ ...suggestion, id: `${group.id}-${index}` })),
		}))
}

/**
 * Option of the file name filter for a typed text.
 *
 * @param query - Text typed in the search field
 */
export function getNameOption(query: string): FilterOption<string> {
	const value = query.trim()

	return {
		filterId: nameFilterId,
		label: t('photos', 'Search file names for "{query}"', { query: value }, undefined, { escape: false, sanitize: false }),
		value,
	}
}
