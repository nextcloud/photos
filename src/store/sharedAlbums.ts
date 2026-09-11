/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Album } from './albums.ts'

import { getCurrentUser } from '@nextcloud/auth'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import useCollectionsStore from './collections.ts'

const sharedAlbumsPrefix = `/photos/${getCurrentUser()?.uid}/sharedalbums`

export default defineStore('sharedAlbums', () => {
	const collectionsStore = useCollectionsStore()

	const sharedAlbums = computed(() => collectionsStore.collectionsWithPrefix(sharedAlbumsPrefix) as unknown as Record<string, Album>)

	/**
	 * @param sharedAlbumName - Name of the shared album
	 */
	function getSharedAlbumName(sharedAlbumName: string): string {
		return `${sharedAlbumsPrefix}/${sharedAlbumName}`
	}

	/**
	 * @param sharedAlbumName - Name of the shared album
	 */
	function getSharedAlbum(sharedAlbumName: string): Album {
		return collectionsStore.collections[getSharedAlbumName(sharedAlbumName)] as unknown as Album
	}

	/**
	 * @param sharedAlbumName - Name of the shared album
	 */
	function getSharedAlbumFiles(sharedAlbumName: string): string[] {
		return collectionsStore.collectionsFiles[getSharedAlbumName(sharedAlbumName)] || []
	}

	return { sharedAlbums, getSharedAlbumName, getSharedAlbum, getSharedAlbumFiles }
})
