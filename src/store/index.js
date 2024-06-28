/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import Vuex, { Store } from 'vuex'

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

Vue.use(Vuex)
export default new Store({
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
			store.subscribe(async (mutation, state) => {
				if (mutation.type === 'updateUserConfig' && mutation.payload.key === 'photosLocation') {
					const photosLocationFolder = await getFolder(state.userConfig.photosLocation)
					store.commit('updateUserConfig', { key: 'photosLocationFolder', value: photosLocationFolder })
				}
			})
		},
	],

	strict: process.env.NODE_ENV !== 'production',
})
