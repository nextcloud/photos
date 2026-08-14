/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { nameFilter } from './nameFilter.ts'

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
		expect(getLiterals(query)).toEqual(['%holidays%'])
	})

	test('trims the search terms and requires all of them to match', () => {
		const query = nameFilter.getQuery([' holidays ', 'rome'])

		expect(query.startsWith('<d:and>')).toBe(true)
		expect(getLiterals(query)).toEqual(['%holidays%', '%rome%'])
	})

	test('escapes the XML entities of the search term', () => {
		expect(getLiterals(nameFilter.getQuery(['<a href="me & you">']))).toEqual([
			'%&#x3C;a href=&#x22;me &#x26; you&#x22;&#x3E;%',
		])
	})

	test('escapes the LIKE wildcards of the search term', () => {
		expect(getLiterals(nameFilter.getQuery(['100%_of\\it']))).toEqual(['%100\\%\\_of\\\\it%'])
	})
})
