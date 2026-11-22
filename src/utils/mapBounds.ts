/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import L from 'leaflet'

/**
 * Keep the items whose marker is within the given bounds of the map.
 *
 * Markers are only drawn at their own longitude, not on the copies of the
 * world shown beside it when the map is panned past the antimeridian, so the
 * bounds are not wrapped either.
 *
 * @param items - The items to filter, their order is kept
 * @param getLatLng - Get the position of an item
 * @param bounds - The bounds of the visible area of the map
 */
export function itemsInBounds<T>(items: T[], getLatLng: (item: T) => [number, number], bounds: L.LatLngBounds): T[] {
	return items.filter((item) => bounds.contains(L.latLng(getLatLng(item))))
}
