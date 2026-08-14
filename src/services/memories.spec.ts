/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { detectTrips } from './memories.ts'

const DAY = 24 * 60 * 60

/**
 * Build photos taken every hour, starting at the given timestamp.
 *
 * @param startTimestamp - Capture time of the first photo, in unix seconds
 * @param count - Number of photos to build
 * @param firstFileId - File id of the first photo
 */
function buildPhotos(startTimestamp: number, count: number, firstFileId: number = 1): PhotoFile[] {
	return Array.from({ length: count }, (_, index) => ({
		fileid: firstFileId + index,
		attributes: { timestamp: startTimestamp + index * 3600 },
	} as PhotoFile))
}

describe('detectTrips', () => {
	test('returns no trip without photos', () => {
		expect(detectTrips([])).toEqual([])
	})

	test('drops clusters with too few photos', () => {
		expect(detectTrips(buildPhotos(0, 7))).toEqual([])
	})

	test('groups photos taken close to each other into a single trip', () => {
		const photos = buildPhotos(0, 10)

		const trips = detectTrips(photos)

		expect(trips).toHaveLength(1)
		expect(trips[0].photos).toHaveLength(10)
		expect(trips[0].startTimestamp).toBe(photos[0].attributes.timestamp)
		expect(trips[0].endTimestamp).toBe(photos[9].attributes.timestamp)
		expect(trips[0].id).toBe('trip-1-10')
	})

	test('starts a new trip after a gap bigger than the given number of days', () => {
		const trips = detectTrips([
			...buildPhotos(0, 10, 1),
			...buildPhotos(5 * DAY, 10, 11),
		])

		expect(trips).toHaveLength(2)
		expect(trips.map((trip) => trip.id)).toEqual(['trip-11-20', 'trip-1-10'])
	})

	test('keeps photos separated by less than the given number of days in the same trip', () => {
		const trips = detectTrips([
			...buildPhotos(0, 10, 1),
			...buildPhotos(1.5 * DAY, 10, 11),
		])

		expect(trips).toHaveLength(1)
		expect(trips[0].photos).toHaveLength(20)
	})

	test('returns the most recent trip first', () => {
		const trips = detectTrips([
			...buildPhotos(0, 10, 1),
			...buildPhotos(10 * DAY, 10, 11),
			...buildPhotos(20 * DAY, 10, 21),
		])

		expect(trips.map((trip) => trip.startTimestamp)).toEqual([20 * DAY, 10 * DAY, 0])
	})

	test('sorts unordered photos before clustering them', () => {
		const photos = buildPhotos(0, 10)

		const trips = detectTrips([...photos].reverse())

		expect(trips).toHaveLength(1)
		expect(trips[0].photos).toEqual(photos)
	})

	test('uses the photo closest to the middle of the trip as cover', () => {
		const photos = buildPhotos(0, 11)

		const trips = detectTrips(photos)

		expect(trips[0].cover).toBe(photos[5])
	})

	test('only keeps clusters with enough photos', () => {
		const trips = detectTrips([
			...buildPhotos(0, 3, 1),
			...buildPhotos(10 * DAY, 10, 11),
			...buildPhotos(20 * DAY, 3, 21),
		])

		expect(trips.map((trip) => trip.id)).toEqual(['trip-11-20'])
	})

	test('honours custom gap and minimum size', () => {
		const photos = [
			...buildPhotos(0, 3, 1),
			...buildPhotos(12 * 3600, 3, 11),
		]

		expect(detectTrips(photos, 0.25, 3).map((trip) => trip.id)).toEqual(['trip-11-13', 'trip-1-3'])
		expect(detectTrips(photos, 1, 3).map((trip) => trip.id)).toEqual(['trip-1-13'])
	})
})
