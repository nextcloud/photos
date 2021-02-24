/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

import client from './DavClient'
import { genFileInfo } from '../utils/fileUtils'

/**
 * List system tags
 *
 * @param {String} path the path relative to the user root
 * @param {Object} [options] optional options for axios
 * @returns {Array} the file list
 */
export default async function(path, options = {}) {
	const response = await client.getDirectoryContents('/systemtags/', Object.assign({}, {
		data: `<?xml version="1.0"?>
			<d:propfind  xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns">
				<d:prop>
					<oc:id />
					<oc:display-name />
					<oc:user-visible />
					<oc:user-assignable />
					<oc:can-assign />
				</d:prop>
			</d:propfind>`,
		details: true,
	}, options))

	return response.data.map(data => genFileInfo(data))
}
