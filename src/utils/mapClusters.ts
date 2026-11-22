/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import L from 'leaflet'

export type MapCluster<T> = {
	/** The items of the cluster, the one it was started from first. */
	items: T[]
	/** Position of the first item, where the cluster is shown. */
	latLng: [number, number]
}

type Seed<T> = {
	x: number
	y: number
	cluster: MapCluster<T>
}

/**
 * Group the items that would be shown less than `radius` pixels apart on the
 * map at the given zoom level.
 *
 * Items are taken in order: each one joins the nearest cluster started within
 * `radius` pixels of it on both axes, or starts a new one. Cluster positions
 * are therefore always at least `radius` pixels apart on one of the axes, so
 * markers no larger than that never overlap.
 *
 * @param items - The items to group, the most relevant first
 * @param getLatLng - Get the position of an item
 * @param zoom - The zoom level of the map
 * @param radius - Distance in pixels below which items are grouped
 */
export function clusterMarkers<T>(
	items: T[],
	getLatLng: (item: T) => [number, number],
	zoom: number,
	radius: number,
): MapCluster<T>[] {
	const clusters: MapCluster<T>[] = []
	// Cluster seeds indexed by grid cells of `radius` pixels, so only the
	// surrounding cells are searched for a cluster to join.
	const grid = new Map<string, Seed<T>[]>()

	for (const item of items) {
		const latLng = getLatLng(item)
		const { x, y } = L.CRS.EPSG3857.latLngToPoint(L.latLng(latLng), zoom)
		const cellX = Math.floor(x / radius)
		const cellY = Math.floor(y / radius)

		let nearest: Seed<T> | undefined
		let nearestDistance = Infinity
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (const seed of grid.get(`${cellX + dx}:${cellY + dy}`) ?? []) {
					const distance = Math.max(Math.abs(seed.x - x), Math.abs(seed.y - y))
					if (distance < radius && distance < nearestDistance) {
						nearest = seed
						nearestDistance = distance
					}
				}
			}
		}

		if (nearest) {
			nearest.cluster.items.push(item)
			continue
		}

		const cluster = { items: [item], latLng }
		clusters.push(cluster)
		const key = `${cellX}:${cellY}`
		grid.set(key, [...(grid.get(key) ?? []), { x, y, cluster }])
	}

	return clusters
}
