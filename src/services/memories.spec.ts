/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { buildYearRecap, detectTrips } from './memories.ts'

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

/**
 * Build photos evenly spread over a whole year.
 *
 * @param year - Year the photos are taken in
 * @param count - Number of photos to build
 * @param firstFileId - File id of the first photo
 */
function buildPhotosOverYear(year: number, count: number, firstFileId: number = 1): PhotoFile[] {
	const start = new Date(year, 0, 1).getTime() / 1000
	const step = (new Date(year + 1, 0, 1).getTime() / 1000 - start) / count

	return Array.from({ length: count }, (_, index) => ({
		fileid: firstFileId + index,
		attributes: { timestamp: Math.floor(start + index * step) },
	} as PhotoFile))
}

/**
 * @param photos - Photos to get the months of
 * @return The months the photos were taken in, starting at 0 for January
 */
function getMonths(photos: PhotoFile[]): Set<number> {
	return new Set(photos.map((photo) => new Date(photo.attributes.timestamp * 1000).getMonth()))
}

describe('buildYearRecap', () => {
	test('returns no recap without photos', () => {
		expect(buildYearRecap([])).toBeNull()
	})

	test('returns no recap when no year holds enough photos', () => {
		expect(buildYearRecap(buildPhotosOverYear(2024, 29))).toBeNull()
	})

	test('recaps the most recent year holding enough photos', () => {
		const recap = buildYearRecap([
			...buildPhotosOverYear(2023, 40, 1),
			...buildPhotosOverYear(2024, 40, 41),
			...buildPhotosOverYear(2025, 10, 81),
		])

		expect(recap?.year).toBe(2024)
		expect(recap?.totalCount).toBe(40)
	})

	test('caps the number of highlights', () => {
		const recap = buildYearRecap(buildPhotosOverYear(2024, 400))

		expect(recap?.totalCount).toBe(400)
		expect(recap?.highlights).toHaveLength(60)
	})

	test('keeps all the favorites', () => {
		const photos = buildPhotosOverYear(2024, 400)
		const favorites = [photos[3], photos[100], photos[399]]
		for (const photo of favorites) {
			photo.attributes.favorite = 1
		}

		const recap = buildYearRecap(photos)

		expect(recap?.highlights).toEqual(expect.arrayContaining(favorites))
	})

	test('spreads the highlights over the year rather than over the photos', () => {
		const recap = buildYearRecap([
			...buildPhotosOverYear(2024, 60, 1),
			// A single month holding most of the photos of the year.
			...buildPhotos(new Date(2024, 6, 1).getTime() / 1000, 500, 61),
		])

		expect(getMonths(recap?.highlights ?? [])).toHaveProperty('size', 12)
	})

	test('returns the highlights in chronological order', () => {
		const recap = buildYearRecap(buildPhotosOverYear(2024, 120))
		const timestamps = (recap?.highlights ?? []).map((photo) => photo.attributes.timestamp)

		expect(timestamps).toEqual([...timestamps].sort((timestamp1, timestamp2) => timestamp1 - timestamp2))
	})

	test('uses a photo from the middle of the highlights as cover', () => {
		const recap = buildYearRecap(buildPhotosOverYear(2024, 120))
		const highlights = recap?.highlights ?? []

		expect(recap?.cover).toBe(highlights[Math.floor(highlights.length / 2)])
	})
})
