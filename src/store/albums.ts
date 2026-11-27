/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ShareType } from '@nextcloud/sharing'
import type { Collection } from '../services/collectionFetcher.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { InvalidFilenameError, InvalidFilenameErrorReason, validateFilename } from '@nextcloud/files'
import { resultToNode } from '@nextcloud/files/dav'
import { t } from '@nextcloud/l10n'
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { formatMonthAndYear } from '../utils/dateUtils.ts'
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

/**
 * Build the local node of an album that is about to be created.
 *
 * @param albumName - Name of the album
 * @param properties - Properties it starts with
 */
export function buildLocalAlbum(albumName: string, properties: Partial<AlbumEditableProperties> = {}): Album {
	return resultToNode({
		basename: albumName,
		filename: `${albumsPrefix}/${albumName}`,
		lastmod: '',
		size: 0,
		type: 'directory',
		etag: null,
		props: {
			displayname: albumName,
			resourcetype: {},
			nbItems: 0,
			location: properties.location ?? '',
			'last-photo': -1,
			date: formatMonthAndYear(new Date()),
			collaborators: properties.collaborators ?? [],
			filters: properties.filters ?? {},
			source: generateRemoteUrl(`dav${albumsPrefix}/${albumName}`),
		},
	}, albumsPrefix) as Album
}

/**
 * Tell why a name cannot be given to an album.
 *
 * @param albumName - Name to check
 * @return The reason to show the user, or `undefined` for a valid name
 */
export function getAlbumNameError(albumName: string): string | undefined {
	try {
		validateFilename(albumName)
	} catch (error) {
		if (!(error instanceof InvalidFilenameError)) {
			throw error
		}

		switch (error.reason) {
			case InvalidFilenameErrorReason.Character:
				return t('files', '"{char}" is not allowed inside a filename.', { char: error.segment })
			case InvalidFilenameErrorReason.ReservedName:
				return undefined // We don't need to enforce that for albums.
			case InvalidFilenameErrorReason.Extension:
				return undefined // We don't need to enforce that for albums.
			default:
				return t('files', 'Invalid filename.')
		}
	}

	return undefined
}

/**
 * Absolute address of the public page of an album shared by link.
 *
 * @param token - Token of the link collaborator
 */
export function getPublicAlbumLink(token: string): string {
	return `${window.location.protocol}//${window.location.host}${generateUrl(`apps/photos/public/${token}`)}`
}

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
