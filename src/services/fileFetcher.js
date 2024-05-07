/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { genFileInfo } from '../utils/fileUtils.js'
import defaultClient from './DavClient.js'

/**
 * @param {string[]} extraProps - Extra properties to add to the DAV request.
 * @return {string}
 */
function getCollectionFilesDavRequest(extraProps = []) {
	return `<?xml version="1.0"?>
			<d:propfind xmlns:d="DAV:"
				xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
				<d:prop>
					<d:getcontentlength />
					<d:getcontenttype />
					<d:getetag />
					<d:getlastmodified />
					<d:resourcetype />
					<nc:metadata-photos-size />
					<nc:metadata-photos-original_date_time />
					<nc:metadata-files-live-photo />
					<nc:has-preview />
					<nc:hidden />
					<oc:favorite />
					<oc:fileid />
					<oc:permissions />
					${extraProps.join('')}
				</d:prop>
			</d:propfind>`
}

/**
 * @param {string} fileName - The full file's name
 * @param {import('webdav').StatOptions} options - Options to forward to the webdav client.
 * @return {Promise<object>}
 */
export async function fetchFile(fileName, options = {}) {
	try {
		const response = await defaultClient.stat(fileName, {
			data: getCollectionFilesDavRequest(),
			details: true,
			...options,
		})

		return genFileInfo(response.data)
	} catch (error) {
		if (error.code === 'ERR_CANCELED') {
			return null
		}

		throw error
	}
}
