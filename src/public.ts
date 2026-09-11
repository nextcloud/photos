/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate, translatePlural } from '@nextcloud/l10n'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import PhotosAppPublic from './PhotosAppPublic.vue'
import router from './router/index.js'
import store from './store/index.js'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

Vue.use(PiniaVuePlugin)

export default new Vue({
	el: '#content',
	name: 'PhotosRoot',
	router,
	store,
	pinia: createPinia(),
	render: (h) => h(PhotosAppPublic),
})
