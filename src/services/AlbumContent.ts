/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios, { type AxiosRequestConfig } from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import allowedMimes from './AllowedMimes.js'
import { getCurrentUser } from '@nextcloud/auth'
import { File, FileType, type Folder } from '@nextcloud/files'
import { resultToNode } from '@nextcloud/files/dav'

/**
 * List files from a folder and filter out unwanted mimes
 */
export default async function(path: string = '/', options: AxiosRequestConfig & { shared?: boolean } = {}) {
	const endpoint = generateUrl(`/apps/photos/api/v1/${options.shared ? 'shared' : 'albums'}`)
	const prefix = `/files/${getCurrentUser()?.uid}`

	// fetch listing
	const response = await axios.get(endpoint + path, options)
	const list: (File|Folder)[] = response.data.map(data => resultToNode(data))

	// filter all the files and folders
	let folder: Folder|undefined
	const folders: Folder[] = []
	const files: File[] = []

	for (const entry of list) {
		switch (entry.type) {
			case FileType.Folder:
				// is this the current provided path ?
				if (entry.path === `${prefix}${path}`) {
					folder = entry
				} else {
					folders.push(entry)
				}
				break
			case FileType.File:
				if (allowedMimes.indexOf(entry.mime as string) > -1) {
					files.push(entry)
				}
				break
		}
	}

	// return current folder, subfolders and files
	return { folder, folders, files }
}
