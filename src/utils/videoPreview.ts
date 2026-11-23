/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'
import { generateUrl } from '@nextcloud/router'

/**
 * How long the pointer has to rest on a tile before its video starts playing on
 * it, in milliseconds. Sweeping across the grid passes over dozens of tiles, and
 * without the delay every one of them would fire a media load.
 */
export const VIDEO_PREVIEW_DELAY = 250

/**
 * Whether this browser plays a format, as far as its mime type tells. An MP4
 * passes even when the codec inside it, HEVC most of all, is one the browser
 * cannot decode, which only playing it reveals.
 *
 * @param mime - Mime type of the file
 */
function canPlayVideoMime(mime: string): boolean {
	return document.createElement('video').canPlayType(mime) !== ''
}

/**
 * The sources to try, in this order, for playing a video inline on its tile:
 * the file itself when the browser knows its format, then the rendition the
 * server converts for browsers that cannot decode the original.
 *
 * @param mime - Mime type of the file
 * @param source - URL of the file
 * @param renditionUrl - URL of its rendition, null when there is none to ask for
 * @param canPlay - Whether the browser plays a mime type
 */
export function getVideoPreviewSources(
	mime: string | undefined,
	source: string,
	renditionUrl: string | null,
	canPlay: (mime: string) => boolean = canPlayVideoMime,
): string[] {
	if (!mime?.startsWith('video/')) {
		return []
	}

	const sources = canPlay(mime) ? [source] : []
	return renditionUrl === null ? sources : [...sources, renditionUrl]
}

/**
 * URL of the browser-playable rendition of a video, null when the server does
 * not make renditions.
 *
 * @param fileId - Id of the video
 * @param etag - Etag of the video, which keeps a cached rendition from outliving its original
 */
export function getVideoRenditionUrl(fileId: number, etag: string): string | null {
	if (!loadState('photos', 'video-renditions', false)) {
		return null
	}

	return generateUrl(`/apps/photos/api/v1/video/${fileId}?etag=${etag}`)
}

/**
 * Whether this session plays video previews at all.
 */
export function playsVideoPreviews(): boolean {
	return window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
}
