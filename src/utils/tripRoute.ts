/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MapCluster } from './mapClusters.ts'

import L from 'leaflet'

type Timestamped = { attributes: { timestamp: number } }

/** Distance in metres below which consecutive photos share a stop. */
const MIN_STOP_DISTANCE = 25

/** Time a stop is shown for at normal speed, in milliseconds. */
const MAX_STEP_DURATION = 1500

/** Time below which stops would follow each other too fast to be looked at. */
const MIN_STEP_DURATION = 250

/** Time a whole route aims not to exceed at normal speed, in milliseconds. */
const MAX_ROUTE_DURATION = 60_000

/**
 * Merge the consecutive items less than `minDistance` metres away from the
 * item a stop was started from into that stop.
 *
 * @param items - The items, in the order they are travelled through
 * @param getLatLng - Get the position of an item
 * @param minDistance - Distance in metres below which items share a stop
 */
export function simplifyRoute<T>(
	items: T[],
	getLatLng: (item: T) => [number, number],
	minDistance: number,
): MapCluster<T>[] {
	const stops: MapCluster<T>[] = []

	for (const item of items) {
		const latLng = getLatLng(item)
		const stop = stops[stops.length - 1]

		if (stop && L.latLng(stop.latLng).distanceTo(latLng) < minDistance) {
			stop.items.push(item)
		} else {
			stops.push({ items: [item], latLng })
		}
	}

	return stops
}

/**
 * Build the route going through the given photos in the order they were taken.
 *
 * Photos taken at the same place share a stop. Routes with more than `maxStops`
 * stops are simplified further, by doubling the distance under which photos
 * share a stop until the route is short enough.
 *
 * @param photos - The photos to go through, in any order
 * @param getLatLng - Get the position of a photo
 * @param maxStops - Maximum number of stops of the route
 */
export function buildRoute<T extends Timestamped>(
	photos: T[],
	getLatLng: (photo: T) => [number, number],
	maxStops: number,
): MapCluster<T>[] {
	const chronological = [...photos].sort((photo1, photo2) => photo1.attributes.timestamp - photo2.attributes.timestamp)

	let minDistance = MIN_STOP_DISTANCE
	let stops = simplifyRoute(chronological, getLatLng, minDistance)
	while (stops.length > Math.max(maxStops, 1)) {
		minDistance *= 2
		stops = simplifyRoute(chronological, getLatLng, minDistance)
	}

	return stops
}

/**
 * Time each stop of a route is shown for. Long routes are played faster so that
 * they do not take much more than a minute at normal speed.
 *
 * @param stopCount - Number of stops of the route
 * @param speed - Playback speed, `1` being the normal one
 * @return The duration in milliseconds
 */
export function getStepDuration(stopCount: number, speed: number): number {
	const duration = Math.min(MAX_STEP_DURATION, Math.max(MIN_STEP_DURATION, MAX_ROUTE_DURATION / Math.max(stopCount, 1)))
	return duration / speed
}
