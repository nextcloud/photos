/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { getCurrentUser } from '@nextcloud/auth'
import { getSingleValue, getValueForKey, parseXML, propsToStat } from 'webdav/dist/node/interface/dav'
import { handleResponseCode, processResponsePayload } from 'webdav/dist/node/response'
import { normaliseHREF, normalisePath } from 'webdav/dist/node/url'
import client, { remotePath } from './DavClient'
import request from './DavRequest'
import pathPosix from 'path-posix'
import { genFileInfo } from '../utils/fileUtils'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {string} path the path relative to the user root
 * @param {object} [options] optional options for axios
 * @return {Array} the file list
 */
export default async function(path, options = {}) {

	options = Object.assign({
		method: 'PROPFIND',
		headers: {
			Accept: 'text/plain',
			Depth: options.deep ? 'infinity' : 1,
		},
		data: request,
		responseType: 'text',
		details: true,
	}, options)

	// we also use the davclient for other endpoints than /files (like tags)
	const prefixPath = `/files/${getCurrentUser().uid}`

	/**
	 * Fetch listing
	 *
	 * we use a custom request because getDirectoryContents filter out the current directory,
	 * but we want this as well to save us an extra request
	 * see https://github.com/perry-mitchell/webdav-client/blob/baf858a4856d44ae19ac12cb10c469b3e6c41ae4/source/interface/directoryContents.js#L11
	 */
	let response = null
	const { data } = await client.customRequest(prefixPath + path, options)
		.then(handleResponseCode)
		.then(res => {
			response = res
			return res.data
		})
		.then(parseXML)
		.then(result => getDirectoryFiles(result, remotePath + prefixPath, options.details))
		.then(files => processResponsePayload(response, files, options.details))

	const list = data.map(data => genFileInfo(data))

	// filter all the files and folders
	let folder = {}
	const folders = []
	const files = []
	for (const entry of list) {
		// is this the current provided path ?
		if (entry.filename === path) {
			folder = entry
		} else if (entry.type !== 'file') {
			folders.push(entry)
		} else if (entry.mime === 'image/jpeg') {
			files.push(entry)
		}
	}

	// return current folder, subfolders and files
	return { folder, folders, files }
}

/**
 * ! Modified function to include the root requested folder
 * ! See webdav library
 * Into the returned data
 *
 * @param {object} result the request result
 * @param {string} serverBasePath server base path
 * @param {boolean} isDetailed detailed request
 * @return {Array}
 */
function getDirectoryFiles(result, serverBasePath, isDetailed = false) {
	const serverBase = pathPosix.join(serverBasePath, '/')
	// Extract the response items (directory contents)
	const multiStatus = getValueForKey('multistatus', result)
	const responseItems = getValueForKey('response', multiStatus)
	return (
		responseItems
			// Map all items to a consistent output structure (results)
			.map(item => {
				// HREF is the file path (in full)
				let href = getSingleValue(getValueForKey('href', item))
				href = normaliseHREF(href)
				// Each item should contain a stat object
				const propStat = getSingleValue(getValueForKey('propstat', item))
				const props = getSingleValue(getValueForKey('prop', propStat))
				// Process the true full filename (minus the base server path)
				const filename
                    = serverBase === '/' ? normalisePath(href) : normalisePath(pathPosix.relative(serverBase, href))
				return propsToStat(props, filename, isDetailed)
			})
	)
}
