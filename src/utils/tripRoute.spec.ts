/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { buildRoute, getStepDuration, simplifyRoute } from './tripRoute.ts'

type Photo = { id: string, latLng: [number, number], attributes: { timestamp: number } }

/** Degrees of latitude covered by one metre. */
const METRE = 1 / 111_195

/**
 * Photos lined up on a meridian, placed the given number of metres north of
 * the equator, named after their offset and taken in the given order.
 *
 * @param offsets - Offset in metres of each photo
 */
function photosAt(offsets: number[]): Photo[] {
	return offsets.map((offset, index) => ({
		id: `${offset}`,
		latLng: [offset * METRE, 0],
		attributes: { timestamp: 1000 + index },
	}))
}

/**
 * @param stops - The stops of a route
 * @return The names of the photos of each stop
 */
function names(stops: { items: Photo[] }[]): string[][] {
	return stops.map((stop) => stop.items.map((photo) => photo.id))
}

const getLatLng = (photo: Photo) => photo.latLng

describe('simplifyRoute', () => {
	test('has no stops without items', () => {
		expect(simplifyRoute([], getLatLng, 50)).toEqual([])
	})

	test('merges the items closer than the minimum distance to the start of a stop', () => {
		const stops = simplifyRoute(photosAt([0, 20, 40, 60, 80, 200]), getLatLng, 50)

		expect(names(stops)).toEqual([['0', '20', '40'], ['60', '80'], ['200']])
		expect(stops.map((stop) => stop.latLng)).toEqual([[0, 0], [60 * METRE, 0], [200 * METRE, 0]])
	})

	test('keeps a place that is come back to as a stop of its own', () => {
		expect(names(simplifyRoute(photosAt([0, 500, 10]), getLatLng, 50))).toEqual([['0'], ['500'], ['10']])
	})
})

describe('buildRoute', () => {
	test('goes through the photos in the order they were taken', () => {
		const [first, second, third] = photosAt([0, 1000, 2000])

		expect(names(buildRoute([third, first, second], getLatLng, 10))).toEqual([['0'], ['1000'], ['2000']])
	})

	test('merges photos taken at the same place', () => {
		expect(names(buildRoute(photosAt([0, 5, 10, 1000]), getLatLng, 10))).toEqual([['0', '5', '10'], ['1000']])
	})

	test('widens the stops until the route has no more than the maximum number of them', () => {
		const photos = photosAt(Array.from({ length: 100 }, (_, index) => index * 30))
		const stops = buildRoute(photos, getLatLng, 20)

		expect(stops.length).toBeLessThanOrEqual(20)
		expect(stops.length).toBeGreaterThan(5)
		expect(stops.flatMap((stop) => stop.items)).toEqual(photos)
	})

	test('ends up with a single stop when no more are allowed', () => {
		expect(buildRoute(photosAt([0, 100_000, 5_000_000]), getLatLng, 1)).toHaveLength(1)
	})
})

describe('getStepDuration', () => {
	test('shows each stop of a short route for the longest duration', () => {
		expect(getStepDuration(1, 1)).toBe(1500)
		expect(getStepDuration(10, 1)).toBe(1500)
	})

	test('plays longer routes faster to keep them around a minute', () => {
		expect(getStepDuration(100, 1)).toBe(600)
	})

	test('never shows a stop for less than the shortest duration at normal speed', () => {
		expect(getStepDuration(1000, 1)).toBe(250)
	})

	test('scales with the playback speed', () => {
		expect(getStepDuration(100, 2)).toBe(300)
		expect(getStepDuration(100, 0.5)).toBe(1200)
	})
})
