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

import { generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'
import client from './DavClient'
import { genFileInfo } from '../utils/fileUtils'

/**
 * List files from a folder and filter out unwanted mimes
 *
 * @returns {Array} the file list
 */
export default async function() {
	// fetch listing
	const response = await client.customRequest('', {
		method: 'SEARCH',
		headers: {
			'content-Type': 'text/xml',
		},
		url: generateRemoteUrl(`dav`),
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
				<d:href>/files/${getCurrentUser().uid}/</d:href>
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
		</d:where>
		<d:orderby/>
	</d:basicsearch>
</d:searchrequest>` })

	const entry = response.data
	console.info(entry)

}
