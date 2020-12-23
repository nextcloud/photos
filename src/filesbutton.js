/**
 * @copyright Copyright (c) 2020 cnmicha <cnmicha@bhb-networks.com>
 *
 * @author cnmicha <cnmicha@bhb-networks.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Vue from 'vue'
import FilesButton from './FilesButton'
import { translate } from '@nextcloud/l10n'

/**
 * Adds a button to the files app that opens the current directory in the photos app.
 */
(function() {
	if (document.getElementById('filesApp')) {
		// Create Vue.js root in DOM
		const vueRoot = document.createElement('div')
		vueRoot.id = 'open-in-photos-button-root'
		document.getElementById('showgridview').insertAdjacentElement('beforebegin', vueRoot)

		Vue.prototype.t = translate
		Vue.config.productionTip = false

		// Create Vue.js instance
		// eslint-disable-next-line no-new
		new Vue({
			el: '#open-in-photos-button-root',
			// eslint-disable-next-line vue/match-component-file-name
			name: 'PhotosFilesButton',
			render: h => h(FilesButton),
		})
	}
})()
