/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { PhotoFile } from '../store/files.ts'

import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FilesByMonthMixin',

	computed: {
		fileIdsByMonth(): Record<string, string[]> {
			const filesByMonth = {}
			for (const fileId of (this.fetchedFileIds as number[])) {
				const file = (this.files as Record<string, PhotoFile>)[fileId]
				if (file) {
					filesByMonth[file.attributes.month] = filesByMonth[file.attributes.month] ?? []
					filesByMonth[file.attributes.month].push(file.fileid)
				}
			}

			// Sort files in sections.
			Object.keys(filesByMonth)
				.forEach((month) => filesByMonth[month].sort(this.sortFilesByTimestamp))

			return filesByMonth
		},

		monthsList(): string[] {
			return Object
				.keys(this.fileIdsByMonth)
				.sort((month1, month2) => month1 > month2 ? -1 : 1)
		},
	},

	methods: {
		sortFilesByTimestamp(fileId1: string, fileId2: string): -1 | 1 {
			return (this.files as Record<string, PhotoFile>)[fileId1].attributes.timestamp > (this.files as Record<string, PhotoFile>)[fileId2].attributes.timestamp ? -1 : 1
		},
	},
})
