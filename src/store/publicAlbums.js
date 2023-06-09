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
