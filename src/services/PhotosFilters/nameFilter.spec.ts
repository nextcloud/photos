/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { describe, expect, test, vi } from 'vitest'
import { nameFilter } from './nameFilter.ts'

vi.mock('@nextcloud/initial-state', () => ({
	loadState: vi.fn((app: string, key: string, fallback: unknown) => fallback),
}))

/**
 * Extract the literals of the comparisons of a query.
 *
 * @param query - The DAV query to extract the literals from
 */
function getLiterals(query: string): string[] {
	return [...query.matchAll(/<d:literal>(.*)<\/d:literal>/g)].map(([, literal]) => literal)
}

describe('nameFilter', () => {
	test('does not provide any option', async () => {
		expect(await nameFilter.getOptions()).toEqual([])
	})

	test('builds no query without search term', () => {
		expect(nameFilter.getQuery([])).toBe('')
		expect(nameFilter.getQuery(['   '])).toBe('')
	})

	test('matches the file name as a substring', () => {
		const query = nameFilter.getQuery(['holidays'])

		expect(query).toContain('<d:displayname/>')
		expect(query).not.toContain('metadata-photos-caption')
		expect(getLiterals(query)).toEqual(['%holidays%'])
	})

	test('also matches the description once the server can search it', () => {
		vi.mocked(loadState).mockReturnValueOnce(true)

		const query = nameFilter.getQuery(['beach', 'dog'])

		expect(query.match(/<d:or>/g)).toHaveLength(2)
		expect(query.match(/<d:displayname\/>/g)).toHaveLength(2)
		expect(query.match(/<nc:metadata-photos-caption\/>/g)).toHaveLength(2)
		expect(getLiterals(query)).toEqual(['%beach%', '%beach%', '%dog%', '%dog%'])
	})

	test('trims the search terms and requires all of them to match', () => {
		const query = nameFilter.getQuery([' holidays ', 'rome'])

		expect(query.startsWith('<d:and>')).toBe(true)
		expect(getLiterals(query)).toEqual(['%holidays%', '%rome%'])
	})

	test('requires every word of a search term to match, in any order', () => {
		vi.mocked(loadState).mockReturnValueOnce(true)

		const query = nameFilter.getQuery(['beach  dog'])

		expect(query.match(/<d:and>/g)).toHaveLength(1)
		expect(query.match(/<d:or>/g)).toHaveLength(2)
		expect(getLiterals(query)).toEqual(['%beach%', '%beach%', '%dog%', '%dog%'])
	})

	test('splits on any whitespace and ignores repeated words', () => {
		expect(getLiterals(nameFilter.getQuery(['dog\ton the\nbeach Dog', 'the']))).toEqual(['%dog%', '%on%', '%the%', '%beach%'])
	})

	test('escapes the XML entities of the search term', () => {
		expect(getLiterals(nameFilter.getQuery(['<a href="me&you">']))).toEqual([
			'%&#x3C;a%',
			'%href=&#x22;me&#x26;you&#x22;&#x3E;%',
		])
	})

	test('escapes the LIKE wildcards of the search term', () => {
		expect(getLiterals(nameFilter.getQuery(['100%_of\\it']))).toEqual(['%100\\%\\_of\\\\it%'])
	})
})
