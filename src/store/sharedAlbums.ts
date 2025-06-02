/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosRootSate } from '.'
import type { Album } from './albums.ts'

import { getCurrentUser } from '@nextcloud/auth'

const sharedAlbumsPrefix = `/photos/${getCurrentUser()?.uid}/sharedalbums`

const getters = {
	sharedAlbums: (_, __, ___, rootGetters): Record<string, Album> => rootGetters.collectionsWithPrefix(sharedAlbumsPrefix),
	getSharedAlbum: (_, __, rootState: PhotosRootSate) => (sharedAlbumName: string): Album => rootState.collections.collections[`${sharedAlbumsPrefix}/${sharedAlbumName}`] as unknown as Album,
	getSharedAlbumFiles: (_, __, rootState: PhotosRootSate) => (sharedAlbumName: string): string[] => rootState.collections.collectionsFiles[`${sharedAlbumsPrefix}/${sharedAlbumName}`] || [],
	getSharedAlbumName: () => (sharedAlbumName: string) => `${sharedAlbumsPrefix}/${sharedAlbumName}`,
}
export default { getters }
