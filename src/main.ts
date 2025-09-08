/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerDavProperty } from '@nextcloud/files/dav'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { sync } from 'vuex-router-sync'
import PhotosApp from './PhotosApp.vue'
import router from './router/index.js'
import store from './store/index.js'

sync(store, router)

registerDavProperty('nc:metadata-photos-size')
registerDavProperty('nc:metadata-files-live-photo')
registerDavProperty('nc:metadata-blurhash')
registerDavProperty('nc:metadata-photos-original_date_time')

const app = createApp(PhotosApp)
app.use(store)
app.use(createPinia())
app.use(router)
app.mount('#content')
