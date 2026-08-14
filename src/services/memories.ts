/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

export type Trip = {
	/** Stable id, derived from the first and the last photo of the trip. */
	id: string
	/** Photos of the trip, in chronological order. */
	photos: PhotoFile[]
	/** Capture time of the earliest photo, in unix seconds. */
	startTimestamp: number
	/** Capture time of the latest photo, in unix seconds. */
	endTimestamp: number
	/** Photo to use as the cover of the trip. */
	cover: PhotoFile
}

const SECONDS_PER_DAY = 24 * 60 * 60

/**
 * Cluster photos into "trips" by detecting gaps in their capture dates:
 * a new cluster is started whenever two consecutive photos are more than
 * `gapDays` apart. Clusters with less than `minPhotos` photos are dropped,
 * as a library typically contains a lot of isolated photos which would
 * otherwise drown the meaningful clusters.
 *
 * @param photos - Photos to cluster
 * @param gapDays - Number of days between two photos that starts a new trip
 * @param minPhotos - Minimum number of photos for a cluster to be a trip
 * @return The trips, most recent first
 */
export function detectTrips(photos: PhotoFile[], gapDays: number = 2, minPhotos: number = 8): Trip[] {
	const sortedPhotos = [...photos].sort((photo1, photo2) => photo1.attributes.timestamp - photo2.attributes.timestamp)

	const trips: Trip[] = []
	let cluster: PhotoFile[] = []

	for (const photo of sortedPhotos) {
		const previousPhoto = cluster[cluster.length - 1]

		if (previousPhoto !== undefined && photo.attributes.timestamp - previousPhoto.attributes.timestamp > gapDays * SECONDS_PER_DAY) {
			if (cluster.length >= minPhotos) {
				trips.push(toTrip(cluster))
			}
			cluster = []
		}

		cluster.push(photo)
	}

	if (cluster.length >= minPhotos) {
		trips.push(toTrip(cluster))
	}

	return trips.sort((trip1, trip2) => trip2.endTimestamp - trip1.endTimestamp)
}

export type YearRecap = {
	/** Year the recap covers. */
	year: number
	/** Number of photos taken during that year. */
	totalCount: number
	/** Photos selected for the recap, in chronological order. */
	highlights: PhotoFile[]
	/** Photo to use as the cover of the recap. */
	cover: PhotoFile
}

/** Number of photos a recap aims for. */
const RECAP_HIGHLIGHT_COUNT = 60

/** Below this, a year does not hold enough material to be worth a recap. */
const RECAP_MIN_PHOTOS = 30

/**
 * Build a "year in photos" recap out of the loaded photos, for the most recent
 * year holding enough of them.
 *
 * @param photos - Photos to build the recap from
 * @return The recap, `null` when no year has enough photos
 */
export function buildYearRecap(photos: PhotoFile[]): YearRecap | null {
	const years = [...groupPhotos(photos, (photo) => getCaptureDate(photo).getFullYear()).entries()]
		.sort(([year1], [year2]) => year2 - year1)

	const recapYear = years.find(([, yearPhotos]) => yearPhotos.length >= RECAP_MIN_PHOTOS)
	if (recapYear === undefined) {
		return null
	}

	const [year, yearPhotos] = recapYear
	const highlights = pickHighlights(yearPhotos)

	return {
		year,
		totalCount: yearPhotos.length,
		highlights,
		// A photo from the middle of the year is more representative than the
		// first or the last one of it.
		cover: highlights[Math.floor(highlights.length / 2)],
	}
}

/**
 * Select the photos of a recap: all the favorites first, then a share of every
 * month until the recap is full.
 *
 * @param photos - Photos taken during the year of the recap
 * @return The selected photos, in chronological order
 */
function pickHighlights(photos: PhotoFile[]): PhotoFile[] {
	const chronological = [...photos].sort((photo1, photo2) => photo1.attributes.timestamp - photo2.attributes.timestamp)

	const highlights = new Set(chronological
		.filter((photo) => photo.attributes.favorite === 1)
		.slice(0, RECAP_HIGHLIGHT_COUNT))

	const months = [...groupPhotos(
		chronological.filter((photo) => !highlights.has(photo)),
		(photo) => getCaptureDate(photo).getMonth(),
	).values()]

	// Photos are not evenly spread over a year, so the free slots are shared
	// between the months rather than between the photos: this keeps a single
	// busy month from taking over the whole recap. Months holding less photos
	// than their share leave their remaining slots to the following ones.
	for (const [monthIndex, month] of months.entries()) {
		const quota = Math.min(month.length, Math.ceil((RECAP_HIGHLIGHT_COUNT - highlights.size) / (months.length - monthIndex)))

		// Spread the picks over the month instead of taking its first photos.
		for (let index = 0; index < quota; index++) {
			highlights.add(month[Math.floor((index * month.length) / quota)])
		}
	}

	return [...highlights].sort((photo1, photo2) => photo1.attributes.timestamp - photo2.attributes.timestamp)
}

/**
 * @param photo - Photo to get the capture date of
 */
function getCaptureDate(photo: PhotoFile): Date {
	return new Date(photo.attributes.timestamp * 1000)
}

/**
 * @param photos - Photos to group
 * @param getKey - Gives the group a photo belongs to
 * @return The groups, in the order their first photo appears in
 */
function groupPhotos<Key>(photos: PhotoFile[], getKey: (photo: PhotoFile) => Key): Map<Key, PhotoFile[]> {
	const groups = new Map<Key, PhotoFile[]>()

	for (const photo of photos) {
		const key = getKey(photo)
		const group = groups.get(key)

		if (group === undefined) {
			groups.set(key, [photo])
		} else {
			group.push(photo)
		}
	}

	return groups
}

/**
 * Build a trip out of an already clustered set of photos.
 *
 * @param photos - Photos of the cluster, in chronological order
 */
function toTrip(photos: PhotoFile[]): Trip {
	const first = photos[0]
	const last = photos[photos.length - 1]

	// The photo closest to the middle of the trip is used as the cover, as it
	// is more likely to be representative than the arrival or departure ones.
	const middleTimestamp = (first.attributes.timestamp + last.attributes.timestamp) / 2
	const cover = photos.reduce((closest, photo) => {
		const closestDistance = Math.abs(closest.attributes.timestamp - middleTimestamp)
		const distance = Math.abs(photo.attributes.timestamp - middleTimestamp)
		return distance < closestDistance ? photo : closest
	}, first)

	return {
		id: `trip-${first.fileid}-${last.fileid}`,
		photos,
		startTimestamp: first.attributes.timestamp,
		endTimestamp: last.attributes.timestamp,
		cover,
	}
}
