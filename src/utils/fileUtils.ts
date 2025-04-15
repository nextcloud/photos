/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { defaultRemoteURL } from '@nextcloud/files/dav'
import { getLanguage } from '@nextcloud/l10n'
import camelcase from 'camelcase'
import { isNumber } from './numberUtils.js'

export type PhotoNode = {
	fileid: string
	basename: string
	filename: string
	source: string
	isFavorite: boolean
	type: 'file' | 'folder'
	mime: string
	hidden: boolean
	metadataPhotosSize: { width: number, height: number }
	metadataPhotosOriginalDateTime: number
	lastmod: number
	timestamp: number
	month: string
	day: string
}

/**
 * Get an url encoded path
 */
const encodeFilePath = function(path: string): string {
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
 */
const extractFilePaths = function(path: string): [string, string] {
	const pathSections = path.split('/')
	const fileName = pathSections[pathSections.length - 1]
	const dirPath = pathSections.slice(0, pathSections.length - 1).join('/')
	return [dirPath, fileName]
}

/**
 * Sorting comparison function
 */
const sortCompare = function(fileInfo1: PhotoNode, fileInfo2: PhotoNode, key: string, asc: boolean = true): number {

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
		? fileInfo1[key]?.toString()?.localeCompare(fileInfo2[key].toString(), getLanguage()) || 1
		: -fileInfo1[key]?.toString()?.localeCompare(fileInfo2[key].toString(), getLanguage()) || -1
}

function genFileInfo(obj: { filename: string }): PhotoNode {
	const fileInfo = flattenAndFormatObject(obj, flattenAndFormatObject) as PhotoNode

	if (fileInfo.filename) {
		const url = new URL(fileInfo.filename, defaultRemoteURL)
		// Adding context
		fileInfo.source = url.href
		fileInfo.filename = fileInfo.filename.replace('remote.php/dav/', '')
	}

	return fileInfo
}

function extractTagInfo(obj: object): PhotoNode {
	return flattenAndFormatObject(obj, flattenAndFormatObject) as PhotoNode
}

function flattenAndFormatObject(obj: object, callback?: (data: object) => Partial<PhotoNode>): Partial<PhotoNode> {
	return Object.entries(obj).reduce((resultObj, [key, data]) => {
		// flatten object if any
		if (!!data && typeof data === 'object' && !Array.isArray(data)) {
			return { ...resultObj, ...(callback ? callback(data) : { [camelcase(key)]: data }) }
		}

		// format key and add it to the tagInfo
		switch (data) {
		case 'false':
			return { ...resultObj, [camelcase(key)]: false }
		case 'true':
			return { ...resultObj, [camelcase(key)]: true }
		default:
			return { ...resultObj, [camelcase(key)]: isNumber(data) ? Number(data) : data }
		}
	}, {})
}

export { encodeFilePath, extractFilePaths, sortCompare, genFileInfo, extractTagInfo }
