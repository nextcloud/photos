/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosRootSate } from '.'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'

export const placesPrefix = `/photos/${getCurrentUser()?.uid}/places`

const getters = {
	places: (_, __, ___, rootGetters): Record<string, Collection[]> => rootGetters.collectionsWithPrefix(placesPrefix),
	getPlace: (_, __, rootState: PhotosRootSate) => (placeName: string): Collection => rootState.collections.collections[`${placesPrefix}/${placeName}`] || null,
	getPlaceFiles: (_, __, rootState: PhotosRootSate) => (placeName: string) => rootState.collections.collectionsFiles[`${placesPrefix}/${placeName}`] || [],
}

export default { getters }
