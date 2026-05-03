/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Thin wrapper around the per-user EXIF override endpoint
 * (`PUT /api/v1/metadata/{fileId}`). The shape matches the backend
 * controller exactly — `null` clears an override, omission leaves
 * it untouched.
 *
 * The frontend keeps its existing `metadata-photos-original_date_time`
 * / `metadata-photos-gps` reads. The backend layers the override
 * on top of the EXIF values before returning, so client code that
 * shows date / location is automatically displaying the user's
 * latest edit without any extra plumbing.
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

export interface MetadataEdit {
	fileId: number
	takenAt: number | null
	gpsLat: number | null
	gpsLng: number | null
}

export async function getMetadataEdit(fileId: number): Promise<MetadataEdit> {
	const { data } = await axios.get<MetadataEdit>(generateUrl('/apps/photos/api/v1/metadata/{fileId}', { fileId }))
	return data
}

/**
 * Save the partial set of fields the user changed. Pass `null`
 * for a field to clear that override; omit a field to leave it
 * untouched. Server returns the merged effective row.
 *
 * @param fileId
 * @param patch
 */
export async function saveMetadataEdit(
	fileId: number,
	patch: Partial<{
		takenAt: number | null
		gpsLat: number | null
		gpsLng: number | null
	}>,
): Promise<MetadataEdit> {
	const { data } = await axios.put<MetadataEdit>(
		generateUrl('/apps/photos/api/v1/metadata/{fileId}', { fileId }),
		patch,
	)
	return data
}
