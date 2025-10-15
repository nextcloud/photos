import type { FoldersNode } from '../services/FolderContent.ts'

import {
	type Node,

	FileType, Permission,
} from '@nextcloud/files'
import { getRemoteURL, getRootPath } from '@nextcloud/files/dav'
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getLanguage } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { isNumber } from './numberUtils.js'

/**
 * Sorting comparison function
 *
 * @param fileInfo1
 * @param fileInfo2
 * @param key
 * @param asc
 */
export function sortCompare(fileInfo1: Node, fileInfo2: Node, key: string, asc: boolean = true): number {
	// favorite always first
	if (fileInfo1.attributes.favorite === 1 && fileInfo2.attributes.favorite === 0) {
		return -1
	} else if (fileInfo1.attributes.favorite === 0 && fileInfo2.attributes.favorite === 1) {
		return 1
	}

	// if this is a number, let's sort by integer
	if (isNumber(fileInfo1.attributes[key]) && isNumber(fileInfo2.attributes[key])) {
		return asc
			? Number(fileInfo2.attributes[key]) - Number(fileInfo1.attributes[key])
			: Number(fileInfo1.attributes[key]) - Number(fileInfo2.attributes[key])
	}

	// else we sort by string, so let's sort directories first
	if (fileInfo1.type === FileType.Folder && fileInfo2.type === FileType.File) {
		return asc ? -1 : 1
	} else if (fileInfo1.type === FileType.File && fileInfo2.type === FileType.Folder) {
		return asc ? 1 : -1
	}

	// if this is a date, let's sort by date
	if (isNumber(new Date(fileInfo1.attributes[key]).getTime()) && isNumber(new Date(fileInfo2.attributes[key]).getTime())) {
		return asc
			? new Date(fileInfo2.attributes[key]).getTime() - new Date(fileInfo1.attributes[key]).getTime()
			: new Date(fileInfo1.attributes[key]).getTime() - new Date(fileInfo2.attributes[key]).getTime()
	}

	// finally sort by name
	return asc
		? fileInfo1.attributes[key]?.toString()?.localeCompare(fileInfo2.attributes[key].toString(), getLanguage()) || 1
		: -fileInfo1.attributes[key]?.toString()?.localeCompare(fileInfo2.attributes[key].toString(), getLanguage()) || -1
}

/**
 * Sorting comparison function
 *
 * @param fileInfo1
 * @param fileInfo2
 * @param key
 * @param asc
 */
export function sortCompareFileInfo(fileInfo1: FoldersNode, fileInfo2: FoldersNode, key: keyof FoldersNode, asc: boolean = true): number {
	// if this is a number, let's sort by integer
	if (isNumber(fileInfo1[key]) && isNumber(fileInfo2[key])) {
		return asc
			? Number(fileInfo2[key]) - Number(fileInfo1[key])
			: Number(fileInfo1[key]) - Number(fileInfo2[key])
	}

	// else we sort by string, so let's sort directories first
	if (fileInfo1.type === FileType.Folder && fileInfo2.type === FileType.File) {
		return asc ? -1 : 1
	} else if (fileInfo1.type === FileType.File && fileInfo2.type === FileType.Folder) {
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

export type ViewerFileInfo = {
	fileid?: number
	basename: string
	filename: string
	mime?: string
	mtime?: Date
	ownerId: string | null
	source: string
	hasPreview: boolean
	previewUrl: string
	etag: string
	permissions: string
}

/**
 *
 * @param file
 */
export function toViewerFileInfo(file: Node): ViewerFileInfo {
	let permissions = ''

	if ((file.permissions & Permission.CREATE) === Permission.CREATE) {
		permissions += 'CK'
	}
	if ((file.permissions & Permission.UPDATE) === Permission.UPDATE) {
		permissions += 'WNV'
	}
	if ((file.permissions & Permission.READ) === Permission.READ) {
		permissions += 'G'
	}
	if ((file.permissions & Permission.DELETE) === Permission.DELETE) {
		permissions += 'D'
	}
	if ((file.permissions & Permission.SHARE) === Permission.SHARE) {
		permissions += 'R'
	}

	let filename = file.path
	let source = file.source
	// Override the filename and source to allow deleting a file from the viewer.
	// This is needed when the filename and source are related to the albums.
	if (file.attributes['photos-collection-file-original-filename'] !== undefined) {
		filename = file.attributes['photos-collection-file-original-filename']
		source = getRemoteURL() + getRootPath() + filename
	}

	return {
		fileid: file.fileid,
		basename: file.basename,
		filename,
		mime: file.mime,
		mtime: file.mtime,
		ownerId: file.owner,
		source,
		hasPreview: file.attributes.hasPreview,
		previewUrl: file.attributes.previewUrl ?? generateUrl(`/apps/photos/api/v1/preview/${file.fileid}?x=2048&y=2048`),
		etag: file.attributes.etag,
		permissions,
	}
}

/**
 *
 * @param file
 */
export function legacyToViewerFileInfo(file: FoldersNode) {
	return {
		fileid: file.fileid,
		basename: file.basename,
		filename: file.filename,
		mime: file.mime,
		mtime: file.lastmod,
		source: file.source,
		hasPreview: file.hasPreview,
		etag: file.etag,
		permissions: file.permissions,
	}
}
