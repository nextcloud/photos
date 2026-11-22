/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

/** The photos of one day, in the order the grid shows them. */
export interface DayGroup {
	/** The `YYYYMMDD` key of the day, in local time. */
	id: string
	fileIds: string[]
}

/**
 * Build the `YYYYMMDD` key of the day a photo was taken, from its `YYYYMM`
 * month key and its `MMDD` day key.
 *
 * @param file - The photo.
 */
export function toDateKey(file: PhotoFile): string {
	return `${file.attributes.month}${file.attributes.day.slice(2)}`
}

/**
 * Split a list of photos into the days they were taken on.
 *
 * @param fileIds - File ids in the order the grid shows them, newest first.
 * @param files - The photos, by file id.
 * @return The days in the order their first photo appears in `fileIds`. Ids
 * missing from `files` are left out.
 */
export function groupFileIdsByDay(fileIds: string[], files: Record<string, PhotoFile>): DayGroup[] {
	const days = new Map<string, string[]>()

	for (const fileId of fileIds) {
		const file = files[fileId]
		if (file === undefined) {
			continue
		}

		const day = toDateKey(file)
		const dayFileIds = days.get(day)
		if (dayFileIds === undefined) {
			days.set(day, [fileId])
		} else {
			dayFileIds.push(fileId)
		}
	}

	return Array.from(days, ([id, dayFileIds]) => ({ id, fileIds: dayFileIds }))
}
