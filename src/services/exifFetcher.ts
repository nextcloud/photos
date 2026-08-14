/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat, ResponseDataDetailed } from 'webdav'
import type { PhotoFile } from '../store/files.ts'
import type { PhotoExif } from '../utils/exif.ts'

import { davClient } from './DavClient.ts'
import logger from './logger.ts'

const exifPropFind = `<?xml version="1.0"?>
		<d:propfind xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
			<d:prop>
				<nc:metadata-photos-exif />
				<nc:metadata-photos-ifd0 />
			</d:prop>
		</d:propfind>`

/**
 * Fetch the EXIF metadata of a single photo.
 *
 * These properties are not registered as default DAV properties on purpose:
 * they hold dozens of entries per photo, which would weigh down the listings
 * fetching hundreds of photos at once while only a handful of them are ever
 * inspected.
 *
 * @param photo - Photo to fetch the metadata of
 * @return The metadata of the photo, empty when it carries none
 */
export async function fetchPhotoExif(photo: PhotoFile): Promise<PhotoExif> {
	try {
		const response = await davClient.stat(`${photo.root}${photo.path}`, {
			data: exifPropFind,
			details: true,
		}) as ResponseDataDetailed<FileStat>

		const props = response.data.props ?? {}

		return {
			exif: (props['metadata-photos-exif'] ?? {}) as Record<string, unknown>,
			ifd0: (props['metadata-photos-ifd0'] ?? {}) as Record<string, unknown>,
		}
	} catch (error) {
		logger.error('Error fetching the metadata of a photo', { error, filename: photo.basename })
		return { exif: {}, ifd0: {} }
	}
}
