/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate, translatePlural } from '@nextcloud/l10n'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import DashboardOnThisDay from './components/Dashboard/DashboardOnThisDay.vue'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

Vue.use(PiniaVuePlugin)

window.addEventListener('DOMContentLoaded', () => {
	window.OCA.Dashboard.register('photos-onthisday', (el) => {
		global.PhotosOnThisDay = new Vue({
			el,
			pinia: createPinia(),
			render: (h) => h(DashboardOnThisDay),
		})
	})
})
