/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent } from 'vue'
import gridConfigState from '../services/GridConfig.js'

/**
 * Expose the current grid config as a reactive computed property.
 * The underlying state is shared and updated on window resize.
 */
export default defineComponent({
	computed: {
		gridConfig() {
			return gridConfigState.gridConfig
		},
	},
})
