/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createApp } from 'vue'
import DashboardOnThisDay from './components/Dashboard/DashboardOnThisDay.vue'
import store from './store/index.js'

window.addEventListener('DOMContentLoaded', () => {
	window.OCA.Dashboard.register('photos-onthisday', (el) => {
		const app = createApp(DashboardOnThisDay)
		app.use(store)
		app.mount(el)
	})
})
