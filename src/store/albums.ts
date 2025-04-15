/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUser } from '@nextcloud/auth'
import type { ShareType } from '@nextcloud/sharing'

import type { Collection } from '../services/collectionFetcher'
import type { PhotoNode } from '../utils/fileUtils'

type Collaborator = {
	id: string // - The id of the collaborator.
	label: string // - The label of the collaborator for display.
	type: ShareType.User|ShareType.Group|ShareType.Link // - The type of the collaborator.
}

export type Album = Collection & {
	location: string // - The user set location of the album.
	collaborators: Collaborator[] // - The list of collaborators.
}

const albumsPrefix = `/photos/${getCurrentUser()?.uid}/albums/`

const getters = {
	albums: (_, __, ___, rootGetters): Album[] => rootGetters.collectionsWithPrefix(albumsPrefix),
	getAlbum: (_, __, rootState) => (albumName): Album => rootState.collections.collections[`${albumsPrefix}${albumName}`],
	getAlbumFiles: (_, __, rootState) => (albumName): PhotoNode[] => rootState.collections.collectionsFiles[`${albumsPrefix}${albumName}`] || [],
	getAlbumName: (_, __, ___) => albumName => `${albumsPrefix}${albumName}`,
}
export default { getters }
