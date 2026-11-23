/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { PhotoSearchOptions } from './PhotoSearch.ts'

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { getPhotos } from './PhotoSearch.ts'
import { getSurpriseTiers, narrowRange, pickOffset, pickSurprise, PROBE_SIZE, resetSurpriseRanges } from './surpriseMe.ts'

vi.mock('./PhotoSearch.ts', () => ({ getPhotos: vi.fn() }))

/**
 * Make the search answer as a library holding the given number of photos would.
 *
 * @param counts - Number of photos matched, with and without the favorites filter
 * @param counts.favorites - Number of favorites
 * @param counts.others - Number of photos when favorites are not asked for
 */
function mockLibrary({ favorites, others }: { favorites: number, others: number }): void {
	vi.mocked(getPhotos).mockImplementation(async (options: Partial<PhotoSearchOptions> = {}) => {
		const count = options.onlyFavorites ? favorites : others
		const first = options.firstResult ?? 0
		const length = Math.max(0, Math.min(options.nbResults ?? 0, count - first))
		return Array.from({ length }, (_, index) => ({ fileid: first + index + (options.onlyFavorites ? 100000 : 0) } as File))
	})
}

describe('getSurpriseTiers', () => {
	const now = new Date(2026, 10, 23, 15, 30)

	test('starts with the old favorites when the draw says so', () => {
		expect(getSurpriseTiers(now, 0.1).map((tier) => tier.id)).toEqual(['old-favorites', 'old', 'all'])
	})

	test('skips the favorites otherwise', () => {
		expect(getSurpriseTiers(now, 0.9).map((tier) => tier.id)).toEqual(['old', 'all'])
	})

	test('never leaves the favorites when only they are wanted', () => {
		const tiers = getSurpriseTiers(now, 0.9, true)

		expect(tiers.map((tier) => tier.id)).toEqual(['old-favorites', 'favorites'])
		expect(tiers.every((tier) => tier.onlyFavorites)).toBe(true)
	})

	test('limits the old photos to those taken more than a year ago', () => {
		const [old, all] = getSurpriseTiers(now, 0.9)

		expect(old.extraFilters).toContain(`<d:literal>${new Date(2025, 10, 23).getTime() / 1000}</d:literal>`)
		expect(old.extraFilters).toContain('<d:lt>')
		expect(all.extraFilters).toBe('')
	})
})

describe('pickOffset', () => {
	test('starts at the beginning of an unknown search', () => {
		expect(pickOffset({ min: 0, max: Infinity }, 0.7)).toBe(0)
	})

	test('doubles the offset while the end of the search is unknown', () => {
		expect(pickOffset({ min: 300, max: Infinity }, 0.7)).toBe(600)
	})

	test('spreads the offsets evenly below the known end', () => {
		expect(pickOffset({ min: 0, max: 10 }, 0)).toBe(0)
		expect(pickOffset({ min: 0, max: 10 }, 0.55)).toBe(5)
		expect(pickOffset({ min: 0, max: 10 }, 0.999)).toBe(9)
	})
})

describe('narrowRange', () => {
	test('raises the lower bound after a full answer', () => {
		expect(narrowRange({ min: 0, max: Infinity }, 200, 100, 100)).toEqual({ min: 300, max: Infinity })
	})

	test('knows the exact size after a partial answer', () => {
		expect(narrowRange({ min: 100, max: Infinity }, 200, 100, 42)).toEqual({ min: 242, max: 242 })
	})

	test('lowers the upper bound after an empty answer', () => {
		expect(narrowRange({ min: 100, max: 800 }, 500, 1, 0)).toEqual({ min: 100, max: 500 })
	})

	test('keeps the bounds consistent when the library shrank', () => {
		expect(narrowRange({ min: 400, max: 400 }, 250, 1, 0)).toEqual({ min: 250, max: 250 })
	})

	test('knows an empty search', () => {
		expect(narrowRange({ min: 0, max: Infinity }, 0, 100, 0)).toEqual({ min: 0, max: 0 })
	})
})

describe('pickSurprise', () => {
	beforeEach(() => {
		resetSurpriseRanges()
		vi.mocked(getPhotos).mockReset()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test('returns nothing for an empty library', async () => {
		mockLibrary({ favorites: 0, others: 0 })

		expect(await pickSurprise()).toBeNull()
	})

	test('falls back to the other photos when there is no favorite', async () => {
		mockLibrary({ favorites: 0, others: 5 })
		vi.spyOn(Math, 'random').mockReturnValue(0.1)

		expect((await pickSurprise())?.fileid).toBe(0)
	})

	test('picks a photo at a random offset of a library bigger than a request', async () => {
		mockLibrary({ favorites: 0, others: 1234 })
		vi.spyOn(Math, 'random').mockReturnValue(0.9)

		const photo = await pickSurprise()

		// The doubling probes end at 1400, an offset the library does not reach:
		// the draws are then made below it, and below every offset found empty.
		expect(photo?.fileid).toBe(Math.floor(0.9 * Math.floor(0.9 * 1400)))
		expect(vi.mocked(getPhotos).mock.lastCall?.[0]).toMatchObject({ firstResult: photo?.fileid, nbResults: 1 })
	})

	test('sizes a search only once', async () => {
		mockLibrary({ favorites: 0, others: 1234 })
		vi.spyOn(Math, 'random').mockReturnValue(0.9)

		await pickSurprise()
		const sizingCalls = vi.mocked(getPhotos).mock.calls.length
		await pickSurprise()

		expect(sizingCalls).toBeGreaterThan(1)
		expect(vi.mocked(getPhotos).mock.calls.length).toBe(sizingCalls + 1)
		expect(vi.mocked(getPhotos).mock.calls.filter(([options]) => options?.nbResults === PROBE_SIZE)).toHaveLength(4)
	})

	test('prefers the favorites when the draw says so', async () => {
		mockLibrary({ favorites: 3, others: 50 })
		vi.spyOn(Math, 'random').mockReturnValue(0.1)

		expect((await pickSurprise())?.fileid).toBe(100000)
	})

	test('avoids a photo which was already shown', async () => {
		mockLibrary({ favorites: 0, others: 10 })
		const random = vi.spyOn(Math, 'random').mockReturnValue(0.9)
		const seen = new Set<number>()

		const first = await pickSurprise({}, seen)
		random.mockReturnValueOnce(0.9).mockReturnValueOnce(0.9).mockReturnValue(0.55)
		const second = await pickSurprise({}, seen)

		expect(first?.fileid).toBe(9)
		expect(second?.fileid).toBe(5)
		expect(seen).toEqual(new Set([9, 5]))
	})

	test('returns nothing once every photo was shown', async () => {
		mockLibrary({ favorites: 0, others: 1 })
		const seen = new Set<number>()

		expect((await pickSurprise({}, seen))?.fileid).toBe(0)
		expect(await pickSurprise({}, seen)).toBeNull()
	})
})
