/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png?url'
import iconUrl from 'leaflet/dist/images/marker-icon.png?url'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url'

// see https://vue2-leaflet.netlify.app/quickstart/#marker-icons-are-missing

type D = L.Icon.Default & {
	_getIconUrl?: string
}

delete (L.Icon.Default.prototype as D)._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
})
