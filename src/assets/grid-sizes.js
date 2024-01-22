/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * Define the max width proportions
 * The number (key) indicate the MAX size
 *
 * needs to be compatible with webpack config
 * so no export default {}
 */
module.exports = {
	sizes: {
		400: {
			marginTop: 66,
			marginW: 8,
			count: 3,
			folderCount: 1,
		},
		700: {
			marginTop: 66,
			marginW: 8,
			count: 4,
			folderCount: 1,
		},
		1024: {
			marginTop: 66,
			marginW: 44,
			count: 5,
			folderCount: 2,
		},
		1280: {
			marginTop: 66,
			marginW: 44,
			count: 4,
			folderCount: 2,
		},
		1440: {
			marginTop: 88,
			marginW: 66,
			count: 5,
			folderCount: 3,
		},
		1600: {
			marginTop: 88,
			marginW: 66,
			count: 6,
			folderCount: 4,
		},
		2048: {
			marginTop: 88,
			marginW: 66,
			count: 7,
			folderCount: 4,
		},
		2560: {
			marginTop: 88,
			marginW: 88,
			count: 8,
			folderCount: 6,
		},
		3440: {
			marginTop: 88,
			marginW: 88,
			count: 9,
			folderCount: 8,
		},
		max: {
			marginTop: 88,
			marginW: 88,
			count: 10,
			folderCount: 10,
		},
	},
}
