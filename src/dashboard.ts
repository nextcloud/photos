/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import DashboardOnThisDay from './components/Dashboard/DashboardOnThisDay.vue'

window.addEventListener('DOMContentLoaded', () => {
	window.OCA.Dashboard.register('photos-onthisday', (el) => {
		const app = createApp(DashboardOnThisDay)
		app.config.idPrefix = 'photos-dashboard'
		app.use(createPinia())
		app.mount(el)
		global.PhotosOnThisDay = app
	})
})
