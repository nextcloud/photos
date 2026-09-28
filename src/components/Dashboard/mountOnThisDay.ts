/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate, translatePlural } from '@nextcloud/l10n'
import { createPinia, PiniaVuePlugin } from 'pinia'
import Vue from 'vue'
import DashboardOnThisDay from './DashboardOnThisDay.vue'

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

Vue.use(PiniaVuePlugin)

/**
 * Mount the "On This Day" dashboard widget.
 *
 * @param el - The element provided by the dashboard for this widget
 */
export function mountOnThisDay(el: HTMLElement): Vue {
	return new Vue({
		el,
		pinia: createPinia(),
		render: (h) => h(DashboardOnThisDay),
	})
}
