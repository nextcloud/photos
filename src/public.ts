/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import PhotosAppPublic from './PhotosAppPublic.vue'
import { router } from './router/index.ts'

const app = createApp(PhotosAppPublic)
app.config.idPrefix = 'photos'
app.use(createPinia())
app.use(router)
app.mount('#content')

export default app
