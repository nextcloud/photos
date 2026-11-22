/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import L from 'leaflet'
import { describe, expect, test } from 'vitest'
import { itemsInBounds } from './mapBounds.ts'

type Item = { id: string, latLng: [number, number] }

const items: Item[] = [
	{ id: 'lisbon', latLng: [38.72, -9.14] },
	{ id: 'porto', latLng: [41.15, -8.61] },
	{ id: 'madrid', latLng: [40.42, -3.7] },
	{ id: 'fiji', latLng: [-17.71, 178.06] },
	{ id: 'samoa', latLng: [-13.76, -172.1] },
]

/**
 * @param southWest - South west corner of the bounds
 * @param northEast - North east corner of the bounds
 * @return The names of the items within the bounds
 */
function within(southWest: [number, number], northEast: [number, number]): string[] {
	return itemsInBounds(items, (item) => item.latLng, L.latLngBounds(southWest, northEast))
		.map(({ id }) => id)
}

describe('itemsInBounds', () => {
	test('keeps the items within the bounds, in order', () => {
		expect(within([36, -10], [42, -6])).toEqual(['lisbon', 'porto'])
	})

	test('keeps items on the edges of the bounds', () => {
		expect(within([38.72, -9.14], [40.42, -3.7])).toEqual(['lisbon', 'madrid'])
	})

	test('keeps nothing when no item is within the bounds', () => {
		expect(within([50, 0], [60, 10])).toEqual([])
	})

	test('keeps every item when the map shows more than the whole world', () => {
		expect(within([-85, -270], [85, 270])).toEqual(items.map(({ id }) => id))
	})

	test('keeps only the items drawn when the map is panned past the antimeridian', () => {
		// Fiji is drawn at 178° east, not at its copy at 182° east.
		expect(within([-20, 170], [-10, 190])).toEqual(['fiji'])
		// Samoa is drawn at 172° west, not at its copy at 188° east.
		expect(within([-20, -190], [-10, -170])).toEqual(['samoa'])
	})

	test('keeps nothing when there are no items', () => {
		expect(itemsInBounds([], (item: Item) => item.latLng, L.latLngBounds([-90, -180], [90, 180]))).toEqual([])
	})
})
