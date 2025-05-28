/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios, { type AxiosRequestConfig } from '@nextcloud/axios'
import { defaultRemoteURL, defaultRootPath } from '@nextcloud/files/dav'
import { generateUrl } from '@nextcloud/router'
import allowedMimes from './AllowedMimes.js'

export type FoldersNode = {
	basename: string
	etag: string
	fileid: number
	filename: string
	source: string
	lastmod: number
	mime: string
	size: number
	type: string
	permissions: string
	hasPreview: boolean
}

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param path
 * @param options
 */
export default async function(path: string = '/', options: AxiosRequestConfig & { shared?: boolean } = {}) {
	const endpoint = generateUrl(`/apps/photos/api/v1/${options.shared ? 'shared' : 'albums'}`)

	// fetch listing
	const response = await axios.get(endpoint + path, options)
	const list: FoldersNode[] = response.data
		.map((data) => ({
			...data,
			filename: `${defaultRootPath}${data.filename}`,
			source: decodeURI(defaultRemoteURL + `${defaultRootPath}${data.filename}`),
		}))

	// filter all the files and folders
	let folder: FoldersNode | undefined
	const folders: FoldersNode[] = []
	const files: FoldersNode[] = []

	for (const entry of list) {
		// is this the current provided path ?
		if (entry.filename === `${defaultRootPath}${path}`) {
			folder = entry
		} else if (entry.type !== 'file') {
			folders.push(entry)
		} else if (allowedMimes.indexOf(entry.mime) > -1) {
			files.push(entry)
		}
	}

	// return current folder, subfolders and files
	return { folder, folders, files }
}
