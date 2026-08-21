/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoLocation } from '../utils/exif.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

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
export async function savePhotoMetadata(photo: PhotoTarget, update: PhotoMetadataUpdate): Promise<void> {
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

	await davClient.customRequest(photo.davPath, {
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

/**
 * Mark a photo as a favorite, or take that mark off again.
 *
 * Favorites are per account rather than per file, which is why this works on a
 * photo shared by someone else as well.
 *
 * @param photo - Photo to update
 * @param favorite - Whether the photo should be a favorite
 * @throws {Error} When the server rejects the update
 */
export async function setPhotoFavorite(photo: PhotoTarget, favorite: boolean): Promise<void> {
	await davClient.customRequest(photo.davPath, {
		method: 'PROPPATCH',
		data: `<?xml version="1.0"?>
			<d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
				<d:set>
					<d:prop>
						<oc:favorite>${favorite ? 1 : 0}</oc:favorite>
					</d:prop>
				</d:set>
			</d:propertyupdate>`,
	})
}

/**
 * Move a photo to the trash.
 *
 * @param photo - Photo to delete
 * @throws {Error} When the server refuses to delete the photo
 */
export async function deletePhoto(photo: PhotoTarget): Promise<void> {
	await davClient.deleteFile(photo.davPath)
}
