/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { groupFilterOptions, isHeading, searchFilterOptions } from './optionGroups.ts'

const filters = [
	{ id: 'name' },
	{ id: 'date-range', label: 'Date' },
	{ id: 'places', label: 'Place' },
	{ id: 'tags', label: 'Tag' },
]

const optionsByFilter = {
	tags: [{ filterId: 'tags', label: 'Beach', value: 'Beach' }],
	'date-range': [
		{ filterId: 'date-range', label: 'Last week', value: 1 },
		{ filterId: 'date-range', label: 'Last month', value: 2 },
	],
	places: [],
}

/**
 * @param entries - Entries of the options list
 * @return Their labels, the ones of the headings in brackets
 */
function labels(entries: ReturnType<typeof groupFilterOptions>): string[] {
	return entries.map((entry) => (isHeading(entry) ? `[${entry.label}]` : entry.label))
}

describe('groupFilterOptions', () => {
	test('lists the options below the heading of their filter, in the order of the filters', () => {
		expect(labels(groupFilterOptions(filters, optionsByFilter))).toEqual(['[Date]', 'Last week', 'Last month', '[Tag]', 'Beach'])
	})

	test('lists nothing without options', () => {
		expect(groupFilterOptions(filters, {})).toEqual([])
	})
})

describe('searchFilterOptions', () => {
	const entries = groupFilterOptions(filters, optionsByFilter)

	test('keeps everything without a search', () => {
		expect(searchFilterOptions(entries, ' ')).toEqual(entries)
	})

	test('keeps the matching options and their headings only', () => {
		expect(labels(searchFilterOptions(entries, 'bea'))).toEqual(['[Tag]', 'Beach'])
		expect(labels(searchFilterOptions(entries, 'LAST W'))).toEqual(['[Date]', 'Last week'])
	})

	test('does not match the headings themselves', () => {
		expect(searchFilterOptions(entries, 'Date')).toEqual([])
	})
})
