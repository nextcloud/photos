/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getDavProperties } from '@nextcloud/files/dav'

/**
 * Used to cache the props
 */
let props: string | null = null

/**
 * Get the default WebDAV properties
 * This is cached for performance reasons
 */
export function getDefaultDavProps() {
	if (props === null) {
		props = getDavProperties()
	}
	return props
}

/**
 *
 * @param extraProps
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
