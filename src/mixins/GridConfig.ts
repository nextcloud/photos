/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent } from 'vue'
import getGridConfig from '../services/GridConfig.js'
import logger from '../services/logger.js'

/**
 * Get the current used grid config
 */
export default defineComponent({
	data() {
		return {
			gridConfig: {} as typeof getGridConfig.gridConfig,
		}
	},

	created() {
		getGridConfig.$on('changed', this.handleGridConfigChange)
		logger.debug('Grid config', { gridConfig: getGridConfig.gridConfig })
		this.gridConfig = getGridConfig.gridConfig
	},

	beforeDestroy() {
		getGridConfig.$off('changed', this.handleGridConfigChange)
	},

	methods: {
		handleGridConfigChange(val: typeof getGridConfig.gridConfig) {
			this.gridConfig = val
		},
	},
})
