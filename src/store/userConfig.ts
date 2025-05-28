import type { Folder } from '@nextcloud/files'
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { FileStat, ResponseDataDetailed } from 'webdav'

import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'
import { defaultRootPath, getDefaultPropfind, resultToNode } from '@nextcloud/files/dav'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { joinPaths } from '@nextcloud/paths'
import { generateUrl } from '@nextcloud/router'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'

export const configChangedEvent = 'photos:user-config-changed'

/**
 *
 * @param path
 */
export async function getFolder(path) {
	const location = joinPaths(defaultRootPath, path) + '/'

	try {
		const stat = await davClient.stat(location, { details: true, data: getDefaultPropfind() }) as ResponseDataDetailed<FileStat>
		return resultToNode(stat.data)
	} catch (error) {
		if (error.response?.status === 404) {
			logger.debug('Photo location does not exist, creating it.')
			await davClient.createDirectory(location)
			const stat = await davClient.stat(location, { details: true, data: getDefaultPropfind() }) as ResponseDataDetailed<FileStat>
			return resultToNode(stat.data)
		} else {
			logger.fatal('Could not load photos folder', { error })
			showError(t('photos', 'Could not load photos folder'))
		}
	}

	throw new Error("Couldn't fetch photos upload folder")
}

export type UserConfigState = {
	croppedLayout: boolean
	photosSourceFolders: string[]
	photosLocation: string
	photosLocationFolder?: Folder
}

const module = {
	state() {
		return {
			croppedLayout: loadState('photos', 'croppedLayout', 'false') as 'false' | 'true' === 'true',
			photosSourceFolders: JSON.parse(loadState('photos', 'photosSourceFolders', '["/Photos"]')),
			photosLocation: loadState('photos', 'photosLocation', ''),
			photosLocationFolder: undefined,
		} as UserConfigState
	},
	mutations: {
		updateUserConfig(state: UserConfigState, { key, value }) {
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
