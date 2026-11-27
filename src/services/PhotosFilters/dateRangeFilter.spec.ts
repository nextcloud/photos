/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { dateRangeFilter } from './dateRangeFilter.ts'

describe('dateRangeFilter', () => {
	it('covers a single day from its first second up to the next day', () => {
		const day = Date.UTC(2024, 5, 14)
		const query = dateRangeFilter.getQuery([{ start: day, end: day }]).replace(/\s+/g, '')

		expect(query).toContain(`<d:gte><d:prop><nc:metadata-photos-original_date_time/></d:prop><d:literal>${day / 1000}</d:literal></d:gte>`)
		expect(query).toContain(`<d:lt><d:prop><nc:metadata-photos-original_date_time/></d:prop><d:literal>${day / 1000 + 86400}</d:literal></d:lt>`)
	})
})
