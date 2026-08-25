/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

export type DuplicateGroup = {
	/** Stable key and identity — the byte size shared by the group. */
	id: string
	/** Byte size shared by every photo in the group. */
	size: number
	photos: PhotoFile[]
}

/**
 * Group photos that look like duplicates of one another.
 *
 * Two photos are treated as duplicates when they share an exact byte size. Two
 * different images compressing to the very same byte count is astronomically
 * unlikely, so this reliably catches re-uploaded copies without hashing the file
 * contents — and the user still reviews each group before deleting anything.
 * Size is used on its own rather than combined with pixel dimensions, which are
 * only filled in by a background job and so are absent for freshly added files.
 * Only groups of two or more are returned, most copies first (then largest
 * files), so the biggest space savings surface at the top.
 *
 * @param photos - The photos to scan
 */
export function findDuplicateGroups(photos: PhotoFile[]): DuplicateGroup[] {
	const bySize = new Map<number, PhotoFile[]>()

	for (const photo of photos) {
		const size = photo.size ?? 0
		// A photo with no real byte size cannot be fingerprinted.
		if (size <= 0) {
			continue
		}

		const existing = bySize.get(size)
		if (existing) {
			existing.push(photo)
		} else {
			bySize.set(size, [photo])
		}
	}

	return [...bySize.entries()]
		.filter(([, group]) => group.length > 1)
		.map(([size, group]) => ({
			id: String(size),
			size,
			photos: group,
		}))
		.sort((a, b) => b.photos.length - a.photos.length || b.size - a.size)
}
