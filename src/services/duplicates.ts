/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

/**
 * Key shared by the files that are copies of each other: same size in bytes,
 * same capture time and same dimensions.
 *
 * This only finds exact copies of a file, not visually similar photos such as
 * an edited or re-encoded version. Files without a size or a capture time are
 * left out, as the remaining properties are too weak to tell copies apart.
 *
 * @param file - File to compute the key of
 * @return The key, or null when the file cannot be compared
 */
export function getDuplicateKey(file: PhotoFile): string | null {
	const takenAt = file.attributes['metadata-photos-original_date_time']
	if (!file.size || !takenAt) {
		return null
	}

	const dimensions = file.attributes['metadata-photos-size']
	return `${file.size}-${takenAt}-${dimensions?.width ?? 0}x${dimensions?.height ?? 0}`
}

/**
 * Group the files that are exact copies of each other.
 *
 * @param files - Files to look for copies in
 * @return The groups holding at least two files, each sorted by path, the
 * groups taking the most space first
 */
export function findDuplicateGroups(files: PhotoFile[]): PhotoFile[][] {
	const filesByKey = new Map<string, PhotoFile[]>()

	for (const file of files) {
		const key = getDuplicateKey(file)
		if (key === null) {
			continue
		}

		const group = filesByKey.get(key)
		if (group === undefined) {
			filesByKey.set(key, [file])
		} else {
			group.push(file)
		}
	}

	return [...filesByKey.values()]
		.filter((group) => group.length > 1)
		.map((group) => group.sort((file1, file2) => file1.path.localeCompare(file2.path)))
		.sort((group1, group2) => (group2[0].size ?? 0) * (group2.length - 1) - (group1[0].size ?? 0) * (group1.length - 1))
}
