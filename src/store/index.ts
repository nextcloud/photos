/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { getCurrentUser } from '@nextcloud/auth'

import files, { type FilesState } from './files.ts'
import albums, { type Album } from './albums.ts'
import publicAlbums, { type PublicAlbum } from './publicAlbums.ts'
import sharedAlbums from './sharedAlbums.ts'
import collections, { type CollectionState } from './collections.ts'
import places from './places.ts'
import faces, { type FacesState } from './faces.ts'
import folders, { type FoldersState } from './folders.ts'
import systemtags, { type SystemTagsState } from './systemtags.ts'
import userConfig, { getFolder, type UserConfigState } from './userConfig.ts'

export type PhotosRootSate = {
	files: FilesState
	collections: CollectionState
	faces: FacesState
	folders: FoldersState
	systemtags: SystemTagsState
	userConfig: UserConfigState
}

export type PhotosStore = {
	state: PhotosRootSate
	commit(mutationName: string, arg: unknown): void
	dispatch(actionName: string, arg: unknown): Promise<unknown>
	getters: {
		albums(): Album[]
		publicAlbums(): Album[]
		sharedAlbums(): Album[]
		getAlbumName(name: string): string
		getAlbum(albumName: string): Album
		getAlbumFiles(albumName: string): string[]
		getPublicAlbum(publicAlbumName: string): PublicAlbum
		getPublicAlbumFiles(publicAlbumName: string): string[]
		getPublicAlbumName(publicAlbumName: string): string,
		getSharedAlbum(sharedAlbumName: string): Album
		getSharedAlbumFiles(sharedAlbumName: string): string[]
		getSharedAlbumName(sharedAlbumName: string): string,
		tagId(name: string): string,
	}
}
export type PhotosContext<T> = PhotosStore & {
	state: T
	rootState: PhotosRootSate
}

/**
 * Get the information of photosLocation and store it as photosLocationFolder
 */
async function initPhotosLocationFolder(store: typeof photosStore, state) {
	const photosLocationFolder = await getFolder(state.userConfig.photosLocation)
	store.commit('updateUserConfig', { key: 'photosLocationFolder', value: photosLocationFolder })
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
		systemtags,
		collections,
		places,
		userConfig,
	},

	plugins: [
		(store) => {
			if (getCurrentUser() !== null) {
				initPhotosLocationFolder(store, store.state)
			}

			store.subscribe(async (mutation, state) => {
				if (mutation.type === 'updateUserConfig' && mutation.payload.key === 'photosLocation') {
					initPhotosLocationFolder(store, state)
				}
			})
		},
	],

	strict: process.env.NODE_ENV !== 'production',
})

export default photosStore
