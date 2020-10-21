/**
 * @copyright Copyright (c) 2020 Corentin Mors
 *
 * @license GNU AGPL version 3 or any later version
 *
 * @author Corentin Mors <medias@pixelswap.fr>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

export default {
	data() {
		return {
			selectedFiles: {},
		}
	},

	beforeDestroy() {
		this.selectedFiles.clear()
	},

	computed: {
		selectedFilesCount() {
			return Object.keys(this.selectedFiles).length
		},
	},

	methods: {
		selectFile(fileId) {
			this.selectedFiles = Object.assign({}, this.selectedFiles, { [fileId]: true })
		},

		unSelectFile(fileId) {
			delete this.selectedFiles[fileId]
			this.selectedFiles = Object.assign({}, this.selectedFiles)
		},

		clearSelectedFiles() {
			this.selectedFiles = {}
		},
	},
}
