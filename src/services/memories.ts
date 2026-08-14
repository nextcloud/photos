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
