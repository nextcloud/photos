/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const arrayRange = function(n) {
	// Array.range(5) --> [0,1,2,3,4]
	return Array.apply(null, Array(n)).map((x, i) => i)
}

/**
 * Split an array into chunks
 *
 * @param {Array} arr an array to split
 * @param {number} count lenght of the chunk
 * @returns {Array}
 */
export default function(arr = [], count = 5) {
	return arrayRange(Math.ceil(arr.length / count)).map((x, i) =>
		arr.slice(i * count, i * count + count)
	)
}
