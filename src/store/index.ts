/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'
import type { Album } from './albums.ts'
import type { CollectionState } from './collections.ts'
import type { FacesState } from './faces.ts'
import type { FilesState } from './files.ts'
import type { FoldersState } from './folders.ts'
import type { PublicAlbum } from './publicAlbums.ts'

import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import albums from './albums.ts'
import collections from './collections.ts'
import faces from './faces.ts'
import files from './files.ts'
import folders from './folders.ts'
import places from './places.ts'
import publicAlbums from './publicAlbums.ts'
import sharedAlbums from './sharedAlbums.ts'

export type PhotosRootSate = {
	files: FilesState
	collections: CollectionState
	faces: FacesState
	folders: FoldersState
}

export type PhotosStore = {
	state: PhotosRootSate
	commit(mutationName: string, arg: unknown): void
	dispatch(actionName: string, arg: unknown): Promise<unknown>
	getters: {
		albums(): Record<string, Album>
		publicAlbums(): Record<string, PublicAlbum>
		sharedAlbums(): Record<string, Album>
		places(): Record<string, Collection>
		getAlbumName(name: string): string
		getAlbum(albumName: string): Album
		getAlbumFiles(albumName: string): string[]
		getPublicAlbum(publicAlbumName: string): PublicAlbum
		getPublicAlbumFiles(publicAlbumName: string): string[]
		getPublicAlbumName(publicAlbumName: string): string
		getSharedAlbum(sharedAlbumName: string): Album
		getSharedAlbumFiles(sharedAlbumName: string): string[]
		getPlaceName(sharedAlbumName: string): string
		getPlace(sharedAlbumName: string): Collection | undefined
		getPlaceFiles(sharedAlbumName: string): string[]
		getSharedAlbumName(sharedAlbumName: string): string
	}
}
export type PhotosContext<T> = PhotosStore & {
	state: T
	rootState: PhotosRootSate
}

Vue.use(Vuex)
const photosStore = new Store({
	modules: {
		files,
		folders,
		albums,
		sharedAlbums,
		publicAlbums,
		faces,
		collections,
		places,
	},

	strict: process.env.NODE_ENV !== 'production',
}) as PhotosStore

export default photosStore
