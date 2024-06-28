/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export default {
	name: 'FilesByMonthMixin',

	computed: {
		/**
		 * @return {Object<string, []>}
		 */
		fileIdsByMonth() {
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

		/**
		 * @return {string[]}
		 */
		monthsList() {
			return Object
				.keys(this.fileIdsByMonth)
				.sort((month1, month2) => month1 > month2 ? -1 : 1)
		},
	},

	methods: {
		/**
		 * @param {string} fileId1 The first file ID
		 * @param {string} fileId2 The second file ID
		 * @return {-1 | 1}
		 */
		sortFilesByTimestamp(fileId1, fileId2) {
			return this.files[fileId1].timestamp > this.files[fileId2].timestamp ? -1 : 1
		},
	},
}
