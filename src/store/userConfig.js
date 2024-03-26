/* eslint-disable jsdoc/require-jsdoc */
/**
 * @copyright Copyright (c) 2024 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
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

import { davGetDefaultPropfind, davResultToNode, davRootPath } from '@nextcloud/files'
import { loadState } from '@nextcloud/initial-state'
import { joinPaths } from '@nextcloud/paths'
import { showError } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'

import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'

export const configChangedEvent = 'photos:user-config-changed'

export async function getFolder(path) {
	const location = joinPaths(davRootPath, path) + '/'

	try {
		const stat = await davClient.stat(location, { details: true, data: davGetDefaultPropfind() })
		return davResultToNode(stat.data)
	} catch (error) {
		if (error.response?.status === 404) {
			logger.debug('Photo location does not exist, creating it.')
			await davClient.createDirectory(location)
			const stat = await davClient.stat(location, { details: true, data: davGetDefaultPropfind() })
			return davResultToNode(stat.data)
		} else {
			logger.fatal(error)
			showError(t('photos', 'Could not load photos folder'))
		}
	}

	throw new Error("Couldn't fetch photos upload folder")
}

/**
 * @typedef {object} UserConfigState
 * @property {boolean} croppedLayout
 * @property {string} photosSourceFolder
 * @property {string} photosLocation
 * @property {import('@nextcloud/files').Folder} [photosLocationFolder]
 */

/** @type {import('vuex').Module<UserConfigState, object>} */
const module = {
	state() {
		return {
			croppedLayout: loadState('photos', 'croppedLayout', 'false') === 'true',
			photosSourceFolder: loadState('photos', 'photosSourceFolder', ''),
			photosLocation: loadState('photos', 'photosLocation', ''),
			photosLocationFolder: undefined,
		}
	},
	mutations: {
		updateUserConfig(state, { key, value }) {
			state[key] = value
		},
	},
	actions: {
		async updateUserConfig({ commit }, { key, value }) {
			commit('updateUserConfig', { key, value })
			await axios.put(generateUrl('apps/photos/api/v1/config/' + key), {
				value: (typeof value === 'string') ? value : JSON.stringify(value),
			})
			emit(configChangedEvent, { key, value })
		},
	},
}

export default module
