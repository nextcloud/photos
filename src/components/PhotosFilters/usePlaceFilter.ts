/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PlacesValueType } from '../../services/PhotosFilters/placesFilter.ts'

import { generateUrl } from '@nextcloud/router'
import { computed, ref, watch } from 'vue'
import useFetchCollections from '../../mixins/useFetchCollections.ts'
import store from '../../store/index.ts'
import { placesPrefix } from '../../store/places.ts'

type NcSelectPlaceOption = {
	label: string
	previewUrl?: string
}

/**
 *
 * @param props
 * @param emit
 */
export default function(props: Readonly<{ value: PlacesValueType }>, emit: (event: 'update:value', args: PlacesValueType) => void) {
	const { fetchCollections, loadingCollections } = useFetchCollections()

	const availablePlaces = ref<NcSelectPlaceOption[]>([])

	const selectedPlaces = computed<NcSelectPlaceOption[]>({
		get() {
			return (props.value ?? []).map((placeId) => {
				const place = store.getters.getPlace(placeId)

				return {
					label: place?.displayname ?? placeId,
					previewUrl: place ? generateUrl(`/apps/photos/api/v1/preview/${place.attributes['last-photo']}?x=${64}&y=${64}`) : undefined,
				}
			})
		},
		set(newSelectedPlacesValue) {
			if (newSelectedPlacesValue.length === 0) {
				emit('update:value', undefined)
			} else {
				emit('update:value', newSelectedPlacesValue.map((place) => place.label))
			}
		},
	})

	const availablePlacesWithoutSelections = computed(() => availablePlaces.value.filter((option) => !selectedPlaces.value.includes(option)))

	watch(
		() => store.getters.places,
		(value) => {
			availablePlaces.value = Object.values(value).map((place) => {
				return {
					label: place.displayname,
					previewUrl: generateUrl(`/apps/photos/api/v1/preview/${place.attributes['last-photo']}?x=${64}&y=${64}`),
				}
			})
		},
		{ immediate: true },
	)

	if (Object.values(store.getters.places).length === 0) {
		fetchCollections(placesPrefix)
	}

	return {
		availablePlacesWithoutSelections,
		selectedPlaces,
		loadingCollections,
	}
}
