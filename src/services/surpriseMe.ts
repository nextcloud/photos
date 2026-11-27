/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { PhotoSearchOptions } from './PhotoSearch.ts'

import { getPhotos } from './PhotoSearch.ts'

/** What is known about the number of photos a search matches. */
export type CountRange = {
	/** The search matches at least this many photos. */
	min: number
	/** The search matches at most this many photos, `Infinity` while unknown. */
	max: number
}

/** A search to draw a photo from. */
export type SurpriseTier = {
	/** Identifies the search, whatever the moment it is built at. */
	id: string
	onlyFavorites: boolean
	extraFilters: string
}

/** Number of photos asked for while the size of a search is still unknown. */
export const PROBE_SIZE = 100

/** How often the favorites are tried before the rest of the old photos. */
const FAVORITES_CHANCE = 0.5

/** Requests a single draw may take, enough to size a library of millions. */
const MAX_REQUESTS = 40

/** Draws made to find a photo which was not shown yet. */
const MAX_DRAWS = 4

/**
 * List the searches a surprise is drawn from, the preferred one first: the
 * following ones are only used when the previous ones match nothing.
 *
 * @param now - The current date
 * @param random - A random number in [0, 1)
 * @param onlyFavorites - Whether photos which are not favorites are left out
 */
export function getSurpriseTiers(now: Date, random: number, onlyFavorites: boolean = false): SurpriseTier[] {
	const aYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
	const olderThanAYear = `<d:lt>
			<d:prop><nc:metadata-photos-original_date_time/></d:prop>
			<d:literal>${Math.floor(aYearAgo.getTime() / 1000)}</d:literal>
		</d:lt>`

	const tiers: SurpriseTier[] = [
		{ id: 'old-favorites', onlyFavorites: true, extraFilters: olderThanAYear },
		{ id: 'old', onlyFavorites: false, extraFilters: olderThanAYear },
		{ id: 'all', onlyFavorites: false, extraFilters: '' },
	]

	if (onlyFavorites) {
		return [tiers[0], { id: 'favorites', onlyFavorites: true, extraFilters: '' }]
	}

	// Always starting with the favorites would show the same few photos over
	// and over to someone who only has a handful of them.
	return random < FAVORITES_CHANCE ? tiers : tiers.slice(1)
}

/**
 * Pick the offset of the next request of a search. Once the size of the
 * search is bounded, any offset below the bound is as likely as another, so
 * every photo has the same chance. Until then the offsets double to find
 * where the search ends.
 *
 * @param range - What is known about the size of the search
 * @param random - A random number in [0, 1)
 */
export function pickOffset(range: CountRange, random: number): number {
	return Number.isFinite(range.max) ? Math.floor(random * range.max) : range.min * 2
}

/**
 * Refine what is known about the size of a search with the outcome of a request.
 *
 * @param range - What was known before the request
 * @param offset - Offset the request started at
 * @param requested - Number of photos asked for
 * @param returned - Number of photos returned
 */
export function narrowRange(range: CountRange, offset: number, requested: number, returned: number): CountRange {
	// Less photos than asked for means the search ends there.
	const max = returned < requested ? Math.min(range.max, offset + returned) : range.max
	const min = returned > 0 ? Math.max(range.min, offset + returned) : range.min

	// The library may have shrunk since the lower bound was found.
	return { min: Math.min(min, max), max }
}

const ranges = new Map<string, CountRange>()

/**
 * Draw a random photo from a search, without loading what it matches: only
 * the photo at a random offset is fetched.
 *
 * @param tier - The search to draw from
 * @param options - Options every request is made with
 * @return The photo, `null` when the search matches nothing
 */
async function drawFromTier(tier: SurpriseTier, options: Partial<PhotoSearchOptions>): Promise<File | null> {
	const key = `${tier.id}:${options.mimesType?.join(',')}`

	for (let request = 0; request < MAX_REQUESTS; request++) {
		const range = ranges.get(key) ?? { min: 0, max: Infinity }
		if (range.max === 0) {
			return null
		}

		const sized = Number.isFinite(range.max)
		const offset = pickOffset(range, Math.random())
		const nbResults = sized ? 1 : PROBE_SIZE
		const files = await getPhotos({
			...options,
			onlyFavorites: tier.onlyFavorites,
			extraFilters: tier.extraFilters,
			firstResult: offset,
			nbResults,
		})
		ranges.set(key, narrowRange(range, offset, nbResults, files.length))

		// A photo found while sizing the search was not picked at random.
		if (sized && files.length > 0) {
			return files[0]
		}
	}

	return null
}

/**
 * Pick a random photo of the library, preferring favorites and photos older
 * than a year.
 *
 * @param options - Options the searches are made with
 * @param seenFileIds - Photos already shown, the picked one is added to them
 * @return The photo, `null` when no photo which was not shown yet is found
 */
export async function pickSurprise(options: Partial<PhotoSearchOptions> = {}, seenFileIds: Set<number> = new Set()): Promise<File | null> {
	for (let draw = 0; draw < MAX_DRAWS; draw++) {
		for (const tier of getSurpriseTiers(new Date(), Math.random(), options.onlyFavorites)) {
			const photo = await drawFromTier(tier, options)
			if (photo === null) {
				continue
			}

			if (!seenFileIds.has(photo.fileid as number)) {
				seenFileIds.add(photo.fileid as number)
				return photo
			}
			break
		}
	}

	return null
}

/**
 * Forget what is known about the size of the searches.
 */
export function resetSurpriseRanges(): void {
	ranges.clear()
}
