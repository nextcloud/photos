/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FileStat, ResponseDataDetailed } from 'webdav'
import type { FaceDetection } from '../utils/faceDetections.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { parseFaceDetections } from '../utils/faceDetections.ts'
import { davClient } from './DavClient.ts'
import { logger } from './logger.ts'

const faceDetectionsPropFind = `<?xml version="1.0"?>
		<d:propfind xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">
			<d:prop>
				<nc:face-detections />
			</d:prop>
		</d:propfind>`

/**
 * Fetch the faces the recognize app detected in a single photo.
 *
 * @param photo - Photo to fetch the faces of
 * @return The faces detected in the photo, empty when there are none
 */
export async function fetchFaceDetections(photo: PhotoTarget): Promise<FaceDetection[]> {
	try {
		const response = await davClient.stat(photo.davPath, {
			data: faceDetectionsPropFind,
			details: true,
		}) as ResponseDataDetailed<FileStat>

		return parseFaceDetections(response.data.props?.['face-detections'])
	} catch (error) {
		logger.error('Error fetching the faces of a photo', { error, filename: photo.basename })
		return []
	}
}
