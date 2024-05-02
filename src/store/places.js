/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'

const placesPrefix = `/photos/${getCurrentUser()?.uid}/places/`

const getters = {
	places: (_, __, ___, rootGetters) => rootGetters.collectionsWithPrefix(placesPrefix),
	getPlace: (_, __, rootState) => placeName => rootState.collections.collections[`${placesPrefix}${placeName}`] || null,
	getPlaceFiles: (_, __, rootState) => placeName => rootState.collections.collectionsFiles[`${placesPrefix}${placeName}`] || [],
}

export default { getters }
