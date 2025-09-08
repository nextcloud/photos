/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import { sync } from 'vuex-router-sync'
import PhotosAppPublic from './PhotosAppPublic.vue'
import router from './router/index.js'
import store from './store/index.js'

sync(store, router)

const app = createApp(PhotosAppPublic)
app.use(store)
app.use(router)
app.mount('#content')
