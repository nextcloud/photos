/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosFilter } from './PhotosFilter.ts'

import mapMarkerSvg from '@mdi/svg/svg/map-marker.svg?raw'
import { generateUrl } from '@nextcloud/router'
import PlacesOption from '../../components/PhotosFilters/PlaceOption.vue'
import store from '../../store/index.ts'
import { placesPrefix } from '../../store/places.ts'
import { fetchCollections } from '../collectionFetcher.ts'

export type PlacesValueType = string

export const placesFilterId = 'places'

export const placesFilter: PhotosFilter<PlacesValueType> = {
	id: placesFilterId,
	icon: mapMarkerSvg,
	renderOptionComponent: PlacesOption,
	async getOptions() {
		if (Object.values(store.getters.places).length === 0) {
			const collections = await fetchCollections(placesPrefix)
			store.dispatch('addCollections', { collections })
		}

		return Object.values(Object.values(store.getters.places)).map((place) => {
			return {
				filterId: placesFilterId,
				label: place.displayname,
				value: place.displayname,
				imgSrc: generateUrl(`/apps/photos/api/v1/preview/${place.attributes['last-photo']}?x=${64}&y=${64}`),
			}
		})
	},
	getQuery(placesId: PlacesValueType[]): string {
		const dav = placesId.map((placeId) => `
			<d:eq>
				<d:prop><nc:metadata-photos-place/></d:prop>
				<d:literal>${placeId}</d:literal>
			</d:eq>
		`)

		return `<d:or>${dav.join('')}</d:or>`
	},
}
