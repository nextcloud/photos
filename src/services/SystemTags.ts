/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat, GetDirectoryContentsOptions, ResponseDataDetailed } from 'webdav'
import type { Tag } from '../store/systemtags.ts'

import { resultToNode } from '@nextcloud/files/dav'
import { davClient } from './DavClient.ts'

/**
 * List system tags
 *
 * @param path
 * @param options
 */
export default async function(path: string, options: GetDirectoryContentsOptions = {}): Promise<Tag[]> {
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

	return response.data
		// The listing leads with the collection itself, whose properties are all
		// answered empty.
		.filter((data) => Boolean(data.props?.id))
		// The id of a tag is answered as `oc:id`. A Node keeps `id` for its own
		// getter and drops it from the attributes, so the id is handed over as the
		// file id the getter reads instead.
		.map((data) => {
			const props = { ...data.props, fileid: data.props?.id } as FileStat['props']
			return resultToNode({ ...data, props }, '/systemtags-assigned/image') as Tag
		})
}
