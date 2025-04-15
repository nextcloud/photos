/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export default {
	name: 'FilesByMonthMixin',

	computed: {
		fileIdsByMonth(): Record<string, string[]> {
			const filesByMonth = {}
			for (const fileId of this.fetchedFileIds) {
				const file = this.files[fileId]
				if (file) {
					filesByMonth[file.month] = filesByMonth[file.month] ?? []
					filesByMonth[file.month].push(file.fileid)
				}
			}

			// Sort files in sections.
			Object.keys(filesByMonth)
				.forEach(month => filesByMonth[month].sort(this.sortFilesByTimestamp))

			return filesByMonth
		},

		monthsList(): string[] {
			return Object
				.keys(this.fileIdsByMonth)
				.sort((month1, month2) => month1 > month2 ? -1 : 1)
		},
	},

	methods: {
		sortFilesByTimestamp(fileId1: string, fileId2: string): -1|1 {
			return this.files[fileId1].timestamp > this.files[fileId2].timestamp ? -1 : 1
		},
	},
}
