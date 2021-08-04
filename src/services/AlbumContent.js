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

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { genFileInfo, encodeFilePath } from '../utils/fileUtils'
import allowedMimes from './AllowedMimes'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {string} path the path relative to the user root
 * @param {object} [options] optional options for axios
 * @param {boolean} [options.shared] fetch shared albums ?
 * @return {Array} the file list
 */
export default async function(path = '/', options = {}) {
	const prefixPath = generateUrl(`/apps/photos/api/v1/${options.shared ? 'shared' : 'albums'}`)

	// fetch listing
	const response = await axios.get(prefixPath + encodeFilePath(path), options)
	const list = response.data.map(data => genFileInfo(data))

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
		} else if (allowedMimes.indexOf(entry.mime) > -1) {
			files.push(entry)
		}
	}

	// return current folder, subfolders and files
	return { folder, folders, files }
}
