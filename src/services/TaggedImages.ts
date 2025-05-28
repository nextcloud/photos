/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { FileStat, GetDirectoryContentsOptions, ResponseDataDetailed } from 'webdav'

import { defaultRootPath, resultToNode } from '@nextcloud/files/dav'
import allowedMimes from './AllowedMimes.js'
import { davClient } from './DavClient.ts'
import { getDefaultDavProps } from './DavRequest.ts'

/**
 * Get tagged files based on provided tag id
 *
 * @param id
 * @param options
 */
export default async function(id: number, options: GetDirectoryContentsOptions = {}): Promise<File[]> {
	options = {
		headers: {
			method: 'REPORT',
		},
		data: `<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${getDefaultDavProps()}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${id}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,
		details: true,
		...options,
	}

	const response = await davClient.getDirectoryContents(defaultRootPath, options) as ResponseDataDetailed<FileStat[]>
	return response.data
		.map((data) => resultToNode(data) as File)
		// filter out unwanted mime because server REPORT service only support
		// hardcoded props and mime is not one of them
		// https://github.com/nextcloud/server/blob/5bf3d1bb384da56adbf205752be8f840aac3b0c5/apps/dav/lib/Connector/Sabre/FilesReportPlugin.php#L274
		.filter((file) => file.mime && allowedMimes.indexOf(file.mime) !== -1)
}
