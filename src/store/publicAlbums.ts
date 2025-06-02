/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotosRootSate } from '.'

import {
	type Album,

	albumsExtraProps,
} from './albums.ts'

export type PublicAlbum = Album & {
	attributes: {
		'original-name': string // The original name of the album.
	}
}

export const publicAlbumsExtraProps = [
	...albumsExtraProps,
	'<nc:original-name />',
]
export const publicAlbumsPrefix = '/photospublic'

const getters = {
	publicAlbums: (_, __, ___, rootGetters): Record<string, PublicAlbum> => rootGetters.collectionsWithPrefix(publicAlbumsPrefix),
	getPublicAlbum: (_, __, rootState: PhotosRootSate) => (publicAlbumName: string): PublicAlbum => rootState.collections.collections[`${publicAlbumsPrefix}/${publicAlbumName}`] as unknown as PublicAlbum || null,
	getPublicAlbumFiles: (_, __, rootState: PhotosRootSate) => (publicAlbumName: string): string[] => rootState.collections.collectionsFiles[`${publicAlbumsPrefix}/${publicAlbumName}`] || [],
	getPublicAlbumName: () => (publicAlbumName: string) => `${publicAlbumsPrefix}/${publicAlbumName}`,
}
export default { getters }
