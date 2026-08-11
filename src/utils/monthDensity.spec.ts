/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { monthDensities } from './monthDensity.ts'

describe('monthDensities', () => {
	test('returns 0 for every month when no month has photos', () => {
		expect(monthDensities(['202601', '202602'], {})).toEqual([0, 0])
	})

	test('scales the counts against the densest month', () => {
		expect(monthDensities(['202601', '202602', '202603'], {
			202601: 100,
			202602: 50,
			202603: 25,
		})).toEqual([1, 0.5, 0.25])
	})

	test('scores months without photos as 0', () => {
		expect(monthDensities(['202601', '202602'], { 202601: 10 })).toEqual([1, 0])
	})

	test('caps outliers so the remaining months keep their spread', () => {
		const months = Array.from({ length: 24 }, (_, index) => `${index}`)
		const counts = Object.fromEntries(months.map((month) => [month, 10]))
		counts['0'] = 1000

		const densities = monthDensities(months, counts)

		// The outlier is clamped to the top of the scale instead of pushing
		// every other month down to 1%.
		expect(densities[0]).toBe(1)
		expect(densities[1]).toBe(1)
	})

	test('keeps the highest count as the top of the scale when there are too few months to clamp', () => {
		expect(monthDensities(['202601', '202602'], { 202601: 100, 202602: 10 })).toEqual([1, 0.1])
	})
})
