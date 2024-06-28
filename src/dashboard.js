/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { generateFilePath } from '@nextcloud/router'
import { getRequestToken } from '@nextcloud/auth'
import { translate, translatePlural } from '@nextcloud/l10n'
import Vue from 'vue'

import store from './store/index.js'
import DashboardOnThisDay from './components/Dashboard/DashboardOnThisDay.vue'

// CSP config for webpack dynamic chunk loading
// eslint-disable-next-line
__webpack_nonce__ = btoa(getRequestToken())

// Correct the root of the app for chunk loading
// OC.linkTo matches the apps folders
// OC.generateUrl ensure the index.php (or not)
// We do not want the index.php since we're loading files
// eslint-disable-next-line
__webpack_public_path__ = generateFilePath('photos', '', 'js/')

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

window.addEventListener('DOMContentLoaded', () => {
	OCA.Dashboard.register('photos.onthisday', (el) => {
		global.PhotosOnThisDay = new Vue({
			el,
			store,
			render: h => h(DashboardOnThisDay),
		})
	})
})
