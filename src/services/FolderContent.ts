/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosRequestConfig } from '@nextcloud/axios'
import type { NodeData } from '@nextcloud/files'

import axios from '@nextcloud/axios'
import { File, Folder } from '@nextcloud/files'
import { defaultRemoteURL, defaultRootPath, parsePermissions } from '@nextcloud/files/dav'
import { generateUrl } from '@nextcloud/router'
import allowedMimes from './AllowedMimes.js'

/**
 * A node of a folder listing, as the endpoint describes it: the fields a DAV node
 * is built from, with everything the properties of a DAV listing would carry
 * gathered under `attributes`.
 */
type FolderListingEntry = {
	/** Id of the node, a string as the ids of a server are moving to snowflakes. */
	id: string
	/** Path of the node, relative to the root of the account. */
	filename: string
	mime: string
	/** Moment the node was last modified, as a unix timestamp in seconds. */
	mtime: number
	size: number
	type: 'file' | 'dir'
	/** Permissions of the account on the node, as the DAV endpoint spells them. */
	permissions: string
	owner: string | null
	attributes: Record<string, unknown>
}

/**
 * Build the node of a listing entry.
 *
 * The endpoint names the path of a node rather than its URL, the DAV endpoint it
 * lives under being the browser's own.
 *
 * @param entry - Node of a folder listing
 */
function toNode(entry: FolderListingEntry): File | Folder {
	const data: NodeData = {
		// A node only answers for its `fileid` as long as it was built from a number,
		// and that is what the app addresses a photo by — from the preview endpoints
		// to the listings the views keep.
		id: Number(entry.id),
		source: decodeURI(`${defaultRemoteURL}${defaultRootPath}${entry.filename}`),
		root: defaultRootPath,
		mime: entry.mime,
		mtime: new Date(entry.mtime * 1000),
		size: entry.size,
		permissions: parsePermissions(entry.permissions),
		owner: entry.owner,
		attributes: entry.attributes,
	}

	return entry.type === 'file' ? new File(data) : new Folder(data)
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
	const list = (response.data as FolderListingEntry[]).map(toNode)

	// The folder itself is listed alongside its content.
	const currentPath = path.replace(/\/$/, '') || '/'

	// filter all the files and folders
	let folder: Folder | undefined
	const folders: Folder[] = []
	const files: File[] = []

	for (const entry of list) {
		if (entry instanceof Folder) {
			// is this the current provided path ?
			if (entry.path === currentPath) {
				folder = entry
			} else {
				folders.push(entry)
			}
		} else if (allowedMimes.indexOf(entry.mime) > -1) {
			files.push(entry)
		}
	}

	// return current folder, subfolders and files
	return { folder, folders, files }
}
