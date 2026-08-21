/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

/**
 * Pick the photo to show as the cover of an album.
 *
 * The album points at the photo added last, which is not necessarily one a
 * preview can be built for - and a cover without a preview leaves an empty
 * tile. The most recent photo with a preview is used instead in that case,
 * falling back to the photo the album points at when none of them has one.
 *
 * @param files - Photos of the album
 * @param coverFileId - File id the album points at, `-1` when it has no photo
 */
export function pickAlbumCover(files: PhotoFile[], coverFileId: number): PhotoFile | undefined {
	const cover = files.find((file) => file.fileid === coverFileId)
	if (cover?.attributes.hasPreview) {
		return cover
	}

	const mostRecentWithPreview = files
		.filter((file) => file.attributes.hasPreview)
		.reduce<PhotoFile | undefined>(
			(newest, file) => newest === undefined || file.attributes.timestamp > newest.attributes.timestamp ? file : newest,
			undefined,
		)

	return mostRecentWithPreview ?? cover
}
