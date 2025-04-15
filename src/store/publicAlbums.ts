/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @typedef {object} _PublicAlbum
 * @property {string} originalName - The original name of the album.
 * @property {string} location - The user set location of the album.
 *
 * @typedef {import("../services/collectionFetcher").Collection&_PublicAlbum} PublicAlbum
 *
 * @typedef {Object<string, PublicAlbum>} IndexedPublicAlbums
 */

const publicAlbumsPrefix = '/photospublic/'

const getters = {
	publicAlbums: (_, __, ___, rootGetters) => rootGetters.collectionsWithPrefix(publicAlbumsPrefix),
	getPublicAlbum: (_, __, rootState) => publicAlbumName => rootState.collections.collections[`${publicAlbumsPrefix}${publicAlbumName}`] || null,
	getPublicAlbumFiles: (_, __, rootState) => publicAlbumName => rootState.collections.collectionsFiles[`${publicAlbumsPrefix}${publicAlbumName}`] || [],
	getPublicAlbumName: (_, __, ___) => publicAlbumName => `${publicAlbumsPrefix}${publicAlbumName}`,
}
export default { getters }
