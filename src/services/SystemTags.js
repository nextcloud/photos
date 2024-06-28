/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import client from './DavClient.js'
import { genFileInfo } from '../utils/fileUtils.js'

/**
 * List system tags
 *
 * @param {string} path the path relative to the user root
 * @param {object} [options] optional options for axios
 * @return {Promise<object[]>} the file list
 */
export default async function(path, options = {}) {
	const response = await client.getDirectoryContents('/systemtags-assigned/image', Object.assign({}, {
		data: `<?xml version="1.0"?>
			<d:propfind  xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
				<d:prop>
					<oc:id />
					<oc:display-name />
					<oc:user-visible />
					<oc:user-assignable />
					<oc:can-assign />
					<nc:files-assigned/>
					<nc:reference-fileid/>
				</d:prop>
			</d:propfind>`,
		details: true,
	}, options))

	return response.data.map(data => genFileInfo(data))
}
