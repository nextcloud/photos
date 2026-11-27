/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, test } from 'vitest'
import { yearLabels } from './yearLabels.ts'

const months = ['202602', '202601', '202512', '202506', '202412', '202401', '202312']

describe('yearLabels', () => {
	test('labels every year at its first month', () => {
		expect(yearLabels(months, 600, 20)).toStrictEqual([
			{ year: '2026', percent: 0 },
			{ year: '2025', percent: (2 / 6) * 100 },
			{ year: '2024', percent: (4 / 6) * 100 },
			{ year: '2023', percent: 100 },
		])
	})

	test('leaves out the labels that would overlap the one before', () => {
		// The years start 40px, 80px and 120px down a 120px track.
		expect(yearLabels(months, 120, 50).map(({ year }) => year)).toStrictEqual(['2026', '2024'])
	})

	test('keeps the first label alone until the track is measured', () => {
		expect(yearLabels(months, 0, 20).map(({ year }) => year)).toStrictEqual(['2026'])
	})

	test('handles a single month', () => {
		expect(yearLabels(['202602'], 600, 20)).toStrictEqual([{ year: '2026', percent: 0 }])
	})
})
