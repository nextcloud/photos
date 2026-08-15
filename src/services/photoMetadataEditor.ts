/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'
import type { PhotoLocation } from '../utils/exif.ts'

import { davClient } from './DavClient.ts'

export type PhotoMetadataUpdate = {
	/** Moment the photo was taken, as a unix timestamp in seconds. */
	takenAt: number
	/** Position the photo was taken at, `null` to drop the one it carries. */
	location: PhotoLocation | null
}

/**
 * Correct the taken date and the position of a photo.
 *
 * The values are stored next to the ones extracted from the picture rather
 * than written into it, so re-reading the file will not bring the old values
 * back, but the picture itself is left untouched.
 *
 * @param photo - Photo to update
 * @param update - Values to store
 * @throws {Error} When the server rejects the update
 */
export async function savePhotoMetadata(photo: PhotoFile, update: PhotoMetadataUpdate): Promise<void> {
	const { takenAt, location } = update

	const setProperties = [
		`<nc:metadata-photos-original_date_time>${takenAt}</nc:metadata-photos-original_date_time>`,
	]

	if (location !== null) {
		setProperties.push(`<nc:metadata-photos-gps>
			<nc:latitude>${location.latitude}</nc:latitude>
			<nc:longitude>${location.longitude}</nc:longitude>
		</nc:metadata-photos-gps>`)
	}

	// Removing the property rather than sending empty coordinates keeps the
	// photo out of the places, which a position of 0/0 would not.
	const removeProperties = location === null
		? '<d:remove><d:prop><nc:metadata-photos-gps /></d:prop></d:remove>'
		: ''

	await davClient.customRequest(`${photo.root}${photo.path}`, {
		method: 'PROPPATCH',
		data: `<?xml version="1.0"?>
			<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
				<d:set>
					<d:prop>
						${setProperties.join('\n')}
					</d:prop>
				</d:set>
				${removeProperties}
			</d:propertyupdate>`,
	})
}
