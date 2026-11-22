/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import L from 'leaflet'
import { describe, expect, test } from 'vitest'
import { clusterMarkers } from './mapClusters.ts'

type Item = { id: string, latLng: [number, number] }

const ZOOM = 8
const RADIUS = 64

/**
 * Items on the equator, placed the given number of pixels east of the prime
 * meridian at `ZOOM`, and named after their offset.
 *
 * @param offsets - Pixel offset of each item
 */
function itemsAt(offsets: number[]): Item[] {
	return offsets.map((offset) => ({
		id: `${offset}`,
		latLng: [0, offset * 360 / (256 * 2 ** ZOOM)],
	}))
}

/**
 * @param items - The items to group
 * @param zoom - The zoom level to group them at
 * @return The names of the items of each cluster
 */
function cluster(items: Item[], zoom = ZOOM): string[][] {
	return clusterMarkers(items, (item) => item.latLng, zoom, RADIUS)
		.map((cluster) => cluster.items.map((item) => item.id))
}

describe('clusterMarkers', () => {
	test('groups nothing when there are no items', () => {
		expect(cluster([])).toEqual([])
	})

	test('leaves items far apart on their own', () => {
		expect(cluster(itemsAt([0, 100, 200]))).toEqual([['0'], ['100'], ['200']])
	})

	test('groups close items, keeping their order', () => {
		expect(cluster(itemsAt([10, 50, 30, 300]))).toEqual([['10', '50', '30'], ['300']])
	})

	test('shows a cluster where its first item is', () => {
		const items = itemsAt([10, 50])
		expect(clusterMarkers(items, (item) => item.latLng, ZOOM, RADIUS)[0].latLng).toBe(items[0].latLng)
	})

	test('splits clusters as the map is zoomed in', () => {
		const items = itemsAt([0, 20, 40])
		expect(cluster(items, ZOOM)).toEqual([['0', '20', '40']])
		expect(cluster(items, ZOOM + 1)).toEqual([['0', '20'], ['40']])
		expect(cluster(items, ZOOM + 2)).toEqual([['0'], ['20'], ['40']])
	})

	test('groups items at the very same place at any zoom level', () => {
		const items = itemsAt([0, 0])
		expect(cluster(items, 18)).toEqual([['0', '0']])
	})

	test('adds an item to the nearest cluster', () => {
		expect(cluster(itemsAt([0, 100, 70]))).toEqual([['0'], ['100', '70']])
		expect(cluster(itemsAt([0, 100, 30]))).toEqual([['0', '30'], ['100']])
	})

	test('keeps clusters at least the radius apart on one of the axes', () => {
		let seed = 1
		const random = () => {
			seed = (seed * 16807) % 2147483647
			return seed / 2147483647
		}
		const items: Item[] = Array.from({ length: 500 }, (_, index) => ({
			id: `${index}`,
			latLng: [45 + random() * 2, 5 + random() * 2],
		}))

		const clusters = clusterMarkers(items, (item) => item.latLng, ZOOM, RADIUS)
		const points = clusters.map((cluster) => L.CRS.EPSG3857.latLngToPoint(L.latLng(cluster.latLng), ZOOM))

		expect(clusters.flatMap((cluster) => cluster.items)).toHaveLength(items.length)
		for (let i = 0; i < points.length; i++) {
			for (let j = i + 1; j < points.length; j++) {
				const distance = Math.max(Math.abs(points[i].x - points[j].x), Math.abs(points[i].y - points[j].y))
				expect(distance).toBeGreaterThanOrEqual(RADIUS)
			}
		}
	})
})
