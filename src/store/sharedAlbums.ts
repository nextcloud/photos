/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import type { Album } from './albums'
import type { PhotosRootSate } from '.'

const sharedAlbumsPrefix = `/photos/${getCurrentUser()?.uid}/sharedalbums`

const getters = {
	sharedAlbums: (_, __, ___, rootGetters): Album[] => rootGetters.collectionsWithPrefix(sharedAlbumsPrefix) as unknown as Album[],
	getSharedAlbum: (_, __, rootState: PhotosRootSate) => (sharedAlbumName: string): Album => rootState.collections.collections[`${sharedAlbumsPrefix}/${sharedAlbumName}`] as unknown as Album,
	getSharedAlbumFiles: (_, __, rootState: PhotosRootSate) => (sharedAlbumName: string): string[] => rootState.collections.collectionsFiles[`${sharedAlbumsPrefix}/${sharedAlbumName}`] || [],
	getSharedAlbumName: (_, __, ___) => (sharedAlbumName: string) => `${sharedAlbumsPrefix}/${sharedAlbumName}`,
}
export default { getters }
