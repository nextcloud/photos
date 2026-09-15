/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ShareType } from '@nextcloud/sharing'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCollectionsStore } from './collections.ts'

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

export const useAlbumsStore = defineStore('albums', () => {
	const collectionsStore = useCollectionsStore()

	const albums = computed(() => collectionsStore.collectionsWithPrefix(albumsPrefix) as unknown as Record<string, Album>)

	/**
	 * @param albumName - Name of the album
	 */
	function getAlbumName(albumName: string): string {
		return `${albumsPrefix}/${albumName}`
	}

	/**
	 * @param albumName - Name of the album
	 */
	function getAlbum(albumName: string): Album {
		return collectionsStore.collections[getAlbumName(albumName)] as unknown as Album
	}

	/**
	 * @param albumName - Name of the album
	 */
	function getAlbumFiles(albumName: string): string[] {
		return collectionsStore.collectionsFiles[getAlbumName(albumName)] || []
	}

	return { albums, getAlbumName, getAlbum, getAlbumFiles }
})
