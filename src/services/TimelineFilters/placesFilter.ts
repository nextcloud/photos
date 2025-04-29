/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { TimelineFilter } from './TimelineFilter.ts'
import PlacesFilter from '../../components/TimelineFilters/PlacesFilter.vue'

export type PlacesValueType = string[]|undefined

export const placesFilterId = 'places'

export const placesFilter: TimelineFilter = {
	id: placesFilterId,
	component: PlacesFilter,
	getQuery(places: PlacesValueType): string {
		if (places === undefined) {
			return ''
		}

		const dav = places.map(place => `
			<d:eq>
				<d:prop><nc:metadata-photos-place/></d:prop>
				<d:literal>${place}</d:literal>
			</d:eq>
		`)

		return `<d:or>${dav.join('')}</d:or>`
	},
}
