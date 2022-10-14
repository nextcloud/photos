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
 *
 */

import client, { prefixPath } from './DavClient.js'
import request from './DavRequest.js'
import { genFileInfo } from '../utils/fileUtils.js'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {string} path the path relative to the user root
 * @return {Array} the file list
 */
export default async function(path) {
	// getDirectoryContents doesn't accept / for root
	const fixedPath = path === '/' ? '' : path

	// fetch listing
	const response = await client.stat(prefixPath + fixedPath, {
		data: request,
		details: true,
	})

	return genFileInfo(response.data)
}
