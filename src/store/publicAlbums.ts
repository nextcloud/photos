/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from './albums.ts'

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { albumsExtraProps } from './albums.ts'
import { useCollectionsStore } from './collections.ts'

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

export const usePublicAlbumsStore = defineStore('publicAlbums', () => {
	const collectionsStore = useCollectionsStore()

	const publicAlbums = computed(() => collectionsStore.collectionsWithPrefix(publicAlbumsPrefix) as unknown as Record<string, PublicAlbum>)

	/**
	 * @param publicAlbumName - Name of the public album
	 */
	function getPublicAlbumName(publicAlbumName: string): string {
		return `${publicAlbumsPrefix}/${publicAlbumName}`
	}

	/**
	 * @param publicAlbumName - Name of the public album
	 */
	function getPublicAlbum(publicAlbumName: string): PublicAlbum | null {
		return collectionsStore.collections[getPublicAlbumName(publicAlbumName)] as unknown as PublicAlbum || null
	}

	/**
	 * @param publicAlbumName - Name of the public album
	 */
	function getPublicAlbumFiles(publicAlbumName: string): string[] {
		return collectionsStore.collectionsFiles[getPublicAlbumName(publicAlbumName)] || []
	}

	return { publicAlbums, getPublicAlbumName, getPublicAlbum, getPublicAlbumFiles }
})
