/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerDavProperty } from '@nextcloud/files/dav'
import { translate, translatePlural } from '@nextcloud/l10n'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import PhotosApp from './PhotosApp.vue'
import router from './router/index.js'
import store from './store/index.js'

sync(store, router)

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

registerDavProperty('nc:metadata-photos-size')
registerDavProperty('nc:metadata-files-live-photo')
registerDavProperty('nc:metadata-blurhash')
registerDavProperty('nc:metadata-photos-original_date_time')

Vue.use(PiniaVuePlugin)

export default new Vue({
	el: '#content',
	name: 'PhotosRoot',
	router,
	store,
	pinia: createPinia(),
	render: (h) => h(PhotosApp),
})
