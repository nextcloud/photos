/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import getGridConfig from '../services/GridConfig.js'
import logger from '../services/logger.js'

/**
 * Get the current used grid config
 */
export default {
	data() {
		return {
			gridConfig: {},
		}
	},

	created() {
		getGridConfig.$on('changed', val => {
			this.gridConfig = val
		})
		logger.debug('Grid config', { gridConfig: getGridConfig.gridConfig })
		this.gridConfig = getGridConfig.gridConfig
	},

	beforeDestroy() {
		getGridConfig.$off('changed', this.gridConfig)
	},
}
