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

// compatible with webpack config, no export
module.exports = {
	sizes: {
		400: {
			marginTop: 66, // same as grid-gap
			marginW: 8, // same as grid-gap
			count: 3,
		},
		600: {
			marginTop: 66,
			marginW: 8, // same as grid-gap
			count: 4,
		},
		1024: {
			marginTop: 66,
			marginW: 44,
			count: 5,
		},
		1400: {
			marginTop: 66,
			marginW: 44,
			count: 6,
		},
		1800: {
			marginTop: 88,
			marginW: 66,
			count: 7,
		},
		2200: {
			marginTop: 88,
			marginW: 66,
			count: 8,
		},
		2600: {
			marginTop: 88,
			marginW: 88,
			count: 9,
		},
		// excessive value on purpose
		max: {
			marginTop: 88,
			marginW: 88,
			count: 10,
		},
	},
}
