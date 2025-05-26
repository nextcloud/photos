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
const props = `
	<d:getcontentlength />
	<d:getcontenttype />
	<d:getetag />
	<d:getlastmodified />
	<d:resourcetype />
	<nc:metadata-photos-size />
	<nc:metadata-photos-original_date_time />
	<nc:metadata-files-live-photo />
	<nc:metadata-blurhash/>
	<nc:has-preview />
	<nc:hidden />
	<oc:favorite />
	<oc:fileid />
	<oc:permissions />
`

export { props }
export default `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${props}
				</d:prop>
			</d:propfind>`
