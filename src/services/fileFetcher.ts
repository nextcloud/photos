/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosError } from 'axios'
import type { FileStat, ResponseDataDetailed, StatOptions } from 'webdav'
import { genFileInfo } from '../utils/fileUtils.js'
import { davClient } from './DavClient'
import { getPropFind } from './DavRequest'

/**
 * @param fileName - The full file's name
 * @param options - Options to forward to the webdav client.
 */
export async function fetchFile(fileName: string, options: StatOptions = {}) {
	try {
		const response = await davClient.stat(fileName, {
			data: getPropFind(),
			details: true,
			...options,
		}) as ResponseDataDetailed<FileStat>

		return genFileInfo(response.data)
	} catch (error) {
		if ((error as AxiosError).code === 'ERR_CANCELED') {
			return null
		}

		throw error
	}
}
