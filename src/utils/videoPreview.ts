/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * How long the pointer has to rest on a tile before its video starts playing on
 * it, in milliseconds. Sweeping across the grid passes over dozens of tiles, and
 * without the delay every one of them would fire a media load.
 */
export const VIDEO_PREVIEW_DELAY = 250

/**
 * The formats a browser plays inline without a plugin. The app cannot transcode,
 * so everything else — QuickTime above all, which is what iOS writes — keeps to
 * its still preview.
 */
const PREVIEWABLE_VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/ogg']

/**
 * Whether a file can be previewed by playing it inline on its tile.
 *
 * @param mime - Mime type of the file
 */
export function isPreviewableVideoMime(mime: string | undefined): boolean {
	return PREVIEWABLE_VIDEO_MIMES.includes(mime ?? '')
}

/**
 * Whether this session plays video previews at all.
 */
export function playsVideoPreviews(): boolean {
	return window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
}
