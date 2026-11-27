/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { describe, expect, test } from 'vitest'
import { formatPlaceName, getCountryName, groupPlacesByCountry } from './placeCountry.ts'

/**
 * Build the parts of a place collection the grouping relies on.
 *
 * @param basename - Name of the place
 * @param country - Country code of the place, as reported by the server
 */
function place(basename: string, country?: string): Collection {
	return { basename, attributes: { 'place-country': country } } as unknown as Collection
}

describe('getCountryName', () => {
	test('names the country in the given locale', () => {
		expect(getCountryName('FR', 'en')).toBe('France')
		expect(getCountryName('DE', 'fr')).toBe('Allemagne')
	})

	test('accepts lower case codes', () => {
		expect(getCountryName('it', 'en')).toBe('Italy')
	})

	test('falls back to the code when it is not a region code', () => {
		expect(getCountryName('not a code', 'en')).toBe('not a code')
	})
})

describe('formatPlaceName', () => {
	test('appends the country', () => {
		expect(formatPlaceName('Paris', 'FR', 'en')).toBe('Paris, France')
	})

	test('keeps the place alone when its country is not known', () => {
		expect(formatPlaceName('Paris', '', 'en')).toBe('Paris')
		expect(formatPlaceName('Paris', undefined, 'en')).toBe('Paris')
	})
})

describe('groupPlacesByCountry', () => {
	test('groups places under their country, sorted by name', () => {
		const lyon = place('Lyon', 'FR')
		const berlin = place('Berlin', 'DE')
		const paris = place('Paris', 'FR')
		const munich = place('Munich', 'DE')

		const { countries, others } = groupPlacesByCountry([paris, berlin, lyon, munich], 'en')

		expect(countries).toEqual([
			{ code: 'FR', name: 'France', places: [lyon, paris] },
			{ code: 'DE', name: 'Germany', places: [berlin, munich] },
		])
		expect(others).toEqual([])
	})

	test('sorts the countries by their localized name', () => {
		const { countries } = groupPlacesByCountry([place('Vienna', 'AT'), place('Berlin', 'DE')], 'de')

		expect(countries.map(({ name }) => name)).toEqual(['Deutschland', 'Österreich'])
	})

	test('keeps the places without a country apart', () => {
		const vienna = place('Vienna', 'AT')
		const zurich = place('Zurich', '')
		const bern = place('Bern')

		const { countries, others } = groupPlacesByCountry([zurich, vienna, bern], 'en')

		expect(countries).toEqual([{ code: 'AT', name: 'Austria', places: [vienna] }])
		expect(others).toEqual([bern, zurich])
	})

	test('has no countries when no place carries one', () => {
		const { countries, others } = groupPlacesByCountry([place('Bern'), place('Zurich')], 'en')

		expect(countries).toEqual([])
		expect(others).toHaveLength(2)
	})
})
