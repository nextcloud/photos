/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import type { Album } from './albums'
import type { PhotoNode } from '../utils/fileUtils'

const sharedAlbumsPrefix = `/photos/${getCurrentUser()?.uid}/sharedalbums/`

const getters = {
	sharedAlbums: (_, __, ___, rootGetters): Album[] => rootGetters.collectionsWithPrefix(sharedAlbumsPrefix),
	getSharedAlbum: (_, __, rootState) => (sharedAlbumName): Album => rootState.collections.collections[`${sharedAlbumsPrefix}${sharedAlbumName}`],
	getSharedAlbumFiles: (_, __, rootState) => (sharedAlbumName): PhotoNode[] => rootState.collections.collectionsFiles[`${sharedAlbumsPrefix}${sharedAlbumName}`] || [],
	getSharedAlbumName: (_, __, ___) => sharedAlbumName => `${sharedAlbumsPrefix}${sharedAlbumName}`,
}
export default { getters }
