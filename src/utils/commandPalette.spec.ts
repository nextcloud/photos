/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { parseDateQuery, rankCommands } from './commandPalette.ts'

const commands = [
	{ label: 'Albums' },
	{ label: 'Map' },
	{ label: 'Memories' },
	{ label: 'Use small tiles', keywords: ['Density'] },
	{ label: 'Málaga 2019' },
	{ label: 'Summer in Lisbon' },
	{ label: 'Lisbon' },
	{ label: 'Alma' },
]

/**
 * @param query - The query to rank the commands for
 */
function labels(query: string): string[] {
	return rankCommands(query, commands).map(({ label }) => label)
}

describe('rankCommands', () => {
	test('keeps every command in order for an empty query', () => {
		expect(labels('  ')).toEqual(commands.map(({ label }) => label))
	})

	test('honours the limit', () => {
		expect(rankCommands('', commands, 3)).toHaveLength(3)
		expect(rankCommands('m', commands, 2)).toHaveLength(2)
	})

	test('drops the commands which do not match', () => {
		expect(labels('zzz')).toEqual([])
	})

	test('ranks an exact match over a prefix, a word prefix and a substring', () => {
		expect(labels('lisbon')).toEqual(['Lisbon', 'Summer in Lisbon'])
		expect(labels('al')).toEqual(['Albums', 'Alma', 'Use small tiles', 'Málaga 2019'])
	})

	test('keeps the given order among equal matches', () => {
		expect(labels('m')).toEqual(['Map', 'Memories', 'Málaga 2019', 'Albums', 'Use small tiles', 'Summer in Lisbon', 'Alma'])
	})

	test('ignores case and diacritics', () => {
		expect(labels('MALAGA')).toEqual(['Málaga 2019'])
		expect(labels('málaga')).toEqual(['Málaga 2019'])
	})

	test('matches words typed in another order', () => {
		expect(labels('2019 malaga')).toEqual(['Málaga 2019'])
		expect(labels('lisbon summer')).toEqual(['Summer in Lisbon'])
	})

	test('finds a command by its keywords, behind the label matches', () => {
		expect(labels('density')).toEqual(['Use small tiles'])
		expect(rankCommands('map', [{ label: 'Places', keywords: ['Map'] }, { label: 'Roadmap' }, { label: 'Map' }])
			.map(({ label }) => label)).toEqual(['Map', 'Places', 'Roadmap'])
	})
})

// The suite runs with `TZ=CET`, so local time is what these dates spell out.
describe('parseDateQuery', () => {
	const now = new Date(2026, 10, 22)
	const locales = ['de-DE', 'en']

	/**
	 * @param query - The query to parse
	 */
	function parse(query: string) {
		return parseDateQuery(query, locales, now)
	}

	test('reads a year as the whole year', () => {
		expect(parse('2021')).toEqual({
			year: 2021,
			month: undefined,
			range: { start: new Date(2021, 0, 1).getTime(), end: new Date(2021, 11, 31).getTime() },
		})
	})

	test('reads a month and a year in any order', () => {
		const june2019 = {
			year: 2019,
			month: 5,
			range: { start: new Date(2019, 5, 1).getTime(), end: new Date(2019, 5, 30).getTime() },
		}
		expect(parse('June 2019')).toEqual(june2019)
		expect(parse(' 2019  june ')).toEqual(june2019)
		expect(parse('Jun, 2019')).toEqual(june2019)
		expect(parse('2019-06')).toEqual(june2019)
		expect(parse('6/2019')).toEqual(june2019)
	})

	test('ends a February of a leap year on the 29th', () => {
		expect(parse('feb 2024')?.range.end).toBe(new Date(2024, 1, 29).getTime())
	})

	test('accepts the month names of every given locale, without diacritics', () => {
		expect(parse('Dezember 2020')?.month).toBe(11)
		expect(parse('marz 2020')?.month).toBe(2)
		expect(parse('March 2020')?.month).toBe(2)
		expect(parse('Mai 2020')?.month).toBe(4)
	})

	test('reads a month alone as the last one that started', () => {
		expect(parse('November')).toMatchObject({ year: 2026, month: 10 })
		expect(parse('December')).toMatchObject({ year: 2025, month: 11 })
		expect(parse('June')).toMatchObject({ year: 2026, month: 5 })
	})

	test('rejects what is not a date', () => {
		expect(parse('')).toBeNull()
		expect(parse('Lisbon')).toBeNull()
		expect(parse('ju')).toBeNull()
		expect(parse('12')).toBeNull()
		expect(parse('Lisbon 2019')).toBeNull()
		expect(parse('13/2019')).toBeNull()
		expect(parse('0/2019')).toBeNull()
		expect(parse('2019 2020')).toBeNull()
		expect(parse('1 June 2019')).toBeNull()
	})

	test('rejects years out of range', () => {
		expect(parse('1899')).toBeNull()
		expect(parse('2027')).toBeNull()
		expect(parse('June 2027')).toBeNull()
	})
})
