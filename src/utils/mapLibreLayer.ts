/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Map as LeafletMap } from 'leaflet'

import { maplibreGL } from '@maplibre/maplibre-gl-leaflet'
import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

import 'maplibre-gl/dist/maplibre-gl.css'

setWorkerUrl(workerUrl)

export function addMapLibreLayer(map: LeafletMap, style: string): void {
	maplibreGL({
		style,
		attributionControl: false,
	}).addTo(map)
}
