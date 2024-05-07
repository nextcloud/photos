/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import client, { prefixPath } from './DavClient.js'
import request from './DavRequest.js'
import { genFileInfo } from '../utils/fileUtils.js'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {string} path the path relative to the user root
 * @return {Array} the file list
 */
export default async function(path) {
	// getDirectoryContents doesn't accept / for root
	const fixedPath = path === '/' ? '' : path

	// fetch listing
	const response = await client.stat(prefixPath + fixedPath, {
		data: request,
		details: true,
	})

	return genFileInfo(response.data)
}
