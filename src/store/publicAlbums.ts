/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from "../services/collectionFetcher"

export type PublicAlbum = Collection & {
	originalName: string // The original name of the album.
	location: string // The user set location of the album.
}

const publicAlbumsPrefix = '/photospublic/'

const getters = {
	publicAlbums: (_, __, ___, rootGetters): PublicAlbum[] => rootGetters.collectionsWithPrefix(publicAlbumsPrefix),
	getPublicAlbum: (_, __, rootState) => (publicAlbumName): PublicAlbum => rootState.collections.collections[`${publicAlbumsPrefix}${publicAlbumName}`] || null,
	getPublicAlbumFiles: (_, __, rootState) => publicAlbumName => rootState.collections.collectionsFiles[`${publicAlbumsPrefix}${publicAlbumName}`] || [],
	getPublicAlbumName: (_, __, ___) => publicAlbumName => `${publicAlbumsPrefix}${publicAlbumName}`,
}
export default { getters }
