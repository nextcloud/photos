/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerDavProperty } from '@nextcloud/files/dav'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import PhotosApp from './PhotosApp.vue'
import router from './router/index.ts'

registerDavProperty('nc:metadata-photos-size')
registerDavProperty('nc:metadata-files-live-photo')
registerDavProperty('nc:metadata-blurhash')
registerDavProperty('nc:metadata-photos-original_date_time')
// Needed by the map view to place the photos, the timeline does not return the
// property unless it is registered.
registerDavProperty('nc:metadata-photos-gps')

const app = createApp(PhotosApp)
// several apps can share a page, and useId has to stay unique across them
app.config.idPrefix = 'photos'
app.use(createPinia())
app.use(router)
app.mount('#content')

export default app
