/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

/** User-editable details of a photo that Nextcloud does not store elsewhere. */
export type PhotoDetails = {
	fileId: number
	description: string | null
	rating: number
}

/**
 * Fetch the stored description and rating of a photo. A photo that has none
 * comes back with an empty description and a rating of 0.
 *
 * @param fileId - File id of the photo
 */
export async function getPhotoDetails(fileId: number): Promise<PhotoDetails> {
	const { data } = await axios.get<PhotoDetails>(generateUrl('/apps/photos/api/v1/metadata/{fileId}', { fileId }))
	return data
}

/**
 * Save the description and/or rating of a photo. Only the given fields change.
 *
 * @param fileId - File id of the photo
 * @param details - The fields to update
 * @param details.description - Description, or an empty string / null to clear it
 * @param details.rating - Rating from 0 (none) to 5
 */
export async function savePhotoDetails(
	fileId: number,
	details: { description?: string | null, rating?: number },
): Promise<PhotoDetails> {
	const { data } = await axios.put<PhotoDetails>(
		generateUrl('/apps/photos/api/v1/metadata/{fileId}', { fileId }),
		details,
	)
	return data
}
