/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { genFileInfo } from '../utils/fileUtils.js'
import { props } from './DavRequest.js'
import allowedMimes from './AllowedMimes.js'
import client, { prefixPath } from './DavClient.js'

/**
 * Get tagged files based on provided tag id
 *
 * @param {number} id the tag id to filter
 * @param {object} [options] optional options for axios
 * @return {Array} the file list
 */
export default async function(id, options = {}) {

	options = Object.assign({
		method: 'REPORT',
		data: `<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${props}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${id}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,
		details: true,
	}, options)

	const response = await client.getDirectoryContents(prefixPath, options)

	return response.data
		.map(data => genFileInfo(data))
		// filter out unwanted mime because server REPORT service only support
		// hardcoded props and mime is not one of them
		// https://github.com/nextcloud/server/blob/5bf3d1bb384da56adbf205752be8f840aac3b0c5/apps/dav/lib/Connector/Sabre/FilesReportPlugin.php#L274
		.filter(file => file.mime && allowedMimes.indexOf(file.mime) !== -1)
		// remove prefix path from full file path
		.map(data => Object.assign({}, data, { filename: data.filename.replace(prefixPath, '') }))
}
