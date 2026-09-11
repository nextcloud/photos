import type { Folder } from '@nextcloud/files'
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { FileStat, ResponseDataDetailed } from 'webdav'

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { showError } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'
import { defaultRootPath, getDefaultPropfind, resultToNode } from '@nextcloud/files/dav'
import { loadState } from '@nextcloud/initial-state'
import { t } from '@nextcloud/l10n'
import { join } from '@nextcloud/paths'
import { generateUrl } from '@nextcloud/router'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'

export const configChangedEvent = 'photos:user-config-changed'

/**
 *
 * @param path
 */
export async function getFolder(path) {
	const location = join(defaultRootPath, path) + '/'

	try {
		const stat = await davClient.stat(location, { details: true, data: getDefaultPropfind() }) as ResponseDataDetailed<FileStat>
		return resultToNode(stat.data)
	} catch (error) {
		if (error.response?.status === 404) {
			logger.debug('Photo location does not exist, creating it.')
			await davClient.createDirectory(location)
			const stat = await davClient.stat(location, { details: true, data: getDefaultPropfind() }) as ResponseDataDetailed<FileStat>
			return resultToNode(stat.data)
		}

		// In case terms of service is installed, the dav endpoint
		// will return 403 until TOS is accepted.
		if (error.response?.status === 403) {
			logger.debug('User is not authenticated, cannot load photos folder')
		} else {
			logger.fatal('Could not load photos folder', { error })
			showError(t('photos', 'Could not load photos folder'))
		}
	}

	throw new Error("Couldn't fetch photos upload folder")
}

/** Size of the tiles of the photo grids. */
export type GridDensity = 'small' | 'medium' | 'large'

/** User config keys persisted through the config endpoint. */
export type PersistedUserConfig = {
	croppedLayout: boolean
	gridDensity: GridDensity
	photosSourceFolders: string[]
	photosLocation: string
}

/**
 * Fall back to the default density for any unknown value.
 *
 * @param value - The persisted density
 */
function parseGridDensity(value: string): GridDensity {
	return value === 'small' || value === 'large' ? value : 'medium'
}

export default defineStore('userConfig', () => {
	const croppedLayout = ref(loadState('photos', 'croppedLayout', 'false') as 'false' | 'true' === 'true')
	const gridDensity = ref<GridDensity>(parseGridDensity(loadState('photos', 'gridDensity', 'medium')))
	const photosSourceFolders = ref<string[]>(JSON.parse(loadState('photos', 'photosSourceFolders', '["/Photos"]')))
	const photosLocation = ref(loadState('photos', 'photosLocation', ''))

	/** Node of photosLocation, resolved from dav and created if missing. */
	const photosLocationFolder = ref<Folder | undefined>(undefined)

	const refs = { croppedLayout, gridDensity, photosSourceFolders, photosLocation }

	/**
	 * Persist a user config value and notify the rest of the app.
	 *
	 * @param key - Config key
	 * @param value - Config value
	 */
	async function updateUserConfig<K extends keyof PersistedUserConfig>(key: K, value: PersistedUserConfig[K]): Promise<void> {
		(refs[key].value as PersistedUserConfig[K]) = value
		await axios.put(generateUrl('apps/photos/api/v1/config/' + key), {
			value: (typeof value === 'string') ? value : JSON.stringify(value),
		})
		emit(configChangedEvent, { key, value })
	}

	/**
	 * Resolve photosLocation into a Folder node.
	 */
	async function initPhotosLocationFolder(): Promise<void> {
		photosLocationFolder.value = await getFolder(photosLocation.value) as Folder
	}

	if (getCurrentUser() !== null) {
		initPhotosLocationFolder()
		watch(photosLocation, () => initPhotosLocationFolder())
	}

	return {
		croppedLayout,
		gridDensity,
		photosSourceFolders,
		photosLocation,
		photosLocationFolder,
		updateUserConfig,
		initPhotosLocationFolder,
	}
})
