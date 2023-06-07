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
