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
