/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'
import camelcase from 'camelcase'
import { rootPath, prefixPath } from '../services/DavClient.js'
import { isNumber } from './numberUtils.js'

/**
 * Get an url encoded path
 *
 * @param {string} path the full path
 * @return {string} url encoded file path
 */
const encodeFilePath = function(path) {
	const pathSections = (path.startsWith('/') ? path : `/${path}`).split('/')
	let relativePath = ''
	pathSections.forEach((section) => {
		if (section !== '') {
			relativePath += '/' + encodeURIComponent(section)
		}
	})
	return relativePath
}

/**
 * Extract dir and name from file path
 *
 * @param {string} path the full path
 * @return {string[]} [dirPath, fileName]
 */
const extractFilePaths = function(path) {
	const pathSections = path.split('/')
	const fileName = pathSections[pathSections.length - 1]
	const dirPath = pathSections.slice(0, pathSections.length - 1).join('/')
	return [dirPath, fileName]
}

/**
 * Sorting comparison function
 *
 * @param {object} fileInfo1 file 1 fileinfo
 * @param {object} fileInfo2 file 2 fileinfo
 * @param {string} key key to sort with
 * @param {boolean} [asc=true] sort ascending?
 * @return {number}
 */
const sortCompare = function(fileInfo1, fileInfo2, key, asc = true) {

	// favorite always first
	if (fileInfo1.isFavorite && !fileInfo2.isFavorite) {
		return -1
	} else if (!fileInfo1.isFavorite && fileInfo2.isFavorite) {
		return 1
	}

	// if this is a number, let's sort by integer
	if (isNumber(fileInfo1[key]) && isNumber(fileInfo2[key])) {
		return asc
			? Number(fileInfo2[key]) - Number(fileInfo1[key])
			: Number(fileInfo1[key]) - Number(fileInfo2[key])
	}

	// else we sort by string, so let's sort directories first
	if (fileInfo1.type !== 'file' && fileInfo2.type === 'file') {
		return asc ? -1 : 1
	} else if (fileInfo1.type === 'file' && fileInfo2.type !== 'file') {
		return asc ? 1 : -1
	}

	// if this is a date, let's sort by date
	if (isNumber(new Date(fileInfo1[key]).getTime()) && isNumber(new Date(fileInfo2[key]).getTime())) {
		return asc
			? new Date(fileInfo2[key]).getTime() - new Date(fileInfo1[key]).getTime()
			: new Date(fileInfo1[key]).getTime() - new Date(fileInfo2[key]).getTime()
	}

	// finally sort by name
	return asc
		? fileInfo1[key]?.toString()?.localeCompare(fileInfo2[key].toString(), OC.getLanguage()) || 1
		: -fileInfo1[key]?.toString()?.localeCompare(fileInfo2[key].toString(), OC.getLanguage()) || -1
}

const knownApps = ['files', 'photos', 'recognize']

/**
 * Checks if the specified path starts with app and user
 *
 * @param {string} path the path to check
 * @return {object} the check result
 */
function analyzePath(path) {
	const parts = typeof path === 'string'
		? path.split('/').filter(p => p.length > 0)
		: []

	const [app, user] = parts
	const hasCurrentUser = user && user === `${getCurrentUser()?.uid}`
	const hasKnownApp = app && knownApps.includes(app)

	return { hasCurrentUser, hasKnownApp, parts }
}

/**
 * Strips '/app/user/' from path or fileInfo.filename
 *
 * @param {string|object.filename} path the path or fileInfo to convert
 * @return {string|object.filename} the converted input or the original if no conversion was required
 */
function toRelativeFilePath(path) {
	if (typeof path === 'object' && 'filename' in path) {
		return { ...path, filename: toRelativeFilePath(path.filename) }
	}

	const { hasKnownApp, hasCurrentUser, parts } = analyzePath(path)
	return hasKnownApp || hasCurrentUser
		? '/' + parts.slice(2).join('/')
		: path
}

/**
 * Changes path (or fileInfo.filename) so that it starts with '/app/user/...'
 *
 * @param {string|object.filename} path the path or fileInfo to convert
 * @param {string} contextPath the prefix to add to relative paths
 * @return {string|object.filename} the converted input or the original if no conversion was required
 */
function toAbsoluteFilePath(path, contextPath = prefixPath) {
	if (typeof path === 'object' && 'filename' in path) {
		return { ...path, filename: toAbsoluteFilePath(path.filename) }
	}

	const { hasKnownApp, hasCurrentUser } = analyzePath(path)
	return !hasKnownApp && !hasCurrentUser
		? contextPath + path
		: path
}

/**
 * Converts the given fileInfo to an obj suitable for OCA.Viewer
 *
 * @param {object} obj the fileInfo to prepare for sending it to OCA.Viewer
 * @returns a clone of obj with properties adjusted when needed
 */
function toViewerFileInfo(obj) {
	if (typeof obj !== 'object' || typeof obj.filename !== 'string') {
		throw new Error('fileInfo obj must be given, found: ' + obj)
	}

	// according to Viewer docs, filename must be URL when route is not /files/user/
	obj = obj.filename.startsWith('/files/')
		? { ...obj, filename: toRelativeFilePath(obj.filename) }
		: { ...obj, filename: obj.source }

	// ensure basename is correct
	const [, basename] = extractFilePaths(obj.filename)
	obj.basename = basename

	return obj
}

/**
 * @param {object} obj - object to flatten and format.
 */
function genFileInfo(obj) {
	const fileInfo = Object.entries(obj).reduce((fileInfo, [key, data]) => {
		// flatten object if any
		if (!!data && typeof data === 'object' && !Array.isArray(data)) {
			return { ...fileInfo, ...genFileInfo(data) }
		}

		// format key and add it to the fileInfo
		switch (data) {
		case 'false':
			return { ...fileInfo, [camelcase(key)]: false }
		case 'true':
			return { ...fileInfo, [camelcase(key)]: true }
		default:
			return { ...fileInfo, [camelcase(key)]: isNumber(data) ? Number(data) : data }
		}
	}, {})

	// format source and filename (ensure app & user is always included)
	if (fileInfo.filename) {
		fileInfo.filename = toAbsoluteFilePath(fileInfo.filename)

		const path = encodeFilePath(fileInfo.filename)
		fileInfo.source = generateRemoteUrl(rootPath) + (path.startsWith('/') ? '' : '/') + path
	}

	return fileInfo
}

export { encodeFilePath, extractFilePaths, sortCompare, genFileInfo, toRelativeFilePath, toAbsoluteFilePath, toViewerFileInfo }
