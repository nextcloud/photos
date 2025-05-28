/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import PlacesFilterDisplay from '../../components/PhotosFilters/PlacesFilterDisplay.vue'
import PlacesFilterInput from '../../components/PhotosFilters/PlacesFilterInput.vue'

export type PlacesValueType = string[] | undefined

export const placesFilterId = 'places'

export const placesFilter: PhotosFilter = {
	id: placesFilterId,
	inputComponent: PlacesFilterInput,
	displayComponent: PlacesFilterDisplay,
	getQuery(places: PlacesValueType): string {
		if (places === undefined) {
			return ''
		}

		const dav = places.map((place) => `
			<d:eq>
				<d:prop><nc:metadata-photos-place/></d:prop>
				<d:literal>${place}</d:literal>
			</d:eq>
		`)

		return `<d:or>${dav.join('')}</d:or>`
	},
}
