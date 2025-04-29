/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import type { ShareType } from '@nextcloud/sharing'

import type { Collection } from '../services/collectionFetcher'
import type { PhotosRootSate } from '.'

export type Collaborator = {
	id: string // - The id of the collaborator.
	label: string // - The label of the collaborator for display.
	type: ShareType.User|ShareType.Group|ShareType.Link // - The type of the collaborator.
}

export type Album = Collection & {
	attributes: {
		location: string // - The user set location of the album.
		collaborators: Collaborator[] // - The list of collaborators.
		date: string // The date of the collection.
	}
}

const albumsPrefix = `/photos/${getCurrentUser()?.uid}/albums`

const getters = {
	albums: (_, __, ___, rootGetters): Record<string, Album> => rootGetters.collectionsWithPrefix(albumsPrefix),
	getAlbum: (_, __, rootState: PhotosRootSate) => (albumName: string): Album => rootState.collections.collections[`${albumsPrefix}/${albumName}`] as unknown as Album,
	getAlbumFiles: (_, __, rootState: PhotosRootSate) => (albumName: string): string[] => rootState.collections.collectionsFiles[`${albumsPrefix}/${albumName}`] || [],
	getAlbumName: (_, __, ___) => (albumName: string) => `${albumsPrefix}/${albumName}`,
}
export default { getters }
