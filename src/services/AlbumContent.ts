/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios, { type AxiosRequestConfig } from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { genFileInfo, encodeFilePath, type PhotoNode } from '../utils/fileUtils.js'
import allowedMimes from './AllowedMimes.js'
import { getCurrentUser } from '@nextcloud/auth'

/**
 * List files from a folder and filter out unwanted mimes
 */
export default async function(path: string = '/', options: AxiosRequestConfig & { shared?: 'shared' | 'album' } = {}) {
	const endpoint = generateUrl(`/apps/photos/api/v1/${options.shared ? 'shared' : 'albums'}`)
	const prefix = `/files/${getCurrentUser()?.uid}`

	// fetch listing
	const response = await axios.get(endpoint + encodeFilePath(path), options)
	const list: PhotoNode[] = response.data
		.map(data => ({ ...data, filename: `${prefix}${data.filename}` }))
		.map(data => genFileInfo(data))

	// filter all the files and folders
	let folder: PhotoNode|undefined
	const folders: PhotoNode[] = []
	const files: PhotoNode[] = []

	for (const entry of list) {
		// is this the current provided path ?
		if (entry.filename === `${prefix}${path}`) {
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
