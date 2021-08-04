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

import { genFileInfo } from '../utils/fileUtils'
import { getCurrentUser } from '@nextcloud/auth'
import { props } from './DavRequest'
import allowedMimes from './AllowedMimes'
import client from './DavClient'

/**
 * Get tagged files based on provided tag id
 *
 * @param {number} id the tag id to filter
 * @param {object} [options] optional options for axios
 * @return {Array} the file list
 */
export default async function(id, options = {}) {

	options = Object.assign({
		method: 'REPORT',
		data: `<?xml version="1.0"?>
			<oc:filter-files
				xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${props}
				</d:prop>
				<oc:filter-rules>
					<oc:systemtag>${id}</oc:systemtag>
				</oc:filter-rules>
			</oc:filter-files>`,
		details: true,
	}, options)

	const prefixPath = `/files/${getCurrentUser().uid}`
	const response = await client.getDirectoryContents(prefixPath, options)

	return response.data
		.map(data => genFileInfo(data))
		// filter out unwanted mime because server REPORT service only support
		// hardcoded props and mime is not one of them
		// https://github.com/nextcloud/server/blob/5bf3d1bb384da56adbf205752be8f840aac3b0c5/apps/dav/lib/Connector/Sabre/FilesReportPlugin.php#L274
		.filter(file => file.mime && allowedMimes.indexOf(file.mime) !== -1)
		// remove prefix path from full file path
		.map(data => Object.assign({}, data, { filename: data.filename.replace(prefixPath, '') }))
}
