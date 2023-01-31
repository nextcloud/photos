/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
	getAlbum: (_, __, rootState) => albumName => rootState.collections.collections[`${albumsPrefix}${albumName}`] || null,
	getAlbumFiles: (_, __, rootState) => albumName => rootState.collections.collectionsFiles[`${albumsPrefix}${albumName}`] || [],
	getAlbumName: (_, __, ___) => albumName => `${albumsPrefix}${albumName}`,
}
export default { getters }
