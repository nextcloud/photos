/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FilesSelectionMixin',

	data() {
		return {
			selection: {} as Record<string, boolean>,
		}
	},

	watch: {
		$route() {
			this.resetSelection()
		},
	},

	methods: {
		onFileSelectToggle({ id, value }): void {
			this.$set(this.selection, id, value)
		},

		onUncheckFiles(filesIds: string[]): void {
			filesIds.forEach((filesId: string) => this.$set(this.selection, filesId, false))
		},

		resetSelection(): void {
			this.selection = {}
		},
	},

	computed: {
		selectedFileIds(): string[] {
			return Object.keys(this.selection).filter((fileId) => this.selection[fileId])
		},
	},
})
