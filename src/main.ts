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
// GPS metadata is needed by the map view to plot photo markers; without
// this registration the timeline endpoint won't return the field.
registerDavProperty('nc:metadata-photos-gps')
// EXIF + IFD0 fuel the optional overlay in the slideshow viewer (camera
// make/model, lens, aperture, exposure, ISO). Cheap to fetch alongside
// the photo size we already pull.
registerDavProperty('nc:metadata-photos-exif')
registerDavProperty('nc:metadata-photos-ifd0')

const app = createApp(PhotosApp)
app.use(store)
app.use(createPinia())
app.use(router)
app.mount('#content')
