/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate, translatePlural } from '@nextcloud/l10n'
import Vue from 'vue'
import DashboardOnThisDay from './components/Dashboard/DashboardOnThisDay.vue'
import store from './store/index.js'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

window.addEventListener('DOMContentLoaded', () => {
	window.OCA.Dashboard.register('photos-onthisday', (el) => {
		global.PhotosOnThisDay = new Vue({
			el,
			store,
			render: (h) => h(DashboardOnThisDay),
		})
	})
})
