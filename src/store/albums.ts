/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ShareType } from '@nextcloud/sharing'
import type { PhotosRootSate } from '.'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'

export type Collaborator = {
	id: string // - The id of the collaborator.
	label: string // - The label of the collaborator for display.
	type: ShareType.User | ShareType.Group | ShareType.Link // - The type of the collaborator.
}

export type AlbumEditableProperties = {
	location: string // - The user set location of the album.
	collaborators: Collaborator[] // - The list of collaborators.
	filters?: Record<string, unknown[]> // - The list of filters.
}

export type Album = Collection & {
	attributes: AlbumEditableProperties & {
		date: string // The date of the collection.
	}
}

export const albumsExtraProps = [
	'<nc:location />',
	'<nc:dateRange />',
	'<nc:collaborators />',
	'<nc:filters />',
]

export const albumFilesExtraProps = ['<nc:photos-album-file-origin />']

export const albumsPrefix = `/photos/${getCurrentUser()?.uid}/albums`

const getters = {
	albums: (_, __, ___, rootGetters): Record<string, Album> => rootGetters.collectionsWithPrefix(albumsPrefix),
	getAlbum: (_, __, rootState: PhotosRootSate) => (albumName: string): Album => rootState.collections.collections[`${albumsPrefix}/${albumName}`] as unknown as Album,
	getAlbumFiles: (_, __, rootState: PhotosRootSate) => (albumName: string): string[] => rootState.collections.collectionsFiles[`${albumsPrefix}/${albumName}`] || [],
	getAlbumName: () => (albumName: string) => `${albumsPrefix}/${albumName}`,
}
export default { getters }
