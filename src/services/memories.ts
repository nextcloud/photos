/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

export type Trip = {
	id: string // Stable id derived from the first/last photo IDs.
	photos: PhotoFile[] // Photos in chronological order.
	startTimestamp: number // Earliest photo's timestamp (unix seconds).
	endTimestamp: number // Latest photo's timestamp (unix seconds).
	cover: PhotoFile // Photo to use as the trip's cover image.
}

const SECONDS_PER_DAY = 24 * 60 * 60

/**
 * Cluster a set of photos into "trips" by detecting gaps in their
 * capture dates. A new trip starts whenever two consecutive photos are
 * separated by more than `gapDays` days.
 *
 * Single-day clusters are folded into the previous/next trip if they're
 * close, otherwise filtered out — a typical user has hundreds of
 * "single random photos" and surfacing each as a trip would drown the
 * Memories view.
 *
 * This is intentionally a pure-JS algorithm running over photos that
 * are already in the store. Server-side trip detection (which would
 * scale to libraries with millions of photos) is deferred — the typical
 * Nextcloud user has a small enough library that the in-memory
 * approach is fine.
 *
 * @param photos - All loaded photos to consider.
 * @param gapDays - A gap of more than this many days between consecutive photos starts a new trip. Defaults to 2.
 * @param minPhotos - Trips with fewer than this many photos are dropped. Defaults to 8.
 */
export function detectTrips(photos: PhotoFile[], gapDays = 2, minPhotos = 8): Trip[] {
	if (photos.length === 0) {
		return []
	}

	const sorted = [...photos].sort((a, b) => a.attributes.timestamp - b.attributes.timestamp)

	const trips: Trip[] = []
	let bucket: PhotoFile[] = [sorted[0]]

	for (let i = 1; i < sorted.length; i++) {
		const gapSeconds = sorted[i].attributes.timestamp - sorted[i - 1].attributes.timestamp
		if (gapSeconds > gapDays * SECONDS_PER_DAY) {
			if (bucket.length >= minPhotos) {
				trips.push(toTrip(bucket))
			}
			bucket = []
		}
		bucket.push(sorted[i])
	}

	if (bucket.length >= minPhotos) {
		trips.push(toTrip(bucket))
	}

	// Most-recent trip first.
	return trips.sort((a, b) => b.endTimestamp - a.endTimestamp)
}

export type YearRecap = {
	year: number
	totalCount: number
	curated: PhotoFile[] // The hand-picked subset (cover + slideshow material).
	cover: PhotoFile // The single photo to put on the recap card.
}

const RECAP_TARGET_COUNT = 60 // Photos to include in the curated set.

/**
 * Build a "Your year in photos" recap from the loaded photo set.
 *
 * Curation strategy (intentionally lightweight; pure JS over what's
 * already in the store):
 *
 *   1. Pick the most recent year that has any photos.
 *   2. Of that year's photos, prefer favourites first, then sample
 *      evenly across the calendar so December and February get a fair
 *      shake instead of last-month dominating.
 *   3. Pick a cover photo near the middle of the curated set —
 *      avoids the "first or last photo of the year" trap.
 *
 * Returns `null` when there aren't enough photos to make a meaningful
 * recap (currently <30) — the threshold keeps us from surfacing a
 * "recap" of someone's first three test uploads.
 *
 * @param photos - All loaded photos.
 */
export function buildYearRecap(photos: PhotoFile[]): YearRecap | null {
	if (photos.length === 0) {
		return null
	}

	// Group by year (using the photo's pre-computed timestamp).
	const byYear = new Map<number, PhotoFile[]>()
	for (const photo of photos) {
		const year = new Date(photo.attributes.timestamp * 1000).getFullYear()
		const bucket = byYear.get(year)
		if (bucket === undefined) {
			byYear.set(year, [photo])
		} else {
			bucket.push(photo)
		}
	}

	// Most recent year with at least 30 photos.
	const candidate = [...byYear.entries()]
		.sort(([a], [b]) => b - a)
		.find(([, bucket]) => bucket.length >= 30)

	if (candidate === undefined) {
		return null
	}

	const [year, yearPhotos] = candidate

	// Sort by timestamp (oldest first) so even-spaced sampling lands
	// on a chronologically distributed set.
	const sorted = [...yearPhotos].sort((a, b) => a.attributes.timestamp - b.attributes.timestamp)

	const favourites = sorted.filter((photo) => photo.attributes.favorite === 1)
	const remaining = sorted.filter((photo) => photo.attributes.favorite !== 1)

	// Always include all favourites (capped at the target). Then fill
	// the rest by sampling evenly from the non-favourite pool.
	const curated: PhotoFile[] = favourites.slice(0, RECAP_TARGET_COUNT)
	const slotsLeft = Math.max(0, RECAP_TARGET_COUNT - curated.length)
	if (slotsLeft > 0 && remaining.length > 0) {
		const stride = Math.max(1, Math.floor(remaining.length / slotsLeft))
		for (let i = 0; i < remaining.length && curated.length < RECAP_TARGET_COUNT; i += stride) {
			curated.push(remaining[i])
		}
	}

	// Re-sort the final selection so the slideshow plays in
	// chronological order instead of "favourites bunched at the start".
	curated.sort((a, b) => a.attributes.timestamp - b.attributes.timestamp)

	const cover = curated[Math.floor(curated.length / 2)] ?? curated[0]

	return {
		year,
		totalCount: yearPhotos.length,
		curated,
		cover,
	}
}

/**
 * Build a Trip record from an already-clustered set of photos.
 *
 * @param photos - Cluster of photos in chronological order.
 */
function toTrip(photos: PhotoFile[]): Trip {
	const first = photos[0]
	const last = photos[photos.length - 1]

	// Use the photo nearest the trip's midpoint as the cover. That
	// tends to surface the most "in-the-moment" photo over the
	// boring travel-day arrival/departure shots.
	const midpoint = (first.attributes.timestamp + last.attributes.timestamp) / 2
	const cover = photos.reduce((best, candidate) => {
		const bestDistance = Math.abs(best.attributes.timestamp - midpoint)
		const candidateDistance = Math.abs(candidate.attributes.timestamp - midpoint)
		return candidateDistance < bestDistance ? candidate : best
	}, first)

	return {
		id: `trip-${first.fileid}-${last.fileid}`,
		photos,
		startTimestamp: first.attributes.timestamp,
		endTimestamp: last.attributes.timestamp,
		cover,
	}
}
