/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
 * needs to be ompatible with webpack config
 * so no export default {}
 */
module.exports = {
	sizes: {
		400: {
			marginTop: 66, // same as grid-gap
			marginW: 8, // same as grid-gap
			count: 3,
		},
		700: {
			marginTop: 66,
			marginW: 8, // same as grid-gap
			count: 4,
		},
		1024: {
			marginTop: 66,
			marginW: 44,
			count: 5,
		},
		1280: {
			marginTop: 66,
			marginW: 44,
			count: 4,
		},
		1440: {
			marginTop: 88,
			marginW: 66,
			count: 5,
		},
		1600: {
			marginTop: 88,
			marginW: 66,
			count: 6,
		},
		2048: {
			marginTop: 88,
			marginW: 66,
			count: 7,
		},
		2560: {
			marginTop: 88,
			marginW: 88,
			count: 8,
		},
		3440: {
			marginTop: 88,
			marginW: 88,
			count: 9,
		},
		max: {
			marginTop: 88,
			marginW: 88,
			count: 10,
		},
	},
}
