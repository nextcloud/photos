/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export default {
	name: 'FilesSelectionMixin',

	data() {
		return {
			/** @type {Object<string, boolean>} */
			selection: {},
		}
	},

	watch: {
		$route() {
			this.resetSelection()
		},
	},

	methods: {
		onFileSelectToggle({ id, value }) {
			this.$set(this.selection, id, value)
		},

		/**
		 * @param {string[]} filesIds - The ids of the files to uncheck.
		 */
		onUncheckFiles(filesIds) {
			filesIds.forEach((/** @type {string} */ filesId) => this.$set(this.selection, filesId, false))
		},

		resetSelection() {
			this.selection = {}
		},
	},

	computed: {
		/**
		 * @return {string[]}
		 */
		selectedFileIds() {
			return Object.keys(this.selection).filter(fileId => this.selection[fileId])
		},
	},
}
