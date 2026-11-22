/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import axios from '@nextcloud/axios'
import { formatFileSize } from '@nextcloud/files'
import { formatRelativeTime, getCanonicalLocale, n, t } from '@nextcloud/l10n'
import { generateOcsUrl } from '@nextcloud/router'

/** Number and size of media files, times as Unix timestamps in seconds. */
export type MediaCount = {
	photos: number
	videos: number
	size: number
	lastUpload: number | null
}

export type CameraFolderStatus = MediaCount & { path: string }

export type LibraryStatus = MediaCount & { cameraFolders: CameraFolderStatus[] }

/**
 * Fetch the number of photos and videos of the current user on the server.
 */
export async function fetchLibraryStatus(): Promise<LibraryStatus> {
	const response = await axios.get(generateOcsUrl('apps/photos/api/v1/library/status'))
	return response.data.ocs.data
}

/**
 * Describe a media count, like *12,345 photos and 678 videos (54 GB)*.
 * A kind of media without any file is left out.
 *
 * @param count - The media count to describe.
 */
export function formatMediaCount(count: MediaCount): string {
	const locale = getCanonicalLocale()
	const size = formatFileSize(count.size)
	const photos = n('photos', '{count} photo', '{count} photos', count.photos, { count: count.photos.toLocaleString(locale) })
	const videos = n('photos', '{count} video', '{count} videos', count.videos, { count: count.videos.toLocaleString(locale) })
	if (count.videos === 0) {
		return t('photos', '{files} ({size})', { files: photos, size }, undefined, { escape: false })
	}
	if (count.photos === 0) {
		return t('photos', '{files} ({size})', { files: videos, size }, undefined, { escape: false })
	}
	return t('photos', '{photos} and {videos} ({size})', { photos, videos, size }, undefined, { escape: false })
}

/**
 * Describe the time of the last upload, like *last upload 2 hours ago*.
 *
 * @param lastUpload - Unix timestamp of the last upload in seconds.
 */
export function formatLastUpload(lastUpload: number): string {
	return t('photos', 'last upload {time}', { time: formatRelativeTime(lastUpload * 1000) }, undefined, { escape: false })
}

/**
 * Summarize the library of the user, like *12,345 photos and 678 videos (54 GB) on this server · last upload 2 hours ago*.
 *
 * @param status - The library status to summarize.
 */
export function formatLibraryStatus(status: LibraryStatus): string {
	if (status.photos === 0 && status.videos === 0) {
		return t('photos', 'No photos or videos on this server yet')
	}

	const summary = t('photos', '{count} on this server', { count: formatMediaCount(status) }, undefined, { escape: false })
	return status.lastUpload === null ? summary : `${summary} · ${formatLastUpload(status.lastUpload)}`
}
