/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from '../../store/albums.ts'
import type { FilterOption } from './PhotosFilter.ts'

import { describe, expect, test, vi } from 'vitest'
import { buildSearchSuggestions, getNameOption } from './searchSuggestions.ts'

vi.mock('@nextcloud/dialogs', () => ({ showError: vi.fn() }))
vi.mock('@nextcloud/vue/functions/dialog', () => ({ spawnDialog: vi.fn() }))
vi.mock('../../components/PhotosFilters/CustomDateRangePickerDialog.vue', () => ({ default: {} }))
vi.mock('../../components/PhotosFilters/DateRangeOption.vue', () => ({ default: {} }))
vi.mock('../../components/PhotosFilters/NameOption.vue', () => ({ default: {} }))
vi.mock('../../components/PhotosFilters/PlaceOption.vue', () => ({ default: {} }))
vi.mock('../../components/PhotosFilters/TagOption.vue', () => ({ default: {} }))

const now = new Date(2026, 10, 22)

const filterOptions: FilterOption<unknown>[] = [
	{ filterId: 'places', label: 'Lisbon', value: 'Lisbon', imgSrc: '/preview/lisbon' },
	{ filterId: 'places', label: 'Zürich', value: 'Zürich' },
	{ filterId: 'places', label: 'Porto', value: 'Porto' },
	{ filterId: 'tags', label: 'beach', value: 'beach' },
	{ filterId: 'tags', label: 'sunset beach', value: 'sunset beach' },
	{ filterId: 'tags', label: 'dog', value: 'dog' },
	{ filterId: 'date-range', label: 'Last week', value: { start: 1, end: 2 } },
	{ filterId: 'date-range', label: 'Custom…', value: undefined },
]

/**
 * @param basename - Name of the album
 * @param lastPhoto - File id of the cover
 */
function album(basename: string, lastPhoto = -1): Album {
	return { basename, attributes: { 'last-photo': lastPhoto } } as unknown as Album
}

const albums = [album('Lisbon 2025', 42), album('Paris')]

const noSelection = { name: [], places: [], tags: [], 'date-range': [] }

/**
 * Labels of the suggestions per group id.
 *
 * @param query - Text typed in the search field
 * @param selectedFilters - Selected values per filter id
 */
function labels(query: string, selectedFilters: Record<string, unknown[]> = noSelection): Record<string, string[]> {
	return Object.fromEntries(buildSearchSuggestions(query, filterOptions, albums, selectedFilters, now)
		.map((group) => [group.id, group.suggestions.map((suggestion) => suggestion.label)]))
}

describe('buildSearchSuggestions', () => {
	test('lists the filter options by kind without search term', () => {
		expect(labels('')).toEqual({
			places: ['Lisbon', 'Zürich', 'Porto'],
			tags: ['beach', 'sunset beach', 'dog'],
			'date-range': ['Last week', 'Custom…'],
		})
	})

	test('groups the matches in a fixed order and ends with the file name search', () => {
		const groups = buildSearchSuggestions('lis', filterOptions, albums, noSelection, now)

		expect(groups.map((group) => group.id)).toEqual(['places', 'albums', 'name'])
		expect(groups.map((group) => group.label)).toEqual(['Places', 'Albums', 'File names'])
		expect(labels('lis')).toEqual({
			places: ['Lisbon'],
			albums: ['Lisbon 2025'],
			name: ['Search file names for "lis"'],
		})
	})

	test('matches regardless of case and diacritics, prefix matches first', () => {
		expect(labels('ZURICH').places).toEqual(['Zürich'])
		expect(labels('beach').tags).toEqual(['beach', 'sunset beach'])
		expect(labels('ach').tags).toEqual(['beach', 'sunset beach'])
	})

	test('gives every suggestion a unique id and keeps the option data', () => {
		const groups = buildSearchSuggestions('lisbon', filterOptions, albums, noSelection, now)
		const [place] = groups[0].suggestions
		const [albumSuggestion] = groups[1].suggestions

		expect(groups.flatMap((group) => group.suggestions.map((suggestion) => suggestion.id))).toEqual(['places-0', 'albums-0', 'name-0'])
		expect(place.imgSrc).toBe('/preview/lisbon')
		expect(place.filterOption).toBe(filterOptions[0])
		expect(albumSuggestion.to).toEqual({ name: 'albumsContent', params: { albumName: 'Lisbon 2025' } })
		expect(albumSuggestion.imgSrc).toContain('/apps/photos/api/v1/preview/42?')
		expect(albumSuggestion.filterOption).toBeUndefined()
	})

	test('does not suggest the values already selected', () => {
		expect(labels('', { ...noSelection, places: ['Lisbon'], 'date-range': [{ start: 1, end: 2 }] })).toEqual({
			places: ['Zürich', 'Porto'],
			tags: ['beach', 'sunset beach', 'dog'],
			'date-range': ['Custom…'],
		})
		expect(labels('dog', { ...noSelection, tags: ['dog'], name: ['dog'] })).toEqual({})
		expect(labels('2023', { ...noSelection, 'date-range': [{ start: new Date(2023, 0, 1).getTime(), end: new Date(2023, 11, 31).getTime() }] })).toEqual({
			name: ['Search file names for "2023"'],
		})
	})

	test('limits the number of suggestions per group', () => {
		const manyPlaces = Array.from({ length: 10 }, (_, i) => ({ filterId: 'places', label: `Place ${i}`, value: `Place ${i}` }))

		const [places] = buildSearchSuggestions('place', manyPlaces, [], noSelection, now)

		expect(places.suggestions).toHaveLength(6)
	})

	test('suggests a typed year', () => {
		const [dates] = buildSearchSuggestions('2023', filterOptions, albums, noSelection, now)

		expect(dates.id).toBe('date-range')
		expect(dates.suggestions.map((suggestion) => suggestion.filterOption)).toEqual([{
			filterId: 'date-range',
			label: '2023',
			value: { start: new Date(2023, 0, 1).getTime(), end: new Date(2023, 11, 31).getTime() },
		}])
	})

	test('ignores numbers that are no past year', () => {
		expect(labels('2030')['date-range']).toBeUndefined()
		expect(labels('123')['date-range']).toBeUndefined()
	})

	test('suggests a typed month of a year', () => {
		const [dates] = buildSearchSuggestions('june 2023', filterOptions, albums, noSelection, now)

		expect(dates.suggestions.map((suggestion) => suggestion.filterOption)).toEqual([{
			filterId: 'date-range',
			label: 'June 2023',
			value: { start: new Date(2023, 5, 1).getTime(), end: new Date(2023, 5, 30).getTime() },
		}])
		expect(labels('Feb 2024')['date-range']).toEqual(['February 2024'])
	})

	test('suggests the last three occurrences of a month typed without year', () => {
		expect(labels('June')['date-range']).toEqual(['June 2026', 'June 2025', 'June 2024'])
		expect(labels('dec')['date-range']).toEqual(['December 2025', 'December 2024', 'December 2023'])
		expect(labels('ju')['date-range']).toBeUndefined()
	})

	test('combines typed dates with the matching date shortcuts', () => {
		expect(labels('last')['date-range']).toEqual(['Last week'])
	})
})

describe('getNameOption', () => {
	test('searches the trimmed text in the file names', () => {
		expect(getNameOption('  me & you ')).toEqual({
			filterId: 'name',
			label: 'Search file names for "me & you"',
			value: 'me & you',
		})
	})
})
