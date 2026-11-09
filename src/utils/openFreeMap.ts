/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Map as LeafletMap } from 'leaflet'

import { addMapLibreLayer } from './mapLibreLayer.ts'

const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

export const OPENFREEMAP_ATTRIBUTION = '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> <a href="https://www.openmaptiles.org/">&copy; OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

export function addOpenFreeMapLayer(map: LeafletMap): void {
	addMapLibreLayer(map, OPENFREEMAP_STYLE)
}
