/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { File } from '@nextcloud/files'
import type { FileStat, GetDirectoryContentsOptions, ResponseDataDetailed } from 'webdav'

import { resultToNode } from '@nextcloud/files/dav'
import { davClient } from './DavClient.ts'

/**
 * List system tags
 *
 * @param path
 * @param options
 */
export default async function(path: string, options: GetDirectoryContentsOptions = {}): Promise<File[]> {
	const response = await davClient.getDirectoryContents('/systemtags-assigned/image', {
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
		...options,
	}) as ResponseDataDetailed<FileStat[]>

	return response.data.map((data) => resultToNode(data, '/systemtags-assigned/image') as File)
}
