/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'

/**
 * @typedef {object} Collaborator
 * @property {string} id - The id of the collaborator.
 * @property {string} label - The label of the collaborator for display.
 * @property {Type.SHARE_TYPE_USER|Type.SHARE_TYPE_GROUP|Type.SHARE_TYPE_LINK} type - The type of the collaborator.
 *
 * @typedef {object} _Album
 * @property {string} location - The user set location of the album.
 * @property {Collaborator[]} collaborators - The file id for the cover of the collection.
 *
 * @typedef {import("../services/collectionFetcher").Collection&_Album} Album
 *
 * @typedef {Object<string, Album>} IndexedAlbums
 * @typedef {Object<string, Collaborator>} IndexedCollaborators
 */

const albumsPrefix = `/photos/${getCurrentUser()?.uid}/albums/`

const getters = {
	albums: (_, __, ___, rootGetters) => rootGetters.collectionsWithPrefix(albumsPrefix),
	getAlbum: (_, __, rootState) => albumName => rootState.collections.collections[`${albumsPrefix}${albumName}`],
	getAlbumFiles: (_, __, rootState) => albumName => rootState.collections.collectionsFiles[`${albumsPrefix}${albumName}`] || [],
	getAlbumName: (_, __, ___) => albumName => `${albumsPrefix}${albumName}`,
}
export default { getters }
