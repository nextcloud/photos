/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { getCurrentUser } from '@nextcloud/auth'

import files from './files.js'
import albums from './albums.js'
import publicAlbums from './publicAlbums.js'
import sharedAlbums from './sharedAlbums.js'
import collections from './collections.js'
import places from './places.js'
import faces from './faces.js'
import folders from './folders.js'
import systemtags from './systemtags.js'
import userConfig, { getFolder } from './userConfig.js'

/**
 * Get the information of photosLocation and store it as photosLocationFolder
 * @param store
 * @param state
 */
async function initPhotosLocationFolder(store, state) {
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
