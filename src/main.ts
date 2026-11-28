/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Node } from '@nextcloud/files'

import { subscribe } from '@nextcloud/event-bus'
import { getSidebar } from '@nextcloud/files'
import { registerDavProperty } from '@nextcloud/files/dav'
import { translate, translatePlural } from '@nextcloud/l10n'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import PhotosApp from './PhotosApp.vue'
import router from './router/index.js'
import logger from './services/logger.ts'
import store from './store/index.js'

sync(store, router)

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

registerDavProperty('nc:metadata-photos-size')
registerDavProperty('nc:metadata-files-live-photo')
registerDavProperty('nc:metadata-blurhash')
registerDavProperty('nc:metadata-photos-original_date_time')
// Needed by the map view to place the photos, the timeline does not return the
// property unless it is registered.
registerDavProperty('nc:metadata-photos-gps')

Vue.use(PiniaVuePlugin)

const app = new Vue({
	el: '#content',
	name: 'PhotosRoot',
	router,
	store,
	pinia: createPinia(),
	render: (h) => h(PhotosApp),
})

// The viewer asks for the Files sidebar of the photo it shows, render it next to the photos
const sidebar = getSidebar()
sidebar.mount(app.$el as HTMLElement)
subscribe('viewer:sidebar:open', (node: Node) => {
	if (!sidebar.available) {
		logger.error('Could not open the Files sidebar from the viewer because it is not available')
		return
	}
	sidebar.open(node)
})

export default app
