/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { getCanonicalLocale, t } from '@nextcloud/l10n'

/** A group of places lying in the same country. */
export type CountryGroup = {
	/** ISO 3166-1 alpha-2 code of the country. */
	code: string
	/** Localized name of the country. */
	name: string
	places: Collection[]
}

/**
 * Localized name of a country.
 *
 * @param code - ISO 3166-1 alpha-2 code of the country
 * @param locale - Locale to name the country in
 * @return The name of the country, the code itself when it is not known
 */
export function getCountryName(code: string, locale: string = getCanonicalLocale()): string {
	try {
		return new Intl.DisplayNames([locale], { type: 'region', fallback: 'code' }).of(code.toUpperCase()) ?? code
	} catch {
		return code
	}
}

/**
 * Name of a place along with its country, as in "Paris, France".
 *
 * @param place - Name of the place
 * @param countryCode - ISO 3166-1 alpha-2 code of its country, empty when unknown
 * @param locale - Locale to name the country in
 */
export function formatPlaceName(place: string, countryCode: string | undefined, locale: string = getCanonicalLocale()): string {
	if (!countryCode) {
		return place
	}

	return t('photos', '{place}, {country}', { place, country: getCountryName(countryCode, locale) })
}

/**
 * Group places by country, both sorted by name.
 *
 * @param places - Places, with their country code in the `place-country` attribute
 * @param locale - Locale to name and sort the countries in
 * @return The countries, and the places whose country is not known
 */
export function groupPlacesByCountry(places: Collection[], locale: string = getCanonicalLocale()): { countries: CountryGroup[], others: Collection[] } {
	const collator = new Intl.Collator(locale)
	const byName = (a: Collection, b: Collection) => collator.compare(a.basename, b.basename)

	const countries = new Map<string, CountryGroup>()
	const others: Collection[] = []

	for (const place of places) {
		const code = String(place.attributes['place-country'] ?? '').toUpperCase()
		if (code === '') {
			others.push(place)
			continue
		}

		let country = countries.get(code)
		if (country === undefined) {
			country = { code, name: getCountryName(code, locale), places: [] }
			countries.set(code, country)
		}
		country.places.push(place)
	}

	for (const country of countries.values()) {
		country.places.sort(byName)
	}

	return {
		countries: [...countries.values()].sort((a, b) => collator.compare(a.name, b.name)),
		others: others.sort(byName),
	}
}
