/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate, translatePlural } from '@nextcloud/l10n'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import PhotosAppPublic from './PhotosAppPublic.vue'
import router from './router/index.js'
import store from './store/index.js'

sync(store, router)

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

export default new Vue({
	el: '#content',
	name: 'PhotosRoot',
	router,
	store,
	render: (h) => h(PhotosAppPublic),
})
