/**
 * @copyright Copyright (c) 2019 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

export default {
	name: 'FilesSelectionMixin',

	data() {
		return {
			/** @type {Object<string, boolean>} */
			selection: {},
		}
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
