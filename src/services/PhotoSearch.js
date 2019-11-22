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

import { getCurrentUser } from '@nextcloud/auth'
import client from './DavClient'
import { genFileInfo } from '../utils/fileUtils'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @param {string} [path] not used
 * @param {Object} [options] used for the cancellable requests
 * @returns {Array} the file list
 */
export default async function(path = '', options) {

	const prefixPath = `/files/${getCurrentUser().uid}`

	options = Object.assign({
		method: 'SEARCH',
		headers: {
			'content-Type': 'text/xml',
		},
		data: `<?xml version="1.0" encoding="UTF-8"?>
			<d:searchrequest xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:basicsearch>
					<d:select>
						<d:prop>
							<d:getlastmodified />
							<d:getetag />
							<d:getcontenttype />
							<oc:fileid />
							<d:getcontentlength />
							<nc:has-preview />
							<oc:favorite />
							<d:resourcetype />
						</d:prop>
					</d:select>
					<d:from>
						<d:scope>
							<d:href>${prefixPath}</d:href>
							<d:depth>infinity</d:depth>
						</d:scope>
					</d:from>
					<d:where>
						<d:like>
							<d:prop>
								<d:getcontenttype/>
							</d:prop>
							<d:literal>image/jpeg</d:literal>
						</d:like>
						<d:eq>
							<d:prop>
								<oc:owner-id/>
							</d:prop>
							<d:literal>admin</d:literal>
						</d:eq>
					</d:where>
					<d:orderby/>
				</d:basicsearch>
			</d:searchrequest>`,
		deep: true,
		details: true,
	}, options)

	const response = await client.getDirectoryContents('', options)

	return response.data
		.map(data => genFileInfo(data))
		// remove prefix path from full file path
		.map(data => Object.assign({}, data, { filename: data.filename.replace(prefixPath, '') }))

}
