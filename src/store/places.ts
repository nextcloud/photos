/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCollectionsStore } from './collections.ts'

export const placesPrefix = `/photos/${getCurrentUser()?.uid}/places`

export const usePlacesStore = defineStore('places', () => {
	const collectionsStore = useCollectionsStore()

	const places = computed(() => collectionsStore.collectionsWithPrefix(placesPrefix))

	/**
	 * @param placeName - Name of the place
	 */
	function getPlace(placeName: string): Collection | null {
		return collectionsStore.collections[`${placesPrefix}/${placeName}`] || null
	}

	/**
	 * @param placeName - Name of the place
	 */
	function getPlaceFiles(placeName: string): string[] {
		return collectionsStore.collectionsFiles[`${placesPrefix}/${placeName}`] || []
	}

	return { places, getPlace, getPlaceFiles }
})
