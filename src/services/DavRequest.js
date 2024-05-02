/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const props = `
	<d:getcontentlength />
	<d:getcontenttype />
	<d:getetag />
	<d:getlastmodified />
	<d:resourcetype />
	<nc:face-detections />
	<nc:face-preview-image />
	<nc:metadata-photos-size />
	<nc:metadata-photos-original_date_time />
	<nc:metadata-files-live-photo />
	<nc:metadata-blurhash/>
	<nc:has-preview />
	<nc:realpath />
	<nc:hidden />
	<oc:favorite />
	<oc:fileid />
	<oc:permissions />
	<nc:nbItems />
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
