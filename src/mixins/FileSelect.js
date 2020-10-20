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
			selectedFiles: new Set(),
			selectedFilesCount: 0, // VueJS does not support Set() as reactive so we need a count var
		}
	},

	beforeDestroy() {
		this.selectedFiles.clear()
	},

	methods: {
		selectFile(filename) {
			this.selectedFiles.add(filename)
			this.selectedFilesCount += 1
		},

		unSelectFile(filename) {
			this.selectedFiles.delete(filename)
			this.selectedFilesCount -= 1
		},

		clearSelectedFiles() {
			this.selectedFiles.clear()
			this.selectedFilesCount = 0
		},
	},
}
