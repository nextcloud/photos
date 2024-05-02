/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'

/**
 * @typedef {import("./albums").Album} _SharedAlbum
 *
 * @typedef {import("../services/collectionFetcher").Collection&_SharedAlbum} SharedAlbum
 *
 * @typedef {Object<string, SharedAlbum>} IndexedSharedAlbums
 */

const sharedAlbumsPrefix = `/photos/${getCurrentUser()?.uid}/sharedalbums/`

const getters = {
	sharedAlbums: (_, __, ___, rootGetters) => rootGetters.collectionsWithPrefix(sharedAlbumsPrefix),
	getSharedAlbum: (_, __, rootState) => sharedAlbumName => rootState.collections.collections[`${sharedAlbumsPrefix}${sharedAlbumName}`] || undefined,
	getSharedAlbumFiles: (_, __, rootState) => sharedAlbumName => rootState.collections.collectionsFiles[`${sharedAlbumsPrefix}${sharedAlbumName}`] || [],
	getSharedAlbumName: (_, __, ___) => sharedAlbumName => `${sharedAlbumsPrefix}${sharedAlbumName}`,
}
export default { getters }
