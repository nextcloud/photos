/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { App } from 'vue'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import DashboardOnThisDay from './DashboardOnThisDay.vue'

/**
 * Mount the "On This Day" dashboard widget.
 *
 * @param el - The element provided by the dashboard for this widget
 */
export function mountOnThisDay(el: HTMLElement): App {
	const app = createApp(DashboardOnThisDay)
	app.config.idPrefix = 'photos-dashboard'
	app.use(createPinia())
	app.mount(el)
	return app
}
