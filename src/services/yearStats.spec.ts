/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { describe, expect, test } from 'vitest'
import { buildYearStats } from './yearStats.ts'

let nextFileId = 1

/**
 * @param date - Local date and time the photo was taken at
 * @param place - Place the photo was taken in
 * @param mime - Mime type of the file
 */
function buildPhoto(date: string, place?: string, mime: string = 'image/jpeg'): PhotoFile {
	return {
		fileid: nextFileId++,
		mime,
		attributes: {
			timestamp: new Date(date).getTime() / 1000,
			'metadata-photos-place': place,
		},
	} as unknown as PhotoFile
}

describe('buildYearStats', () => {
	test('returns empty numbers without photos', () => {
		expect(buildYearStats([], 2025)).toEqual({
			year: 2025,
			photoCount: 0,
			videoCount: 0,
			dayCount: 0,
			placeCount: 0,
			busiestMonth: null,
			busiestDay: null,
			topPlaces: [],
		})
	})

	test('only counts the photos of the given year', () => {
		const stats = buildYearStats([
			buildPhoto('2024-12-31T23:59:59'),
			buildPhoto('2025-01-01T00:00:00'),
			buildPhoto('2025-12-31T23:59:59'),
			buildPhoto('2026-01-01T00:00:00'),
		], 2025)

		expect(stats.photoCount).toBe(2)
		expect(stats.dayCount).toBe(2)
	})

	test('counts photos and videos apart', () => {
		const stats = buildYearStats([
			buildPhoto('2025-03-01T10:00:00'),
			buildPhoto('2025-03-01T11:00:00', undefined, 'image/heic'),
			buildPhoto('2025-03-02T10:00:00', undefined, 'video/mp4'),
		], 2025)

		expect(stats.photoCount).toBe(2)
		expect(stats.videoCount).toBe(1)
	})

	test('counts every day once, whatever the number of photos taken on it', () => {
		const stats = buildYearStats([
			buildPhoto('2025-03-01T08:00:00'),
			buildPhoto('2025-03-01T22:00:00'),
			buildPhoto('2025-04-01T08:00:00'),
		], 2025)

		expect(stats.dayCount).toBe(2)
	})

	test('finds the busiest month and day, videos included', () => {
		const stats = buildYearStats([
			buildPhoto('2025-03-01T08:00:00'),
			buildPhoto('2025-03-02T08:00:00'),
			buildPhoto('2025-03-03T08:00:00'),
			buildPhoto('2025-08-15T08:00:00'),
			buildPhoto('2025-08-15T09:00:00', undefined, 'video/mp4'),
		], 2025)

		expect(stats.busiestMonth).toEqual({ month: '202503', count: 3 })
		expect(stats.busiestDay?.count).toBe(2)
		expect(stats.busiestDay?.date.getMonth()).toBe(7)
		expect(stats.busiestDay?.date.getDate()).toBe(15)
	})

	test('picks the earliest of equally busy months and days', () => {
		const stats = buildYearStats([
			buildPhoto('2025-09-10T08:00:00'),
			buildPhoto('2025-02-05T08:00:00'),
		], 2025)

		expect(stats.busiestMonth).toEqual({ month: '202502', count: 1 })
		expect(stats.busiestDay?.date.getMonth()).toBe(1)
	})

	test('lists the three most visited places', () => {
		const stats = buildYearStats([
			buildPhoto('2025-03-01T08:00:00', 'Lisbon'),
			buildPhoto('2025-03-02T08:00:00', 'Lisbon'),
			buildPhoto('2025-03-03T08:00:00', 'Lisbon'),
			buildPhoto('2025-04-01T08:00:00', 'Berlin'),
			buildPhoto('2025-04-02T08:00:00', 'Berlin'),
			buildPhoto('2025-05-01T08:00:00', 'Tokyo'),
			buildPhoto('2025-05-02T08:00:00', 'Cairo'),
			buildPhoto('2025-06-01T08:00:00'),
			buildPhoto('2025-06-02T08:00:00', ''),
			buildPhoto('2024-06-02T08:00:00', 'Oslo'),
		], 2025)

		expect(stats.placeCount).toBe(4)
		expect(stats.topPlaces).toEqual([
			{ name: 'Lisbon', count: 3 },
			{ name: 'Berlin', count: 2 },
			{ name: 'Cairo', count: 1 },
		])
	})
})
