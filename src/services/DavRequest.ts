/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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

import { getDavProperties, registerDavProperty } from '@nextcloud/files'

const recoginzeDAVProps = [
	'nc:face-detections',
	'nc:face-preview-image',
	'nc:realpath',
	'nc:nbItems',
]

/**
 * Used to cache the props
 */
let props: string|null = null

/**
 * Get the default WebDAV properties
 * This is cached for performance reasons
 */
export const getDefaultDavProps = () => {
	if (props === null) {
		recoginzeDAVProps.forEach(prop => registerDavProperty(prop))
		props = getDavProperties()
	}
	return props
}

/**
 * @param extraProps - Extra properties to add to the DAV request.
 */
export function getPropFind(extraProps: string[] = []): string {
	return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					${getDefaultDavProps()}
					${extraProps.join('\n')}
				</d:prop>
			</d:propfind>`
}
