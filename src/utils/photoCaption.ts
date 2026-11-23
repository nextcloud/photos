/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { loadState } from '@nextcloud/initial-state'

/** DAV property holding the one-line description generated for a photo. */
export const CAPTION_PROPERTY = 'metadata-photos-caption'

/**
 * Whether the name search also matches the descriptions, which is only
 * possible once the server stored at least one of them.
 */
export function isCaptionSearchEnabled(): boolean {
	return loadState<boolean>('photos', 'caption-search', false)
}

/**
 * Get the description generated for a photo.
 *
 * @param props - DAV properties of the photo
 * @return The description, `undefined` when the photo has none
 */
export function getPhotoCaption(props: Record<string, unknown>): string | undefined {
	const caption = props[CAPTION_PROPERTY]

	// The DAV client parses numeric values, a description could be one.
	if (typeof caption === 'number') {
		return String(caption)
	}

	return typeof caption === 'string' && caption.trim() !== '' ? caption : undefined
}
