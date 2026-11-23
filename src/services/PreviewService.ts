/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { generateUrl } from '@nextcloud/router'

// The preview service worker cache name (see webpack config)
const SWCacheName = 'images'
const hotCache = []

/**
 * Check if the preview is already cached by the service worker
 *
 * @param previewUrl
 */
export async function isCachedPreview(previewUrl: string): Promise<boolean> {
	try {
		// Browser's cache take ~100ms to check, hot cache ~10ms.
		if (!hotCache[previewUrl]) {
			const cache = await window.caches?.open(SWCacheName)
			const response = await cache?.match(previewUrl)
			hotCache[previewUrl] = response !== undefined
		}

		return hotCache[previewUrl]
	} catch {
		return false
	}
}

/**
 * The url of the preview of a file of the current user.
 *
 * @param fileId - Id of the file
 * @param etag - Etag of the file, as its DAV attribute holds it
 * @param size - Width and height of the preview
 */
export function getPreviewUrl(fileId: number | string, etag: string, size: number): string {
	const decodedEtag = etag.replace('&quot;', '').replace('&quot;', '')
	return generateUrl(`/apps/photos/api/v1/preview/${fileId}?etag=${decodedEtag}&x=${size}&y=${size}`)
}
