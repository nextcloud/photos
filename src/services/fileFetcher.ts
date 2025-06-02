/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosError } from 'axios'
import type { FileStat, ResponseDataDetailed, StatOptions } from 'webdav'

import { resultToNode } from '@nextcloud/files/dav'
import { davClient } from './DavClient.ts'
import { getPropFind } from './DavRequest.ts'

/**
 *
 * @param fileName
 * @param options
 */
export async function fetchFile(fileName: string, options: StatOptions = {}) {
	try {
		const response = await davClient.stat(fileName, {
			data: getPropFind(),
			details: true,
			...options,
		}) as ResponseDataDetailed<FileStat>

		return resultToNode(response.data)
	} catch (error) {
		if ((error as AxiosError).code === 'ERR_CANCELED') {
			return null
		}

		throw error
	}
}
