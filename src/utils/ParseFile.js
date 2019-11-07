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

/**
 * Format a file into a usable fileinfo object
 *
 * @param {Object} fileData file data returned by the webdav lib
 * @param {String} prefixPath path to substract from the files
 * @returns {Object}
 */
export default function(fileData, prefixPath = '') {
	const filename = fileData.filename.replace(prefixPath, '/').replace(/^\/\//, '/')
	return Object.assign({
		id: parseInt(fileData.props.fileid),
		isFavorite: fileData.props.favorite !== '0',
		hasPreview: fileData.props['has-preview'] !== 'false',
	}, fileData, { filename })
}
